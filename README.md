![4992302674875625426](https://github.com/user-attachments/assets/c4476e82-bd9d-4e24-a4d3-feeb0a15258b)

# Fingerprintrs-Wasm-JS

Este repositório reúne a implementação de técnicas de Web Fingerprinting utilizando WebAssembly (WASM) como alternativa às abordagens tradicionais baseadas em JavaScript, que vêm sendo restringidas por navegadores e políticas de privacidade. O projeto explora métodos como Canvas, WebGL e análise de áudio em módulos WASM, com JavaScript reduzido ao mínimo necessário para integração com o navegador, visando avaliar o potencial do WASM.

## 📄 Sobre o Artigo

- **Título**: Além do JavaScript: Explorando Web Fingerprinting usando WebAssembly

## 📁 Estrutura do Repositório

```

├── src/                      # \Pasta contendo as implementações do backend
├── public                    # \Pasta contendo as implementações do frontend e scripts fornecidos para os navegadores
├── collect_fingerprint-rs    # \Pasta contendo a implementação em rust do módulo posteriormente compilado em wasm
├── Makefile                  # Arquivo contendo comandos facilitadores para execução deste projeto
├── README.md                 # Este arquivo

````


## 🚀 Como Reproduzir os Experimentos

### 1. Clonar o Repositório
```bash
git clone [https://github.com/[usuario]/[nome-do-repositorio].git](https://github.com/fingerprint-wasm/fingerprintrs-wasm-js.git)
cd fingerprintrs-wasm-js
````

### 2. \[Passo 2: instalar dependências, compilar, etc.]

```bash
make rust
make js
```

### 3. \[Passo 3: execução, testes, etc.]

```bash
make run
```

---

## 📌 Requisitos

* \node instalado
* \rust instalado

