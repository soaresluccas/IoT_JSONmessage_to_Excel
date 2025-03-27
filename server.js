const WebSocket = require('ws');
const express = require('express');
const HTTP = require ('http');
const fs = require('fs');
const xlsx = require('xlsx');

const app = express();
const server = HTTP.createServer(app);
const wss = new WebSocket.Server({server});

app.use(express.static('public'));  

wss.on('connection',  function connection(ws) {
    console.log('Cliente conectado.');

    ws.send('Benvindo ao Servidor');

    ws.on('message', (message) => {
        console.log('Mensagem recebida:', message);

        const timestamp = new Date().toISOString();
        const jsonMessage = {
            timestamp,
            message: message.toString(),
        };

        dataStore.push(jsonMessage);

        saveToExcel(dataStore);
    });

    ws.on('uncaughExcepition', (err) => {
        console.error('Erro no WebSocket:', err.message);
        ws.exit(1);
    });
});

function saveToExcel(data){
    const ws = xlsx.utils.json_to_sheet(data);

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(ws, wb, 'Message');

    xlsx.writeFile(wb, 'message.xlsx');
}

server.listen(3100, () =>{
    console.log('Servidor rodando na porta 3100!');
});

console.log('Inciando servidor...');