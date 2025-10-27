import socket

HOST = "0.0.0.0"  # 代表所有 IPv4 地址
PORT = 8082  # 设置端口

class Http:
    def __init__(self, host=HOST, port=PORT):
        self.host = host
        self.port = port
        self.conn = None
        self.method = None
        self.path = None
        self.routes = {}  # 路由字典
    
    def route(self, path, method="GET"):
        """装饰器用于注册路由"""
        def decorator(handler):
            # 确保路径存在
            if path not in self.routes:
                self.routes[path] = {}
            # 注册处理函数
            self.routes[path][method] = handler
            return handler
        return decorator
    
    def run(self):
        """启动HTTP服务器"""
        with socket.socket() as s:
            s.bind((self.host, self.port))
            s.listen(5)
            print(f'服务器启动在 {self.host}:{self.port}')
            
            while True:
                conn, addr = s.accept()
                with conn:
                    print('连接地址：', addr)
                    self.conn = conn
                    request = conn.recv(4096).decode("utf-8", errors="ignore")
                    
                    # 解析请求
                    first_line = request.split("\r\n", 1)[0]
                    method, path, _ = first_line.split(" ", 2)
                    self.method = method
                    self.path = path
                    
                    # 查找路由处理函数
                    handler = self.find_handler(path, method)
                    if handler:
                        body = handler()
                        self.response(body)
                    else:
                        self.handle_404()
    
    def find_handler(self, path, method):
        """查找对应的处理函数"""
        # 检查路径是否存在
        if path in self.routes:
            # 检查方法是否存在
            if method in self.routes[path]:
                return self.routes[path][method]
            # 检查是否有通配处理函数
            if "*" in self.routes[path]:
                return self.routes[path]["*"]
        # 检查是否有通配路径处理
        if "*" in self.routes:
            if method in self.routes["*"]:
                return self.routes["*"][method]
            if "*" in self.routes["*"]:
                return self.routes["*"]["*"]
        return None
    
    def handle_404(self):
        """处理404请求"""
        body = f"<h1>404 Not Found</h1><p>Path={self.path}</p>"
        self.response(body, status="404 Not Found")
    
    def response(self, body, status="200 OK"):
        """发送HTTP响应"""
        resp = (
            f"HTTP/1.1 {status}\r\n"
            "Content-Type: text/html; charset=utf-8\r\n"
            f"Content-Length: {len(body.encode())}\r\n"
            "Connection: close\r\n\r\n"
            f"{body}"
        )
        self.conn.sendall(resp.encode('utf-8'))
