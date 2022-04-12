"use strict";

var session = require('../utils/session.js');
var errors = require('../utils/errors.js');

var models = require('../models');

var Promise = models.Sequelize.Promise;

var Service = {
    list: function(params, callback, sid, req) {
            return models.sequelize.query('SELECT TABLE_NAME as "tablename" FROM information_schema.tables WHERE table_schema = \'public\'')
            .then(function(result) {
                var tables = result[0];

                return Promise.map(tables, function (row) {
                    return models.sequelize.query('SELECT lastupdate.updated, lastcreation.created FROM (SELECT updated FROM ' + row.tablename + ' ORDER BY updated DESC LIMIT 1) as lastupdate, (SELECT created FROM ' + row.tablename + ' ORDER BY created DESC LIMIT 1) as lastcreation').then(function (uptResult) {
                        return {
                            tablename: row.tablename,
                            update_time: uptResult && uptResult[0] && Array.isArray(uptResult[0]) && uptResult[0][0] && uptResult[0][0].updated,
                            create_time: uptResult && uptResult[0] && Array.isArray(uptResult[0]) && uptResult[0][0] && uptResult[0][0].created
                        }
                    })
                }).then(function (payload) {                    
                    callback(null, {
                        total: payload.length,
                        data: payload
                    });
                });
            }).catch(function(err) {
                callback(err);
            });
    },

    insert: function(params, callback, sid, req) {
        session.verify(req).then(function() {
            // NOTE(SB): the direct proxy requires methods for all CRUD actions
            throw errors.types.notImplemented();
        }).catch(function(err) {
            callback(err);
        });
    },

    update: function(params, callback, sid, req) {
        session.verify(req).then(function() {
            // NOTE(SB): the direct proxy requires methods for all CRUD actions
            throw errors.types.notImplemented();
        }).catch(function(err) {
            callback(err);
        });
    },

    remove: function(params, callback) {
        session.verify(req).then(function() {
            // NOTE(SB): the direct proxy requires methods for all CRUD actions
            throw errors.types.notImplemented();
        }).catch(function(err) {
            callback(err);
        });
    }
}

module.exports = Service;