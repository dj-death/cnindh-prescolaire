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
        session.verify(req).then(function (session) {
            const user = session.user;
            const accessFilters = helpers.checkListAuthorization(user, params)
            
            if (accessFilters === false) {
                callback(new Error('Non autorisé'));
                return;
            }

            params.filter = accessFilters;            

            const qScope = params.scope || 'browse';
            
            return models.Transfert.scope(qScope).findAndCountAll(helpers.sequelizify(params, models.Transfert));
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
                callback(new Error('Non autorisé'));
                return;
            }

            return models.Transfert/*.cache()*/.create(params);
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

                    return models.Transfert/*.cache()*/.findByPk(_param.id).then(function (row) {
                        if (!row) {
                            throw errors.types.invalidParams({
                                path: 'id', message: 'Transfert with the specified id cannot be found',
                            });
                        }

                        if (helpers.checkModifyAuthorization(user, row) === false) {
                            callback(new Error('Non autorisé'));
                            return;
                        }

                        if (user.get('role') > 0 && row.get('ordre') == 1) {
                            const updatedFields = Object.keys(_param)
                            const isNbreTouched = updatedFields.filter(f => ['nbre_ups_retenues_conventions', 'nbre_ups_ouvertes_plus2ans', 'nbre_ups_ouvertes_moins2ans', 'nbre_ups_encours'].includes(f)).length > 0;

               
                            if (isNbreTouched) {
                                callback(new Error('Modification non autorisée ! Veuillez communiquer avec l\'administrateur !'));
                                return;
                            }
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

            return models.Transfert/*.cache()*/.findByPk(params.id);
        }).then(function (row) {
            if (Array.isArray(row)) {
                callback(null, {
                    data: row,
                    total: row.length
                });
            } else {

                if (!row) {
                    throw errors.types.invalidParams({
                        path: 'id', message: 'Transfert with the specified id cannot be found',
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
            return models.Transfert/*.cache()*/.findByPk(params.id);
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Transfert with the specified id cannot be found',
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
            return helpers.fetchFilters(params, models.Transfert);
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

        return models.Transfert.findAll({
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
