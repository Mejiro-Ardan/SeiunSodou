import { db_getUniqueFieldValues } from "@/server/utils/db";

export async function getAllCategory(): Promise<ArticleCategories> {
    const categories = await db_getUniqueFieldValues('SeiunSodou', 'articles', 'category');
    return {
        code: "200",
        categories,
    };
}