$env:Path += ";C:\Program Files\Go\bin"
go mod download
go build -o server.exe ./cmd/server
./server.exe
