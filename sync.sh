#!/usr/bin/env bash
# 把本地对 skill 的改动提交并推送到 GitHub。
# 用法：./sync.sh "说明你改了什么"
set -e
cd "$(dirname "$0")"
msg="${1:-update skill}"
git add -A
if git diff --cached --quiet; then
  echo "没有需要提交的改动。"
  exit 0
fi
git commit -m "$msg"
git push
echo "已推送到 $(git remote get-url origin)"
