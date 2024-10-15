import { db_find, db_read, db_count } from "@/server/utils/db";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = Number.parseInt(query.page as string || '1');
    const size = Number.parseInt(query.size as string || '10');
    return getArticlesPaging(page, size);
});
/**
 * 获取分页的文章数据
 * 
 * @param {number} [page=1] - 当前页码，默认为1
 * @param {number} [size=10] - 每页显示的文章数量，默认为10
 * @returns {Promise<PagingData>} 包含分页文章数据的Promise对象
 */
export async function getArticlesPaging(page?: number, size?: number): Promise<PagingData> {
    const total = await db_count('SeiunSodou', 'articles', {});

    if (page === 0 || size === 0) {
        return { total } as PagingData;
    }

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
        ArticlesCollection.map(async (article: any) => {
            const authorId = Number.parseInt(article.author, 10);
            const UserinfoCollection = await db_find("SeiunSodou", "user_data", { uid: authorId });
            article.author = UserinfoCollection;
            delete article.text;
            return article;
        }),
    ) as PagingData['articles'];

    return {
        page: currentPage,
        size: pageSize,
        total,
        totalPages,
        articles
    } as PagingData;
}