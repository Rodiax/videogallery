const express = require('express');
const router = express.Router();
const list = require('../controllers/list.controller');


router.get('/videos', list.getAllVideos);
router.get('/categories', list.getAllCategories);
router.get('/actors', list.getAllActors);


module.exports = router;