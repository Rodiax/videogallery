const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const folders = [
    'video',
    'preview',
    'poster'
];

folders.forEach(folder => {
    router.get(`/${folder}/*`, (req, res) => {
        const file = req.params[0];
        const pathToFile = path.resolve(`files/${folder}/`, file);
    
        fs.lstat(pathToFile, (err, stats) => {
            if (err) return err;
        
            if (stats.isFile()) {
                res.sendFile(pathToFile);
            }
        });
    });
});


module.exports = router;