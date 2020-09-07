from pymongo import MongoClient

def get_db():
    # make connection to DB and return database
    client = MongoClient('mongodb://localhost:27017')
    return client.databaseNameHere


def fetch_items():
    #  return collection from db
    db = get_db()
    items = [item for item in db.collectionNameHere.find({})]
    return items


if __name__ == '__main__':
    print(fetch_items())


