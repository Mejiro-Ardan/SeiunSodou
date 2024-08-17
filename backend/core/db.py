import os
import logging
from pymongo import MongoClient


def mongo_client():
    # 从环境变量中获取数据库连接参数
    MONGO_HOST = os.getenv("MONGO_HOST", "127.0.0.1")
    MONGO_PORT = os.getenv("MONGO_PORT", "27017")
    MONGO_USER = os.getenv("MONGO_USER")
    MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")

    # 检查 MONGO_PORT 是否为有效的整数
    if not MONGO_PORT.isdigit():
        MONGO_PORT = 27017
    else:
        MONGO_PORT = int(MONGO_PORT)

    # 打印连接信息
    logging.info(f"连接数据库: {MONGO_HOST}:{MONGO_PORT}")

    # 根据是否有用户名和密码来创建MongoClient
    if MONGO_USER and MONGO_PASSWORD:
        client = MongoClient(
            f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}"
        )
    else:
        client = MongoClient(f"mongodb://{MONGO_HOST}:{MONGO_PORT}")
    return client


# 检测是否存在数据库
def check_db(db_name):
    client = mongo_client()
    dblist = client.list_database_names()
    client.close()
    return db_name in dblist


# 初始化数据库
def init_db(db_name):
    client = mongo_client()
    logging.info('初始化数据库')
    db = client[db_name]
    # 创建用户集合以及文章集合
    db.create_collection("users")
    db.create_collection("user_data")
    db.create_collection("articles")
    db.create_collection("register")
    # 检测是否创建成功
    collist = db.list_collection_names()
    client.close()
    return "users" in collist and "articles" in collist


# 读取数据内容
def db_read(db_name, collection_name, filter={}):
    client = mongo_client()
    db = client[db_name]
    collection = db[collection_name]
    data = collection.find(filter)
    result = [i for i in data]
    client.close()
    return result


# 插入数据
def db_insert(db_name, collection_name, data):
    client = mongo_client()
    db = client[db_name]
    collection = db[collection_name]
    collection.insert_one(data)
    client.close()
    return True


# 查找数据
def db_find(db_name, collection_name, data):
    client = mongo_client()
    db = client[db_name]
    collection = db[collection_name]
    result = collection.find_one(data)
    client.close()
    return result


# 更新数据
def db_update(db_name, collection_name, query, data):
    client = mongo_client()
    db = client[db_name]
    collection = db[collection_name]
    collection.update_one(query, {"$set": data})
    client.close()
    return True


# 删除数据
def db_delete(db_name, collection_name, query):
    client = mongo_client()
    db = client[db_name]
    collection = db[collection_name]
    collection.delete_one(query)
    client.close()
    return True
