"use strict";

var helpers = require('../utils/helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');

const _ = require('lodash');

var Promise = models.Sequelize.Promise;
var PromiseThrottle = require('promise-throttle');
var promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 50,           // up to 1 request per second
    promiseImplementation: Promise  // the Promise library you are using
});


function hasFilter(coll, property) {
    if (!Array.isArray(coll)) {
        return false;
    }

    var result = coll.filter(function (item) {
        return item['property'] === property;
    });

    return result.length > 0;
}

var Service = {
    list: function (params, callback, sid, req) {
        session.verify(req).then(function (session) {
            const user = session.user;
            const userRole = user.get('role');

            if (userRole > 1) {
                callback(new Error('Not authorized'));
                return;
            }

            const key = 'sousdelegations_' + ( params.filter ? JSON.stringify(params.filter) : '')
            let qScope = params.scope || (params.id ? 'nested' : 'browse');
            if (params.id && qScope === 'browse') qScope = 'nested';

            return models.SousDelegation.scope(qScope)/*.cache(key)*/.findAndCountAll(
                helpers.sequelizify(params, models.SousDelegation));
        }).then(function (result) {
            callback(null, {
                total: result.count,
                data: result.rows,
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

            if (params.delegation_id) params.delegationId = params.delegation_id
            if (!params.montant_effectif2 && params.montant_effectif > 0) params.montant_effectif2 = params.montant_effectif

            return models.SousDelegation/*.cache()*/.create(params);
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

            return models.SousDelegation/*.cache()*/.findOne({
                where: {
                    id: params.id
                }
            });
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'SousDelegation with the specified id cannot be found',
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

            return models.SousDelegation.findOne({
                where: {
                    id: params.id
                }
            });
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Délégation with the specified id cannot be found',
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
            return helpers.fetchFilters(params, models.SousDelegation);
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

        return models.SousDelegation.findAll({
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