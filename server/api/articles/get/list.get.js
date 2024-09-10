import { db_find, db_read, db_count } from "~/server/lib/db";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = Number.parseInt(query.page);
    const size = Number.parseInt(query.size);

    // 获取总记录数
    const total = await db_count('SeiunSodou', 'articles', {});

    // 如果 page 或 size 为 0，只返回 total
    if (page === 0 || size === 0) {
        return { total };
    }

    // 如果 page 或 size 未定义，设置默认值
    const currentPage = page || 1;
    const pageSize = size || 10;

    const filter = {};
    const skip = Math.max((currentPage - 1) * pageSize, 0);

    const options = {
        skip: skip,
        limit: pageSize,
        sort: { id: -1 }
    };

    const totalPages = Math.ceil(total / pageSize);
    const ArticlesCollection = await db_read('SeiunSodou', 'articles', filter, options);

    const articles = await Promise.all(
        ArticlesCollection.map(async (article) => {
            const authorId = Number.parseInt(article.author, 10);
            const UserinfoCollection = await db_find("SeiunSodou", "user_data", { uid: authorId });
            article.author = UserinfoCollection;
            delete article.text;
            return article;
        }),
    );

    return {
        page: currentPage,
        size: pageSize,
        total,
        totalPages,
        articles
    };
});