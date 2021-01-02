const express = require('express');
const router = express.Router();
const videos = require('../controllers/video.controller');


router.get('/all', videos.getAll);
router.get('/search', videos.searchTypedVideo);
router.get('/filter', videos.getFiltered);
router.get('/suggestion', videos.getSuggested);

router.put('/update', videos.update);


module.exports = router;