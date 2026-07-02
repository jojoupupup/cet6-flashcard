@echo off
chcp 65001 >nul
title 六级背单词 - 启动服务器

echo ============================================================
echo   🎓 六级背单词 - 一键启动
echo ============================================================
echo.

:: 检查Python是否可用
where python >nul 2>nul
if %errorlevel%==0 (
    echo [√] 检测到 Python，正在启动服务器...
    echo.
    python "%~dp0start_server.py"
    goto :end
)

:: 检查Python3
where python3 >nul 2>nul
if %errorlevel%==0 (
    echo [√] 检测到 Python3，正在启动服务器...
    echo.
    python3 "%~dp0start_server.py"
    goto :end
)

:: 检查Node.js
where node >nul 2>nul
if %errorlevel%==0 (
    echo [√] 检测到 Node.js，正在启动服务器...
    echo.
    node "%~dp0start_server_node.js"
    goto :end
)

:: 没有任何可用运行时
echo [!] 未检测到 Python 或 Node.js
echo.
echo   请安装以下任一工具后重试：
echo   - Python: https://www.python.org/downloads/ (推荐)
echo   - Node.js: https://nodejs.org/
echo.
echo   或者直接双击 背单词.html 用浏览器打开（功能可用，但无法安装为手机App）
echo.

:: 直接用浏览器打开
echo 正在用浏览器打开...
start "" "%~dp0背单词.html"

:end
pause
