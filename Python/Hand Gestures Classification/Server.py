import socket as s

Server = s.socket(s.AF_INET, s.SOCK_STREAM)
Server.bind((s.gethostname(), 1234))
Server.listen(5)

while True:
    Clinet, Address = Server.accept()
    print(f'Connection from {Address} has been established!')
    Clinet.send(('Welcome to the server!').encode())
    while True:
        Data = Clinet.recv(1024)
        if not Data:
            break
        print(Data.decode())
