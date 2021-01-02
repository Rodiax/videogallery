const Video = require('../model/video.model');
const Actor = require('../model/actor.model');
const Tag = require('../model/tag.model');
const Category = require('../model/category.model');

const getAllVideos = (req, res) => {
    const limit = {
        offset: req.query.offset,
        limit: 12
    };

    Promise.all(
        [
            Video.getAllVideos(limit),
            Video.getCount()
        ]
    ).then(videos => {
        const [videosArr, countArr] = videos;
        
        const toSend = {
            content: videosArr.map(video => ({ id: video.id, name: video.name })),
            total: countArr[0].count
        };

        res.send(toSend);
    });
};

const getAllCategories = (req, res) => {
    const limit = {
        offset: req.query.offset,
        limit: 12
    };

    Promise.all(
        [
            Category.getAllCategories(limit),
            Category.getCount()
        ]
    ).then(categories => {
        const [categoriesArr, countArr] = categories;
        
        const toSend = {
            content: categoriesArr.map(category => ({ id: category.id, name: category.name })),
            total: countArr[0].count
        };

        res.send(toSend);
    });
};

const getAllActors = (req, res) => {
    const limit = {
        offset: req.query.offset,
        limit: 12
    };

    Promise.all(
        [
            Actor.getAllActors(limit),
            Actor.getCount()
        ]
    ).then(actors => {
        const [actorsArr, countArr] = actors;
        
        const toSend = {
            content: actorsArr.map(actor => ({ id: actor.id, name: actor.name })),
            total: countArr[0].count
        };

        res.send(toSend);
    });
};

module.exports = {
    getAllVideos,
    getAllCategories,
    getAllActors
};