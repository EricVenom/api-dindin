![](https://i.imgur.com/xG74tOh.png)

# DinDin API

RESTful API que permite:

- Cadastrar Usuário
- Fazer Login 
- Detalhar Perfil do Usuário Logado 
- Editar Perfil do Usuário Logado 
- Listar categorias 
- Listar transações 
- Detalhar transação 
- Cadastrar transação 
- Editar transação 
- Remover transação 
- Obter extrato de transações 

## **Banco de dados**

Você precisa criar um Banco de Dados PostgreSQL chamado `dindin` contendo as seguintes tabelas e colunas:  
**ATENÇÃO! Os nomes das tabelas e das colunas a serem criados devem seguir exatamente os nomes listados abaixo.**

- usuarios
  - id
  - nome
  - email (campo único)
  - senha
- categorias
  - id
  - descricao
- transacoes
  - id
  - descricao
  - valor
  - data
  - categoria_id
  - usuario_id
  - tipo

**IMPORTANTE: No projeto o arquivo SQL que deverá ser o script que cria as tabelas corretamente se chama `query.sql`.**

As categorias a seguir precisam ser previamente cadastradas para que sejam listadas no endpoint de listagem das categorias.

## **Categorias**

- Alimentação
- Assinaturas e Serviços
- Casa
- Mercado
- Cuidados Pessoais
- Educação
- Família
- Lazer
- Pets
- Presentes
- Roupas
- Saúde
- Transporte
- Salário
- Vendas
- Outras receitas
- Outras despesas

## **Status Codes**

Abaixo, listamos os possíveis **_status codes_** esperados como resposta da API.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
```

## **Endpoints**
---
### **Cadastrar usuário**
#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha

- **Resposta**  
    - Em caso de **sucesso**, deveremos enviar no corpo (body) da resposta o conteúdo do usuário cadastrado, incluindo seu respectivo `id` e excluindo a senha criptografada.

  - Cadastrará o usuário no banco de dados em caso de **sucesso**.

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

---
### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - email
  - senha

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **token** que deverá possuir como valor o token de autenticação gerado e uma propriedade **usuario** que deverá possuir as informações do usuário autenticado, exceto a senha do usuário.  

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, deverão exigem o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado

---
### **Detalhar usuário**

#### `GET` `/usuario`

Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.  
**Atenção!:** O usuário deverá ser identificado através do ID presente no token de autenticação.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo da requisição.

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa o usuário encontrado, com todas as suas propriedades (exceto a senha), conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  

#### **Exemplo de requisição**

```javascript
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```
---
### **Atualizar usuário**

#### `PUT` `/usuario`

Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  
**Atenção!:** O usuário deverá ser identificado através do ID presente no token de autenticação.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha

- **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  

#### **Exemplo de requisição**

```javascript
// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```
---
### **Listar categorias**

#### `GET` `/categoria`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as categorias cadastradas.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (categorias) encontrados.  

#### **Exemplo de requisição**

```javascript
// GET /categoria
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
    {
        id: 1,
        descricao: "Roupas",
    },
    {
        id: 2,
        descricao: "Mercado",
    },
]
```

```javascript
// HTTP Status 200 / 201 / 204
[]
```
---
### **Listar transações do usuário logado**

#### `GET` `/transacao`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas.  
**Lembre-se:** Deverão ser retornadas **apenas** transações associadas ao usuário logado, que deverá ser identificado através do ID presente no token de validação.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (transações) encontrados.  

#### **Exemplo de requisição**

```javascript
// GET /transacao
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
    {
        id: 1,
        tipo: "saida",
        descricao: "Sapato amarelo",
        valor: 15800,
        data: "2022-03-23T15:35:00.000Z",
        usuario_id: 5,
        categoria_id: 4,
        categoria_nome: "Roupas",
    },
    {
        id: 3,
        tipo: "entrada",
        descricao: "Salário",
        valor: 300000,
        data: "2022-03-24T15:30:00.000Z",
        usuario_id: 5,
        categoria_id: 6,
        categoria_nome: "Salários",
    },
]
```

```javascript
// HTTP Status 200 / 201 / 204
[]
```
---
### **Detalhar uma transação do usuário logado**

#### `GET` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.  
**Lembre-se:** Deverá ser retornado **apenas** transação associada ao usuário logado, que deverá ser identificado através do ID presente no token de validação.

- **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa a transação encontrada, com todas as suas propriedades, conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  

#### **Exemplo de requisição**

```javascript
// GET /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 2,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```
---
### **Cadastrar transação para o usuário logado**

#### `POST` `/transacao`

Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.  
**Lembre-se:** Deverá ser possível cadastrar **apenas** transações associadas ao próprio usuário logado, que deverá ser identificado através do ID presente no token de validação.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - descricao
  - valor
  - data
  - categoria_id
  - tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

- **Resposta**
    Em caso de **sucesso**, deveremos enviar, no corpo (body) da resposta, as informações da transação cadastrada, incluindo seu respectivo `id`.  

#### **Exemplo de requisição**

```javascript
// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "categoria_id": 6
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```
---
### **Atualizar transação do usuário logado**

#### `PUT` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.  
**Lembre-se:** Deverá ser possível atualizar **apenas** transações associadas ao próprio usuário logado, que deverá ser identificado através do ID presente no token de validação.

- **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - descricao
  - valor
  - data
  - categoria_id
  - tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

- **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta. 

#### **Exemplo de requisição**

```javascript
// PUT /transacao/2
{
 "descricao": "Sapato amarelo",
 "valor": 15800,
 "data": "2022-03-23 12:35:00",
 "categoria_id": 4,
 "tipo": "saida"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```
---
### **Excluir transação do usuário logado**

#### `DELETE` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.  
**Lembre-se:** Deverá ser possível excluir **apenas** transações associadas ao próprio usuário logado, que deverá ser identificado através do ID presente no token de validação.

- **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  

#### **Exemplo de requisição**

```javascript
// DELETE /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```
---
### **Obter extrato de transações**

#### `GET` `/transacao/extrato`

Essa é a rota que será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas.
**Lembre-se:** Deverá ser possível consultar **apenas** transações associadas ao próprio usuário logado, que deverá ser identificado através do ID presente no token de validação.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
    Em caso de **sucesso**, deveremos enviar no corpo (body) da resposta um objeto contendo a soma de todas as transações do tipo `entrada` e a soma de todas as transações do tipo `saida`.  

- **REQUISITOS OBRIGATÓRIOS**:
  - Em caso de não existir transações do tipo `entrada` cadastradas para o usuário logado, o valor retornado no corpo (body) da resposta deverá ser 0.
  - Em caso de não existir transações do tipo `saida` cadastradas para o usuário logado, o valor retornado no corpo (body) da resposta deverá ser 0.


#### **Exemplo de requisição**

```javascript
// GET /transacao/extrato
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
 "entrada": 300000,
 "saida": 15800
}
```

---

###### tags: `back-end` `nodeJS` `PostgreSQL` `API REST`
