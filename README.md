# Leitura Automatizada de Medidores de Água e Gás - API

## Descrição

Esta API foi projetada para gerenciar a leitura automatizada de consumo de água e gás a partir de imagens de medidores. O serviço utiliza inteligência artificial para extrair os valores das medições das imagens. A API oferece endpoints para o envio das imagens, a confirmação dos valores lidos e a consulta de medições por cliente.

A API foi implementada com **Node.js** e **TypeScript**, e está completamente **dockerizada**. Ela utiliza um banco de dados para armazenar as medições e integra-se a uma API de LLM para a extração das medições a partir das imagens.

## Funcionalidades

- **POST /upload**: Recebe uma imagem em base64, consulta a API Gemini para obter a medição e retorna o valor extraído.
- **PATCH /confirm**: Permite confirmar ou corrigir a medição extraída pela IA.
- **GET /{customer_code}/list**: Lista todas as medições realizadas por um cliente, com possibilidade de filtro por tipo de medição.

## Requisitos

- **Node.js** (versão 18.x ou superior)
- **Docker** e **Docker Compose** para criação do ambiente de desenvolvimento.
- **Chave da API Gemini** para a extração de dados da imagem (disponibilizada no arquivo `.env`).

## Instalação

### Passo 1: Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <diretorio_do_projeto>
```

### Passo 2: Configurar variáveis de ambiente

1. Crie um arquivo `.env` na raiz do projeto.
2. Adicione a chave da API Gemini no arquivo `.env`:

```
GEMINI_API_KEY=<sua-chave-api>
```

### Passo 3: Construir e rodar o projeto com Docker

```bash
docker-compose up --build
```

Esse comando vai construir os containers e iniciar a aplicação na porta 80, juntamente com todos os serviços necessários (banco de dados e integração com a API Gemini).

## Endpoints da API

### 1. **POST /upload**

Recebe uma imagem em base64 e retorna a medição extraída pela API Gemini.

#### Request

**URL**: `/upload`  
**Método**: `POST`

**Body**:

```json
{
  "image": "base64",
  "customer_code": "string",
  "measure_datetime": "datetime",
  "measure_type": "WATER" "ou" "GAS"
}
```

#### Respostas

- **Status 200 - Operação Realizada com Sucesso**

```json
{
  "image_url": "string",
  "measure_value": "integer",
  "measure_uuid": "string"
}
```

- **Status 400 - Dados Inválidos**

```json
{
  "error_code": "INVALID_DATA",
  "error_description": "Descrição do erro"
}
```

- **Status 409 - Leitura Duplicada**

```json
{
  "error_code": "DOUBLE_REPORT",
  "error_description": "Leitura do mês já realizada"
}
```

### 2. **PATCH /confirm**

Confirma ou corrige o valor lido pela IA.

#### Request

**URL**: `/confirm`  
**Método**: `PATCH`

**Body**:

```json
{
  "measure_uuid": "string",
  "confirmed_value": "integer"
}
```

#### Respostas

- **Status 200 - Operação Realizada com Sucesso**

```json
{
  "success": true
}
```

- **Status 400 - Dados Inválidos**

```json
{
  "error_code": "INVALID_DATA",
  "error_description": "Descrição do erro"
}
```

- **Status 404 - Leitura Não Encontrada**

```json
{
  "error_code": "MEASURE_NOT_FOUND",
  "error_description": "Leitura não encontrada"
}
```

- **Status 409 - Leitura Já Confirmada**

```json
{
  "error_code": "CONFIRMATION_DUPLICATE",
  "error_description": "Leitura já confirmada"
}
```

### 3. **GET /{customer_code}/list**

Lista todas as medições realizadas por um cliente. É possível filtrar por tipo de medição (`WATER` ou `GAS`).

#### Request

**URL**: `/customer_code/list`  
**Método**: `GET`  
**Parâmetro de Query (opcional)**: `measure_type` (`WATER` ou `GAS`)

#### Respostas

- **Status 200 - Operação Realizada com Sucesso**

```json
{
  "customer_code": "string",
  "measures": [
    {
      "measure_uuid": "string",
      "measure_datetime": "datetime",
      "measure_type": "string",
      "has_confirmed": "boolean",
      "image_url": "string"
    }
  ]
}
```

- **Status 400 - Tipo de Medição Inválido**

```json
{
  "error_code": "INVALID_TYPE",
  "error_description": "Tipo de medição não permitida"
}
```

- **Status 404 - Nenhum Registro Encontrado**

```json
{
  "error_code": "MEASURES_NOT_FOUND",
  "error_description": "Nenhuma leitura encontrada"
}
```

## Testes

A API pode ser testada utilizando ferramentas como [Postman](https://www.postman.com/) ou [cURL](https://curl.se/). Certifique-se de que a aplicação esteja rodando corretamente e que o Docker tenha inicializado todos os containers necessários.

### Testando os Endpoints

#### 1. **POST /upload**: Enviar uma imagem codificada em base64 para verificar se a IA consegue ler corretamente a medição.

#### 2. **PATCH /confirm**: Confirmar ou corrigir um valor já extraído e verificar a atualização no banco de dados.

#### 3. **GET /{customer_code}/list**: Listar as medições de um cliente, podendo aplicar filtro por tipo de medição.

## Docker Compose

Este repositório inclui um arquivo `docker-compose.yml` que facilita o setup da aplicação e dos seus serviços. Para rodar a aplicação, execute o comando:

```bash
docker-compose up --build
```

A aplicação será exposta na porta 80.
