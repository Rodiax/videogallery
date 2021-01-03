# Video Gallery
Is a browser application that allows you to name, tag, edit, find and finally watch your own videos.

## Installation
There are several things you have to do to make it run:
- Clone this repository.
- Open `server` and `client` root folders in command prompt and install dependencies using npm command: `npm install`
- Since it's database is based on *MySQL* you also have to install it. After installation and configuring database, the fastest way to fill it with tables is to open file `tables.sql` in root directory and copy-paste it's content into MySQL command prompt. 
- Download and install `FFmpeg` convertor locally as it allows to create some small previews of videos that app shows in gallery. [Here](https://www.wikihow.com/Install-FFmpeg-on-Windows) is complete tutorial for windows.
- Rewrite environment constants in `server/.env` like `DB_HOST` etc. 
- Choose any video you would like to see in gallery and place it in `server/files/video/` directory. The video must be only in **.mp4** format!

## Running the project
Put your videos in `server/files/video/` directory, run `node app.js` command in command prompt and wait for final ***Server started*** message.
After then run `npm start` command for `client/` directory.

## Overview
- Name / Tag / Edit your videos as you want.
- Filter them by Name / Tags / Categories or Actors you gave them.
- Look at short preview by hovering mouse on a card in gallery.
- List full content of videos that are located in app.
 
