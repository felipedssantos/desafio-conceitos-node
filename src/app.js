const express = require("express");
const cors = require("cors");

const {uuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {

  //Recebe os dados da requisição
  const {title, url, techs} = request.body

  //Armazena os dados recebidos em um novo projeto
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  // Adiciona o projeto criado a lista de projetos existentes
  repositories.push(repository)

  // retorna o projeto criado
  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body

  // Busca o index do repositório a ser atualizado comparando o ID passado na URL e os ID's existente no array de repositórios
  const repositoryIndex = repositories.findIndex(repo => repo.id == id)

  // Verifica se o repositório foi encontrado, caso seja false retorna status 400 e um erro.
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  // Cria uma cópia do repositório original utilizando spread operator e atualiza apenas os dados necessários: title, url e techs
  const newRepositoryInfo = {
    ...repositories[repositoryIndex],
    title: title,
    url: url,
    techs: techs
  }

  // Atualiza os dados no repositório original buscando ele pelo index
  repositories[repositoryIndex] = newRepositoryInfo

  // Retorna o JSON com o repositório atualizado
  return response.json(newRepositoryInfo)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params

  // Busca o index do repositório a ser atualizado comparando o ID passado na URL e os ID's existente no array de repositórios
  const repositoryIndex = repositories.findIndex(repo => repo.id == id)

  // Verifica se o repositório foi encontrado, caso seja false retorna status 400 e um erro.
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  // Retira o repositório encontrado do array de repositórios
  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params

  // Busca o index do repositório a ser atualizado comparando o ID passado na URL e os ID's existente no array de repositórios
  const repositoryIndex = repositories.findIndex(repo => repo.id == id)

  // Verifica se o repositório foi encontrado, caso seja false retorna status 400 e um erro.
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  let likes = repositories[repositoryIndex].likes

  console.log(likes)

  // Cria uma cópia do repositório original utilizando spread operator e atualiza apenas os dados necessários: title, url e techs
  const repositoryLike = {
    ...repositories[repositoryIndex],
    likes: likes + 1
  }

  // Atualiza os dados no repositório original buscando ele pelo index
  repositories[repositoryIndex] = repositoryLike

  return response.json({likes: repositoryLike.likes, message: 'Repositório curtido com sucesso!'})

});

module.exports = app;
