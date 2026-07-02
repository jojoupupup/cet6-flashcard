"""
六级背单词 - 一键启动HTTP服务器
让局域网内的手机和其他电脑都能访问背单词应用

使用方法：
  1. 双击 start_server.py 或运行: python start_server.py
  2. 服务器启动后会显示访问地址
  3. 手机扫码或输入地址即可使用
  4. 手机浏览器打开后，点击"添加到主屏幕"即可安装为App
"""

import http.server
import socketserver
import socket
import qrcode
import os
import sys
import webbrowser

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # PWA需要的CORS头
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def get_local_ip():
    """获取本机局域网IP"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return '127.0.0.1'

def main():
    local_ip = get_local_ip()
    url = f'http://{local_ip}:{PORT}/背单词.html'
    local_url = f'http://localhost:{PORT}/背单词.html'
    
    print('=' * 60)
    print('  🎓 六级背单词 - HTTP服务器')
    print('=' * 60)
    print()
    print(f'  📍 本机访问: {local_url}')
    print(f'  📱 手机访问: {url}')
    print()
    
    # 生成二维码方便手机扫码
    try:
        qr = qrcode.QRCode(box_size=1, border=2)
        qr.add_data(url)
        qr.make(fit=True)
        qr.print_ascii(invert=True)
        print()
        print('  📲 手机扫码上方二维码即可打开！')
    except:
        print('  (安装 qrcode 库可显示二维码: pip install qrcode)')
    
    print()
    print('  💡 手机浏览器打开后，选择「添加到主屏幕」即可安装为App')
    print('  ⌨️  按 Ctrl+C 停止服务器')
    print()
    
    # 自动在电脑浏览器打开
    webbrowser.open(local_url)
    
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n  ✅ 服务器已停止')
            sys.exit(0)

if __name__ == '__main__':
    main()
