import nodemailer from 'nodemailer';

const RuntimeConfig = useRuntimeConfig();

/**
 * 发送验证码邮件的异步函数
 * 
 * @param {string} receiverEmail - 收件人的电子邮件地址
 * @param {string} verificationCode - 验证码
 * @param {string} requestType - 请求类型 ('signup' 或 'reset')
 * @returns {Promise<Object>} - 返回一个包含邮件发送信息的 Promise 对象，如果发送失败则返回错误信息
 */
export async function sendCode(receiverEmail, verificationCode, requestType) {

    // 根据 requestType 设置邮件内容
    let emailBody;
    if (requestType === 'signup') {
        emailBody = `Your registration verification code is ${verificationCode}`;
    } else if (requestType === 'reset') {
        emailBody = `Your password reset verification code is ${verificationCode}`;
    } else {
        emailBody = `Your verification code is ${verificationCode}`;
    }

    // 创建邮件传输器
    let transporter = nodemailer.createTransport({
        host: RuntimeConfig.SMTP_SERVER,
        port: RuntimeConfig.SMTP_PORT,
        secure: false,
        auth: {
            user: RuntimeConfig.SMTP_SENDER,
            pass: RuntimeConfig.SMTP_PASSWORD
        }
    });
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
        return error;
    }
}