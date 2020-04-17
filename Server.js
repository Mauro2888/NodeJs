//npm i joi@version for manage validation

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = 8080;

//Fake data
const users = [
    {id:1, nome:"Mauro"},
    {id:2, nome:"Luca"}
];

//GET ALL
app.get('/users', (req,res)=>{
    res.send(users);
})

//GET BY ID
app.get('/users/:id',(req,res)=>{
    const select = users.find(c => c.id === parseInt(req.params.id))
    if(!select) return res.status(404).send("Unable to find user with this ID");
    res.send(select);
});

//POST USER
app.post('/users', (req,res)=>{
    //VALIDATE
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //CREATE 
    const user = {
        id: users.length + 1,
        nome: req.body.nome
    };
    users.push(user);
    res.send(user);
});

//DELETE USER BY ID
app.delete('/users/:id',(req,res)=>{
    const selected = users.find(c => c.id === parseInt(req.params.id));
    if(!selected) return res.status(404).send("Unable to find user with this ID");
    const index = users.indexOf(selected);
    users.splice(index,1);
    res.send(selected);
});

//PUT USER BY ID
app.put('/users/:id',(req,res)=>{
    //FIND RESOURCES
    const userSelected = users.find(c => c.id === parseInt(req.params.id))
    if(!userSelected) return res.status(404).send("Unable to find user with this ID");

    //VALIDATE
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //OBJECT TO UPDATE
    userSelected.nome = req.body.nome;
    res.send(userSelected);
});

function validateUser(user){
    //VALIDATE
    const schema = {
        nome : Joi.string().min(3).required()
    };
    return Joi.validate(user,schema);

}


app.listen(port, ()=>{
    console.log("listen to " + port);
})