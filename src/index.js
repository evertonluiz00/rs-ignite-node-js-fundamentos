const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

const customers = [];

app.use(express.json());


// GET
app.get("/statement/:cpf", (request, response) => {
    const { cpf } = request.params;

    const customer = customers.find(customer => customer.cpf === cpf);

    return response.json(customer.statement);
});


// POST
app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const existsCustomerByCpf = customers.some((customer) => customer.cpf === cpf);

    if (existsCustomerByCpf) {
        return response.status(400).json({ error: "Customer already exists!" });
    }

    customers.push({
        cpf,
        name,
        id : uuidv4(),
        statement: []
    });

    return response.status(201).send();
});


// PUT
app.put("/courses/:id", (request, response) => {
    const params = request.params;
    const { id } = request.params;
    console.log(params);
    console.log(id);
    return response.json(["Curso6", "Curso2", "Curso3", "Curso4"]);
});

// DELETE
app.delete("/courses/:id", (request, response) => {
    return response.json(["Curso6", "Curso2", "Curso4"]);
});

app.listen(3333);