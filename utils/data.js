"use strict";

var models = require("../models");
var sequelize = models.sequelize;
var Promise = models.Sequelize.Promise;

function pick(items, index) {
    var count = items.length;
    if (index === undefined) {
        index = Math.floor(Math.random() * count);
    }

    return items[index % count];
}

module.exports = {

    sync: function () {
        console.info('create not existed tables...');

        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }) //, alter: true
        })

    },

    reset: function () {
        console.info('Populating database with example data...');
        /*return sequelize.transaction(function (t) {
            return sequelize.sync({ force: true, transaction: t }).then(function () {
                return models.Action.destroy({ truncate: true, transaction: t });
                
            })
        }).then(function () {*/
        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: true, transaction: t }).then(function () {
                return models.Person.bulkCreate(require('../data/users.json'), { transaction: t })
                //return models.Person.destroy({ truncate: true, transaction: t })
            }).then(function () {
                return Promise.all([
                    models.Reporting.bulkCreate(require('../data/reportings.json'), { transaction: t })
                ])
            });
        })/*;
        })*/.then(function () {
            console.info('Populating database: DONE');
        })
    },

    insertUnites: function (records, query) {
        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                return models.Unite.destroy({ where: query, truncate: query ? false : true, transaction: t })
            }).then(function () {
                console.log(records.length);
                return models.Unite.bulkCreate(records, { transaction: t });
            })
        })
    },

    upsertUnites: function (records) {
        //const fields = Object.keys(models.Unite.rawAttributes).filter(f => !['id', 'created', 'fp_id'].includes(f))
        const fields = Object.keys(records[0]).filter(f => !['id', 'created', 'fp_id'].includes(f));

        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                return models.Unite.bulkCreate(records, { transaction: t, updateOnDuplicate: fields, returning: ['id'] });
            })
        })
    },

    insertLots: function (records, query) {
        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                /*return models.Lot.destroy({ where: query, truncate: query ? false : true, transaction: t })
            }).then(function () {*/
                return models.Lot.bulkCreate(require('../data/lots.json'), { transaction: t })
            }).catch(function (err) {
                console.log(err)
            })
        })
    },

    insertDelegations: function (records, query) {
        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                /*return models.Delegation.destroy({ where: query, truncate: query ? false : true, transaction: t })
            }).then(function () {*/
                return models.Delegation.bulkCreate(require('../data/delegations.json'), { include: [{ model: models.Lot, as: 'lot' }], transaction: t })
            }).catch(function (err) {
                console.log(err)
            })
        })
    },

    insertSousDelegations: function (records, query) {
        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                /*return models.Delegation.destroy({ where: query, truncate: query ? false : true, transaction: t })
            }).then(function () {*/
                return models.SousDelegation.bulkCreate(require('../data/sousdelegations.json'), { include: [{ model: models.Delegation, as: 'delegation' }], transaction: t })
            })
        })
    },


    insertUsers: function (records) {
        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                /*return models.Person.destroy({ truncate: true, transaction: t })
            }).then(function () {*/
                return models.Person.bulkCreate(require('../data/users.json'), { transaction: t })
            })
        }).then(function () {
            console.info('Imports From Google Sheets: DONE');
        })
    },

    insertReportings: function (records) {
        records = records || require('../data/reports.json')

        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                return models.Reporting.destroy({ truncate: true, transaction: t })
            }).then(function () {
                return models.Reporting.bulkCreate(records, { transaction: t })
            })
        })
    },

    upsertReportings: function (records, call) {
        records = records || require('../data/reports.json')

        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                return Promise.map(records, function (record, index) {
                    return models.Reporting.findOne({
                        where: { plan_actions: record.plan_actions.toString(), province: record.province }
                    }).then(function (row) {
                        /*if (!row) {
                            console.log(`Create ${record.province}`)
                            return models.Reporting.create(record)
                        }

                        if (row.get('updatedAt') >= new Date(record.date_situation)) {
                            return Promise.resolve(null)
                        }*/

                        if (!row) {
                            console.log(`No Row For ${record.province}, ${record.plan_actions}`)
                            return Promise.resolve(null);
                        }

                        console.log(`Update ${record.province}`)
                        return row.update(record);
                    })/*.then(function (row) {
                        if (!row) {
                            console.log('nothing')
                            return Promise.resolve(null)
                        }

                        return row.reload().then(function (row) {
                            var modifiedFields = row.changed(),
                                object = row.get('province') + ' / PA ' + row.get('plan_actions'),
                                subject = 'PA ' + row.get('plan_actions');

                            console.log(`Update ${object}`, modifiedFields)

                            if (!modifiedFields || !modifiedFields.length) {
                                return Promise.resolve(row)
                            }

                            subject += '<ul>';

                            for (const [key, value] of Object.entries(modifiedFields)) {
                                subject += ('<li><b>' + key + ' :</b> &nbsp;' + row.previous(key) + '&nbsp; -> ' + row.get(key));
                                subject += '</li>';
                            };

                            subject += '</ul>';

                            return models.Action.create({
                                type: row.isNewRecord ? 'Ajout' : 'Modification',
                                subject,
                                object,
                                author: row.get('modified_by')
                            });
                        })
                    })*/
                })
            })
        }).then(function () {
            console.info('Imports DONE');
        }).catch(function (err) {
            console.log('fails', err)
        })
    }
};
