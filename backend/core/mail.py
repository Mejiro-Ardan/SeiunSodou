import smtplib
from email.mime.text import MIMEText
import os

def send_code(receiver_email, verification_code, request_type):
    # 邮件服务器设置
    smtp_server = os.getenv('SMTP_SERVER')
    smtp_port = os.getenv('SMTP_PORT')
    sender_email = os.getenv('SMTP_SENDER')
    sender_password = os.getenv('SMTP_PASSWORD')

    # 根据 request_type 设置邮件内容
    if request_type == 'signup':
        email_body = f'Your registration verification code is {
            verification_code}'
    elif request_type == 'reset':
        email_body = f'Your password reset verification code is {
            verification_code}'
    else:
        email_body = f'Your verification code is {verification_code}'

    # 创建邮件内容
    message = MIMEText(email_body, 'plain', 'utf-8')
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = 'SeiunSodou Verification Code'

    # 连接邮件服务器并发送邮件
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(sender_email, sender_password)
    server.sendmail(sender_email, [receiver_email], message.as_string())
    server.quit()
    return True
