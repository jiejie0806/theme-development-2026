# Shopify 主题开发项目

基于 Shopify Dawn 主题二次开发的电商主题项目。

## 项目信息

| 项 | 值 |
|---|---|
| **GitHub 仓库** | https://github.com/jiejie0806/theme-development-2026 |
| **Shopify 商店** | theme-development-2026.myshopify.com |
| **本地开发目录** | /Users/jiejie/Desktop/shopify-project |
| **本地预览地址** | http://127.0.0.1:9292 |
| **Node 版本要求** | >= 22.12.0 |
| **Shopify CLI** | @shopify/cli@4.5.2 |

## 目录结构

```
shopify-project/
├── layout/            # 全局布局文件（theme.liquid）
├── templates/         # 页面模板（product.json, cart.json, collection.json 等）
├── sections/          # 可复用区块（header, footer, main-product 等）
├── snippets/          # 可复用小组件（card-product, price, icon 等）
├── assets/            # 静态资源（CSS, JS, 图片）
├── config/            # 主题配置（settings_schema.json, settings_data.json）
└── locales/           # 多语言文件
```

## 环境准备

### 1. 安装 Node.js v22

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

### 2. 安装 Shopify CLI

```bash
npm install -g @shopify/cli@latest
```

### 3. 登录 Shopify

```bash
shopify auth login
```

浏览器会弹出授权页面，登录创建商店的 Partners 账号即可。

## 开发流程

### 本地开发

# 启动本地开发服务器（热刷新预览）
```bash
shopify theme dev --store theme-development-2026-bbh8p7a3.myshopify.com

启动后访问 http://127.0.0.1:9292 ，修改文件自动刷新。
```
### 从商店拉取

```bash
# 拉取线上主题文件到本地（覆盖本地）
shopify theme pull --store theme-development-2026-bbh8p7a3.myshopify.com

# 只拉取指定文件
shopify theme pull --store theme-development-2026-bbh8p7a3.myshopify.com --only config/settings_data.json
```

### 推送到商店

```bash
# 推送到未发布主题（测试用，不影响线上）
shopify theme push --store theme-development-2026-bbh8p7a3.myshopify.com --unpublished

# 推送并发布（替换线上主题）
shopify theme push --store theme-development-2026-bbh8p7a3.myshopify.com --publish
```

## Git 版本管理

### 首次克隆

```bash
git clone https://github.com/jiejie0806/theme-development-2026.git
cd theme-development-2026

# 克隆后拉取 settings_data.json（被 gitignore 忽略）
shopify theme pull --store theme-development-2026-bbh8p7a3.myshopify.com --only config/settings_data.json
```

### 日常推送流程

```bash
# 1. 查看改动
git status

# 2. 添加文件
git add .

# 3. 提交
git commit -m "feat: 添加产品自定义标签功能"

# 4. 推送到 GitHub
git push
```

### 分支管理

```bash
# 创建功能分支
git checkout -b feat/custom-badge

# 开发完成合并回 main
git checkout main
git merge feat/custom-badge

# 推送
git push
```

## 常用命令速查

| 命令 | 作用 |
|------|------|
| `shopify theme dev` | 启动本地开发预览（热刷新） |
| `shopify theme pull` | 从商店拉取主题到本地 |
| `shopify theme push` | 推送本地主题到商店 |
| `shopify theme push --unpublished` | 推送到未发布主题（测试环境） |
| `shopify theme push --publish` | 推送并发布上线 |
| `shopify theme check` | 代码检查（类似 linter） |
| `shopify auth login` | 登录 Shopify 账号 |
| `shopify auth logout` | 退出登录 |
| `git add .` | 添加所有改动到暂存区 |
| `git commit -m "说明"` | 提交到本地仓库 |
| `git push` | 推送到 GitHub |
| `git pull` | 拉取 GitHub 最新代码 |

## 注意事项

### settings_data.json

`config/settings_data.json` 被 .gitignore 忽略，因为它存储商家在后台改的设置值，每次改动都会变，提交会产生无意义 diff。

新环境克隆代码后，需要从商店拉取：

```bash
shopify theme pull --store theme-development-2026-bbh8p7a3.myshopify.com --only config/settings_data.json
```

### 模板命名规则

Shopify 模板文件名必须符合固定格式，不能自定义类型名：

| 文件名 | 匹配 URL |
|--------|---------|
| `product.liquid` / `product.json` | /products/* |
| `collection.liquid` / `collection.json` | /collections/* |
| `cart.liquid` / `cart.json` | /cart |
| `page.liquid` / `page.json` | /pages/* |
| `page.contact.liquid` | /pages/contact（需后台选模板） |
| `404.liquid` | 任意不存在的 URL |

备用模板格式：`{类型}.{名称}.liquid`，如 `page.contact.liquid`。

### Section 文件要求

每个 section 文件必须包含 `{% schema %}` 标签，否则报 "不是有效的 section 类型"：

```liquid
{% schema %}
{
  "name": "Header",
  "settings": []
}
{% endschema %}
```

### Section vs Section Group

| 语法 | 作用 |
|------|------|
| `{% section 'header' %}` | 引入单个 section（sections/header.liquid） |
| `{% sections 'header-group' %}` | 引入 section group（sections/header-group.json） |

### cart_type 设置

购物车模式由 `settings_data.json` 的 `cart_type` 控制，改 `settings_schema.json` 的 default 无效（已被覆盖）：

| 值 | 效果 |
|---|---|
| `drawer` | 右侧抽屉滑出 |
| `page` | 独立 /cart 页面 |
| `notification` | 顶部通知 |

修改后需重启 `shopify theme dev` 才生效（配置文件不热刷新）。

### Node 版本

Shopify CLI 4.x 要求 Node >= 22.12.0。低版本会报 `enableCompileCache` 语法错误。

```bash
node -v  # 确认版本
nvm use 22  # 切换版本
```

### Token 过期

`shopify theme dev` 报 "Looks like you don't have access to this dev store" 通常是 token 过期：

```bash
shopify auth logout
shopify auth login
```

### Git 认证

GitHub 不支持密码认证，需要用 Personal Access Token (classic)：

1. 去 https://github.com/settings/tokens/new
2. 勾选 `repo` 权限
3. 生成 token（以 `ghp_` 开头）
4. 推送时用户名填 GitHub 用户名，密码填 token

macOS 钥匙串会自动记住凭据，后续推送不用再输。

如果凭据错误，清除钥匙串：

```bash
printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase
```
