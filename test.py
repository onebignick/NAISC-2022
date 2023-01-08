from sgnlp.models.sentic_gcn import (
    SenticGCNBertTokenizer,
    SenticGCNBertEmbeddingConfig,
    SenticGCNBertEmbeddingModel,
    SenticGCNBertModel,
    SenticGCNBertPreprocessor,
    SenticGCNBertConfig,
    SenticGCNBertPostprocessor,
)

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
txt = "whatever input we have"
blob = TextBlob(txt)
aspects = blob.noun_phrases
inputs = [{"aspects":aspects, "sentence": txt}]

# processing
processed_inputs, processed_indices = preprocessor(inputs)
outputs = model(processed_indices)

# Postprocessing
post_outputs = postprocessor(processed_inputs=processed_inputs, model_outputs=outputs)

print(post_outputs)