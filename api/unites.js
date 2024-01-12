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
                callback(new Error('Non autorisé'));
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
                callback(new Error('Non autorisé'));
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
                callback(new Error('Non autorisé'));
                return;
            }

            params = Array.isArray(params) ? params : [params];
            const ids = params.map(p => p.id).filter(pId => pId != null);

            if (!ids.length) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Unite.findAll({ where: { id: ids }, attributes: ['id', 'fp_id'/*, 'est_ouverte'*/], raw: true });
        }).then(function (rows) {
            const notAllowedFields = ['id', 'created', 'fp_id', /*'est_programmee_pp',*/ 'est_ouverte_bilan2022'];
            const updatedFields = Object.keys(params[0]).filter(f => !notAllowedFields.includes(f));


            const updatedRows = params.map(function (item) {
                /*if (helpers.checkModifyAuthorization(user, row, 4) === false) {
                    callback(new Error('Non autorisé'));
                    return null;
                }*/
    
                const match = rows.find(row => item.id == row.id);
                
                if (match) {
                    item['fp_id'] = match['fp_id'];
                    //if (match['est_ouverte'] == undefined) item['est_ouverte'] = match['est_ouverte'];      
                }

                return item;

            }).filter(r => r != null)

            if (!updatedRows.length || updatedRows.length !== params.length) {
                callback(new Error(`Difference between matchs ${updatedRows.length} and supplieds ${params.length} `));
                return;
            }

            console.log(updatedRows, updatedFields)

            return models.Unite.bulkCreate(updatedRows, { updateOnDuplicate: updatedFields, returning: true });

        }).then(function (result) {
            callback(null, {
                data: result,
                total: result.length
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
                callback(new Error('Non autorisé'));
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
            callback(new Error('Non autorisé'));
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
