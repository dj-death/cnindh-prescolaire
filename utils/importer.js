var dataUtils = require('./data.js');


const { google } = require('googleapis');
const googleFolderId = "1HTMgMUJvVLVqa7abVRDYFCqI0XaOMibf"
const { v1 } = require('uuid')
const debounce = require('debounce-promise')
const { distance, closest } = require('fastest-levenshtein')
const helpers = require('./helpers')

const provinces = helpers.provinces
const emails = helpers.emails
const mappingPPRegions = helpers.mappingPPRegions

const debounceTimeMin = 15
const debounceTimeMs = debounceTimeMin * 60000


const latinize = require('latinize');

let auth = null
let subscription = null
let pageToken = null

var Importer = {
    drive: function (version) {
        return google.drive({ version: version || 'v2', auth })
    },

    authentificate: function () {
        auth = new google.auth.GoogleAuth({
            keyFile: "./credentials.json",
            scopes: [
                "https://www.googleapis.com/auth/spreadsheets", //readonly
                "https://www.googleapis.com/auth/drive"
            ]
        })

        return auth
    },

    addFiles: async () => {
        let i = 0, len = provinces.length, province;
        const _drive = module.exports.drive('v3')

        for (; i < len; i++) {
            province = provinces[i]

            try {
                const newFile = await _drive.files.copy({
                    fileId: '1f2kiSP9ikziEEZp4WJd-7TQKJqISbWC9AvmAMuhoxhQ',
                    fields: 'id',
                    requestBody: {
                        title: province,
                        name: province,
                        mimeType: "application/vnd.google-apps.spreadsheet",
                        parents: [googleFolderId]
                    }
                })

                const provinceEmail = emails[province]

                if (provinceEmail) {
                    await _drive.permissions.create({
                        fileId: newFile.data.id,
                        emailMessage: "CN-INDH Axe Préscolaire: Suite au mail du 21/02/2022, Veuillez trouver ci-dessous le lien de votre Tableau de bord en ligne pour le suivi hebdomadaire de la mise en œuvre des Plans d’Actions du Préscolaire",
                        sendNotificationEmail: true,
                        fields: 'id',
                        resource: {
                            type: 'user',
                            role: 'writer',
                            emailAddress: provinceEmail
                        }
                    })
                } else {
                    console.log('province with no mail')
                }

            } catch (err) {
                console.log(err)
            }

            /*await drive.files.update({
              fileId: newFile.data.id,
              fields: 'id',
              requestBody: {
                title: provinces[i],
                name: provinces[i]
              }
            });*/

            /*await drive.permissions.create({
              fileId: newSheet.data.spreadsheetId,
              transferOwnership: 'true',
              resource: {
                role: 'owner',
                type: 'user',
                emailAddress: 'application@cn-indh-prescolaire.iam.gserviceaccount.com'
              }
            });*/
        }
    },


    process: async () => {
        let records = []

        let today = new Date();
        today.setMinutes(today.getMinutes() - debounceTimeMin - 2)
        today.setSeconds(0)

        const filesResp = await module.exports.drive().files.list({
            q: `'${googleFolderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and modifiedDate >= '${today.toISOString()}'`
        })


        if (filesResp.data) {
            const files = filesResp.data.items
            let fIdx = 0, filesCount = files.length

            console.log(filesCount, today.toISOString())
            for (; fIdx < filesCount; fIdx++) {
                let file = files[fIdx]
                if (file.title.match(/modèle/i)) {
                    continue
                }

                console.log('processing ', file.title)

                try {
                    const results = await module.exports.loadReportingSheet(file)
                    records = records.concat(results)
                } catch (err) {
                    console.log(err)
                }
            }
        }

        return records
    },

    loadUPsSheet: async (file) => {
        console.log(file.title)

        let records = []
        const sheets = google.sheets({ version: "v4", auth });

        const meta = await sheets.spreadsheets.get({
            spreadsheetId: file.id
        })

        if (meta.data) {
            const feuilles = meta.data.sheets

            let i = 0
            const len = feuilles.length

            for (; i < len; i++) {
                const sheetName = feuilles[i].properties.title
                const values = await sheets.spreadsheets.values
                    .get({
                        spreadsheetId: file.id,
                        range: `'${sheetName}'`,
                        valueRenderOption: 'UNFORMATTED_VALUE'
                    })

                if (values.data) {
                    const rows = values.data.values;
                    const headers = rows.slice(1, 4)
                    const props = []

                    // Process Headers
                    const maxColumns = Math.max(...headers.map(hRow => hRow.length))

                    let x = 0
                    let combinedTitles
                    let prop

                    for (; x < maxColumns; x++) {
                        combinedTitles = headers.map(rowCells => {
                            let col = helpers.findNonEmpty(rowCells, x)

                            return col ? latinize(col.replace(/\s?(de l['’]up|\(.+\))\s?/gi, '').replace(/\s?( d['’]\s?| des? |-|\/|\\)\s?/ig, '_').replace(/\s/g, '_').toLowerCase()) : null
                        }).filter(val => !!val)

                        let prop = combinedTitles.join('_').replace(/_{2,}/g, '_').replace(/^_|_$/g, '').replace('rentree_scolaire', 'saison').replace('_homme_', '_')
                        switch (prop) {
                            case 'montant_global_delegue': prop = 'montant_delegue'; break;
                            case 'programmation_source': prop = 'programme'; break;
                            case 'cout_global_marches_travaux_y_compris_les_etudes': prop = 'cout_travaux'; break;
                            case 'taux_avancement': prop = 'tx_avancement_physique'; break;
                            case 'date_ouverture_effective_previsionnelle': prop = 'date_ouverture'; break;
                        }
                        props.push(prop)
                    }

                    //console.log(props)

                    const results = rows.slice(4).map((row, idx) => {
                        return props.reduce((acc, curr, idx) => {
                            acc[curr.trim().toLowerCase()] = typeof (row[idx]) !== 'string' ? row[idx] : (row[idx] ? row[idx].replace(/\s+/g, ' ').trim() : null)
                            return acc
                        }, {})
                    });

                    //console.log(filename, sheetName, results)

                    const annee = sheetName.replace(/\D/g, '')
                    records = records.concat(results.map(res => {
                        res.province = file.title.trim()
                        res.region = mappingPPRegions[res.province]
                        res.plan_actions = annee
                        res.douar_quartier = helpers.capitalizeFirstLetter(res.douar_quartier)
                        res.commune = helpers.capitalizeFirstLetter(res.commune)

                        if (res.fondation_partenaire) {
                            res.fondation_partenaire = res.fondation_partenaire.toUpperCase()
                        }

                        res.statut_latin = res.statut && latinize(res.statut)
                        res.date_situation = file.modifiedDate
                        res.modified_by = file.lastModifyingUser ? `${file.lastModifyingUser.displayName} ${file.lastModifyingUser.emailAddress}` : ''
                        return res
                    }))

                }
            }

        }

        return records
    },


    loadReportingSheet: async (file, sourceSheet) => {
        const sheets = google.sheets({ version: "v4", auth });
        let values

        try {
            values = await sheets.spreadsheets.values.get({
                spreadsheetId: file.id,
                range: "'Tableau de Bord'",
                valueRenderOption: 'UNFORMATTED_VALUE'
            })
        } catch (err) {
            const meta = await sheets.spreadsheets.get({
                spreadsheetId: file.id
            })

            if (meta.data) {
                values = await sheets.spreadsheets.values.get({
                    spreadsheetId: file.id,
                    range: `'${meta.data.sheets[0].properties.title}'`,
                    valueRenderOption: 'UNFORMATTED_VALUE'
                })
            }
        }


        if (values && values.data) {
            const rows = values.data.values;
            const props = [
                'plan_actions',
                'fondation_partenaire',
                'nbre_programmees',
                'nbre_programmees_t1',
                'nbre_programmees_t2',
                'nbre_programmees_t3',
                'nbre_programmees_amg',
                'nbre_non_demarrees',
                'nbre_encours_25',
                'nbre_encours_25_50',
                'nbre_encours_50_75',
                'nbre_encours_75',
                'nbre_achevees',
                'nbre_ouvertes',
                'nbre_encours_reception',
                'nbre_encours_equip',
                'nbre_encours_inscription',
                'prevision_mois0',
                'prevision_mois1',
                'prevision_mois2',
                'remarques'
            ]

            const propsPA21 = [
                'plan_actions',
                'fondation_partenaire',
                'nbre_programmees',
                'nbre_programmees_t1',
                'nbre_programmees_t2',
                'nbre_programmees_t3',
                'nbre_programmees_amg',
                'nbre_etudes_non_lancees',
                'nbre_etudes_lancees',
                'nbre_etudes_achevees',
                'nbre_marches_lances',
                'nbre_marches_adjuges',
                'cout_global_marches_travaux',
                'cout_unitaire_moyen_marches_travaux',
                'nbre_encours_25',
                'nbre_encours_25_50',
                'nbre_encours_50_75',
                'nbre_encours_75',
                'nbre_achevees',
                'remarques'
            ]


            // Process PA 20 et 21
            let results = rows.slice(4, 6).map((row, idx) => props.reduce((acc, curr, idx) => {
                const field = curr.trim().toLowerCase()
                acc[field] = typeof (row[idx]) !== 'string' ? row[idx] : (row[idx] ? row[idx].replace(/\s+/g, ' ').trim() : null)

                if (field.startsWith('nbre_') || field.startsWith('cout_') || field.startsWith('prevision_')) {
                    acc[field] = typeof (acc[field]) === 'string' ? acc[field].replace(/\s/g, '').replace(/,/, '.') : acc[field]
                    acc[field] = isNaN(acc[field]) && isNaN(parseFloat(acc[field])) ? null : acc[field]
                }

                return acc
            }, {}));
            const resultsPA21 = rows.slice(11, 12).map((row, idx) => propsPA21.reduce((acc, curr, idx) => {
                const field = curr.trim().toLowerCase()
                acc[field] = typeof (row[idx]) !== 'string' ? row[idx] : (row[idx] ? row[idx].replace(/\s+/g, ' ').trim() : null)

                if (field.startsWith('nbre_') || field.startsWith('cout_') || field.startsWith('prevision_')) {
                    acc[field] = typeof (acc[field]) === 'string' ? acc[field].replace(/\s/g, '').replace(/,/, '.') : acc[field]
                    acc[field] = isNaN(acc[field]) && isNaN(parseFloat(acc[field])) ? null : acc[field]
                }
                return acc
            }, {}));
            results = results.concat(resultsPA21)

            const nonEmptyRecords = results.map(res => {
                let province = file.title.trim()

                if (province && !provinces.includes(province)) {
                    /*const rgx = new RegExp(cleanStr(province), 'i')
                    province = provinces.find(prov => cleanStr(prov).match(rgx)) || province*/
                    province = closest(province, provinces)
                }

                res.province = province
                res.plan_actions = res.plan_actions.toString()
                res.region = mappingPPRegions[res.province]
                res.date_situation = file.modifiedDate
                res.modified_by = file.lastModifyingUser ? `${file.lastModifyingUser.displayName} ${file.lastModifyingUser.emailAddress}` : ''
                res.nbre_restantes = res.nbre_programmees - res.nbre_achevees

                //if (res.nbre_programmees_t3) delete res.nbre_programmees_t3
                return res
            }).filter(res => res.nbre_programmees > 0)

            if (nonEmptyRecords.length === 0) {
                console.log(file.title, ' +empty')
            }

            console.log(file.title, nonEmptyRecords.length)

            return nonEmptyRecords

        }

        return null
    },

    paste: async () => {
        const sheets = google.sheets({ version: "v4", auth });

        const sourceWb = (await sheets.spreadsheets.get({
            spreadsheetId: '1f2kiSP9ikziEEZp4WJd-7TQKJqISbWC9AvmAMuhoxhQ',
            ranges: ["'Tableau de Bord'!A3:W4", "'Tableau de Bord'!A10:V11"],
            includeGridData: true
        })).data

        const sourceSheet = sourceWb.sheets[0].data
        console.log(sourceSheet)

        await sheets.spreadsheets.batchUpdate({
            // The spreadsheet to apply the updates to.
            spreadsheetId: '16V9PDmCVDBvFmCnHosrd4HRCCC84GK1ib-_J1Pspoto',
            resource: {
                requests: [
                    {
                        "updateCells": {
                            "range": {
                                "sheetId": '903258977',
                                "startRowIndex": 2,
                                "endRowIndex": 4,
                                "startColumnIndex": 0,
                                "endColumnIndex": 23
                            },
                            "fields": "*",
                            "rows": sourceSheet[0].rowData
                        }
                    },
                    {
                        "updateCells": {
                            "range": {
                                "sheetId": '903258977',
                                "startRowIndex": 9,
                                "endRowIndex": 11,
                                "startColumnIndex": 0,
                                "endColumnIndex": 23
                            },
                            "fields": "*",
                            "rows": sourceSheet[1].rowData
                        }
                    }
                ]
            }
        })
    },

    cutPaste: async (spreadsheetId, doDelete) => {
        const sheets = google.sheets({ version: "v4", auth });


        const response = await sheets.spreadsheets.sheets.copyTo({
            // The ID of the spreadsheet containing the sheet to copy.
            spreadsheetId: '1f2kiSP9ikziEEZp4WJd-7TQKJqISbWC9AvmAMuhoxhQ',
            sheetId: '586492095',
            resource: {
                // The ID of the spreadsheet to copy the sheet to.
                destinationSpreadsheetId: spreadsheetId
            },

            auth
        })

        if (doDelete) {
            await sheets.spreadsheets.batchUpdate({
                // The spreadsheet to apply the updates to.
                spreadsheetId,
                resource: {
                    requests: [
                        {
                            deleteSheet: {
                                sheetId: '586492095'
                            }
                        }, {
                            "updateSheetProperties": {
                                "properties": {
                                    "sheetId": response.data.sheetId,
                                    "title": "Tableau de Bord"
                                },
                                "fields": "title",
                            }
                        }
                    ]
                }
            })
        }



    },

    changeProperty: async () => {
        const _drive = module.exports.drive('v3')

        const filesResp = await _drive.files.list({
            q: `'${googleFolderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and not 'med91.didi@gmail.com' in owners`
        })

        if (filesResp.data) {
            const files = filesResp.data.files
            let fIdx = 0, filesCount = files.length

            console.log(filesCount)

            for (; fIdx < filesCount; fIdx++) {
                let file = files[fIdx]
                if (file.name.match(/modèle/i)) {
                    continue
                }

                console.log(file.name)

                await _drive.permissions.create({
                    fileId: file.id,
                    transferOwnership: 'true',
                    resource: {
                        role: 'owner',
                        type: 'user',
                        emailAddress: 'med91.didi@gmail.com'
                    }
                });
            }
        }



    },

    shareFile: async (fileId, province) => {
        const _drive = module.exports.drive('v3')
        const provinceEmail = emails[province]

        if (provinceEmail) {
            try {
                await _drive.permissions.create({
                    fileId,
                    emailMessage: "CN-INDH Axe Préscolaire: Suite au mail du 21/02/2022, Veuillez trouver ci-dessous le lien de votre Tableau de bord en ligne pour le suivi hebdomadaire de la mise en œuvre des Plans d’Actions du Préscolaire",
                    sendNotificationEmail: true,
                    fields: 'id',
                    resource: {
                        type: 'user',
                        role: 'writer',
                        emailAddress: provinceEmail
                    }
                })

                console.log('shared with province: ', province)
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log('province with no mail: ', province)
        }
    },

    watch: async () => {
        const _drive = module.exports.drive()
        let r = await _drive.changes.getStartPageToken()
        const startPageToken = r.data.startPageToken

        var request = await _drive.changes.watch({
            startPageToken,
            pageSize: 1,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            //driveId: googleFolderId,
            requestBody: {
                id: v1(),
                type: 'web_hook',
                address: 'https://cnindh-prescolaire.herokuapp.com/drive-webhook',
                expiration: (process.env.NODE_ENV === 'production' ? null : 15 * 60000) + new Date().getTime() // one day later 86400000
            }
        })

        pageToken = startPageToken
        subscription = request.data

        process.on('SIGTERM', function () {
            module.exports.unwatch()
        })
    },

    unwatch: async () => {
        if (subscription) {
            const _drive = module.process.drive()
            const channels = _drive.channels
            await channels.stop({
                requestBody: {
                    id: subscription.id,
                    resourceId: subscription.resourceId
                }
            })

            console.log('unwatch')

            subscription = null
            pageToken = null
        }
    },

    listChanges: async () => {
        const _drive = module.exports.drive()
        let r = await _drive.changes.getStartPageToken()
        const startPageToken = r.data.startPageToken

        var request = await _drive.changes.list({
            startPageToken,
            pageSize: 10,
            includeItemsFromAllDrives: false,
            supportsAllDrives: false,
            spaces: 'drive',
            fields: '*'
        })

        pageToken = startPageToken
        subscription = request.data

        const changes = subscription.items.filter(sub => sub.changeType === 'file').map((sub) => {
            return {
                createdAt: sub.modificationDate,
                object: sub.file.title,
                subject: sub.id
            }
        })

        console.log(changes)


        for (let i = 0, len = changes.length; i < len; i++) {
            const change = await _drive.changes.get({
                changeId: changes[i].subject,
                fields: '*'
            })

            console.log(change.data)
        }

    },


    webhook: async (req, res, next) => {
        var params = req.body,
            result = {},
            unite;

        if (params.id) {
            console.log(params)

            try {
                debounceProcessChanges()
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(params)
        }

        res.sendStatus(200)
    }
    /*_processChanges: async (changeId) => {
        const change = await module.exports.drive().changes.get({
            changeId: changeId,
            fields: 'file.id'
        })

        console.log(change.data)

        if (change.data.file) {
            const results = await module.exports.loadReportingSheet(change.data.file)
            console.log(results)
            //dataUtils.upsertReportings(results)
        }
    }*/
}


module.exports = Importer
const debounceProcessChanges = debounce(function () {
    return module.exports.process().then((records) => {
        console.log(records.length)
        //data.insertUnites(records)
        return data.upsertReportings(records)
    })
}, debounceTimeMs, { leading: false })





/*
if (nonEmptyRecords.length === 0) {
                const meta = await sheets.spreadsheets.get({
                    spreadsheetId: file.id
                })

                if (meta.data) {
                    console.log(meta.data.sheets.map(sh => sh.properties.title))
                    if (meta.data.sheets.length === 2 && meta.data.sheets[1].properties.title.includes('Copie de')) {
                        console.log('duplicate', file.title)

                        try {
                            await sheets.spreadsheets.batchUpdate({
                                // The spreadsheet to apply the updates to.
                                spreadsheetId: file.id,
                                resource: {
                                    requests: [
                                        {
                                            deleteSheet: {
                                                sheetId: meta.data.sheets[1].properties.sheetId
                                            }
                                        }
                                    ]
                                }
                            })
                        } catch (err) {
                            console.log(err)
                        }
                    } else {
                        try {
                            await module.exports.cutPaste(file.id, true)
                        } catch (err) {

                        }
                    }


                }


            } else {
                console.log(file.title)
                await module.exports.cutPaste(file.id, false)
            }*/