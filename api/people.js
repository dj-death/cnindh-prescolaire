"use strict";

var latinize = require('latinize');
var helpers = require('../utils/helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');

var Service = {
    get: function (params, callback, sid, req) {
        session.verify(req).then(function () {
            var query = params;
            if (!query) {
                throw errors.generate(
                    'Missing username argument'
                );
            }

            return models.Person.scope('nested').findOne({
                where: {
                    $or: [
                        { id: query },
                        { username: query },
                        { email: query }
                    ]
                }
            });
        }).then(function (person) {
            callback(null, { data: person });
        }).catch(function (err) {
            callback(err);
        });
    },

    list: function (params, callback, sid, req) {
        session.verify(req).then(function (session) {
            if (session.user.get('role') > 0 && session.user.get('id') !== params.id) {
                callback(new Error('Non autorisé'));
                return;
            }

            if (params.id) {
                return models.Person.scope('nested').lookup(params.id).then(function (person) {
                    return { count: 1, rows: [person] };
                });
            } else {
                const qScope = params.scope || 'browse';
                return models.Person.scope(qScope).findAndCountAll(
                    helpers.sequelizify(params, models.Person));
            }
        }).then(function (result) {
            callback(null, {
                data: result.rows,
                total: result.count
            });
        }).catch(function (err) {
            callback(err);
        });
    },

    insert: function (params, callback, sid, req) {
        session.verify(req).then(function (session) {
            if (session.user.get('role') > 0) { // && session.user.get('id') !== params.id
                callback(new Error('Non autorisé'));
                return;
            }

            return models.Person.create(params);
        }).then(function (row) {
            callback(null, { data: row });
        }).catch(function (err) {
            callback(errors.parse(err));
        });
    },

    update: function (params, callback, sid, req) {
        session.verify(req).then(function (session) {
            if (session.user.get('role') > 0 && session.user.get('id') !== params.id) {
                callback(new Error('Non autorisé'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }

            return models.Person.scope('nested').findOne({ where: { id: params.id } });
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Person with the specified id cannot be found',
                });
            }

            if (params.password === null || params.password === '') {
                // explicitly remove the password if no value has been given
                delete params.password;
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
        session.verify(req).then(function (session) {
            if (session.user.get('role') > 0) {
                callback(new Error('Non autorisé'));
                return;
            }

            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }
            return models.Person.scope('nested').findOne({
                where: {
                    id: params.id
                }
            });
        }).then(function (row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Person with the specified id cannot be found',
                });
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
            return helpers.fetchFilters(params, models.Person);
        }).then(function (results) {
            callback(null, {
                data: results
            });
        }).catch(function (err) {
            callback(err);
        });
    },

    generateUsername: function (params, callback, sid, req) {
        session.verify(req).then(function () {
            var firstname = params.firstname || undefined;
            if (!firstname) {
                throw errors.generate('Missing firtname arguments');
            }

            var lastname = params.lastname || undefined;
            if (!lastname) {
                throw errors.generate('Missing lastname arguments');
            }

            var sequelize = models.sequelize;
            var username = latinize(firstname + '.' + lastname)
                .replace(/[^a-z0-9]/gi, '_')
                .toLowerCase();

            return models.Person.findAll({
                where: { username: { like: username + '%' } },
                order: [['username']],
                attributes: ['username']
            }).then(function (rows) {
                // if username (without number) already exist, it will be the first one
                if (rows.length == 0 || rows[0].get('username') != username) {
                    return username;
                }

                // iterating usernames to find the first available and valid suffix.
                var index = 1;
                rows.some(function (row) {
                    var number = parseInt(row.get('username').substr(username.length));
                    return number && number != index++;
                });

                return username + index;
            });
        }).then(function (result) {
            callback(null, result);
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

        return models.Person.findAll({
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
