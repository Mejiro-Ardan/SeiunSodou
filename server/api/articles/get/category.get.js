import { db_getUniqueFieldValues } from "~/server/lib/db";

export default defineEventHandler(async (event) => {
    // const query = getQuery(event);

    const categories = await db_getUniqueFieldValues('SeiunSodou', 'articles', 'category');
    return {
        code: "200",
        categories,
    };
});