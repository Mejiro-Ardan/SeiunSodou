from pymongo import MongoClient
import logging
import os


MONGO_HOST = os.getenv('MONGO_HOST', 'localhost')
MONGO_PORT = int(os.getenv('MONGO_PORT', 27017))
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')

logging.info('链接数据库')

if MONGO_PASSWORD:
    client = MongoClient(
        f'mongodb://{MONGO_HOST}:{MONGO_PORT}', password=MONGO_PASSWORD)
else:
    client = MongoClient(MONGO_HOST, MONGO_PORT)


# 检测是否存在数据库
def check_db(db_name):
    dblist = client.list_database_names()
    if db_name in dblist:
        return True
    else:
        return False


# 初始化数据库
def init_db(db_name):
    logging.info('初始化数据库')
    db = client[db_name]
    # 创建用户集合以及文章集合
    db.create_collection('users')
    db.create_collection('articles')
    db.create_collection('register')
    # 检测是否创建成功
    collist = db.list_collection_names()
    if "users" in collist and "articles" in collist:
        return True
    else:
        return False


# 读取数据内容
def db_read(db_name, collection_name, filter={}):
    db = client[db_name]
    collection = db[collection_name]
    data = collection.find(filter)
    return [i for i in data]


# 插入数据
def db_insert(db_name, collection_name, data):
    db = client[db_name]
    collection = db[collection_name]
    collection.insert_one(data)
    return True


# 符合登录的数据
def find_user(db_name, collection_name, data):
    db = client[db_name]
    collection = db[collection_name]
    data = collection.find_one(data)
    return data


def find_register(db_name, collection_name, data):
    db = client[db_name]
    collection = db[collection_name]
    data = collection.find_one(data)
    return data


# 更新数据
def db_update(db_name, collection_name, query, data):
    db = client[db_name]
    collection = db[collection_name]
    collection.update_one(query, {"$set": data})
    return True


# 删除数据
def db_delete(db_name, collection_name, query):
    db = client[db_name]
    collection = db[collection_name]
    collection.delete_one(query)
    return True
