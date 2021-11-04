const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];


// Middlewares
function verifyExistsAccountByCpf(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({ error: "Customer not found" });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return acc + operation.amount;
        }
        else{
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}


// GET
app.get("/account", (request, response) => {
    return response.json(customers);
});

app.get("/statement", verifyExistsAccountByCpf, (request, response) => {
    const { customer } = request;

    return response.json(customer);
});

app.get("/statement/date", verifyExistsAccountByCpf, (request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString());

    return response.json(statement);
});

app.get("/balance", verifyExistsAccountByCpf, (request, response) => {
    const { customer } = request;
    const balance = getBalance(customer.statement);

    return response.json(balance);
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

app.post("/deposit", verifyExistsAccountByCpf, (request, response) => {
    const { description, amount } = request.body;
    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.post("/withdraw", verifyExistsAccountByCpf, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if (balance < amount) {
        return response.status(400).json({ error: "Insuficient funds!" });
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});


// PUT
app.put("/account", verifyExistsAccountByCpf, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;
    return response.status(201).send();
});


// DELETE
app.delete("/account", verifyExistsAccountByCpf, (request, response) => {
    const { customer } = request;

    customers.splice(customers.indexOf(customer), 1);

    return response.status(200).json(customers);
});


app.listen(3333);