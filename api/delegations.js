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

            const key = 'delegations_' + ( params.filter ? JSON.stringify(params.filter) : '')
            let qScope = params.scope || (params.id ? 'nested' : 'browse');
            if (params.id && qScope === 'browse') qScope = 'nested';

            return models.Delegation.scope(qScope)/*.cache(key)*/.findAndCountAll(
                helpers.sequelizify(params, models.Delegation));
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

    addUnites: function (deleg, unitesIds, transaction) {
        return models.Unite.findAll({
            where: {
                id: {
                    $in: unitesIds
                }
            }
        }).then(function (unites) {
            if (!unites) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Unites with the specified ids cannot be found',
                });
            }

            const nbre_mois_fonctionnement = deleg.get('nbre_mois_fonctionnement');
            const nature_affectation = deleg.get('nature_affectation');


            const promises = unites.map((proj) => promiseThrottle.add(function (proj) {
                const nbre_salles = proj.get('nbre_salles');

                let montant = 0;
                switch (nature_affectation) {
                    case 'Equipement': montant = 25000 * nbre_salles; break;
                    case 'Fonctionnement': montant = 55000 * nbre_salles * nbre_mois_fonctionnement / 12; break;
                }

                return deleg.addUnite(proj, { through: { montant: montant }, transaction: transaction })
            }.bind(null, proj)));

            return deleg.removeUnites({ transaction: transaction }).then(function () {
                return Promise.all(promises)
            });
        })
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

            return models.Delegation/*.cache()*/.create(params);
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

            return models.Delegation/*.cache()*/.findOne({
                where: {
                    id: params.id
                },

                include: [{ model: models.Unite, as: 'unites' }]
            });
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Délégation with the specified id cannot be found',
                });
            }

            const previousUnites = row.get('unites_list');
            const unitesIds = params.unites_list;

            return models.sequelize.transaction(function (t) {
                return models.sequelize.sync({ force: false, transaction: t }).then(function () {
                    return row.update(params, { returning: true, transaction: t }).then(function (row) {
                        if (_.isEqual(_.sortBy(previousUnites), _.sortBy(unitesIds))) {
                            console.log('equal')
                            return Promise.resolve(row);
                        } else {
                            return module.exports.addUnites(row, unitesIds, t);
                        }
                    }).then(function () {
                        return row.reload();
                    }).then(function (row) {
                        callback(null, {
                            data: [row],
                            total: 1
                        });
                    });
                });
            })
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

            return models.Delegation.findOne({
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
            return helpers.fetchFilters(params, models.Delegation);
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

        return models.Delegation.findAll({
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