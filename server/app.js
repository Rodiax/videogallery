const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const registrateFiles = require('./files/file_registrator');

const app = express();
const PORT = process.env.PORT;

const video = require('./routes/videos.routes');
const list = require('./routes/list.routes');
const files = require('./routes/files');

app.use(cors());
app.use(express.json());

app.use('/videos', video);
app.use('/list', list);
app.use('/files', files);


registrateFiles().then(() => {
    app.listen(PORT, () => {
        console.log("Server started");
    });
});




