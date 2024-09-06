export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const href = body.url;

    if (!href) {
        return { error: 'URL is required' };
    }

    try {
        const response = await fetch(href);
        const html = await response.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'No title found';

        return {
            'code': '200',
            title
        };
    } catch (error) {
        return {
            'code': '500',
            error: 'Failed to fetch URL'
        };
    }
});