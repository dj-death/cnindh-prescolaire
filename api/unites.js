"use strict";

var helpers = require('../utils/helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');


var Service = {
    list: function (params, callback, sid, req, res, scopeName) {
        scopeName = scopeName || 'browse';

        session.verify(req).then(function (session) {
            const user = session.user;
            const accessFilters = helpers.checkListAuthorization(user, params, 4)
            
            if (accessFilters === false) {
                callback(new Error('Not authorized'));
                return;
            }

            params.filter = accessFilters;

            let qScope = params.scope || 'browse';

            // no limit no filter then need to fetch from cache
            /*if (!params.limit && (!params.filter || params.filter.length === 0) && scopeName === 'browse') {
                return models.Unite.scope(qScope).cache('unites').findAll(helpers.sequelizify(params, models.Unite));
            }*/

            if (params.id && qScope === 'browse') qScope = 'nested';
            return models.Unite.scope(qScope).findAndCountAll(helpers.sequelizify(params, models.Unite))
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

    nestedList: function (params, callback, sid, req, res) {
        module.exports.list(params, callback, sid, req, res, 'nested')
    },


    insert: function (params, callback, sid, req) {
        let user;

        session.verify(req).then(function (session) {
            user = session.user;

            if (helpers.checkModifyAuthorization(user, params, 4) === false) {
                callback(new Error('Not authorized'));
                return;
            }

            var data = Array.isArray(params) ? params : [params];
            data.forEach(function (rec) {
                if (rec.fp_id) return;

                if (rec.fp_code == 0) { // FMPS
                    rec.fp_id = 'temp_' + Date.now()
                } else {
                    rec.fp_id = `${rec.province_code}/${rec.plan_actions}/${rec.commune}/${rec.douar_quartier}/${rec.intitule}`; 
                }
            })

            return models.Unite/*.cache()*/.bulkCreate(data);
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

            if (user.get('role') > 4) {
                callback(new Error('Not authorized'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Unite/*.cache()*/.findByPk(params.id);
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Unite with the specified id cannot be found',
                });
            }

            if (helpers.checkModifyAuthorization(user, row, 4) === false) {
                callback(new Error('Not authorized'));
                return;
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
        let user;
        session.verify(req).then(function (session) {
            user = session.user;

            if (user.get('role') > 4) {
                callback(new Error('Not authorized'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }
            return models.Unite/*.cache()*/.findByPk(params.id);
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Unite with the specified id cannot be found',
                });
            }

            if (helpers.checkModifyAuthorization(user, row, 4) === false) {
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
            return helpers.fetchFilters(params, models.Unite);
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

        return models.Unite.findAll({
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
