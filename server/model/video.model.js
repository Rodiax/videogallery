const db = require('../db/connection');

const Video = {};

Video.getCount = function() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS count FROM videos`
        , []
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
};

Video.getAllVideos = function({ offset, limit }) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM videos LIMIT ?, ?`
        , [Number(offset), Number(limit)]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}

Video.searchTypedVideo = function(params, text) {
    return new Promise((resolve, reject) => {
        Promise.all([
            Video.getVideosByName(params, text),
            Video.getVideosByActors(params, text),
            Video.getVideosByTags(params, text),
            Video.getVideosByCategories(params, text)
        ])
        .then(videos => {
            const results = videos.reduce((acc, collection) => { 
                collection.forEach(video => {
                    let res = acc.find(item => item.id == video.id);
                    
                    if (!res) acc.push(video);
                });
                
                return acc;
            }, []);
 
            resolve(results); 
        });
    });
}

Video.getVideosByActors = function(limit, name) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT V.*
            FROM videos AS V
            LEFT JOIN video_actors_composition AS VA ON V.id = VA.videos_id
            LEFT JOIN actors AS A ON VA.actors_id = A.id
            WHERE A.name LIKE ?
                AND A.id IS NOT NULL
            GROUP BY V.id
            ${limit ? 'LIMIT ?, ?' : ''}`
        , 
        [
            `%${name}%`,

            Number(limit && limit.offset ? limit.offset : 0),
            Number(limit && limit.limit ? limit.limit : 0)
        ]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}

Video.getVideosByTags = function(limit, name) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT V.*
            FROM videos AS V
            LEFT JOIN video_tags_composition AS VT ON V.id = VT.videos_id
            LEFT JOIN tags AS T ON VT.tags_id = T.id
            WHERE T.name LIKE ?
                AND T.id IS NOT NULL
            GROUP BY V.id
            ${limit ? 'LIMIT ?, ?' : ''}`
        , 
        [
            `%${name}%`,

            Number(limit && limit.offset ? limit.offset : 0),
            Number(limit && limit.limit ? limit.limit : 0)
        ]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        })
    });
}

Video.getVideosByCategories = function(limit, name) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT V.*
            FROM videos AS V
            LEFT JOIN video_categories_composition AS VC ON V.id = VC.videos_id
            LEFT JOIN categories AS C ON VC.categories_id = C.id
            WHERE C.name LIKE ?
                AND C.id IS NOT NULL
            GROUP BY V.id
            ${limit ? 'LIMIT ?, ?' : ''}`
        , 
        [
            `%${name}%`,

            Number(limit && limit.offset ? limit.offset : 0),
            Number(limit && limit.limit ? limit.limit : 0)
        ]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        })
    });
}

Video.getVideosByName = function(limit, name) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT *
            FROM videos 
            WHERE name LIKE ? 
            ${limit ? 'LIMIT ?, ?' : ''}`
        , 
        [
            `%${name}%`,

            Number(limit && limit.offset ? limit.offset : 0),
            Number(limit && limit.limit ? limit.limit : 0)
        ]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}

Video.getFiltered = function(limit, id, table) {
    return new Promise((resolve, reject) => {
        if (table.includes('videos')) {
            return Video
                    .getVideoByID(id, limit)
                    .then(resolve);
        }

        const tableName = ['actors', 'tags', 'categories'].find(t => t.indexOf(table) > -1);
        if (!tableName) return reject([]);

        db.query(`SELECT V.* 
            FROM videos AS V
            LEFT JOIN video_${tableName}_composition AS VC ON V.id = VC.videos_id
            LEFT JOIN ${tableName} AS TN ON VC.${tableName}_id = TN.id
            WHERE TN.id = ?
            GROUP BY V.id
            ${limit ? 'LIMIT ?, ?' : ''}`
        , 
        [
            id, 

            Number(limit && limit.offset ? limit.offset : 0),
            Number(limit && limit.limit ? limit.limit : 0)
        ]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}

Video.getVideoByID = function(id, limit) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM videos WHERE id = ? ${limit ? 'LIMIT ?, ?' : ''}`
        , 
        [
            id, 
            
            Number(limit && limit.offset ? limit.offset : 0), 
            Number(limit && limit.limit ? limit.limit : 0)
        ]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}

Video.update = function(cols) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE videos SET 
            name = ?, 
            description = ?,
            year = ?
            WHERE id = ?`
        , 
        [
            cols.name,
            cols.description,
            cols.year,
            cols.id
        ]
        , (err, sqlResult) => {
            if (err)
                return reject(err);
            else 
                return resolve({cols, sqlResult});
        });
    });
}

Video.JSONData = function(data) {
    return {
        "id": data.id,
        "name": data.name,
        "description": data.description,
        "indexed": data.indexed,
        "duration": data.duration,
        "year": data.year,

        "actors": [...data.actors],
        "tags": [...data.tags],
        "categories": [...data.categories],

        "pathTo": {
            "video": `${process.env.URL}/files/video/${data.filename}`,
            "preview": `${process.env.URL}/files/preview/${data.filename}`,
            "poster": `${process.env.URL}/files/poster/${data.file}.jpg`
        }
    };
}



module.exports = Video;