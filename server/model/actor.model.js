const db = require('../db/connection');

const Actor = {};

Actor.getCount = function() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS count FROM actors`
        , []
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
};

Actor.getAllActors = function({ offset, limit }) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM actors LIMIT ?, ?`
        , [Number(offset), Number(limit)]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
};

Actor.getActorsByName = function(limit, name) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT *
            FROM actors 
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

Actor.update = function(cols) {
    return new Promise((resolve, reject) => {
        Actor
            .deleteUnexisted(cols.actors, cols.id)
            .then(res => {
                Promise.all(cols.actors.map(actor => {
                    return Actor.createIfNotexists(actor, cols);
                }))
                .then(() => resolve());
            });
    });
}

Actor.deleteUnexisted = function(actors, videoId) {
    return new Promise((resolve, reject) => {
        if (!actors.length) {
            db.query(`DELETE FROM video_actors_composition
                WHERE videos_id = ?`
            , [videoId]
            , (err, res) => {
                if (err)
                    return reject(err);
                else 
                    return resolve(res);
            });
        } else {
            db.query(`SELECT id FROM actors WHERE id IN (${actors.map(_ => '?').join()})`
            , [...actors.map(actor => actor.id)]
            , (err, records) => {
                if (err) return reject(err);
                if (!records.length) return resolve(records);

                db.query(`DELETE FROM video_actors_composition 
                    WHERE videos_id = ? 
                        AND actors_id NOT IN (${records.map(_ => '?').join()})`
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

Actor.createIfNotexists = function(actor, videoCols) {
    delete actor.id;
    
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM actors WHERE name = ?`
        , [actor.name]
        , (err, res) => {
            if (res.length) {
                return resolve(...res);
            }

            db.query(`INSERT INTO actors SET ${Object.keys(actor).map(key => key + ' = ?').join()}`
            , [Object.values(actor)]
            , (err, res) => {
                return resolve({...res, id: res.insertId});
            });
        });
    })
    .then(record => {
        db.query(`REPLACE INTO video_actors_composition SET 
            videos_id = ?, 
            actors_id = ?`
        , [videoCols.id, record.id]
        , (err, res) => {
            if (err) 
                return Promise.reject(err);
            else 
                return Promise.resolve(res);
        });
    });
}

Actor.getColsByID = function(id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM actors WHERE id = ?`
        , [id]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}


module.exports = Actor;