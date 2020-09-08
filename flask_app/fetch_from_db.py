from pymongo import MongoClient

def get_db():
    # make connection to DB and return database
    client = MongoClient('mongodb://localhost:27017')
    return client.DATABASENAMEHERE


def fetch_states():
    #  return collection from db
    db = get_db()
    states = [state for state in db.COLLECTIONNAMEHERE.find({})]
    return states

def fetch_national():
    #  return collection from db
    db = get_db()
    national = [day for day in db.COLLECTIONNAMEHERE.find({})]
    return national



if __name__ == '__main__':
    print(fetch_states())


