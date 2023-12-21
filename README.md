<h1 align="center">Rancho API</h1>

Esse repositório é o Backend do projeto "Rancho" criado para auxiliar no gerenciamento de gado de leite. [O frontend está disponível aqui](https://github.com/gustavohernandes11/rancho-web). O projeto está estruturado com uma arquitetura robusta seguindo padrões do Clean Architecture (usecases, divisão em camadas, isolamento das regras de negócio, etc).  

## Stack
- Typescript.
- Express.
- Mongodb: banco de dados não relacional.
- Jest: testes unitários.
- Supertest: testes de integração.
- JWT.
- Bcrypt.
- Husky: assegurar que o código não esteja falhando ao fazer commits.
  
## Features
[x] Sistema de login de usuários.

[x] Registrar lotes.

[x] Registrar animals com informações como sexo, nome, data de nascimento, código, lote etc.

[x] Separação dos animais por lotes.

[ ] Registrar medicamentos e vacinas dos animais.

[ ] Registrar produção de leite com relatórios estatísticos.

[ ] Gerar dados em Excel.

[ ] Gerar relatório do gado total divido em categorias para conformidade legislativas, como notas fiscais, vacinação e medicamentos.
