import { createTransport } from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const RuntimeConfig = useRuntimeConfig();

const options: SMTPTransport.Options = {
    host: RuntimeConfig.SMTP_SERVER,
    port: Number(RuntimeConfig.SMTP_PORT),
    secure: false, // 如果需要 SSL/TLS，请设置为 true
    auth: {
        user: RuntimeConfig.SMTP_SENDER,
        pass: RuntimeConfig.SMTP_PASSWORD
    }
}

/**
 * 发送验证码邮件的异步函数
 * 
 * @param {string} receiverEmail - 收件人的电子邮件地址
 * @param {number} verificationCode - 验证码
 * @param {string} requestType - 请求类型 ('signup' 或 'reset')
 * @returns {Promise<SMTPTransport.SentMessageInfo>} - 返回一个包含邮件发送信息的 Promise 对象，如果发送失败则返回错误信息
 */
export async function sendCode(
    receiverEmail: string,
    verificationCode: number,
    requestType: 'signup' | 'reset' | string
): Promise<SMTPTransport.SentMessageInfo> {

    // 根据 requestType 设置邮件内容
    let emailBody: string;
    if (requestType === 'signup') {
        emailBody = `Your registration verification code is ${verificationCode}`;
    } else if (requestType === 'reset') {
        emailBody = `Your password reset verification code is ${verificationCode}`;
    } else {
        emailBody = `Your verification code is ${verificationCode}`;
    }

    // 创建邮件传输器
    let transporter = createTransport(options);

    // 设置邮件选项
    let mailOptions = {
        from: `"星雲草堂SeiunSodou" <${RuntimeConfig.SMTP_SENDER}>`,
        to: receiverEmail,
        subject: 'SeiunSodou Verification Code',
        text: emailBody,
    };

    // 发送邮件
    try {
        let info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error(error);
        throw error;
    }
}