DROP DATABASE IF EXISTS kukkatukkuAdb;

CREATE DATABASE kukkatukkuAdb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE kukkatukkuAdb;

CREATE TABLE kukka(
    nimi VARCHAR(50) NOT NULL PRIMARY KEY,
    vari VARCHAR(30) NOT NULL,
    hinta DECIMAL(10,2) NOT NULL,
    maara INTEGER NOT NULL
);

CREATE TABLE `viljelijä`(
    viljelijannro INTEGER NOT NULL PRIMARY KEY,
    ytunnus VARCHAR(9) NOT NULL,
    nimi VARCHAR(100) NOT NULL,
    osoite VARCHAR(100) NOT NULL,
    yhteys_sukunimi VARCHAR(30) NOT NULL,
    yhteys_etunimi VARCHAR(20) NOT NULL,
    yhteys_puhelin VARCHAR(20) NOT NULL,
    yhteys_email VARCHAR(100)
);

CREATE TABLE `viljelijän_kukat`(
    numero INTEGER AUTO_INCREMENT PRIMARY KEY,
    viljelijannro INTEGER NOT NULL,
    kukan_nimi VARCHAR(50) NOT NULL,
    varastosaaldo INTEGER NOT NULL,
    yksikköhinta DECIMAL(10,2) NOT NULL,

    FOREIGN KEY(viljelijannro)
        REFERENCES `viljelijä`(viljelijannro),

    FOREIGN KEY(kukan_nimi)
        REFERENCES kukka(nimi)
);

DROP USER IF EXISTS 'atukkuri'@'localhost';

CREATE USER 'atukkuri'@'localhost'
IDENTIFIED BY '1234';

GRANT ALL PRIVILEGES
ON kukkatukkuAdb.*
TO 'atukkuri'@'localhost';
