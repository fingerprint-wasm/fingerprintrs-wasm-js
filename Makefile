# Caminhos principais
RUST_SRC=collect_fingerprint-rs
PUBLIC=public/fingerprints
RUST_OUT=../$(PUBLIC)/rust_pkg
SERVER=src/server.js
DATA=data

# Alvos principais
.PHONY: all build rust run clean

all: build run

build: rust js

rust:
	@echo "🔨 Compilando Rust para WebAssembly..."
	@wasm-pack build $(RUST_SRC) --target web --out-dir $(RUST_OUT)

js:
	@echo "📚 Baixando as dependencias do javascript..."
	@npm install

run:
	@echo "🚀 Iniciando o servidor..."
	@node $(SERVER)
	@mkdir -p $(DATA)