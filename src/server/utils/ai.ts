import { OpenAI } from 'openai';

const RuntimeConfig = useRuntimeConfig();

const client = new OpenAI({
    apiKey: RuntimeConfig.ZHIPU_TOKEN,
    baseURL: "https://open.bigmodel.cn/api/paas/v4/"
});

/**
 * 生成AI响应
 * 
 * @param {string} model - 使用的模型名称
 * @param {string} systemMessage - 系统消息内容
 * @param {string} userMessage - 用户消息内容
 * @param {number} temperature - 生成文本的温度参数
 * @param {number} top_p - 生成文本的top_p参数
 * @returns {Promise<string>} - 返回生成的AI响应，格式为JSON字符串
 */
export async function ai_generate(
    model: string,
    systemMessage: string,
    userMessage: string,
    temperature: number,
    top_p: number
): Promise<string> {
    const completion = await client.chat.completions.create({
        model,
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage }
        ],
        top_p,
        temperature
    });
    return JSON.stringify(completion, null, 2);
}