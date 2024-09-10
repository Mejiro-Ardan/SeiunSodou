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
 * 带有超时机制的连接函数。
 * @param {MongoClient} client - MongoDB 客户端实例
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<void>} 连接成功或超时错误
 */
async function connectWithTimeout(client, timeout = 5000) {
    return Promise.race([
        client.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('连接数据库超时')), timeout))
    ]);
}

/**
 * 检查数据库是否存在。
 * @param {string} dbName - 数据库名称
 * @returns {Promise<boolean>} 如果数据库存在则返回 true，否则返回 false
 */
export async function check_db(dbName) {
    const client = mongoClient();
    try {
        await connectWithTimeout(client);
        const dblist = await client.db().admin().listDatabases();
        return dblist.databases.some(db => db.name === dbName);
    } catch (error) {
        console.error(`检查数据库时出错: ${error.message}`);
        return false;
    } finally {
        await client.close();
    }
}

/**
 * 初始化数据库，创建必要的集合。
 * @param {string} dbName - 数据库名称
 * @returns {Promise<boolean>} 如果初始化成功则返回 true，否则返回 false
 */
export async function init_db(dbName) {
    const client = mongoClient();
    try {
        await connectWithTimeout(client);
        console.log('初始化数据库');
        const db = client.db(dbName);
        await db.createCollection('users');
        await db.createCollection('user_data');
        await db.createCollection('articles');
        await db.createCollection('pending_verifications');
        const collist = await db.listCollections().toArray();
        return collist.some(col => col.name === 'users') && collist.some(col => col.name === 'articles');
    } catch (error) {
        console.error(`初始化数据库时出错: ${error.message}`);
        return false;
    } finally {
        await client.close();
    }
}

/**
 * 从数据库中读取数据。
 * @param {string} dbName - 数据库名称
 * @param {string} collectionName - 集合名称
 * @param {Object} [filter={}] - 查询过滤器
 * @param {Object} [options={}] - 查询选项，包括分页和排序
 * @returns {Promise<Array>} 返回查询到的数据数组
 */
export async function db_read(dbName, collectionName, filter = {}, options = {}) {
    const client = mongoClient();
    try {
        await connectWithTimeout(client);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        return await collection.find(filter, options).toArray();
    } catch (error) {
        console.error(`读取数据时出错: ${error.message}`);
        return [];
    } finally {
        await client.close();
    }
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
    try {
        await connectWithTimeout(client);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne(data);
        return true;
    } catch (error) {
        console.error(`插入数据时出错: ${error.message}`);
        return false;
    } finally {
        await client.close();
    }
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
    try {
        await connectWithTimeout(client);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        return await collection.findOne(data);
    } catch (error) {
        console.error(`查找数据时出错: ${error.message}`);
        return null;
    } finally {
        await client.close();
    }
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
    try {
        await connectWithTimeout(client);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.updateOne(query, { $set: data });
        return true;
    } catch (error) {
        console.error(`更新数据时出错: ${error.message}`);
        return false;
    } finally {
        await client.close();
    }
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
    try {
        await connectWithTimeout(client);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.deleteOne(query);
        return true;
    } catch (error) {
        console.error(`删除数据时出错: ${error.message}`);
        return false;
    } finally {
        await client.close();
    }
}

/**
 * 获取数据库中某一集合的文档总数
 * @param {string} dbName - 数据库名称
 * @param {string} collectionName - 集合名称
 * @param {Object} [filter={}] - 查询过滤器
 * @returns {Promise<number>} 返回集合中的文档总数
 */
export async function db_count(dbName, collectionName, filter = {}) {
    const client = mongoClient();
    try {
        await connectWithTimeout(client);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        return await collection.countDocuments(filter);
    } catch (error) {
        console.error(`获取文档总数时出错: ${error.message}`);
        return 0;
    } finally {
        await client.close();
    }
}

/**
 * 从数据库中获取某个字段的所有唯一值
 * @param {string} dbName - 数据库名称
 * @param {string} collectionName - 集合名称
 * @param {string} fieldName - 需要获取唯一值的字段名
 * @returns {Promise<Array>} 返回包含所有唯一字段值的数组
 */
export async function db_getUniqueFieldValues(dbName, collectionName, fieldName) {
    const client = mongoClient();
    try {
        await connectWithTimeout(client);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // 使用聚合管道从数据库中获取唯一的字段值
        const result = await collection.aggregate([
            { $match: { [fieldName]: { $exists: true } } }, // 仅匹配包含指定字段的文档
            { $group: { _id: `$${fieldName}` } }, // 按照指定字段分组
            { $project: { _id: 0, value: "$_id" } } // 投影字段，返回字段值
        ]).toArray();

        // 从聚合结果中提取唯一字段值
        return result.map(item => item.value);
    } catch (error) {
        console.error(`获取唯一字段值时出错: ${error.message}`);
        return [];
    } finally {
        await client.close();
    }
}