"use strict";

var models = require("../models");
var sequelize = models.sequelize;
var throat = require('throat');
const helpers = require('./helpers');
const { help } = require("yargs");
const {lig3} = require('talisman/metrics/lig');

function pick(items, index) {
    var count = items.length;
    if (index === undefined) {
        index = Math.floor(Math.random() * count);
    }

    return items[index % count];
}

var corr = {
    "08577051706102": "AGLF",
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

var notAggrNumCols = [
    'fp_code',
    'province_code',
    'commune_code',
    'cercle_code',
    'operationnalite',
    'delai_execution'
];

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
                /*return models.Unite.destroy({ where: query, truncate: query ? false : true, transaction: t })
            }).then(function () {*/
                console.log(records.length);
                return models.Unite.bulkCreate(records, { transaction: t });
            })
        })
    },

    compareUnites: function (records) {
        const etat_date_situation = records[0].date_situation;

        return models.Unite.findAll({ where: { fp_code: records[0].fp_code }, order: [['date_situation', 'DESC'], ['province_code', 'ASC'], ['plan_actions', 'ASC']], raw: true})
            .then(function (prevRecs) {
                const last_situation = prevRecs.find(r => r.plan_actions === '2019').date_situation
                let i = 0, len = records.length, maintained = [], instance, match, pa, object;
                const arrets = [];

                const actions = [];

                for (; i < len; i++) {
                    instance = records[i]
                    match = prevRecs.find(r => r.fp_id == instance.fp_id && r.date_situation <= etat_date_situation)

                    pa = `${helpers.getProvinceByCode(instance.province_code)} ${instance.plan_actions}`;
                    object = `${instance.douar_quartier} (${instance.fp_id})`

                    if (!match) {
                        actions.push({
                            type: 'Ajout UP',
                            pa,
                            object,
                            author: instance.fp_code == 1 ? 'FZ' : 'FMPS'
                        })
                    } else {
                        let changes = []

                        maintained.push(instance.fp_id.toString())

                        for (const [key, value] of Object.entries(match)) {
                            if (['id', 'created', 'updated', 'date_situation', 'est_livree', 'dispose_convention_signee', 'est_programmee'].includes(key) || typeof(instance[key]) === 'undefined') continue

                            if (!helpers.compare(instance[key], value)) {
                                if (key === 'intitule') {
                                    if (lig3(instance[key], value.replace(/up /i, '')) > 0.7) {
                                        continue
                                    }
                                    
                                }

                                if (!value && !instance[key]) continue

                                if (value instanceof Date || instance[key] instanceof Date) {
                                    changes.push(`<li>${key}: &nbsp; ${value && helpers.formatDate(value)} &nbsp; -> ${instance[key] && helpers.formatDate(instance[key])}</li>`)
                                } else {
                                    changes.push(`<li>${key}: &nbsp; ${value} &nbsp; -> ${instance[key]}</li>`)

                                    if (key === 'est_ouverte' && value == true && instance[key] == false) {
                                        arrets.push({
                                            pa, object
                                        })
                                    }
                                }

                            }
                        }

                        if (changes.length > 0) {
                            actions.push({
                                type: 'Modification UP',
                                pa,
                                object,
                                subject: `<ul>${changes.join('')}</ul>`,
                                author: instance.fp_code == 1 ? 'FZ' : 'FMPS'
                            })
                        }
                    }
                }

                const deleted = prevRecs.filter(r => !maintained.includes(r.fp_id) && r.date_situation <= etat_date_situation && helpers.compare(r.date_situation, last_situation))

                deleted.forEach(function (d) {
                    //if (records[0].plan_actions === '2022') return

                    let object = `${d.douar_quartier} (${d.fp_id})`
                    let pa = `${helpers.getProvinceByCode(d.province_code)} PA ${d.plan_actions}`

                    actions.push({
                        type: 'Suppression UP',
                        object,
                        pa,
                        author: d.fp_code == 1 ? 'FZ' : 'FMPS',
                        object_id: d.id
                    })
                })

                const actionsConsolidated = []

                if (actions.length > 0) {
                    const ajouts = actions.filter(a => a.type === 'Ajout UP');
                    const modifs = actions.filter(a => a.type === 'Modification UP');
                    const suppressions = actions.filter(a => a.type === 'Suppression UP');

                    let message = `<b>Arrêts: ${arrets.length}; Modifications: ${modifs.length}; Ajouts: ${ajouts.length}; Suppressions: ${suppressions.length};</b><hr/>`

                    if (arrets.length) {
                        message += '<ul>Arrêts:';
                        
                        arrets.forEach(function (up, idx) {
                            message += `<li>${up.pa} / ${up.object}</li>`;
                        })
                        message += '</ul>';
                    }

                    if (modifs.length) {
                        message += '<ul>Modifications:';
                        
                        for (const [_pa, _paModifs] of Object.entries(helpers.groupBy(modifs, 'pa'))) {
                            message += `<li>${_pa}:<ul>`;
                            message += `${_paModifs.map(a => '<li>' + a.object + ':' + a.subject).join('</li>')}`;
                            message += '</ul></li>';
                        }

                        message += '</ul>'
                    }


                    if (ajouts.length) {
                        message += '<ol>Ajouts:';
                        
                        for (const [_pa, _paAjouts] of Object.entries(helpers.groupBy(ajouts, 'pa'))) {
                            message += `<li>${_pa}:<ul>`;
                            message += _paAjouts.map(a => `<li>${a.object}</li>`).join('');
                            message += '</ul></li>';
                        }

                        message += '</ol>';
                    }

                    if (suppressions.length) {
                        message += '<ol>Suppressions:';
                        
                        for (const [_pa, _paSuppressions] of Object.entries(helpers.groupBy(suppressions, 'pa'))) {
                            message += `<li>${_pa}:<ul>`;
                            message += _paSuppressions.map(a => `<li>${a.object}</li>`).join('');
                            message += '</ul></li>';
                        }

                        message += '</ol>';
                    }

                    const fp = actions[0].fp_code === 1 ? 'FZ' : 'FMPS';

                    actionsConsolidated.push({
                        type: 2,
                        object: `Etat ${fp} ${helpers.formatDate(etat_date_situation)}`,
                        subject: message,
                        author: fp
                    })
                } 

                return Promise.resolve(actionsConsolidated)
            })
    },

    upsertUnites: function (records, actions) {
        //const fields = Object.keys(models.Unite.rawAttributes).filter(f => !['id', 'created', 'fp_id'].includes(f))
        const fields = Object.keys(records[0]).filter(f => !['id', 'created', 'fp_id', 'est_programmee_pp', 'est_ouverte_bilan2022'].includes(f));
        //console.log('fields', fields)

        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                /*return Promise.all(records.map(throat(1, function (record, index) {
                    if (index <= 500) return Promise.resolve()
                    return models.Unite.upsert(record, { validate: false, transaction: t, updateOnDuplicate: fields, returning: ['id'] })
                })))*/
                
                return models.Unite.bulkCreate(records, { individualHooks: false, validate: false, transaction: t, updateOnDuplicate: fields, returning: true /*['id']*/ }).then(function (rows) {
                    console.log('successfully updated rows: ' + rows.length);
                    return module.exports.updateCompoundUPs().then(function () {
                        return models.Action.bulkCreate(actions, { transaction: t, returning: false }).then(function () {                       
                            return Promise.resolve(rows)
                        });
                    })
                    
                })
            })
        })
    },

    updateCompoundUPs: function () {
        let diffCount = 0;

        return models.Unite.findAll({ where: { parent_up_id: { $not: null } }, raw: true }).then(function (unites) {
            const compounds = helpers.groupBy(unites, 'parentupid');
            console.log('count ', unites.length, Object.keys(compounds));

            return models.Unite.findAll({ where: { id: { $in: Object.keys(compounds) } } }).then(function (parentUPs) {
                return Promise.all(parentUPs.map(throat(1, function (_parentUP, index) {
                    const pId = _parentUP.get('id').toString();
                    let sums = {};

                    let nbre_est_resilie = 0;
                    let nbre_est_ouverte = 0;

                    let dates = [];

                    compounds[pId].forEach(item => {
                        for (const [key, value] of Object.entries(item)) {
                          if (typeof value === 'number' && !notAggrNumCols.includes(key)) {
                            sums[key] = (sums[key] || 0) + value;
                          }
                        }

                        nbre_est_resilie += (+item.est_resilie);
                        nbre_est_ouverte += (+item.est_ouverte);

                        if (item.date_ouverture) {
                            dates.push(item.date_ouverture);
                        }
                    })

                    sums.est_ouverte = nbre_est_ouverte > 0;
                    sums.est_resilie = nbre_est_resilie === compounds[pId].length;

                    dates.sort();
                    sums.date_ouverture = dates[0];

                    ++diffCount;
                    console.log(sums)
                    return _parentUP.update(sums);
                })));
            })
        })
    },

    cloneRecord: function (id) {
        return sequelize.transaction(function (t) {
            return sequelize.sync({ force: false, transaction: t }).then(function () {
                
                return models.Unite.findOne({
                    where: { id: id }
                }).then(function (row) {
                    console.log('record to clone', row.get('id'))

                    const data = row.get({ plain: true });
                    data.fp_id += '___' 
                    delete data.id;

                    return models.Unite.create(data, { transaction: t, returning: ['id'] }).then(function (result) {       
                        console.log('successfully cloned row: ', result.get('id'));
                        result.set('fp_id', result.get('id'))                
                        return result.save().then(function() {
                            return Promise.resolve(result)
                        })
                    }).catch(function (err) {
                        console.log(err)
                    })
                })
            })
        })
    },

    setCommunesCode: function () {
        let diffCount = 0;

        var ids = ['bb65f24a-395d-4dbe-8990-056453d90d11',
'cb3ca350-83ee-4124-bb82-4d92e1f1b88a',
'9efa83c2-b2cf-48c3-ab0c-4545968005ab',
'c3e0740a-d09f-4710-a465-425574ca297a',
'00bfb302-7268-4e09-ab13-5aaf967a2306',
'6bfd621b-9945-424e-ac6d-facd5271fe74',
'f9de12e0-9c04-4706-84f0-defdd14c4420',
'4198a24d-f499-402f-873c-2e9c58987719'];

        models.Unite.findAll({ where: { id: ids } }).then(function (unites) {
            return Promise.all(/*Promise.map(unites,*/ unites.map(throat(1, function (unite, index) {
                let commune = unite.get('commune');
                let commune_code = helpers.getCommuneCode(commune, unite.get('province_code'));
                let cercle_code;

                if (commune_code != null) {
                    var communeMatch = helpers.communesCfg.find(comm => comm.value === commune_code);
                    var cercleMatch = communeMatch ? helpers.cerclesCfg.find(cercle => cercle.value === communeMatch.cercle_code) : null;
                    cercle_code = cercleMatch ? cercleMatch.value : null;
                }

                ++diffCount;

                return unite.update({
                    commune_code,
                    cercle_code
                });

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

                /*var intitule = helpers.sanitizeDouar(unite.get('intitule'));
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
                });*/
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
            if (province) dr.province_code = helpers.decoupage.find(rec => rec.label === province).value;


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
                return models.SousDelegation.bulkCreate(require('../data/sousdelegationsmars2023.json'), { include: [{ model: models.Delegation, as: 'delegation' }], transaction: t })
            }).catch(function (err) {
                console.log(err)
            })
        }).then(function () {
            console.info('Imports From Google Sheets: DONE');
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
                return Promise.all(records.map(function (record, index) {
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
                }))
            })
        }).then(function () {
            console.info('Imports DONE');
        }).catch(function (err) {
            console.log('fails', err)
        })
    }
};
