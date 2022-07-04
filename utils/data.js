"use strict";

var models = require("../models");
var sequelize = models.sequelize;
var Promise = models.Sequelize.Promise;
var throat = require('throat');
const helpers = require('./helpers');

function pick(items, index) {
    var count = items.length;
    if (index === undefined) {
        index = Math.floor(Math.random() * count);
    }

    return items[index % count];
}

var corr = { "08577051706102": "AGLF",
"08577051702001": "AGRAD NOUAMASSIOUNE",
"08577051704802": "AGULZI NIKKAINE",
"08577051700801": "AKHBOU",
"08577051701101": "AMERDOUL AZOUGAGHE",
"08577051702105": "ANOU NOUAACHA",
"08577051703301": "ASSFALOU",
"10473050103603": "Aتكمي افلا",
"08577051702801": "BOUGAFER",
"08577051702701": "DAW BOUTAGLIMTE",
"08577051705901": "ID ZAGHANE",
"08577051702702": "IKISS TAADI",
"08577051703201": "Imin ouargue",
"08577051704701": "IZILI",
"08577051703401": "OUGOUG",
"08577051701701": "TAFRAOUTE NOULKOUDE",
"08577051702703": "Taghda Nikiss",
"08577051706101": "TAGLIOUITE",
"08577051700201": "TALBACHATE",
"08577051702101": "TALOUDATE",
"08577051703302": "Tanghourte",
"08577051703101": "Tigolzatine",
"08577051703001": "TISLITE NOUSSILKANE"
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

    setCommunesCode: function () {
        let diffCount = 0;

        models.Unite.findAll(/*{ where: { plan_actions: '2021', fp_code: 1 } }*/).then(function (unites) {
            return Promise.all(/*Promise.map(unites,*/ unites.map(throat(1, function (unite, index) {
                /*var douar_quartier = unite.get('douar_quartier');
                var commune_code = unite.get('commune_code');

                var cleanedDr = helpers.titleCase(douar_quartier).replace(/\b(douar|up)\.?\b/i, '').trim();
                cleanedDr = cleanedDr.replace(/\bCoop\.?\b\s/i, 'Coopérative ').trim();
        
                if ((cleanedDr.match(/\d/g) || []).length === 1) {
                    cleanedDr = cleanedDr.replace(/[\-\s]{0,2}[1-4][\-\s]{0,2}$/, '').trim();
                }

                var communeMatch = helpers.communesCfg.find(comm => comm.value === commune_code);
                var cercleMatch = communeMatch ? helpers.cerclesCfg.find(cercle => cercle.value === communeMatch.cercle_code) : null;
                
                if (/coop/i.test(cleanedDr)) console.log(douar_quartier, cleanedDr);*/

                var intitule = helpers.sanitizeDouar(unite.get('intitule'));
                var douar_quartier = intitule;

                douar_quartier = douar_quartier.replace(/\b(douar|up)\.?\b\s/ig, '');
                douar_quartier = douar_quartier.replace(/\s?\([a-zA-Zé ]+\)\s?/, "");
                douar_quartier = douar_quartier.replace(/^(ecole|nm_|nm_ecole)\s?/i, '');
        
                if ((douar_quartier.match(/\d/g) || []).length === 1) {
                  douar_quartier = douar_quartier.replace(/[\-\s]{0,2}[1-4][\-\s]{0,2}$/, '');
                }
        
                douar_quartier = helpers.titleCase(douar_quartier);

                return unite.update({
                    intitule: intitule,
                    douar_quartier: douar_quartier,
                    adresse: unite.get('fp_code') === 1 ? `${helpers.nameSig(douar_quartier)}/${helpers.nameSig(intitule)}` : null
                });
            })));  
        }).then(function () {
            console.log('end = ', diffCount);
        })

        /*return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                return models.Unite.bulkCreate(records, { transaction: t, updateOnDuplicate: fields, returning: ['id'] });
            })
        })*/
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

    insertDouars: function (records, query) {
        var douars = require('../data/douars.json');
        douars = douars.map(function (dr) {
            let province = helpers.closestEntry(dr.province, helpers.provinces, true, true);
            if (province) dr.province_code = helpers.decoupage.find(rec => rec.label ===  province).value;
              

            if (dr.code_sous_douar && corr[dr.code_sous_douar.toString()]) {
                dr.nom_fr = corr[dr.code_sous_douar.toString()];
            }

            dr.nom_fr = helpers.titleCase(dr.nom_fr);
            dr.commune = helpers.titleCase(dr.commune);
            let commune_code = helpers.getCommuneCode(dr.commune, dr.province_code);
            dr.commune_code = commune_code;

            var communeMatch = helpers.communesCfg.find(comm => comm.value === commune_code);
            var cercleMatch = communeMatch ? helpers.cerclesCfg.find(cercle => cercle.value === communeMatch.cercle_code) : null;
            dr.cercle_code = cercleMatch ? cercleMatch.value : null;

            if (dr.code_sous_douar) {
                dr.code_douar_mere = dr.code_douar;
                dr.code_douar = dr.code_sous_douar;
            }

            dr.type = ["Douars", "Sous-Douar", "Nomades", "Sous-Quartier"].indexOf(dr.type) + 1;
            dr.milieu = ["rural", "urbain"].indexOf(dr.milieu) + 1;

            dr.location = {
                longitude: dr.longitude,
                latitude: dr.latitude
            }

            return dr;
        });

        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                /*return models.Lot.destroy({ where: query, truncate: query ? false : true, transaction: t })
            }).then(function () {*/
                return models.Douar.bulkCreate(douars, { transaction: t })
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
                return models.SousDelegation.bulkCreate(require('../data/sousdelegations.json').filter(d => ['13e5db8f-ff82-4449-b36d-edf91861dff3', '31ebeca9-9bd6-4aaf-ba4d-673bb31bc12d'].includes(d.delegationId)), { include: [{ model: models.Delegation, as: 'delegation' }], transaction: t })
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
