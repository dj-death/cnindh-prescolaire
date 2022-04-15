/**
 * This file collects all the models from the models directory and associates them if needed.
 */

"use strict";

var fs = require("fs");
var path = require("path");

var Sequelize = require("sequelize");
const Op = Sequelize.Op;

var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'utils', 'config')).database;
config = config || {};
config.operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};

process.env.REDISCLOUD_URL = process.env.REDISCLOUD_URL || "redis://default:IX4Sk07AMXNvXOyPlvs8BtRXe4Z30255@redis-12680.c243.eu-west-1-3.ec2.cloud.redislabs.com:12680";

const Redis = require('ioredis');
const redisClient = new Redis(process.env.REDISCLOUD_URL, {
    no_ready_check: true
    /*tls: {
        rejectUnauthorized: false
    }*/
});

var sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}


const RedisAdaptor = require('../utils/sequelize-transparent-cache-ioredis');
const redisAdaptor = new RedisAdaptor({
    client: redisClient,
    namespace: 'model',
    lifetime: 60
})

const sequelizeCache = require('../utils/sequelize-transparent-cache');
const { withCache } = sequelizeCache(redisAdaptor);

var db = {};

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        try {
            var model = sequelize.import(path.join(__dirname, file));
            db[model.name] = withCache(model);
        } catch (err) {
            console.log(err)
        }
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.withCache = withCache;

module.exports = db;
