- node 22.11.0
- npm 10.9.0
- pnpm 10.20.0

- `npm start`
- `npm test`
- `npm run build`
- `npm run eject`

###### 配置自定义 eslint
###### 配置 prettier
###### 配置husky（校验eslint/prettier）
###### 配置commit lint

###### classnames
###### css Module(必须xxxx.module.css命名)
###### sass
###### 路由
###### tailwindcss


# 终端 1：启动后端
cd server
npm install --legacy-peer-deps   # 如遇 peer 警告
npm run dev

# 终端 2：启动前端（默认仍为 mock 模式）
cd ..
npm start