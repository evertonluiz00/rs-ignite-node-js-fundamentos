const { request, response } = require('express');
const express = require('express');

const app = express();

app.get("/", (request, response) => {
    return response.json({ message: "Olá Node - Json 22222" });
});

app.listen(3333);