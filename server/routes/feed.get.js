import { Feed } from 'feed';

const appConfig = useAppConfig();

export default defineEventHandler(async (event) => {
    // 获取查询参数中的 `fmt` 参数
    const query = getQuery(event);
    const format = query.fmt || 'atom'; // 默认返回 Atom 格式

    // 获取文章数据
    const response = await fetch(`${appConfig.SiteConfig.SiteURL}/api/articles/get/list?page=1&size=50`);
    const data = await response.json();

    const feedOptions = {
        title: "SeiunSodou",
        description: "SeiunSodou Feed",
        id: appConfig.SiteConfig.SiteURL,
        link: appConfig.SiteConfig.SiteURL,
        language: "zh",
        updated: new Date(),
        feedLinks: {
            atom: `${appConfig.SiteConfig.SiteURL}/feed?fmt=atom`,
            json: `${appConfig.SiteConfig.SiteURL}/feed?fmt=json`
        }
    };

    const feed = new Feed(feedOptions);

    // 添加文章到 Feed
    data.articles.forEach((article) => {
        feed.addItem({
            id: `${appConfig.SiteConfig.SiteURL}/p/${article.slug}`,
            title: article.title,
            description: article.summary,
            content: article.text,
            author: [
                {
                    name: article.author?.nick || '未知作者',
                    link: `${appConfig.SiteConfig.SiteURL}/s/${article.author?.uid}`
                }
            ],
            date: new Date(article.created),
            updated: new Date(article.modified)
        });
    });

    if (format === 'json') {
        const jsonFeed = feed.json1();

        event.node.res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return jsonFeed;
    } else {
        const atomFeed = feed.atom1();

        event.node.res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');
        return atomFeed;
    }
});