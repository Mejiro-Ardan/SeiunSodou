import { db_find, db_read, db_count } from "~/server/lib/db";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = Number.parseInt(query.page) || 1;
    const size = Number.parseInt(query.size) || 10;

    const filter = {};

    const skip = Math.max((page - 1) * size, 0);

    const options = {
        skip: skip,
        limit: size,
        sort: { id: -1 }
    };

    // 获取总记录数
    const total = await db_count('SeiunSodou', 'articles', filter);
    const totalPages = Math.ceil(total / size);

    const ArticlesCollection = await db_read('SeiunSodou', 'articles', filter, options);

    const articles = await Promise.all(
        ArticlesCollection.map(async (article) => {
            const authorId = Number.parseInt(article.author, 10);
            const UserinfoCollection = await db_find("SeiunSodou", "user_data", { uid: authorId });
            article.author = UserinfoCollection;
            return article;
        }),
    );

    return {
        page,
        size,
        total,
        totalPages,
        articles
    };
});