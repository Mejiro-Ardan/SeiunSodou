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
 * @param {string} user_id - 用户ID
 * @param {number} temperature - 生成文本的温度参数
 * @param {number} top_p - 生成文本的top_p参数
 * @returns {Promise<string>} - 返回生成的AI响应，格式为JSON字符串
 */
export async function ai_generate(model, systemMessage, userMessage, user_id, temperature, top_p) {
    const completion = await client.chat.completions.create({
        model,
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage }
        ],
        top_p,
        temperature,
        user_id: user_id.toString().padStart(6, '0')
    });
    return JSON.stringify(completion, null, 2);
}