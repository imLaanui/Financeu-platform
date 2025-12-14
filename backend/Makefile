.PHONY: run build migrate-up migrate-down migrate-status test vet lint check clean

include .env
export

run:
	go run cmd/server/main.go

build:
	go build -o bin/server cmd/server/main.go

migrate-up:
	goose -dir migrations postgres "$(DATABASE_URL)" up

migrate-down:
	goose -dir migrations postgres "$(DATABASE_URL)" down

migrate-status:
	goose -dir migrations postgres "$(DATABASE_URL)" status

test:
	go test -v ./...

vet:
	go vet ./...

lint:
	golangci-lint run

check: vet lint test

clean:
	rm -rf bin
