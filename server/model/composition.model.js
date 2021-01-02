const db = require('../db/connection');
const Video = require('../model/video.model');

const Composition = {};


Composition.getVideoTags = function(videoIDs) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT T.*, videos_id AS video_id
            FROM tags AS T
            LEFT JOIN video_tags_composition AS VT ON T.id = VT.tags_id
            WHERE videos_id IN (${Array(videoIDs.length).fill('?').join()})
            GROUP BY T.id, videos_id`
        , [...videoIDs]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
};


Composition.getVideoActors = function(videoIDs) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT A.*, videos_id AS video_id
            FROM actors AS A
            LEFT JOIN video_actors_composition AS VA ON A.id = VA.actors_id
            WHERE videos_id IN (${Array(videoIDs.length).fill('?').join()})
            GROUP BY A.id, videos_id`
        , [...videoIDs]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
};


Composition.getVideoCategories = function(videoIDs) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT C.*, videos_id AS video_id
            FROM categories AS C
            LEFT JOIN video_categories_composition AS VC ON C.id = VC.categories_id
            WHERE videos_id IN (${Array(videoIDs.length).fill('?').join()})
            GROUP BY C.id, videos_id`
        , [...videoIDs]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
};


Composition.composeData = function(videos) {
    if (!videos.length) {
        return Promise.resolve([]);
    }

    const videoIDs = videos.map(video => video.id);
    
    return Promise.all(
        [
            this.getVideoTags(videoIDs),
            this.getVideoActors(videoIDs),
            this.getVideoCategories(videoIDs)
        ]
    )
    .then(results => {
        const [tags, actors, cats] = results;

        const data = videos.map(video => {
            video.tags = [...tags.filter(tag => tag.video_id == video.id).map(tag => ({...tag}))];
            video.actors = [...actors.filter(actor => actor.video_id == video.id).map(actor => ({...actor}))];
            video.categories = [...cats.filter(cat => cat.video_id == video.id).map(cat => ({...cat}))];
            
            return Video.JSONData(video);
        });
        
        return Promise.resolve(data);
    });
};

module.exports = Composition;
