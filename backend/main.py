# main.py
import uvicorn
from fastapi import FastAPI, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from core.db import init_db, check_db
from core.handlers import handle_login, handle_send_mail, handle_register_verify, handle_verify, handle_reset_password
from dotenv import load_dotenv
import os

# 加载外部Nuxt项目的.env文件
load_dotenv(dotenv_path=f'{os.path.dirname(
    os.path.dirname(os.path.abspath(__file__)))}/.env')

app = FastAPI()

def get_jwt_token(authorization: str):
    return authorization.split(" ")[1]

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有Header
)


@app.options("/api/{rest_of_path:path}")
async def preflight_handler():
    return {"message": "Preflight request successful"}


@app.post("/api/login")
async def login(request: Request):
    data = await request.json()
    return await handle_login(data)


@app.post("/api/send_mail")
async def send_mail(request: Request):
    data = await request.json()
    return await handle_send_mail(data)


@app.post("/api/register_verify")
async def verify(request: Request):
    data = await request.json()
    return await handle_register_verify(data)


@app.post("/api/reset_password")
async def verify(request: Request):
    data = await request.json()
    return await handle_reset_password(data)


@app.post("/api/verify")
async def verify(authorization: str = Header(None)):
    token = get_jwt_token(authorization)
    result = await handle_verify(token)
    return result

if __name__ == "__main__":
    # 检查数据库是否存在
    if not check_db('SeiunSodou'):
        # 初始化数据库
        if not init_db('SeiunSodou'):
            print('初始化数据库失败')
            exit()
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
