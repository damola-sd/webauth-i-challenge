const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const Users = require('./database/Models/user-model');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());


server.get('/', (req, res) => {
    res.send("Testing Server");
  });


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));