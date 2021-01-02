const db = require('../db/connection');

const Tag = {};

Tag.getCount = function() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS count FROM tags`
        , []
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
};

Tag.getAllTags = function({ offset, limit }) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM tags LIMIT ?, ?`
        , [Number(offset), Number(limit)]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}


Tag.getTagsByName = function(limit, name) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT *
            FROM tags 
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



Tag.update = function(cols) {
    return new Promise((resolve, reject) => {
        Tag
            .deleteUnexisted(cols.tags, cols.id)
            .then(res => {
                Promise.all(cols.tags.map(tag => {
                    return Tag.createIfNotexists(tag, cols);
                }))
                .then(() => resolve());
            });
    });
}

Tag.deleteUnexisted = function(tags, videoId) {
    return new Promise((resolve, reject) => {
        if (!tags.length) {
            db.query(`DELETE FROM video_tags_composition
                WHERE videos_id = ?`
            , [videoId]
            , (err, res) => {
                if (err)
                    return reject(err);
                else 
                    return resolve(res);
            });
        } else {
            db.query(`SELECT id FROM tags WHERE id IN (${tags.map(_ => '?').join()})`
            , [...tags.map(tag => tag.id)]
            , (err, records) => {
                if (err) return reject(err);
                if (!records.length) return resolve(records);

                db.query(`DELETE FROM video_tags_composition 
                    WHERE videos_id = ? 
                        AND tags_id NOT IN (${records.map(_ => '?').join()})`
                , [videoId, ...records.map(r => r.id)]
                , (err, res) => {
                    if (err)
                        return reject(err);
                    else 
                        return resolve(res);
                });
            });        
        }
    });
   

}

Tag.createIfNotexists = function(tag, videoCols) {
    delete tag.id;
    
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM tags WHERE name = ?`
        , [tag.name]
        , (err, res) => {
            if (res.length) {
                return resolve(...res);
            }

            db.query(`INSERT INTO tags SET ${Object.keys(tag).map(key => key + ' = ?').join()}`
            , [Object.values(tag)]
            , (err, res) => {
                return resolve({...res, id: res.insertId});
            });
        });
    })
    .then(record => {
        db.query(`REPLACE INTO video_tags_composition SET 
            videos_id = ?, 
            tags_id = ?`
        , [videoCols.id, record.id]
        , (err, res) => {
            if (err) 
                return Promise.reject(err);
            else 
                return Promise.resolve(res);
        });
    });
}


Tag.getColsByID = function(id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM tags WHERE id = ?`
        , [id]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}


module.exports = Tag;