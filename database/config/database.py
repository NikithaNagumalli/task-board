from pymongo import MongoClient

client = MongoClient("mongodb+srv://nikitha:dbUserPassword@cluster0.mlefytl.mongodb.net/?appName=Cluster0")
db = client.tasks_db
collection_name = db["tasks_collection"]