from sgnlp.models.sentic_gcn import (
    SenticGCNBertTokenizer,
    SenticGCNBertEmbeddingConfig,
    SenticGCNBertEmbeddingModel,
    SenticGCNBertModel,
    SenticGCNBertPreprocessor,
    SenticGCNBertConfig,
    SenticGCNBertPostprocessor,
)
from flask import Flask,jsonify,request
from textblob import TextBlob
from flask import Flask
from flask_cors import CORS
import sqlite3
import requests
import time
from threading import Thread
# Create tokenizer
tokenizer = SenticGCNBertTokenizer.from_pretrained("bert-base-uncased")

# Create embedding model
embed_config = SenticGCNBertEmbeddingConfig.from_pretrained("bert-base-uncased")
embed_model = SenticGCNBertEmbeddingModel.from_pretrained("bert-base-uncased", config=embed_config)

# Create preprocessor
preprocessor = SenticGCNBertPreprocessor(
    tokenizer=tokenizer,
    embedding_model=embed_model,
    senticnet="https://storage.googleapis.com/sgnlp/models/sentic_gcn/senticnet.pickle",
    device="cpu",
)

# Create postprocessor
postprocessor = SenticGCNBertPostprocessor()

# Load model
config = SenticGCNBertConfig.from_pretrained(
    "https://storage.googleapis.com/sgnlp/models/sentic_gcn/senticgcn_bert/config.json"
)

model = SenticGCNBertModel.from_pretrained(
    "https://storage.googleapis.com/sgnlp/models/sentic_gcn/senticgcn_bert/pytorch_model.bin", config=config
)
APIKEY = "14d67047a8714deb9f5038a787f05821"

app = Flask(__name__)
CORS(app)


URL = f"https://newsapi.org/v2/top-headlines?sources=cnn&apiKey={APIKEY}"

def generate_score(title, desc):
    blob = TextBlob(title)
    headline_aspects = [i for i in blob.noun_phrases]
    #print(aspects)
    blob1 = TextBlob(desc)
    article_aspects = [i for i in blob1.noun_phrases]

    inputs = [{"aspects":headline_aspects, "sentence": title, },{"aspects":article_aspects, "sentence": desc,}]
    print(inputs)
    # processing
    processed_inputs, processed_indices = preprocessor(inputs)
    outputs = model(processed_indices)

# Postprocessing
    post_outputs = postprocessor(processed_inputs=processed_inputs, model_outputs=outputs)
    print(post_outputs)
    score = sum(post_outputs[0]['labels'])
    return score

@app.route('/data',  methods = ['GET', 'POST'])
def index():
    ## {headline : 'boy dies', article : 'boy dies at smwhere are smtime'}
    data = request.form

    headline = data['headline']
    article = data['article']
    txt = "Boy dies in traffic accident"

    blob = TextBlob(headline)
    headline_aspects = [i for i in blob.noun_phrases]
    #print(aspects)
    blob1 = TextBlob(article)
    article_aspects = [i for i in blob1.noun_phrases]

    inputs = [{"aspects":headline_aspects, "sentence": headline, },{"aspects":article_aspects, "sentence": article,}]
    print(inputs)
    # processing
    processed_inputs, processed_indices = preprocessor(inputs)
    outputs = model(processed_indices)

# Postprocessing
    post_outputs = postprocessor(processed_inputs=processed_inputs, model_outputs=outputs)
    score = sum(post_outputs['labels'])

    response = jsonify({"overall" : score})
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response

#@app.route('/getnews')

def getnews():
    x = requests.get(URL)
    data = x.json()

    # connect to database
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    for i in range(len(data['articles'])):
        check_article = '''
            SELECT article_title FROM Articles WHERE article_title="{}"
        '''.format(data["articles"][i]['title'])
        result = cur.execute(check_article)
        if len(result.fetchall()) == 0:
            check_source = '''
                SELECT source_name FROM Sources WHERE source_name="{}"
            '''.format(data['articles'][i]['source']['name'])
            result = cur.execute(check_source)
            if len(result.fetchall()) == 0:
                cur.execute('''
                    INSERT INTO Sources(source_name) VALUES (?)
                ''', (data['articles'][i]['source']['name'],))
                conn.commit()
                result = cur.execute(check_source)
                print(result.fetchall())

            #source_id = result.fetchall()[0][0]
            #print(source_id)

            check_author = '''
                SELECT author_name FROM Authors WHERE author_name="{}"
            '''.format(data['articles'][i]['author'])
            try:
                result = cur.execute(check_author)
            except:
                data['articles'][i]['author'] = "Various Authors"
                check_author = '''
                SELECT author_name FROM Authors WHERE author_name="{}"
            '''.format(data['articles'][i]['author'])
                result = cur.execute(check_author)
            
            if len(result.fetchall()) == 0:
                cur.execute('''
                    INSERT INTO Authors(author_name) VALUES (?)
                ''', (data['articles'][i]['author'],))
                conn.commit()           
                result = cur.execute(check_author)

            print(result.fetchall())
            #author_id = result.fetchall()[0][0]
            #print(author_id)
            score = generate_score(data['articles'][i]['title'],data['articles'][i]['description'])
            cur.execute('''
                INSERT INTO Articles(article_title, article_description, article_url, article_url_to_image, article_date_published, article_content, article_score) 
                VALUES  (?,?,?,?,?,?,?)
            ''', (data['articles'][i]['title'], data['articles'][i]['description'], data['articles'][i]['url'], data['articles'][i]['urlToImage'], data['articles'][i]['publishedAt'], data['articles'][i]['content'], score))

            conn.commit()
    conn.close()
    
    return jsonify(data['articles'][:50])

@app.route('/articles')
def articles():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    result = cur.execute('''SELECT * FROM Articles''').fetchall()
    return jsonify(result)

def updater():
    while True:
        getnews()
        time.sleep(10000000000000000)
if __name__ == '__main__':
    p = Thread(target=updater)
    p.start()
    app.run(port=8000, debug=True)
    p.join()