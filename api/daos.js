"use strict";

var helpers = require('../utils/dpe_helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');

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
            console.log(accessFilters);

            if (accessFilters === false) {
                callback(new Error('Non Autorisé'));
                return;
            }

            params.filter = accessFilters;            

            const qScope = params.scope || (params.id != null ? 'nested' : 'browse');
            const mois = params.mois;
            const annee = params.annee;

            const query = helpers.sequelizify(params, models.Dao);
            const sequelize = models.Dao.sequelize

            if (qScope === 'browse') {
                let periodFilter = ''
                if (mois != null || annee != null) {
                    periodFilter += ' AND Dao_Activites.periode '

                    if (mois != null && annee != null) periodFilter += ' = \'' + mois + '/' + annee + '\''
                    else if (mois != null) periodFilter += ' LIKE \'' + mois + '/%\''
                    else periodFilter += ' LIKE \'%/' + annee + '\''
                }

                query.attributes = {
                    include: [
                        [sequelize.literal('(SELECT SUM(nbre_benefs_enceintes_orientees) FROM Dao_Activites WHERE Dao_Activites.dao_id = Dao.id ' + periodFilter + ')'), 'nbre_benefs_enceintes_orientees'],
                        [sequelize.literal('(SELECT SUM(nbre_benefs_enceintes_nonorientees) FROM Dao_Activites WHERE Dao_Activites.dao_id = Dao.id ' + periodFilter + ')'), 'nbre_benefs_enceintes_nonorientees'],
                        [sequelize.literal('(SELECT SUM(nbre_benefs_femmes_apres_accouchement) FROM Dao_Activites WHERE Dao_Activites.dao_id = Dao.id ' + periodFilter + ')'), 'nbre_benefs_femmes_apres_accouchement'],
                        [sequelize.literal('(SELECT SUM(duree_moy_sejour) FROM Dao_Activites WHERE Dao_Activites.dao_id = Dao.id ' + periodFilter + ')'), 'duree_moy_sejour'],
                        [sequelize.literal('(SELECT prestations_offertes FROM Dao_Activites WHERE Dao_Activites.dao_id = Dao.id ' + periodFilter + ' LIMIT 1)'), 'prestations_offertes'],
                        [sequelize.literal('(SELECT SUM(nbre_benefs_nouveaux_nes) FROM Dao_Activites WHERE Dao_Activites.dao_id = Dao.id ' + periodFilter + ')'), 'nbre_benefs_nouveaux_nes'],
                        [sequelize.literal('(SELECT SUM(nbre_sessions_sensibilisation) FROM Dao_Activites WHERE Dao_Activites.dao_id = Dao.id ' + periodFilter + ')'), 'nbre_sessions_sensibilisation']
                    ]
                }
            }

            return models.Dao.scope(qScope).findAndCountAll(query);
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
        let user
        session.verify(req).then(function (session) {
            user = session.user;

            if (helpers.checkModifyAuthorization(user, params) === false) {
                callback(new Error('Non Autorisé'));
                return;
            }

            return models.Dao.create(params);
        }).then(function (row) {
            callback(null, { data: row });
        }).catch(function (err) {
            callback(errors.parse(err));
        });
    },

    update: function (params, callback, sid, req) {
        let user
        session.verify(req).then(function (session) {
            user = session.user;

            const role = user.get('role');
            if (role == 11 || role > 12) {
                callback(new Error('Non Autorisé'));
                return;
            }

            if (Array.isArray(params)) {
                return Promise.all(params.map(function (_param) {
                    if (!_param.id) {
                        throw errors.types.invalidParams({
                            path: 'id', message: 'Missing required parameter: id',
                        });
                    }

                    return models.Dao.findByPk(_param.id).then(function (row) {
                        if (!row) {
                            throw errors.types.invalidParams({
                                path: 'id', message: 'DAO with the specified id cannot be found',
                            });
                        }

                        if (helpers.checkModifyAuthorization(user, row) === false) {
                            callback(new Error('Non Autorisé'));
                            return;
                        }

                        if (user.get('role') > 0) {
                            _param.modified_by = user.get('title') || user.get('username');
                            _param.date_situation = new Date();
                        }

                        return row.update(_param);
                    }).then(function (row) {
                        // reload record data in case associations have been updated.
                        return row.reload();
                    })
                }))
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Dao.findByPk(params.id);
        }).then(function (row) {
            if (Array.isArray(row)) {
                callback(null, {
                    data: row,
                    total: row.length
                });
            } else {

                if (!row) {
                    throw errors.types.invalidParams({
                        path: 'id', message: 'DAO with the specified id cannot be found',
                    });
                }

                if (helpers.checkModifyAuthorization(user, row) === false) {
                    callback(new Error('Non Autorisé'));
                    return;
                }

                if (user.get('role') > 0) {
                    params.modified_by = user.get('title') || user.get('username');
                    params.date_situation = new Date();
                }

                return row.update(params)/*.then(function (row) {
                    // reload record data in case associations have been updated.
                    return row.cache().reload();

                })*/.then(function (row) {
                    callback(null, {
                        data: [row],
                        total: 1
                    });
                })
            }
        }).catch(function (err) {
            console.log(err)

            callback(errors.parse(err));
        });
    },

    remove: function (params, callback, sid, req) {
        let user
        session.verify(req).then(function (session) {
            user = session.user;

            if (user.get('role') > 12) {
                callback(new Error('Non Autorisé'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }
            return models.Dao.findByPk(params.id);
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'DAO with the specified id cannot be found',
                });
            }

            if (helpers.checkModifyAuthorization(user, row) === false) {
                callback(new Error('Non Autorisé'));
                return;
            }

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
            return helpers.fetchFilters(params, models.Dao);
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
