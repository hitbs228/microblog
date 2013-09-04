/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Version : 50612
 Source Host           : localhost
 Source Database       : node_sql

 Target Server Version : 50612
 File Encoding         : utf-8

 Date: 09/02/2013 16:45:51 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `content`
-- ----------------------------
DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `content` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `content`
-- ----------------------------
BEGIN;
INSERT INTO `content` VALUES ('1', 'hitbs228', 'what a wonderful world!');
COMMIT;

-- ----------------------------
--  Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
--  Records of `users`
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('5', 'hitbs228', 'PUpWDCU0SOR5wFejP1QWGg==');
COMMIT;

-- ----------------------------
--  Procedure structure for `1`
-- ----------------------------
DROP PROCEDURE IF EXISTS `1`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `1`()
select name from users
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `dsa`
-- ----------------------------
DROP PROCEDURE IF EXISTS `dsa`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `dsa`()
SELECT * from users
 ;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
