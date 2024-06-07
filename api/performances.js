"use strict";

var helpers = require('../utils/dpe_helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');

var Service = {
    list: function (params, callback, sid, req) {
        session.verify(req).then(function (session) {
            const user = session.user;
            const accessFilters = helpers.checkListAuthorization(user, params)
            
            if (accessFilters === false) {
                callback(new Error('Non Autorisé'));
                return;
            }

            params.filter = accessFilters;

            return models.Performance.scope('browse').findAndCountAll(
                helpers.sequelizify(params, models.Performance));
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

            if (helpers.checkModifyAuthorization(user, params) === false) {
                callback(new Error('Non Autorisé'));
                return;
            }

            if (params.prc_id) {
                params.prcId = params.prc_id
            } else {
                callback(new Error('Aucun PRC rattaché !'));
                return;
            }

            return models.Performance.findOne({
                where: {
                    prc_id: params.prcId,
                    periode: params.periode
                }
            });
        }).then(function (row) {
            if (row) {
                callback(new Error('Période déjà insérée !'));
                return;
            }

            return models.Performance.create(params, { include: [{ model: models.Prc, as: 'prc' }] });
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

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Performance.findOne({
                where: {
                    id: params.id
                }
            });
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Performance with the specified id cannot be found',
                });
            }

            if (helpers.checkModifyAuthorization(user, row) === false) {
                callback(new Error('Non Autorisé'));
                return;
            }

            return row.update(params);
        }).then(function (row) {
            // reload record data in case associations have been updated.
            return row.reload();
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


            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }
            return models.Performance.findOne({
                where: {
                    id: params.id
                }
            });
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Effectif with the specified id cannot be found',
                });
            }

            if (helpers.checkModifyAuthorization(user, row) === false) {
                callback(new Error('Non Autorisé'));
                return;
            }

            let today = new Date();
            today.setDate(1);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setHours(0);

            let [month, year] = row.get('periode').split('/');
            let rowPeriod = new Date(year, parseInt(month) - 1, 1);

            /*if (user.get('role') > 10 && rowPeriod < today) {
                callback(new Error('Non Autorisé'));
                return;
            }*/

            return row.destroy();
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
            return helpers.fetchFilters(params, models.Performance);
        }).then(function (results) {
            callback(null, {
                data: results
            });
        }).catch(function (err) {
            callback(err);
        });
    }
};

module.exports = Service;
