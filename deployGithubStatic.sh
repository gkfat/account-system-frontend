#!/bin/bash

CURRENT_DATE=$(date +"%Y-%m-%d %H:%M")
echo "Start deploy: $CURRENT_DATE"

# 部署至 Remote path gh-page 建立靜態頁面
npm run build

# 複製 index.html 並產生一份 404.html
echo "---
permalink: /404.html
---
" > "./dist/404.html"
cat "./dist/index.html" >> "./dist/404.html"

# 將 dist 部署至 gh-pages
git subtree push --prefix dist origin gh-pages