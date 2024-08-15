FROM node:20

RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

# 运行应用
CMD ["pnpm", "run", "start"]
