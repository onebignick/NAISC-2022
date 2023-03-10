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
    #print(inputs)
    # processing
    processed_inputs, processed_indices = preprocessor(inputs)
    outputs = model(processed_indices)

# Postprocessing
    try:
        post_outputs = postprocessor(processed_inputs=processed_inputs, model_outputs=outputs)
        #print(post_outputs)
        title_score = sum(post_outputs[0]['labels'])/len(post_outputs[0]['labels'])
        article_score = sum(post_outputs[1]['labels'])/len(post_outputs[1]['labels'])
        score = (title_score, article_score)
        #print(score)
        return score
    except Exception as e:
        return (-2, -2)

# function to get news
def getnews():
    x = requests.get(URL)
    data = x.json()

    # connect to database
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    # New data replaces all data
    # cur.execute('''DELETE FROM Articles''')

    # for each article in api call
    for i in range(len(data['articles'])):
        # Check whether article already exists in db
        check_article = '''
            SELECT article_url FROM Articles WHERE article_url="{}"
        '''.format(data["articles"][i]['url'])
        result = cur.execute(check_article)

        # If article is not present
        if len(result.fetchall()) == 0:
            # Check if source is in db
            check_source = '''
                SELECT source_name FROM Sources WHERE source_name="{}"
            '''.format(data['articles'][i]['source']['name'])
            result = cur.execute(check_source)
            # if source is not in add it in
            if len(result.fetchall()) == 0:
                cur.execute('''
                    INSERT INTO Sources(source_name) VALUES (?)
                ''', (data['articles'][i]['source']['name'],))
                conn.commit()

            # Check if author is in db
            check_author = '''
                SELECT author_name FROM Authors WHERE author_name="{}"
            '''.format(data['articles'][i]['author'])
            # Fix for some weird authors
            try:
                result = cur.execute(check_author)
            except:
                data['articles'][i]['author'] = "Various Authors"
                check_author = '''
                SELECT author_name FROM Authors WHERE author_name="{}"
            '''.format(data['articles'][i]['author'])
                result = cur.execute(check_author)
            
            # If author is not in add author in
            if len(result.fetchall()) == 0:
                cur.execute('''
                    INSERT INTO Authors(author_name) VALUES (?)
                ''', (data['articles'][i]['author'],))
                conn.commit()           
                result = cur.execute(check_author)

            # foreign keys and score generation
            source_id = conn.execute('''SELECT source_id FROM Sources WHERE source_name="{}"'''.format(data['articles'][i]['source']['name'])).fetchone()[0]
            author_id = conn.execute('''SELECT author_id FROM Authors WHERE author_name="{}"'''.format(data['articles'][i]['author'])).fetchone()[0]
            score = generate_score(data['articles'][i]['title'],data['articles'][i]['description'])
            print('|')
            print('|')
            print(score)
            print('|')
            print('|')
            # Adding of article into db
            cur.execute('''
                INSERT INTO Articles(article_title, article_description, article_url, article_url_to_image, article_date_published, article_content, article_title_score, article_description_score, article_votes, article_source_id, article_author_id) 
                VALUES  (?,?,?,?,?,?,?,?,?,?,?)
            ''', (data['articles'][i]['title'], data['articles'][i]['description'], data['articles'][i]['url'], data['articles'][i]['urlToImage'], data['articles'][i]['publishedAt'][:10], data['articles'][i]['content'], score[0], score[1], 0, source_id, author_id))

            conn.commit()
            #print("article added")
    conn.close()

def arraytodict(article : list):
    if len(article) != 12:
        print('input is missing fields', article)
        return {}
    else:
        labels = ['index','title', 'description', 'url', 'imageurl','date', 'content', 'sourceid', 'authorid', 'score', 'otherscore', 'votes']
        results = {labels[i] : article[i] for i in range(len(labels))}
        return results


def commenttodict(comment : list):
    if len(comment) != 3:
        print('input is missing fields', comment)
        return {}
    else:
        labels = ['commentid', 'comment', 'articleid']
        results = {labels[i] : comment[i] for i in range(len(labels))}
        return results 


@app.route('/articles')
def articles():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    result = cur.execute('''SELECT * FROM Articles''').fetchall()
    conn.close()
    results = [arraytodict(i) for i in result]
    return jsonify(results)

@app.route('/search/', methods=['GET'])
def search():
    if request.method == 'GET':
        searchTerm = request.args.get('search')
        conn = sqlite3.connect("database.db")
        cur = conn.cursor()
        result = cur.execute("""SELECT * FROM Articles WHERE article_title LIKE '%{}%'""".format(searchTerm)).fetchall()
        conn.close()
        results = [arraytodict(i) for i in result]
        print(results)
        return jsonify(results)

@app.route('/sources')
def sources():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    result = cur.execute('''SELECT S.source_id, S.source_name, COUNT(A.article_id) FROM Articles AS A LEFT JOIN Sources AS S ON A.article_source_id = S.source_id''').fetchall()
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    conn.close()
    return response

# route to get latest article
@app.route('/get-latest', methods=['GET'])
def getLatest():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    result = cur.execute('''SELECT * FROM Articles WHERE article_id=(SELECT max(article_id) FROM Articles)''').fetchone()
    conn.close()
    return jsonify(result)

# Update the votes of each article
@app.route("/updateVotes", methods=['PATCH'])
def updateVotes():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    sqlStatement = '''UPDATE Articles SET article_votes = article_votes + ? WHERE article_id = ?'''
    result = cur.execute(sqlStatement, [request.json["num"], request.json["article_id"]]).fetchall()
    conn.commit()
    conn.close()
    return jsonify(result)

# Add comments for articles
@app.route("/comments", methods=['POST'])
def comments():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    sqlStatement = '''INSERT INTO Comments(content, article_id) VALUES (?, ?)'''
    cur.execute(sqlStatement, [request.json["comment"], request.json["article_id"]])
    conn.commit()
    conn.close()

# Get comments for articles
@app.route("/getComments", methods=['GET'])
def getComment():
        articleID = request.args.get('article_id')
        conn = sqlite3.connect("database.db")
        cur = conn.cursor()
        result = cur.execute("""SELECT * FROM Comments WHERE article_id = ?""", [articleID]).fetchall()
        conn.close()
        results = [commenttodict(i) for i in result]
        response = jsonify(results)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

def updater():
    while True:
        getnews()
        #time.sleep(10000000000000000)
        time.sleep(1000000)

if __name__ == '__main__':
    p = Thread(target=updater)
    p.start()
    app.run(port=8000, debug=True)
    p.join()