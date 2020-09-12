import pymongo
from pymongo import MongoClient
# from secrets import credentials

def get_db():
    # make connection to DB and return database
    connection = f'mongodb+srv://dbUser:Project2@cluster0.zfx73.mongodb.net/project2_?retryWrites=true&w=majority'
    client = pymongo.MongoClient(connection)
    return client.project2_


def fetch_states():
    #  return States collection from Mongodb
    db = get_db()
    states = [state for state in db.presidential_state_toplines_2020.find({})]
    return states

def fetch_national():
    #  return National collection from Mongodb
    db = get_db()
    national = [day for day in db.presidential_national_toplines_2020.find({})]
    return national



if __name__ == '__main__':
    print(fetch_states())
    print(fetch_national())


