# Requerimentos

## Cadastro

### Caso de sucesso

1. [x] Recebe uma requisição do tipo **POST** na rota **/api/signup**
2. [x] Valida dados obrigatórios **name**, **email**, **password** e **passwordConfirmation**
3. [x] Valida que **password** e **passwordConfirmation** são iguais
4. [x] Valida que o campo **email** é um e-mail válido
5. [x] **Valida** se já existe um usuário com o email fornecido
6. [x] Gera uma senha **criptografada** (essa senha não pode ser descriptografada)
7. [x] **Cria** uma conta para o usuário com os dados informados, **substituindo** a senha pela senha criptografada
8. [x] Gera um **token** de acesso a partir do ID do usuário
9. [x] **Atualiza** os dados do usuário com o token de acesso gerado
10. [x] Retorna **200** com o token de acesso e o nome do usuário

### Exceções

1. [x] Retorna erro **404** se a API não existir
2. [x] Retorna erro **400** se name, email, password ou passwordConfirmation não forem fornecidos pelo client
3. [x] Retorna erro **400** se password e passwordConfirmation não forem iguais
4. [x] Retorna erro **400** se o campo email for um e-mail inválido
5. [x] Retorna erro **403** se o email fornecido já estiver em uso
6. [x] Retorna erro **500** se der erro ao tentar gerar uma senha criptografada
7. [x] Retorna erro **500** se der erro ao tentar criar a conta do usuário
8. [x] Retorna erro **500** se der erro ao tentar gerar o token de acesso
9. [x] Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado

## Login

### Caso de sucesso

1. [x] Recebe uma requisição do tipo **POST** na rota **/api/login**
2. [x] Valida dados obrigatórios **email** e **password**
3. [x] Valida que o campo **email** é um e-mail válido
4. [x] **Busca** o usuário com o email e senha fornecidos
5. [x] Gera um **token** de acesso a partir do ID do usuário
6. [x] **Atualiza** os dados do usuário com o token de acesso gerado
7. [x] Retorna **200** com o token de acesso e o nome do usuário

### Exceções

1. [x] Retorna erro **404** se a API não existir
2. [x] Retorna erro **400** se email ou password não forem fornecidos pelo client
3. [x] Retorna erro **400** se o campo email for um e-mail inválido
4. [x] Retorna erro **401** se não encontrar um usuário com os dados fornecidos
5. [x] Retorna erro **500** se der erro ao tentar gerar o token de acesso
6. [x] Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado

## Adicionar Animal

### Caso de sucesso

1. [x] Recebe uma requisição do tipo **POST** na rota **/api/animals**
2. [x] Valida os dados obrigatórios, como **nome**, **idade** ou **data de nascimento**.
3. [ ] Opções informações opcionais: **numeração**, **observação**, **maternidade** ou **paternidade**.
4. [x] Cria um novo animal com os dados informados
5. [x] Retorna **201** com os dados do animal criado

### Exceções

1. [x] Retorna erro **404** se a API não existir
2. [x] Retorna erro **400** se o nome e a idade do animal não for enviado
3. [x] Retorna erro **500** se ocorrer um erro ao tentar criar o animal

## Verificar animais

### Caso de sucesso

1. [ ] Recebe uma requisição do tipo **GET** na rota **/api/animals**
2. [ ] Valida qual usuário está fazendo a requisição pelo token JWT
3. [ ] Retorna **204** se estiver vazio
4. [ ] Retorna **200** com uma lista de animais **desse usuário**

### Exceções

1. [ ] Retorna erro **400** se a API não existir
2. [ ] Retorna erro **401** se não encontrar um usuário com os dados fornecidos
3. [ ] Retorna **500** se houver algum erro no servidor

## Verificar animail

### Caso de sucesso

1. [ ] Recebe uma requisição do tipo **GET** na rota **/api/animals/:id**
2. [ ] Valida qual usuário está fazendo a requisição pelo token JWT
3. [ ] Retorna **204** se estiver vazio
4. [ ] Retorna **200** com uma lista de animais **desse usuário**

### Exceções

1. [ ] Retorna erro **400** se a API não existir
2. [ ] Retorna erro **401** se não encontrar um usuário com os dados fornecidos
3. [ ] Retorna **500** se houver algum erro no servidor

## Editar Animal

### Caso de sucesso

1. [ ] Recebe uma requisição do tipo **PUT** na rota **/api/animals/:id**, onde **:id** é o identificador único do animal a ser editado
2. [ ] Valida qual usuário está fazendo a requisição pelo token JWT
3. [ ] Valida os dados opcionais a serem atualizados, como **nome**, **numeração**, **data de nascimento**, **observação**, **maternidade** ou **paternidade**
4. [ ] Atualiza os dados do animal com as informações fornecidas
5. [ ] Retorna **200** com os dados atualizados do animal

### Exceções

1. [ ] Retorna erro **404** se a API não existir
2. [ ] Retorna erro **400** se os dados a serem atualizados forem inválidos ou ausentes
3. [ ] Retorna erro **401** se o usuário não estiver autorizado a editar o animal
4. [ ] Retorna erro **404** se o animal com o ID especificado não for encontrado
5. [ ] Retorna erro **500** se ocorrer um erro ao tentar atualizar o animal

## Remover Animal

### Caso de sucesso

1. [ ] Recebe uma requisição do tipo **DELETE** na rota **/api/animals/:id**, onde **:id** é o identificador único do animal a ser removido
2. [ ] Valida qual usuário está fazendo a requisição pelo token JWT
3. [ ] Remove o animal com o ID especificado
4. [ ] Retorna **204** (sem conteúdo) para indicar que o animal foi removido com sucesso

### Exceções

1. [ ] Retorna erro **404** se a API não existir
2. [ ] Retorna erro **401** se o usuário não estiver autorizado a remover o animal
3. [ ] Retorna erro **404** se o animal com o ID especificado não for encontrado
4. [ ] Retorna erro **500** se ocorrer um erro ao tentar remover o animal

## Listar Animais

### Caso de sucesso

1. [ ] Recebe uma requisição do tipo **GET** na rota **/api/animals**
2. [ ] Valida qual usuário está fazendo a requisição pelo token JWT
3. [ ] Retorna **204** se a lista de animais estiver vazia
4. [ ] Retorna **200** com uma lista de animais **desse usuário**

### Exceções

1. [ ] Retorna erro **400** se a API não existir
2. [ ] Retorna erro **401** se não encontrar um usuário com os dados fornecidos
3. [ ] Retorna **500** se houver algum erro no servidor
