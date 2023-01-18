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

@app.route('/data',  methods = ['GET', 'POST'])
def index():
    response_body = {'data' : [-8, -9, -10, '48jhgkjl']}
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

@app.route('/getnews')
def getnews():
    x = requests.get(URL)
    data = x.json()
    
    return jsonify(data['articles'][:50])

if __name__ == '__main__':
    app.run(port=8000, debug=True)