const { request, response } = require('express');
const express = require('express');

const app = express();

app.use(express.json());

// GET
app.get("/courses", (request, response) => {
    const query = request.query;
    console.log(query);
    return response.json(["Curso1", "Curso2", "Curso3"]);
});

// POST
app.post("/courses", (request, response) => {
    const body = request.body;
    console.log(body);
    return response.json(["Curso1", "Curso2", "Curso3", "Curso4"]);
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