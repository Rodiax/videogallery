const Video = require('../model/video.model');
const Actor = require('../model/actor.model');
const Tag = require('../model/tag.model');
const Category = require('../model/category.model');
const Composition = require('../model/composition.model');


const getAll = (req, res) => {
    const limit = {
        offset: req.query.offset,
        limit: 12
    };

    Video
        .getAllVideos(limit)
        .then(videos => {
            Composition
                .composeData(videos)
                .then(data => res.send(data))
                .catch(err => console.log(err));
        }); 
};

const searchTypedVideo = (req, res) => {
    const limit = {
        offset: req.query.offset,
        limit: 12
    };

    Video
        .searchTypedVideo(limit, req.query.text)
        .then(videos => {
            Composition
                .composeData(videos)
                .then(data => res.send(data))
                .catch(err => console.log(err));
        });
};

const getFiltered = (req, res) => {
    const {id, filter} = req.query;

    const limit = {
        offset: req.query.offset,
        limit: 12
    };

    Video
        .getFiltered(limit, id, filter)
        .then(videos => {
            Composition
                .composeData(videos)
                .then(data => res.send(data))
                .catch(err => console.log(err));
        });
};

const getSuggested = (req, res) => { 
    if (!req.query.text.length) {
        return res.send([]);
    }

    const limit = {
        limit: 5,
        offset: 0
    };

    Promise.all(
        [
            Video.getVideosByName(limit, req.query.text),
            Actor.getActorsByName(limit, req.query.text),
            Tag.getTagsByName(limit, req.query.text),
            Category.getCategoriesByName(limit, req.query.text)
        ]
    )
    .then(records => {
        let [videos, actors, tags, cats] = records;

        videos = videos.map(video => ({ ...video }));
        actors = actors.map(actor => ({ ...actor }));
        tags   =   tags.map(tag => ({ ...tag }));
        cats   =   cats.map(cat => ({ ...cat }));

        const data = [
            { 
                filter: 'videos',
                data: videos
            }, 
            {
                filter: 'actors',
                data: actors
            },
            {
                filter: 'tags',
                data: tags
            },
            {
                filter: 'categories',
                data: cats
            }
        ]
        .filter(item => item.data.length > 0)
        .map(item => {
            item.data = item.data.map(data => ({
                id: data.id,
                result: data.name
            }));

            return item;
        });

        res.send(data);
    });
}

const update = (req, res) => {
    if (!req.body) {
        return res.status(400).send();
    }
    
    Video
        .update(req.body)
        .then(({ cols }) => {
            Promise.all(
                [
                    Actor.update(cols),
                    Category.update(cols),
                    Tag.update(cols)
                ]
            )
            .then(result => {
                Video
                    .getVideoByID(req.body.id)
                    .then(video => {
                        Composition
                            .composeData(video)
                            .then(data => res.send(data))
                            .catch(err => console.log(err));
                    });
            });
        });
};


module.exports = {
    getAll,
    searchTypedVideo,
    getSuggested,
    getFiltered,
    update
};