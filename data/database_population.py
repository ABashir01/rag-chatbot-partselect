import os
import sys
from dotenv import load_dotenv

load_dotenv()
USER_AGENT = os.getenv("USER_AGENT")

sys.stdout.reconfigure(encoding='utf-8')
sys.stdin.reconfigure(encoding='utf-8')

import qdrant_client as qc
from qdrant_client.models import PointStruct

from langchain_community.document_loaders.sitemap import SitemapLoader, WebBaseLoader
from langchain_community.document_loaders.url_selenium import SeleniumURLLoader
from langchain.text_splitter import CharacterTextSplitter

import openai
import json
from xml.etree import ElementTree as ET
import requests
import nest_asyncio
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()


nest_asyncio.apply()

client = qc.QdrantClient("http://localhost:6333")
open_ai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_embedding(text):
    response = open_ai_client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

# # This file contains the points format as a JSON file format but with the embeddings non-converted to vectors (still as text)
# file_name = "data/points_data/points_with_text.json"

# with open(file_name, "r") as f:
#     points = json.load(f)

# # Create the embeddings + points
# points_with_embeddings = []
# for point in points:
#     embedding = generate_embedding(point["vector"])  
#     points_with_embeddings.append(
#         PointStruct(
#             id=point["id"],
#             vector=embedding,
#             payload=point["payload"]
#         )
#     )

# collection_name = "test_collection"
# try:
#     client.create_collection(
#         collection_name=collection_name,
#         vectors_config=qc.models.VectorParams(
#             size=len(points_with_embeddings[0].vector),  
#             distance=qc.models.Distance.COSINE
#         )
#     )
# except Exception as e:
#     print(f"Collection already exists or error: {e}")


# client.upsert(collection_name=collection_name, points=points_with_embeddings)

# print(f"Uploaded {len(points_with_embeddings)} points to the '{collection_name}' collection.")

# ------------------------------------------------------------------
# Create the collection with the sitemap data
# ------------------------------------------------------------------

# sitemap_url = "https://www.partselect.com/sitemaps/PartSelect.com_Sitemap_Master.xml"
# sitemap_url = "https://python.langchain.com/sitemap.xml"

sitemap_points = []
curr_id = 0

def parse_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    namespace = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [url.find("ns:loc", namespace).text for url in root.findall("ns:url", namespace)]
    return urls


urls_to_add = ["https://www.partselect.com/user/self-service/", 
               "https://www.partselect.com/your-models-guest/",
               "https://www.partselect.com/Repair/",
               "https://www.partselect.com/Repair/Washer/",
               "https://www.partselect.com/Water-Filter-Finder/",
               "https://www.partselect.com/user/create/",
               "https://www.partselect.com/shopping-cart/",
               "https://www.partselect.com/Repair/Dishwasher/Not-Drying-Properly/#HeatingElement",
               "https://www.partselect.com/365-Day-Returns.htm",
                ]


for url in urls_to_add:
    # print("File: ", file)
    # sitemap_url = f"C:/Users/ahadb/Desktop/Instalily Case Study/data/new_xml_files/{file}"
    # print("Sitemap URL: ", sitemap_url)
    # urls = parse_xml(sitemap_url)
    # print("URLs: ", urls)

    driver.get(url)
    driver.implicitly_wait(1)
    # print("Title: ", driver.title)
    # print("Body: ", driver.page_source)

    # Embed the page text into the Qdrant collection
    all_text = driver.find_element(By.XPATH, "/html/body").text
    print("All text: ", all_text)

    # Embed all text into Qdrant
    embedding = generate_embedding(all_text)
    sitemap_points.append(
        PointStruct(
            id=curr_id,
            vector=embedding,
            payload={"title": driver.title, "url": url, "body": all_text}
        )
    )
    curr_id += 1

    # Feed the result to webbaseloader

    # response = requests.get(urls[0], headers={"User-Agent": USER_AGENT})
    # print("Response: ", response.text)
    # loader = WebBaseLoader(urls[0])
    # loader.headers = {"User-Agent": USER_AGENT}
    # loader.requests_per_second = 1
    # docs = loader.aload()

    # loader = SeleniumURLLoader(urls[0])
    # loader.headless = False
    # loader.headers = {"User-Agent": USER_AGENT}
    # docs = loader.load()
    # print("Docs: ", docs[0])

    # print("Docs: ", docs[0])
    
    # sitemap_loader = SitemapLoader(web_path=sitemap_url, is_local=True, restrict_to_same_domain=False)

    # pages = sitemap_loader.load()

    # print("Pages 0: ", pages[0])

collection_name = "sitemap_collection"
try:
    client.create_collection(
        collection_name=collection_name,
        vectors_config=qc.models.VectorParams(
            size=len(sitemap_points[0].vector),  
            distance=qc.models.Distance.COSINE
        )
    )
except Exception as e:
    print(f"Collection already exists or error: {e}")


client.upsert(collection_name=collection_name, points=sitemap_points)

print(f"Uploaded {len(sitemap_points)} points to the '{collection_name}' collection.")

