const db = require('../db/connection');

const Category = {};


Category.getCount = function() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS count FROM categories`
        , []
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
};

Category.getAllCategories = function({ offset, limit }) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM categories LIMIT ?, ?`
        , [Number(offset), Number(limit)]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}


Category.getCategoriesByName = function(limit, name) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT *
            FROM categories 
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


Category.update = function(cols) {
    return new Promise((resolve, reject) => {
        Category
            .deleteUnexisted(cols.categories, cols.id)
            .then(res => {
                Promise.all(cols.categories.map(category => {
                    return Category.createIfNotexists(category, cols);
                }))
                .then(() => resolve());
            });
    });
}

Category.deleteUnexisted = function(categories, videoId) {
    return new Promise((resolve, reject) => {
        if (!categories.length) {
            db.query(`DELETE FROM video_categories_composition
                WHERE videos_id = ?`
            , [videoId]
            , (err, res) => {
                if (err)
                    return reject(err);
                else 
                    return resolve(res);
            });
        } else {
            db.query(`SELECT id FROM categories WHERE id IN (${categories.map(_ => '?').join()})`
            , [...categories.map(category => category.id)]
            , (err, records) => {
                if (err) return reject(err);
                if (!records.length) return resolve(records);

                db.query(`DELETE FROM video_categories_composition 
                    WHERE videos_id = ? 
                        AND categories_id NOT IN (${records.map(_ => '?').join()})`
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

Category.createIfNotexists = function(category, videoCols) {
    delete category.id;
    
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM categories WHERE name = ?`
        , [category.name]
        , (err, res) => {
            if (res.length) {
                return resolve(...res);
            }

            db.query(`INSERT INTO categories SET ${Object.keys(category).map(key => key + ' = ?').join()}`
            , [Object.values(category)]
            , (err, res) => {
                return resolve({...res, id: res.insertId});
            });
        });
    })
    .then(record => {
        db.query(`REPLACE INTO video_categories_composition SET 
            videos_id = ?, 
            categories_id = ?`
        , [videoCols.id, record.id]
        , (err, res) => {
            if (err) 
                return Promise.reject(err);
            else 
                return Promise.resolve(res);
        });
    });
}


Category.getColsByID = function(id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM categories WHERE id = ?`
        , [id]
        , (err, rows) => {
            if (err) 
                return reject(err);
            else 
                return resolve(rows);
        });
    });
}


module.exports = Category;