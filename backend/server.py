from flask import Flask, request, jsonify
from flask_cors import CORS
from qdrant_client import QdrantClient
import openai
import re
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

qdrant_client = QdrantClient("http://localhost:6333")
collection_name = "test_collection"

open_ai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_embedding(text):
    response = open_ai_client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

def search_qdrant(query_embedding, top_k=3, min_similarity_score=0.7):
    collection_name = "test_collection"
    results = qdrant_client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=top_k
        )
    
    filtered_results = [res for res in results if res.score >= min_similarity_score]
    return filtered_results

def search_qdrant_sitemap(query_embedding, top_k=2, min_similarity_score=0.75):
    collection_name = "sitemap_collection"
    results = qdrant_client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=top_k
        )
    
    filtered_results = [res for res in results if res.score >= min_similarity_score]
    return filtered_results

def create_part_list(response, search_results):

    # Extract the parts list, denoted with '[[[{children}]]]', from the response
    parts_list_match = re.search(r"\[\[\[(.*?)\]\]\]", response)
    if parts_list_match:
        parts_list = parts_list_match.group(1).split(", ")
        response = re.sub(r"\[\[\[.*?\]\]\]", "", response).strip()
    else:
        parts_list = []

    # Add the payload content for the parts list
    parts_content_list = []
    for partselect_number in parts_list:
        for res in search_results:
            if res.payload.get("partselect-number") == partselect_number:
                parts_content_list.append(res.payload)

    return response, parts_content_list

def summarize_text(text):
    prompt = f"""
    Please summarize the following text based on the idea that it is a webpage and you want to tell the user what it is about in a few sentences:
    {text}
    """

    # print("prompt: ", prompt)

    response = open_ai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_completion_tokens=50,
    )

    response = response.choices[0].message.content

    return response
    

def generate_chat_response(user_query, search_results):
    if not search_results:
        # Default response if no results
        return """I'm sorry, I couldn't find any relevant information in the database. 
                    I can only assist with specific questions about refrigerators or dishwasher parts.""", []

    # Format search results as regular text to add them to the prompt
    results_text = "\n".join(
    [
        f"""
        - Name: {res.payload['name']}
          Description: {res.payload['description']}
          Type: {res.payload['type']}
          Manufacturer Part Number: {res.payload.get('manufacturer-part-number', 'N/A')}
          PartSelect Number: {res.payload.get('partselect-number', 'N/A')}
          Brand: {res.payload.get('brand', 'N/A')}
          Appliance Types: {', '.join(res.payload.get('appliance-types', []))}
          Compatible With These Models: {', '.join(res.payload.get('compatible-with-these-models', []))}
          This Part Fixes These Symptoms: {', '.join(res.payload.get('fixes_these_symptoms', []))}
          Installation Instructions: {res.payload.get('installation-instructions-video', 'N/A')}
          Price: ${res.payload['price']}
          Reviews: {res.payload['reviews']['average-rating']} stars from {res.payload['reviews']['total-reviews']} reviews
          Product Image: {res.payload.get('image', 'N/A')}
          Product Link: {res.payload.get('link', 'N/A')}
        """
        for res in search_results
    ]
)
    
    prompt = f"""
    A user asked: "{user_query}"
    Based on the available database, here are the relevant results:
    {results_text}
    You must strictly base your response only on the information provided above. 
    Do not add any other information, assumptions, or unrelated content.
    """

    # print("prompt: ", prompt)

    response = open_ai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": 
                "system", 
             "content": 
                """You are a helpful sales assistant for a device part selling company 
                that strictly answers questions about parts 
                for refrigerators and dishwashers based on the provided database results. 
                Do not make up information, only answer if information is found from the provided database results.
                If you're given a prompt that includes a PartSelect number (format of PS followed by numbers), please generate a response
                that includes the details of the part with that PartSelect number - do not say you don't know in that case
                At the end of your response, please state: '[[[' list of PartSelect numbers that assisted in your response ']]]'.
                Do not exclude any PartSelect numbers from the list that were used in your response. 
                You MUST include any PartSelect numbers that were used in your response if you know the answer.
                If you don't know the answer just respond 'Sorry, I don't have information about that. 
                Please ask a more specific question about refrigerator or dishwasher parts.'"""
             },
            {"role": "user", "content": prompt}
        ]
    )

    response = response.choices[0].message.content
    print("response: ", response)
    response, parts_content_list = create_part_list(response, search_results)
    
    return response, parts_content_list

def generate_chat_response_sitemap(search_results):
    if not search_results:
        # Default response if no results
        return """I'm sorry, I couldn't find any relevant information in the database. 
                    Could you ask a more specific question?""", [], []
    

    results_text = ""
    for res in search_results:
        results_text += f"""
        - [{res.payload['title']}]({res.payload['url']})"""

    # results_text = "".join(
    #     [
    #         f"""
    #         - [{res.payload['title']}]({res.payload['url']})
    #         """
    #         for res in search_results
    #     ]
    # )


    response = f"""Here are some urls I found that may be what you're looking for (If these aren't right, please ask a more specific question):
    """
    
    return response, [res.payload['title'] for res in search_results], [res.payload['url'] for res in search_results]


@app.route('/chat', methods=['POST'])
def chat():
    user_query = request.json.get('query', '').replace("[[[", "").replace("]]]", "")
    print("user_query: ", user_query)
    query_embedding = generate_embedding(user_query)
    search_results = search_qdrant(query_embedding)
    print("search_results: ", search_results)
    response, parts_list = generate_chat_response(user_query, search_results)

    return jsonify({"response": response, "parts_list": parts_list})

@app.route('/sitemap_chat', methods=['POST'])
def sitemap_chat():
    user_query = request.json.get('query', '').replace("[[[", "").replace("]]]", "")
    print("user_query: ", user_query)
    query_embedding = generate_embedding(user_query)
    search_results = search_qdrant_sitemap(query_embedding)
    print("search_results: ", search_results)
    response, title_list, url_list = generate_chat_response_sitemap(search_results)

    return jsonify({"response": response, "title_list": title_list, "url_list": url_list})

# Route to check if the server is running fine
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
