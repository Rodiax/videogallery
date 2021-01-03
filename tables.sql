CREATE DATABASE `videogallery`;

USE `videogallery`;

CREATE TABLE `actors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `file` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `title` varchar(255) NOT NULL,
  `indexed` datetime DEFAULT NULL,
  `duration` time NOT NULL,
  `year` varchar(4) NOT NULL DEFAULT '1900',
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `filename` (`filename`),
  KEY `file` (`file`),
  KEY `indexed` (`indexed`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `video_actors_composition` (
  `videos_id` int NOT NULL,
  `actors_id` int NOT NULL,
  PRIMARY KEY (`videos_id`,`actors_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `video_categories_composition` (
  `videos_id` int NOT NULL,
  `categories_id` int NOT NULL,
  PRIMARY KEY (`videos_id`,`categories_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `video_tags_composition` (
  `videos_id` int NOT NULL,
  `tags_id` int NOT NULL,
  PRIMARY KEY (`videos_id`,`tags_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;