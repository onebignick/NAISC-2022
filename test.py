from sgnlp.models.sentic_gcn import (
    SenticGCNBertTokenizer,
    SenticGCNBertEmbeddingConfig,
    SenticGCNBertEmbeddingModel,
    SenticGCNBertModel,
    SenticGCNBertPreprocessor,
    SenticGCNBertConfig,
    SenticGCNBertPostprocessor,
)
from flask import Flask,jsonify
from textblob import TextBlob

app = Flask(__name__)

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

# test Inputs
inputs = [
    {  # Single word aspect
        "aspects": ["service"],
        "sentence": "To sum it up : service varies from good to mediorce , depending on which waiter you get ; generally it is just average ok .",
    },
    {  # Single-word, multiple aspects
        "aspects": ["service", "decor"],
        "sentence": "Everything is always cooked to perfection , the service is excellent, the decor cool and understated.",
    },
    {  # Multi-word aspect
        "aspects": ["grilled chicken", "chicken"],
        "sentence": "the only chicken i moderately enjoyed was their grilled chicken special with edamame puree .",
    },
]

@app.route('/api')
def data():
    # here we want to get the value of user (i.e. ?user=some-value)
    headline = request.args.get('str')
    blob = TextBlob(headline)
    aspects = blob.noun_phrases
    inputs = [{"aspects":aspects, "sentence": txt}]

# processing
    processed_inputs, processed_indices = preprocessor(inputs)
    outputs = model(processed_indices)

# Postprocessing
    post_outputs = postprocessor(processed_inputs=processed_inputs, model_outputs=outputs)

    return jsonify(post_outputs)

txt = "Boy dies in traffic accident"
blob = TextBlob("Boy dies in traffic accident")
aspects = [i for i in blob.noun_phrases]
print(aspects)
inputs = [{"aspects":aspects, "sentence": txt,},{"aspects":aspects, "sentence": txt,}]
print(inputs)
# processing
processed_inputs, processed_indices = preprocessor(inputs)
outputs = model(processed_indices)

# Postprocessing
post_outputs = postprocessor(processed_inputs=processed_inputs, model_outputs=outputs)
post_outputs['aspects'] 
print(post_outputs)

app.run(host="0.0.0.0", port=5000)