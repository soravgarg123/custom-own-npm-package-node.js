-- Adminer 4.1.0 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `contact_us`;
CREATE TABLE `contact_us` (
  `contactId` bigint(20) NOT NULL AUTO_INCREMENT,
  `contactName` varchar(250) NOT NULL,
  `contactPhone` varchar(150) NOT NULL,
  `contactEmail` varchar(250) NOT NULL,
  `contactMessage` text NOT NULL,
  `contactDateTime` datetime NOT NULL,
  `isRepliedByAdmin` smallint(1) NOT NULL DEFAULT '0' COMMENT '0 = No, 1 = Yes',
  `replyDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`contactId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- 2017-10-02 13:54:29
