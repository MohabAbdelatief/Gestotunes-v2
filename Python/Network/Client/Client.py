import socket as s

Data='Hello World'

Clinet = s.socket(s.AF_INET, s.SOCK_STREAM)
Clinet.connect((s.gethostname(), 1234))

Message = Clinet.recv(1024)
print(Message.decode())

Clinet.send(Data.encode())