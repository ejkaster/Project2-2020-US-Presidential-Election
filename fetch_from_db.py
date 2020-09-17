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
    states = [state for state in db.presidential_state_toplines_2020.find({},{"state":1,"vpi":1,"tipping":1})]
    return states

def fetch_popular():
    #  return States collection from Mongodb
    db = get_db()
    popular = [state for state in db.presidential_state_toplines_2020.find({},{"modeldate":1,"state":1, "voteshare_inc":1,"voteshare_chal":1})]
    return popular


def fetch_national():
    #  return National collection from Mongodb
    db = get_db()
    national = [day for day in db.presidential_national_toplines_2020.find({},{"modeldate":1,"ev_inc":1,"ev_chal":1})]
    return national




if __name__ == '__main__':
    print(fetch_states())
    print(fetch_national())


