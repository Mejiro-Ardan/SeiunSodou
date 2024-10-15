import { db_find } from "@/server/utils/db";

export default async function id2article(id: number): Promise<ArticleDetail> {
    const ArticlesCollection = await db_find("SeiunSodou", "articles", { slug: id });

    const authorId = Number.parseInt(ArticlesCollection.author);
    const authorData = await db_find("SeiunSodou", "user_data", { uid: authorId });

    return {
        code: "200",
        data: {
            ...ArticlesCollection,
            author: authorData,
        },
    };
}