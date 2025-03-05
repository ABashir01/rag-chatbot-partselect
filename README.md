# RAG Chatbot for PartSelect

A proof of concept RAG chatbot I created based off the PartSelect catalog. It helps users find parts they need based off a description of their problem and gives them links to certain pages on the website if they also need help navigating the website.

## Description

The motivation for this was creating a smart shopping assistant that utilized a vector database to allow users to type what they need in normal language and be told the parts that might help them - which is useful for an average user who might be unclear on what could be causing their machine's problem and what parts can be used to fix it. As a proof of concept, it only works for a small number of problems/pages based off the ones I hardcoded into the data folder which can be used to populate the qdrant database using the database_population.py script in the data folder.

## Technologies Used
 - React.js
 - Python (Flask)
 - OpenAI API
 - Qdrant

### Executing program

* To start up the qdrant server locally, follow the instructions at [https://qdrant.tech/documentation/quickstart/](https://qdrant.tech/documentation/quickstart/)
* To run the backend, navigate to the backend directory, then run "python3 server.py" assuming you've installed the necessary dependencies (probably via pip)
* To run the frontend, navigate to the frontend directory, then run "npm run dev" if using npm after installing the necessary dependencies (probably via npm or yarn)
* The database_population.py file can also just be run like a normal python file (using 'python3 server.py')
