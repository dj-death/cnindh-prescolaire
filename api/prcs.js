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

            const query = helpers.sequelizify(params, models.Prc);
            const sequelize = models.Dao.sequelize

            if (qScope === 'browse') {
                let periodFilter = ''
                if (mois != null || annee != null) {
                    periodFilter += ' AND Prc_Performances.periode '

                    if (mois != null && annee != null) periodFilter += ' = \'' + mois + '/' + annee + '\''
                    else if (mois != null) periodFilter += ' LIKE \'' + mois + '/%\''
                    else periodFilter += ' LIKE \'%/' + annee + '\''
                }

                query.attributes = {
                    include: [
                        [sequelize.literal('(SELECT SUM(mnt_subvention) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'mnt_subvention'],
                        [sequelize.literal('(SELECT nbre_total_prc FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_total_prc'],
                        [sequelize.literal('(SELECT nbre_prc_formees FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_formees'],
                        [sequelize.literal('(SELECT nbre_prc_actives FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_actives'],
                        [sequelize.literal('(SELECT nbre_prc_femme FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_femme'],
                        [sequelize.literal('(SELECT nbre_prc_homme FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_homme'],
                        [sequelize.literal('(SELECT nbre_prc_18_35ans FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_18_35ans'],
                        [sequelize.literal('(SELECT nbre_prc_35_50ans FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_35_50ans'],
                        [sequelize.literal('(SELECT nbre_prc_age_sup50ans FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_age_sup50ans'],
                        [sequelize.literal('(SELECT nbre_prc_sans_instr FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_sans_instr'],
                        [sequelize.literal('(SELECT nbre_prc_primaire FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_primaire'],
                        [sequelize.literal('(SELECT nbre_prc_secondaire FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_secondaire'],
                        [sequelize.literal('(SELECT nbre_prc_superieur FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_superieur'],
                        [sequelize.literal('(SELECT nbre_prc_maitrise_arabe FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_maitrise_arabe'],
                        [sequelize.literal('(SELECT nbre_prc_maitrise_amazigh FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_maitrise_amazigh'],
                        [sequelize.literal('(SELECT nbre_prc_maitrise_langues FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_maitrise_langues'],
                        [sequelize.literal('(SELECT nbre_prc_indemnise FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ' ORDER BY updated DESC LIMIT 1)'), 'nbre_prc_indemnise'],
                        [sequelize.literal('(SELECT SUM(nbre_foyers_charge_par_prc) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_foyers_charge_par_prc'],
                        [sequelize.literal('(SELECT SUM(nbre_grossesses_recensees) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_grossesses_recensees'],
                        [sequelize.literal('(SELECT SUM(nbre_visites_sensibilisation) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_visites_sensibilisation'],
                        [sequelize.literal('(SELECT SUM(nbre_orientees_accouchement_surv) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_orientees_accouchement_surv'],
                        [sequelize.literal('(SELECT SUM(nbre_orientees_cpn_trim1) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_orientees_cpn_trim1'],
                        [sequelize.literal('(SELECT SUM(nbre_orientees_cpn_trim2_3) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_orientees_cpn_trim2_3'],
                        [sequelize.literal('(SELECT SUM(nbre_orientees_acheve_4_visites_cpn) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_orientees_acheve_4_visites_cpn'],
                        [sequelize.literal('(SELECT SUM(nbre_orientees_suivi_postnatal) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_orientees_suivi_postnatal'],
                        [sequelize.literal('(SELECT SUM(nbre_enfants_moins5_orientes) FROM Prc_Performances WHERE Prc_Performances.prc_id = Prc.id ' + periodFilter + ')'), 'nbre_enfants_moins5_orientes']
                        
                    ]
                }
            }

            return models.Prc.scope(qScope).findAndCountAll(query);
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

            return models.Prc.create(params);
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

                    return models.Prc.findByPk(_param.id).then(function (row) {
                        if (!row) {
                            throw errors.types.invalidParams({
                                path: 'id', message: 'PRC with the specified id cannot be found',
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

            return models.Prc.findByPk(params.id);
        }).then(function (row) {
            if (Array.isArray(row)) {
                callback(null, {
                    data: row,
                    total: row.length
                });
            } else {

                if (!row) {
                    throw errors.types.invalidParams({
                        path: 'id', message: 'PRC with the specified id cannot be found',
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
            return models.Prc.findByPk(params.id);
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'PRC with the specified id cannot be found',
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
            return helpers.fetchFilters(params, models.Prc);
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
