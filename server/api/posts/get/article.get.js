import { db_find } from "~/server/lib/db";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = Number.parseInt(query.id);

    if (!id) {
        return {
            code: "400",
            body: { error: "id is a required query parameter" },
        };
    }

    const ArticlesCollection = await db_find("SeiunSodou", "articles", { slug: id });

    if (!ArticlesCollection) {
        return {
            code: "404",
            body: { error: "Article not found" },
        };
    }

    const authorId = Number.parseInt(ArticlesCollection.author);
    const authorData = await db_find("SeiunSodou", "user_data", { uid: authorId });

    return {
        code: "200",
        data: {
            ...ArticlesCollection,
            author: authorData,
        },
    };
});