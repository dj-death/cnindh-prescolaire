"use strict";

var helpers = require('../utils/helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');

var Promise = models.Sequelize.Promise;


var Service = {
    list: function (params, callback, sid, req) {
        session.verify(req).then(function (session) {
            const user = session.user;
            const userRole = user.get('role');

            if (userRole > 1) {
                callback(new Error('Not authorized'));
                return;
            }

            const key = 'lots_'
            if (params.id) {
                return models.Lot.scope('nested')/*.cache()*/.findByPk(params.id);
            }

            const qScope = params.scope || (params.id ? 'nested' : 'browse');
            return models.Lot.scope(qScope)/*.cache(key)*/.findAll(
                helpers.sequelizify(params, models.Lot));
        }).then(function (result) {
            result = Array.isArray(result) ? result : [result];
            result = result.filter(rec => rec != null);
            
            callback(null, {
                total: result.count || result.length,
                data: result.rows || result,
                lastupdated: new Date()
            });
        }).catch(function (err) {
            callback(err);
        });
    },

    insert: function (params, callback, sid, req) {
        let user;
        session.verify(req).then(function (session) {
            user = session.user;
            const userRole = user.get('role');

            if (userRole > 1) {
                callback(new Error('Not authorized'));
                return;
            }

            return models.Lot/*.cache()*/.create(params);
        }).then(function (row) {
            callback(null, { data: row });
        }).catch(function (err) {
            callback(errors.parse(err));
        });
    },

    update: function (params, callback, sid, req) {
        let user;

        session.verify(req).then(function (session) {
            user = session.user;

            if (user.get('role') > 1) {
                callback(new Error('Not authorized'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Lot/*.cache()*/.findByPk(params.id);
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Effectif with the specified id cannot be found',
                });
            }

            return row/*.cache()*/.update(params);
        }).then(function (row) {
            // reload record data in case associations have been updated.
            return row/*.cache()*/.reload();
        }).then(function (row) {
            callback(null, {
                data: [row],
                total: 1
            });
        }).catch(function (err) {
            callback(errors.parse(err));
        });
    },


    remove: function (params, callback, sid, req) {
        let user
        session.verify(req).then(function (session) {
            user = session.user;

            if (user.get('role') > 1) {
                callback(new Error('Not authorized'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Lot/*.cache()*/.findByPk(params.id)
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Lot with the specified id cannot be found',
                });
            }

            const userRole = user.get('role');

            if (userRole > 1) {
                callback(new Error('Not authorized'));
                return;
            }
            return row/*.cache()*/.destroy();
        }).then(function (row) {
            callback(null, {
                total: 1
            });

        }).catch(function (err) {
            callback(errors.parse(err));
        });
    },

    filters: function (params, callback, sid, req) {
        session.verify(req).then(function () {
            return helpers.fetchFilters(params, models.Lot);
        }).then(function (results) {
            callback(null, {
                data: results
            });
        }).catch(function (err) {
            callback(err);
        });
    },

    checklast: function (callback, sid, req) {

        /*const user = session.user;
        const userRole = user.get('role');
     
        if (userRole > 3) {
            callback(new Error('Not authorized'));
            return;
        }*/

        return models.Lot.findAll({
            limit: 1,
            where: {},
            attributes: ['updated'],
            order: [['updated', 'DESC']]
        }).then(function (results) {
            callback(null, {
                lastupdated: results[0] && results[0].get('updated')
            });
        }).catch(function (err) {
            callback(err);
        });
    }
};

module.exports = Service;