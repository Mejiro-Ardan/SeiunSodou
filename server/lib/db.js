import { MongoClient } from 'mongodb';

const RuntimeConfig = useRuntimeConfig();
/**
 * 创建并返回一个 MongoDB 客户端实例。
 * @returns {MongoClient} MongoDB 客户端实例
 */
function mongoClient() {
    const MONGO_HOST = RuntimeConfig.MONGO_HOST || '127.0.0.1';
    let MONGO_PORT = RuntimeConfig.MONGO_PORT || '27017';
    const MONGO_USER = RuntimeConfig.MONGO_USER;
    const MONGO_PASSWORD = RuntimeConfig.MONGO_PASSWORD;

    if (isNaN(parseInt(MONGO_PORT))) {
        MONGO_PORT = 27017;
    } else {
        MONGO_PORT = parseInt(MONGO_PORT);
    }

    let client;
    if (MONGO_USER && MONGO_PASSWORD) {
        const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
        client = new MongoClient(uri);
    } else {
        const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
        client = new MongoClient(uri);
    }

    return client;
}

/**
 * 检查数据库是否存在。
 * @param {string} dbName - 数据库名称
 * @returns {Promise<boolean>} 如果数据库存在则返回 true，否则返回 false
 */
export async function check_db(dbName) {
    const client = mongoClient();
    await client.connect();
    const dblist = await client.db().admin().listDatabases();
    await client.close();
    return dblist.databases.some(db => db.name === dbName);
}

/**
 * 初始化数据库，创建必要的集合。
 * @param {string} dbName - 数据库名称
 * @returns {Promise<boolean>} 如果初始化成功则返回 true，否则返回 false
 */
export async function init_db(dbName) {
    const client = mongoClient();
    await client.connect();
    console.log('初始化数据库');
    const db = client.db(dbName);
    await db.createCollection('users');
    await db.createCollection('user_data');
    await db.createCollection('articles');
    await db.createCollection('pending_verifications');
    const collist = await db.listCollections().toArray();
    await client.close();
    return collist.some(col => col.name === 'users') && collist.some(col => col.name === 'articles');
}

/**
 * 从数据库中读取数据。
 * @param {string} dbName - 数据库名称
 * @param {string} collectionName - 集合名称
 * @param {Object} [filter={}] - 查询过滤器
 * @returns {Promise<Array>} 返回查询到的数据数组
 */
export async function db_read(dbName, collectionName, filter = {}) {
    const client = mongoClient();
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find(filter).toArray();
    await client.close();
    return data;
}

/**
 * 向数据库中插入数据。
 * @param {string} dbName - 数据库名称
 * @param {string} collectionName - 集合名称
 * @param {Object} data - 要插入的数据
 * @returns {Promise<boolean>} 如果插入成功则返回 true
 */
export async function db_insert(dbName, collectionName, data) {
    const client = mongoClient();
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne(data);
    await client.close();
    return true;
}

/**
 * 在数据库中查找数据。
 * @param {string} dbName - 数据库名称
 * @param {string} collectionName - 集合名称
 * @param {Object} data - 查找条件
 * @returns {Promise<Object|null>} 返回查找到的数据，如果没有找到则返回 null
 */
export async function db_find(dbName, collectionName, data) {
    const client = mongoClient();
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.findOne(data);
    await client.close();
    return result;
}

/**
 * 更新数据库中的数据。
 * @param {string} dbName - 数据库名称
 * @param {string} collectionName - 集合名称
 * @param {Object} query - 查询条件
 * @param {Object} data - 更新的数据
 * @returns {Promise<boolean>} 如果更新成功则返回 true
 */
export async function db_update(dbName, collectionName, query, data) {
    const client = mongoClient();
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.updateOne(query, { $set: data });
    await client.close();
    return true;
}

/**
 * 删除数据库中的数据。
 * @param {string} dbName - 数据库名称
 * @param {string} collectionName - 集合名称
 * @param {Object} query - 删除条件
 * @returns {Promise<boolean>} 如果删除成功则返回 true
 */
export async function db_delete(dbName, collectionName, query) {
    const client = mongoClient();
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.deleteOne(query);
    await client.close();
    return true;
}