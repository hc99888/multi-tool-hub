#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

cd "${COZE_WORKSPACE_PATH}"

echo "=========================================="
echo "  同步 Web 资源到 Android 项目"
echo "=========================================="
echo ""

npx cap sync android

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 同步完成！"
    echo ""
    echo "现在可以运行: npx cap run android"
    echo ""
else
    echo ""
    echo "❌ 同步失败"
    exit 1
fi
