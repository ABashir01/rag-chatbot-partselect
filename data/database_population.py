import qdrant_client as qc
from qdrant_client.models import PointStruct
import openai
import json

client = qc.QdrantClient("http://localhost:6333")
open_ai_client = openai.OpenAI(api_key="API-KEY-GOES-HERE")

def generate_embedding(text):
    response = open_ai_client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

# This file contains the points format as a JSON file format but with the embeddings non-converted to vectors (still as text)
file_name = "data/points_data/points_with_text.json"

with open(file_name, "r") as f:
    points = json.load(f)

# Create the embeddings + points
points_with_embeddings = []
for point in points:
    embedding = generate_embedding(point["vector"])  
    points_with_embeddings.append(
        PointStruct(
            id=point["id"],
            vector=embedding,
            payload=point["payload"]
        )
    )

collection_name = "test_collection"
try:
    client.create_collection(
        collection_name=collection_name,
        vectors_config=qc.models.VectorParams(
            size=len(points_with_embeddings[0].vector),  
            distance=qc.models.Distance.COSINE
        )
    )
except Exception as e:
    print(f"Collection already exists or error: {e}")


client.upsert(collection_name=collection_name, points=points_with_embeddings)

print(f"Uploaded {len(points_with_embeddings)} points to the '{collection_name}' collection.")
