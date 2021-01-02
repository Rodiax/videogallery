const db = require('../db/connection');
const glob = require("glob");
const cp = require('child_process');
const path = require('path');

const VIDEO_FOLDER = path.join(path.dirname(__dirname), 'files/video');
const VIDEO_POSTER_FOLDER = path.join(path.dirname(__dirname), 'files/poster');
const VIDEO_PREVIEW_FOLDER = path.join(path.dirname(__dirname), 'files/preview');

let PROCESSED_VIDEOS = 0;

module.exports = () => {
    console.log("Checking for new videos...");

    return new Promise(resolveModule => {
        glob("/**/*"
        , { root: VIDEO_FOLDER }
        , (err, files) => {
            if (err) throw err;

            const promises = files.map(filepath => {
                const fpArr = filepath.split('\\');
                const filename = fpArr[fpArr.length - 1];
                
                return new Promise(resolve => {
                    if (isVideo(filename)) {
                        db.query(`SELECT * FROM videos WHERE filename = ?`
                        , [filename]
                        , (err, video) => {
                            if (err) throw err;
            
                            // Will make preview and store new video
                            if (!video.length) {
                                console.log(`New video "${filename}" found! Processing...`);
                                
                                cp.exec(`ffmpeg -i ${filename} 2>&1 | find "Duration"`
                                , { cwd: VIDEO_FOLDER }
                                , (err, res) => {
                                    const duration = res.split(',')[0].replace(/^\s+Duration:\s+/ig, '');
                                    
                                    storeVideo({ filename, duration })
                                        .then(() => makePreview(filename))
                                        .then(() => {
                                            PROCESSED_VIDEOS++;
                                            console.log(`Process complete!`);
                                            resolve(filename);
                                        });
                                });     
                            } else resolve();
                        });
                    } else resolve();
                });        
                
            });

            Promise
                .all(promises)
                .then(() => {
                    if (PROCESSED_VIDEOS > 0) 
                        console.log(`Processed ${PROCESSED_VIDEOS} videos.`);
                    else 
                        console.log(`No new videos found, ${PROCESSED_VIDEOS} videos processed.`);

                    resolveModule();
                });
        });
    });
};

const isVideo = file => /\.mp4$/.test(file);

const storeVideo = ({ filename, duration}) => {
    return new Promise(resolve => {
        db.query(`INSERT INTO videos SET 
            name = ?, 
            file = ?, 
            filename = ?, 
            description = ?,
            title = ?,
            indexed = NOW(), 
            duration = ?,
            year = ?`
        , [
            filename.split('.')[0],
            filename.split('.')[0],
            filename,
            '',
            '',
            duration,
            ''
        ]
        , (err, res) => {
            if (err) throw err;
            resolve(res);
        });
    });
};

const makePreview = filename => {
    const promisePreview = new Promise(resolve => {
        // Will create video preview
        cp.exec(`ffmpeg -ss 00:01:00 -i ${filename} -to 00:01:10 -c copy ${VIDEO_PREVIEW_FOLDER}/${filename}`
        , { cwd: VIDEO_FOLDER }
        , (err, res) => {
            resolve();
        });
    });

    const promisePoster = new Promise(resolve => {
        // Will create video image
        cp.exec(`ffmpeg -ss 00:00:15 -i ${filename} -vf scale=800:-1 -vframes 1 ${VIDEO_POSTER_FOLDER}/${filename.split('.')[0]}.jpg`
        , { cwd: VIDEO_FOLDER }
        , (err, res) => {
            resolve();
        });
    });

    return Promise.all([ promisePreview, promisePoster ]);
};