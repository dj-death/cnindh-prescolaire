"use strict";

var helpers = require('../utils/helpers.js');
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
        let user;
        let filteredPA;

        session.verify(req).then(function (session) {
            user = session.user;
            const accessFilters = helpers.checkListAuthorization(user, params)
            
            if (accessFilters === false) {
                callback(new Error('Non autorisé'));
                return;
            }

            params.filter = accessFilters;

            if (user.role > 1 && [46, 69, 60, 63, 66].includes(user.province_code)) {
                params.filter.push({
                    property: 'plan_actions',
                    operator: '!=',
                    value: '2024'
                })
            }

            const qScope = params.scope || 'browse';

            if (params.filter) {

                var concernee_visio2022Filter = params.filter.find(filt => filt.property === 'concernee_visio2022')

                if (concernee_visio2022Filter && !typeFilter.value) {
                    var idx = params.filter.findIndex(filt => filt.property === 'concernee_visio2022');
                    params.filter.idx(idx, 1);
                }
            }

            if (params.livrable === 'true') {
                let paFilter = params.filter.find(f => f.property === 'plan_actions')
                if (paFilter) {
                    filteredPA = paFilter.value

                    if (filteredPA === '2023' || filteredPA === '2024') {
                        paFilter.operator = 'in'
                        paFilter.value = ['2023', '2024']
                    }
                }
            }

            return models.Reporting.scope(qScope).findAndCountAll(helpers.sequelizify(params, models.Reporting, { raw: true }));
        }).then(function (result) {
            let rows = result.rows

            // handle mechanizm of assainissement of PA 2023
            if (params.livrable === 'true' && user.role <= 1) {
                const pa24report = []

                rows = rows.map(function (r) {
                    if (r.plan_actions !== '2023') return r
                    if ([60].includes(r.province_code)) return r

                    let nbre_reportees = r.nbre_etudes_non_lancees + r.nbre_etudes_lancees + r.nbre_etudes_achevees + r.nbre_marches_lances
                    let adjuge_a_reporter = 0

                    if (r.nbre_marches_adjuges > 0) {
                        // PP dont 100% UP dispose des crédits
                        if (![46, 69, 60, 63, 66].includes(r.province_code)) {
                            if (r.province_code === 21) {
                                if (r.nbre_marches_lances < 3) adjuge_a_reporter = Math.min(3 - r.nbre_marches_lances, r.nbre_marches_adjuges)   
                            } else {
                                adjuge_a_reporter = r.nbre_marches_adjuges
                            }
                        }

                        nbre_reportees += adjuge_a_reporter
                    }

                    if (!nbre_reportees) return r;

                    // all
                    if (r.nbre_programmees === nbre_reportees) {
                        r.plan_actions = '2024'

                        let i = 1;
                        for(; i <= 7; i++) {
                            r['prevision_mois' + i] = 0
                        }

                        r.prevision_mois0 = nbre_reportees

                    } else {
                        let newR = {
                            id: 800 + pa24report.length,
                            plan_actions: '2024',
                            fondation_partenaire: r.fondation_partenaire,
                            province_code: r.province_code,
                            nbre_programmees: nbre_reportees,
                            nbre_etudes_non_lancees: r.nbre_etudes_non_lancees,
                            nbre_etudes_lancees: r.nbre_etudes_lancees,
                            nbre_etudes_achevees: r.nbre_etudes_achevees,
                            nbre_marches_lances: r.nbre_marches_lances,
                            nbre_marches_adjuges: adjuge_a_reporter,
                            date_situation: r.date_situation,
                            updated: r.updated,
                            prevision_mois0: nbre_reportees
                        }

                        r.nbre_programmees -= nbre_reportees
                        r.nbre_etudes_non_lancees = 0
                        r.nbre_etudes_lancees = 0
                        r.nbre_etudes_achevees = 0
                        r.nbre_marches_lances = 0
                        r.nbre_marches_adjuges -= adjuge_a_reporter

                        let i = 7;
                        let restant = nbre_reportees

                        for(; i >= 0; i--) {
                            if (r['prevision_mois' + i] > 0) {
                                let a_deduire = Math.min(r['prevision_mois' + i], restant)
                                restant -= a_deduire
                                r['prevision_mois' + i] -= a_deduire
                            }

                            if (!restant) break
                        }

                        if (r.province_code === 52) {
                            newR.nbre_programmees_t1 = Math.min(r.nbre_programmees_t1, nbre_reportees)
                            newR.nbre_programmees_amg = nbre_reportees - newR.nbre_programmees_t1
                            newR.nbre_salles = nbre_reportees

                            r.nbre_programmees_t1 -= newR.nbre_programmees_t1
                            r.nbre_programmees_amg -=  newR.nbre_programmees_amg
                            r.nbre_salles -= nbre_reportees
                        } else {
                            r.nbre_programmees_t1 -= nbre_reportees
                            r.nbre_salles -= nbre_reportees

                            newR.nbre_programmees_t1 = nbre_reportees
                            newR.nbre_salles = nbre_reportees
                        }

                        pa24report.push(newR)
                    }
        
                    return r
                })

                rows = [...rows, ...pa24report]
                if (filteredPA) rows = rows.filter(r => r.plan_actions === filteredPA)
            }

            callback(null, {
                total: rows.length,
                data: rows,
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
                callback(new Error('Non autorisé'));
                return;
            }

            return models.Reporting/*.cache()*/.create(params);
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
            if (role == 2 || role > 3) {
                callback(new Error('Non autorisé'));
                return;
            }

            if (Array.isArray(params)) {
                return Promise.all(params.map(function (_param) {
                    if (!_param.id) {
                        throw errors.types.invalidParams({
                            path: 'id', message: 'Missing required parameter: id',
                        });
                    }

                    return models.Reporting/*.cache()*/.findByPk(_param.id).then(function (row) {
                        if (!row) {
                            throw errors.types.invalidParams({
                                path: 'id', message: 'Reporting with the specified id cannot be found',
                            });
                        }

                        if (helpers.checkModifyAuthorization(user, row) === false) {
                            callback(new Error('Non autorisé'));
                            return;
                        }

                        if (user.get('role') > 1) {
                            _param.modified_by = user.get('title') || user.get('username');
                        }

                        _param.date_situation = new Date();

                        return row/*.cache()*/.update(_param);
                    }).then(function (row) {
                        // reload record data in case associations have been updated.
                        return row/*.cache()*/.reload();
                    })
                }))
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Reporting/*.cache()*/.findByPk(params.id);
        }).then(function (row) {
            if (Array.isArray(row)) {
                callback(null, {
                    data: row,
                    total: row.length
                });
            } else {

                if (!row) {
                    throw errors.types.invalidParams({
                        path: 'id', message: 'Reporting with the specified id cannot be found',
                    });
                }

                if (helpers.checkModifyAuthorization(user, row) === false) {
                    callback(new Error('Non autorisé'));
                    return;
                }

                if (user.get('role') > 0) {
                    params.modified_by = user.get('title') || user.get('username');
                    params.date_situation = new Date();
                }

                return row/*.cache()*/.update(params)/*.then(function (row) {
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

            if (user.get('role') > 3) {
                callback(new Error('Non autorisé'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }
            return models.Reporting/*.cache()*/.findByPk(params.id);
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Reporting with the specified id cannot be found',
                });
            }

            if (helpers.checkModifyAuthorization(user, row) === false) {
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
            return helpers.fetchFilters(params, models.Reporting);
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

        return models.Reporting.findAll({
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
