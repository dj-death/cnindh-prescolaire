"use strict";

var helpers = require('../utils/helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');

var Service = {
    list: function (params, callback, sid, req) {
        session.verify(req).then(function (session) {
            const user = session.user;
            const userRole = user.get('role');

            if (userRole > 4) {
                callback(new Error('Non autorisé'));
                return;
            } else if (userRole > 1) {
                params['filter'] = params['filter'] || []

                var existProp = params.filter.find(filt => filt.property === 'person_id')
                if (existProp) {
                    existProp.value = user.get('id')
                } else {
                    params.filter.push({
                        property: 'person_id',
                        value: user.get('id')
                    })
                }
            }
            
            const qScope = params.scope || 'browse';

            var typeFilter = params.filter.find(filt => filt.property === 'type')

            if (typeFilter && typeFilter.value == 1) {
                params.filter.push({
                    property: 'person_id',
                    operator: '!=',
                    value: '431d69a9-7262-4ae1-bd01-9cff3f8515eb'
                })
            }

            return models.Action.scope(qScope).findAndCountAll(
                helpers.sequelizify(params, models.Action));
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
        session.verify(req).then(function (session) {
            return session.user.createAction(params);
        }).then(function (row) {
            callback(null, {
                data: row
            });
        }).catch(function (err) {
            callback(err);
        });
    },

    update: function (params, callback, sid, req) {
        session.verify(req).then(function () {
            // NOTE(SB): the direct proxy requires methods for all CRUD actions
            throw errors.types.notImplemented();
        }).catch(function (err) {
            callback(err);
        });
    },

    remove: function (params, callback, sid, req) {
        session.verify(req).then(function () {
            var ids = helpers.idsFromParams(params);
            if (ids.length === 0) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Action.destroy({
                where: {
                    id: { $in: ids }
                }
            });
        }).then(function () {
            callback(null);
        }).catch(function (err) {
            callback(err);
        });
    },

    filters: function (params, callback, sid, req) {
        session.verify(req).then(function (session) {
            const user = session.user;
            const userRole = user.get('role');

            if (userRole > 4) {
                callback(new Error('Non autorisé'));
                return;
            } else if (userRole > 1) {
                params['filter'] = params['filter'] || []

                var existProp = params.filter.find(filt => filt.property === 'person_id')
                if (existProp) {
                    existProp.value = user.get('id')
                } else {
                    params.filter.push({
                        property: 'person_id',
                        value: user.get('id')
                    })
                }


            }

            return helpers.fetchFilters(params, models.Action);
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
            callback(new Error('Non autorisé'));
            return;
        }*/

        return models.Action.findAll({
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
}

module.exports = Service;
