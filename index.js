const express = require('express');

const server = express();

server.use(express.json());

//Dados dos projetos
const projects = [];

//Encontra index do projeto na lista
function findIndexInArray (id){
  let index = projects.findIndex(function(obj){
    return obj.id == id;
  });

  return index;
}

//Middleware Global
server.use((req, res, next) => {
  console.count('Requisições até o momento');
  next()
})

//Middleware Local
function checkIfIdProjectExists(req, res, next){
  const { id } = req.params;

  const index = findIndexInArray(id);

  if(index == -1){//-1 quando não é encontrado na lista
    return res.status(400).json({ error:'Project does not exists'})
  }

  req.indexInArray = index; //cria a variavel indexInArray no req, todas as rotas que utilizarem este middleware tem acesso a ela

  return next();
}

//ROTAS
/*
Cadastra um novo projeto
Request body: id, title
*/
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  let newProject = {
    id,
    title,
    tasks: []
  }

  projects.push(newProject);

  return res.json(newProject);
})

//Lista todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
})

/*
Altera o titulo do projeto pelo id presente nos parametros da rota
Route params: id
Request body: title
*/
server.put('/projects/:id', checkIfIdProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[req.indexInArray].title = title

  return res.json(projects[req.indexInArray])
})

//Deleta projeto pelo id presente nos parametros da rota
server.delete('/projects/:id', checkIfIdProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(req.indexInArray, 1);

  return res.send();
})

/*
Adiciona nova tarefa no projeto pelo id presente nos parametros da rota
Route params: id
Request body: title
*/
server.post('/projects/:id/tasks', checkIfIdProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[req.indexInArray].tasks.push(title)

  return res.json(projects[req.indexInArray]);
})

server.listen(3000);