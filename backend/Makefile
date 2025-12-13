.PHONY: run build migrate test clean

run:
	go run cmd/server/main.go

build:
	go build -o bin/server cmd/server/main.go

migrate:
	psql -h $(DB_HOST) -U $(DB_USER) -d $(DB_NAME) -f migrations/001_init_schema.sql

test:
	go test -v ./...

clean:
	rm -rf bin/
