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
            const accessFilters = helpers.checkListAuthorization2(user, params)
            
            if (accessFilters === false) {
                callback(new Error('Not authorized'));
                return;
            }

            params.filter = accessFilters;            

            const qScope = params.scope || 'browse';

            console.log(params);

            return models.Implementation.scope(qScope).findAndCountAll(helpers.sequelizify(params, models.Implementation));
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

            if (helpers.checkModifyAuthorization2(user, params) === false) {
                callback(new Error('Not authorized'));
                return;
            }

            return models.Implementation.create(params);
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
            if (role == 12 || role > 13) {
                callback(new Error('Not authorized'));
                return;
            }

            if (Array.isArray(params)) {
                return Promise.all(params.map(function (_param) {
                    if (!_param.id) {
                        throw errors.types.invalidParams({
                            path: 'id', message: 'Missing required parameter: id',
                        });
                    }

                    return models.Implementation.findByPk(_param.id).then(function (row) {
                        if (!row) {
                            throw errors.types.invalidParams({
                                path: 'id', message: 'Implementation with the specified id cannot be found',
                            });
                        }

                        if (helpers.checkModifyAuthorization2(user, row) === false) {
                            callback(new Error('Not authorized'));
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

            return models.Implementation.findByPk(params.id);
        }).then(function (row) {
            if (Array.isArray(row)) {
                callback(null, {
                    data: row,
                    total: row.length
                });
            } else {

                if (!row) {
                    throw errors.types.invalidParams({
                        path: 'id', message: 'Implementation with the specified id cannot be found',
                    });
                }

                if (helpers.checkModifyAuthorization2(user, row) === false) {
                    callback(new Error('Not authorized'));
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

            if (user.get('role') > 13) {
                callback(new Error('Not authorized'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }
            return models.Implementation.findByPk(params.id);
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Implementation with the specified id cannot be found',
                });
            }

            if (helpers.checkModifyAuthorization2(user, row) === false) {
                callback(new Error('Not authorized'));
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
            return helpers.fetchFilters(params, models.Implementation);
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
