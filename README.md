# Rancho API

Rancho API é uma aplicação backend criada para ajudar criadores de gado a gerenciar seus animais.

## Instalação local
1. Clone este repositório:

    ```bash
    git clone https://github.com/gustavohernandes11/rancho-mobile
    ```

2. Navegue até o diretório e instale as dependências:

    ```bash
    cd rancho-mobile
    yarn
    ```

3. Crie um arquivo `.env` com os campos conforme o exemplo em `.env.exemple`.

4. Inicie o projeto:

    ```bash
    yarn start
    ```
## Tecnologias utilizadas no projeto
- **Linguagem de Programação:**
  - TypeScript

- **Framework Web:**
  - Express

- **Banco de Dados:**
  - MongoDB (Banco de dados não relacional)

- **Testes:**
  - Jest (Testes unitários)
  - Supertest (Testes de integração)

- **Segurança:**
  - JWT (JSON Web Tokens)
  - Bcrypt (Para hash de senhas)

- **Ferramentas de Desenvolvimento:**
  - Husky (Garante que o código não esteja falhando ao fazer commits)

- **Documentação:**
  - Swagger (Ferramenta de documentação)

## Arquitetura do projeto
O projeto, apesar de simples, possui uma arquitetura bem estruturada e segue os princípíos da "Clean Architecture". Suas partes são desacopladas e não dependem de um framework específico. Há 6 camadas, as camadas mais externas não tem conhecimento das camadas mais externas, e portanto não são dependentes.
### Domain
A camada mais interna, conhecida como o "núcleo" da aplicação. Aqui, residem os modelos que representam os conceitos centrais da aplicação e os casos de uso, que definem as regras de negócio fundamentais. Esta camada é independente de frameworks externos e serve como a base que orienta toda a lógica de negócio.

``` 
│   ├───domain/
│   │   ├───models/
│   │   │   ├───account.ts
│   │   │   ├───animals.ts
│   │   │   ├─── ...
│   │   │   └───update-animal.ts
│   │   └───usecases/
│   │       ├───add-account.ts
│   │       ├───add-animal.ts
│   │       ├─── ...
│   │       └───update-many-animals.ts
```

### Data
Responsável por definir interfaces que representam contratos entre as regras de negócio da camada Domain e a implementação concreta na camada Infra. As interfaces nesta camada descrevem como os casos de uso devem interagir com o armazenamento de dados.

```
│   ├───data/
│   │   ├───protocols/
│   │   │   ├───criptography/
│   │   │   └───db/
│   │   └───usecases/
│   │       ├───add-account/
│   │       ├───add-animal/
│   │       ├─── ...
│   │       └───update-many-animals/
```

### Infra
Implementa as interfaces definidas na camada Data. Aqui, as tecnologias específicas, como bancos de dados e serviços externos, são integradas à aplicação. A camada Infra fornece os meios para persistência e recuperação de dados, mas sem conhecimento sobre o que esses dados representam em termos de regras de negócio.

```
│   ├───infra/
│   │   ├───criptography/
│   │   │   ├───bcrypt-adapter.spec.ts
│   │   │   ├───bcrypt-adapter.ts
│   │   │   ├───jwt-adapter.spec.ts
│   │   │   └───jwt-adapter.ts
│   │   └───db/
│   │       └───mongodb/
```

### Presentation
Camada responsável por lidar com as requisições dos usuários. Os controladores nesta camada recebem as solicitações HTTP e interagem com os casos de uso definidos na camada Domain. A Presentation não contém lógica de negócio, mas coordena as interações entre o usuário e o núcleo da aplicação.

```
│   ├───presentation/
│   │   ├───controllers/
│   │   │   ├───account/
│   │   │   ├───animals/
│   │   │   └───batch/
│   │   ├───errors/
│   │   │   ├───access-denied-error.ts
│   │   │   ├───body-is-not-array-error.ts
│   │   │   ├─── ...
│   │   │   └───param-in-use-error.ts
│   │   ├───helpers/
│   │   │   └───http-helpers.ts
│   │   ├───middlewares/
│   │   │   ├───auth-middleware.spec.ts
│   │   │   └───auth-middleware.ts
│   │   └───protocols/
│   │       ├───controller.ts
│   │       ├───http.ts
│   │       ├───index.ts
│   │       ├───middleware.ts
│   │       └───validation.ts
```

### Validation
Uma camada dedicada à validação de dados. Aqui, são realizadas validações específicas antes de os dados atingirem as camadas mais internas. Isso ajuda a garantir a integridade dos dados antes que eles alcancem a camada de regras de negócio.

```
│   └───validation/
│       ├───protocols/
│       │   └───email-validator.ts
│       └───validators/
│           ├───compare-fields-validation.spec.ts
│           ├───compare-fields-validation.ts
│           ├───email-validation.spec.ts
│           ├───email-validation.ts
│           ├─── ...
│           ├───validation-composite.spec.ts
│           └───validation-composite.ts
```

### Main
A camada mais externa, onde a aplicação é inicializada. Aqui, ocorre a configuração do servidor, a definição de middlewares, a configuração de rotas e a instância do banco de dados. A Main serve como ponto de entrada e coordena a inicialização de todos os componentes necessários para a execução da aplicação.

```
│   ├───main/
│   │   ├───adapters/
│   │   ├───config/
│   │   ├───docs/
│   │   ├───factories/
│   │   ├───middlewares/
```

## Documentação simplificada da API
A documentação do projeto foi criada usando Swagger e pode ser explorada na rota "/docs". Uma versão simplificada das possíveis rotas está abaixo:

### Rotas de autenticação

- Login: **POST** `/api/login`
- Signup: **POST** `/api/signup`

### Rotas de animais

- Carregar animal: **GET** `/animals/:animalId`
- Modificar animal: **PUT** `/animals/:animalId`
- Deletar animal: **DELETE** `/animals/:animalId`
- Adicionar Animal: **POST** `/animals`
- Atualizar Múltiplos Animais: **PUT** `/animals`
- Listar Animais: **GET** `/animals`

### Rotas de lotes

- Obter Informações do Lote: **GET** `/batches/:batchId/info`
- Listar Animais no Lote: **GET** `/batches/:batchId`
- Atualizar Informações do Lote: **PUT** `/batches/:batchId`
- Deletar Lote: **DELETE** `/batches/:batchId`
- Adicionar Lote: **POST** `/batches`
- Listar Lotes: **GET** `/batches`



## Testes
Há testes extensivos que asseguram o funcionamento das partes unitárias e de sua integração. Você pode rodar todos os testes com o seguinte comando:

```bash
yarn test
```

O resultado deve ser algo parecido com isso:

![Captura de Tela (18)](https://github.com/gustavohernandes11/rancho-api/assets/66632840/834fb373-4d49-41dc-a364-0d98b2aede98)

## License

[MIT](https://choosealicense.com/licenses/mit/)
