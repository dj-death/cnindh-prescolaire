"use strict";

var helpers = require('../utils/helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');

const _ = require('lodash');

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
            const accessFilters = helpers.checkListAuthorization(user, params)
            
            if (accessFilters === false) {
                callback(new Error('Non autorisé'));
                return;
            }

            params.filter = accessFilters;

            let qScope = params.scope || (params.id ? 'nested' : 'browse');
            if (params.id && qScope === 'browse') qScope = 'nested';

            /*params.filter.push({
                property: 'delegation_id',
                operator: 'in',
                value: [
                    "3514b03b-86df-4104-b944-2df4c01efade",
"22fc5bd5-523b-46af-9e18-1bf88bf71615",
"b2343fe4-6566-4505-a0e2-611274dbd76d",
"cd016854-d888-4df2-bde7-a5c38f2966bf",
"4676dabd-7ff8-4ae9-a4c2-3dab40938171",
"ac412bcd-7647-4e2b-8f2f-952403dfea0c",
"61bbb4bb-2411-4e55-8482-695adb67eb10",
"0535693f-8bb9-4349-8704-6d66fd90546c",
"f2efbb51-025f-4393-adf8-45c4b0a856cf",
"8e79f50b-6aa0-46ac-bc0c-c304dc212b96",
"bc024fcf-3703-407f-be54-936e985f8c77",
"bbaddffa-c603-4c1d-b282-17872d3e754d",
"452f2997-f82b-461a-b0da-9b8141e99c06",
"45316b0b-fbfd-499e-af2c-976a7268ac62",
"090a8fe0-30b0-4348-a2c0-1308b3fa4a6f",
"0577feb6-e54c-4bb4-98a6-1fee2a6fe872",
"e38d428d-a4e7-4d27-9643-17064278c96b",
"26087b97-2b7a-48db-a27b-bb588b567e26"
                ]      
            })
*/

            return models.SousDelegation.scope(qScope).findAndCountAll(
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
                callback(new Error('Non autorisé'));
                return;
            }

            if (params.delegation_id) params.delegationId = params.delegation_id
            if (!params.montant_effectif && params.montant_effectif > 0) params.montant_effectif = params.montant_effectif

            if (!Array.isArray(params) && !params.nbre_ups_concernees) {
                params.nbre_ups_concernees = params.nbre_t1 + params.nbre_t2 + params.nbre_t3 + params.nbre_amg + params.nbre_mod;
                params.nbre_salles_concernees = params.nbre_t1 + params.nbre_t2 * 2 + params.nbre_t3 * 3 + params.nbre_amg + params.nbre_mod;
            }

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
                callback(new Error('Non autorisé'));
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
                callback(new Error('Non autorisé'));
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
                    path: 'id', message: 'Délégation non retrouvée !',
                });
            }

            const userRole = user.get('role');

            if (userRole > 1) {
                callback(new Error('Non autorisé'));
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
            callback(new Error('Non autorisé'));
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