"use strict";

const config = require('../utils/config');
const latinize = require('latinize');
const moment = require('moment');

const decoupage = [
    {
        "value": 1,
        "label": "Tanger-Assilah",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS",
        "email": "Wdas.tanger@gmail.com"
    },
    {
        "value": 2,
        "label": "M’diq-Fnideq",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS"
    },
    {
        "value": 3,
        "label": "Tétouan",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS",
        "email": "brirhetm@gmail.com"
    },
    {
        "value": 4,
        "label": "Fahs-Anjra",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS",
        "email": "Tassammite.mohammed@gmail.com"
    },
    {
        "value": 5,
        "label": "Larache",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FZ",
        "email": "Taimi.outhman@gmail.com"
    },
    {
        "value": 6,
        "label": "Al Hoceima",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS",
        "email": "dasalhoceima@gmail.com"
    },
    {
        "value": 7,
        "label": "Chefchaouen",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FZ",
        "email": "mrinimd@gmail.com"
    },
    {
        "value": 8,
        "label": "Ouezzane",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS"
    },
    {
        "value": 9,
        "label": "Oujda-Angad",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "Hafida.mi@hotmail.fr"
    },
    {
        "value": 10,
        "label": "Nador",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "mohamedwariachi@yahoo.fr"
    },
    {
        "value": 11,
        "label": "Driouch",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "Abdellaari@gmail.com"
    },
    {
        "value": 12,
        "label": "Jerada",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "Jalal.tagmouti@gmail.com"
    },
    {
        "value": 13,
        "label": "Berkane",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FZ",
        "email": "Mohammed.mimouni@hotmail.com"
    },
    {
        "value": 14,
        "label": "Taourirt",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "AKHTIB@taourirt.interieur.gov.ma"
    },
    {
        "value": 15,
        "label": "Guercif",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "dasguercif@gmail.com"
    },
    {
        "value": 16,
        "label": "Figuig",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "dassgprfiguig@yahoo.fr"
    },
    {
        "value": 17,
        "label": "Fès",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "ramibahae@yahoo.fr"
    },
    {
        "value": 18,
        "label": "Meknès",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "dasmeknes@gmail.com"
    },
    {
        "value": 19,
        "label": "El Hajeb",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "daselhajeb@yahoo.fr"
    },
    {
        "value": 20,
        "label": "Ifrane",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": ""
    },
    {
        "value": 21,
        "label": "Moulay Yacoub",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "dasmyyacoub@gmail.com"
    },
    {
        "value": 22,
        "label": "Sefrou",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": ""
    },
    {
        "value": 23,
        "label": "Boulemane",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "dascomboulemane@gmail.com"
    },
    {
        "value": 24,
        "label": "Taounate",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "aminaoufal@gmail.com"
    },
    {
        "value": 25,
        "label": "Taza",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "Abdelkrim.mouhoute@gmail.com"
    },
    {
        "value": 26,
        "label": "Rabat",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "email": "mbellakbircharfi@rabat.interieur.gov.ma"
    },
    {
        "value": 27,
        "label": "Salé",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FZ",
        "email": ""
    },
    {
        "value": 28,
        "label": "Skhirate-Témara",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FMPS",
        "email": "rguignaoual@hotmail.com/ addi.afnane@gmail.com"
    },
    {
        "value": 29,
        "label": "Kénitra",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FMPS",
        "email": "ebtissamwilaya@gmail.com"
    },
    {
        "value": 30,
        "label": "Khémisset",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FMPS",
        "email": "Dassfrc05@gmail.com"
    },
    {
        "value": 31,
        "label": "Sidi Kacem",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FZ",
        "email": ""
    },
    {
        "value": 32,
        "label": "Sidi Slimane",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FMPS",
        "email": "Das.sidislimane@gmail.com"
    },
    {
        "value": 33,
        "label": "Béni Mellal",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FMPS",
        "email": "Jaberabderrahman@yahoo.fr"
    },
    {
        "value": 34,
        "label": "Azilal",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FMPS",
        "email": "azilaldas@gmail.com"
    },
    {
        "value": 35,
        "label": "Fquih Ben Salah",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FZ",
        "email": "larbi.bouabidi@gmail.com"
    },
    {
        "value": 36,
        "label": "Khénifra",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FMPS",
        "email": "Ziani_das@yahoo.fr"
    },
    {
        "value": 37,
        "label": "Khouribga",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FZ",
        "email": "daskhouribga@gmail.com"
    },
    {
        "value": 38,
        "label": "Casablanca",
        "region_code": 5,
        "region": "Casablanca-Settat"
    },
    {
        "value": 39,
        "label": "Mohammadia",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FZ"
    },
    {
        "value": 40,
        "label": "El Jadida",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "m.houboub@gmail.com"
    },
    {
        "value": 41,
        "label": "Nouaceur",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "Das.prnouaceur@gmail.com"
    },
    {
        "value": 42,
        "label": "Médiouna",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS"
    },
    {
        "value": 43,
        "label": "Benslimane",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "hassandas@gmail.com"
    },
    {
        "value": 44,
        "label": "Berrechid",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "das.berrechid@gmail.com"
    },
    {
        "value": 45,
        "label": "Settat",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FZ",
        "email": "dasettat@gmail.com"
    },
    {
        "value": 46,
        "label": "Sidi Bennour",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "Indh.sidibennour@gmail.com"
    },
    {
        "value": 47,
        "label": "Marrakech",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "Anouar.dbira@gmail.com"
    },
    {
        "value": 48,
        "label": "Chichaoua",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FZ",
        "email": "Loudinisa1966@gmail.com"
    },
    {
        "value": 49,
        "label": "Al Haouz",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "dashaouz@gmail.com"
    },
    {
        "value": 50,
        "label": "El Kelâa des Sraghna",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FZ",
        "email": "m002siraj@yahoo.fr"
    },
    {
        "value": 51,
        "label": "Essaouira",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "khairiprovince@gmail.com"
    },
    {
        "value": 52,
        "label": "Rehamna",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "dasrhamna@gmail.com"
    },
    {
        "value": 53,
        "label": "Safi",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "mi.dassafi@gmail.com"
    },
    {
        "value": 54,
        "label": "Youssoufia",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "dasprovinceyoussoufia@gmail.com"
    },
    {
        "value": 55,
        "label": "Errachidia",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "tzeggwagh@gmail.com"
    },
    {
        "value": 56,
        "label": "Ouarzazate",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "dasouarzazate@gmail.com"
    },
    {
        "value": 57,
        "label": "Midelt",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "dasmidelt@gmail.com"
    },
    {
        "value": 58,
        "label": "Tinghir",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "indhtinghir@gmail.com"
    },
    {
        "value": 59,
        "label": "Zagora",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "hassanbtb@gmail.com"
    },
    {
        "value": 60,
        "label": "Agadir-Ida-Ou-Tanane",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FMPS",
        "email": "benkiranesaloua@gmail.com"
    },
    {
        "value": 61,
        "label": "Inezgane-Aït Melloul",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FMPS",
        "email": "draissislimane@gmail.com"
    },
    {
        "value": 62,
        "label": "Chtouka-Aït Baha",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FZ",
        "email": "Das.chtouka@gmail.com"
    },
    {
        "value": 63,
        "label": "Taroudannt",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FZ",
        "email": "dastaroudannt@taroudann.interieur.gov.ma"
    },
    {
        "value": 64,
        "label": "Tiznit",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FZ",
        "email": "dastiznit@gmail.com"
    },
    {
        "value": 65,
        "label": "Tata",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FZ",
        "email": "Mkhaldi6@gmail.com"
    },
    {
        "value": 66,
        "label": "Guelmim",
        "region_code": 9,
        "region": "Guelmim-Oued Noun",
        "fp": "FMPS",
        "email": "M.joumani@gmail.com"
    },
    {
        "value": 67,
        "label": "Assa-Zag",
        "region_code": 9,
        "region": "Guelmim-Oued Noun",
        "fp": "FMPS",
        "email": ""
    },
    {
        "value": 68,
        "label": "Tan-Tan",
        "region_code": 9,
        "region": "Guelmim-Oued Noun",
        "fp": "FMPS",
        "email": "dastantan@yahoo.fr"
    },
    {
        "value": 69,
        "label": "Sidi Ifni",
        "region_code": 9,
        "region": "Guelmim-Oued Noun",
        "fp": "FMPS",
        "email": "dassidiifni@gmail.com"
    },
    {
        "value": 70,
        "label": "Laâyoune",
        "region_code": 10,
        "region": "Laâyoune-Sakia Al Hamra",
        "fp": "FMPS",
        "email": "dailadaila1972@gmail.com"
    },
    {
        "value": 71,
        "label": "Boujdour",
        "region_code": 10,
        "region": "Laâyoune-Sakia Al Hamra",
        "fp": "FMPS",
        "email": "boujdourprovince@yahoo.fr"
    },
    {
        "value": 72,
        "label": "Tarfaya",
        "region_code": 10,
        "region": "Laâyoune-Sakia Al Hamra",
        "fp": "FMPS",
        "email": "Talbi.hasanna@gmail.com"
    },
    {
        "value": 73,
        "label": "Es-Semara",
        "region_code": 10,
        "region": "Laâyoune-Sakia Al Hamra",
        "email": ""
    },
    {
        "value": 74,
        "label": "Oued Ed-Dahab",
        "region_code": 11,
        "region": "Dakhla-Oued Eddahab",
        "fp": "FMPS",
        "email": "DAS@ouededdahab.interieur.gov.ma"
    },
    {
        "value": 75,
        "label": "Aousserd",
        "region_code": 11,
        "region": "Dakhla-Oued Eddahab",
        "fp": "FMPS",
        "email": "dasprovinceaousserd@gmail.com"
    }
];

const decoupageRegions = [
    {
        "value": 0,
        "label": "Tanger-Tétouan-Al Hoceima",
        "provinces": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8
        ]
    },
    {
        "value": 1,
        "label": "L’Oriental",
        "provinces": [
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16
        ]
    },
    {
        "value": 2,
        "label": "Fès-Meknès",
        "provinces": [
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25
        ]
    },
    {
        "value": 3,
        "label": "Rabat-Salé-Kénitra",
        "provinces": [
            26,
            27,
            28,
            29,
            30,
            31,
            32
        ]
    },
    {
        "value": 4,
        "label": "Beni Mellal-Khénifra",
        "provinces": [
            33,
            34,
            35,
            36,
            37
        ]
    },
    {
        "value": 5,
        "label": "Casablanca-Settat",
        "provinces": [
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46
        ]
    },
    {
        "value": 6,
        "label": "Marrakech-Safi",
        "provinces": [
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54
        ]
    },
    {
        "value": 7,
        "label": "Drâa-Tafilalet",
        "provinces": [
            55,
            56,
            57,
            58,
            59
        ]
    },
    {
        "value": 8,
        "label": "Souss-Massa",
        "provinces": [
            60,
            61,
            62,
            63,
            64,
            65
        ]
    },
    {
        "value": 9,
        "label": "Guelmim-Oued Noun",
        "provinces": [
            66,
            67,
            68,
            69
        ]
    },
    {
        "value": 10,
        "label": "Laâyoune-Sakia Al Hamra",
        "provinces": [
            70,
            71,
            72,
            73
        ]
    },
    {
        "value": 11,
        "label": "Dakhla-Oued Eddahab",
        "provinces": [
            74,
            75
        ]
    }
];


var Helpers = {
    decoupage,
    decoupageRegions,
    provinces: decoupage.map(pp => pp.label),
    regions: decoupageRegions.map(pp => pp.label),
    fondations: ['FMPS', 'FZ'],
    apiUrl: (function () {
        var direct = config.direct;
        if (direct.relativeUrl) {
            return '';
        }

        var scheme = direct.protocol;
        var port = direct.port;
        return (scheme ? scheme + '://' : '//') + direct.server + (port ? ':' + port : '') + '/';
    }()),

    searchableAttributes: function (model) {
        var attributes = model.tableAttributes || [];
        var keys = Object.keys(attributes);
        var result = [];
        var key;

        for (var i = 0, ilen = keys.length; i < ilen; ++i) {
            key = keys[i];
            if (attributes[key].searchable) {
                result.push(key);
            }
        }

        return result;
    },

    // [TODO] advanced search:
    // regex: /(?:(\w+):(?:"([^"]+)"|([^"\s]*)))|(?:"([^"]+)"|([^\s]+))/g

    sequelizeConcat: function (attributes, sequelize) {
        return sequelize.literal(attributes.map(function (value) {
            return sequelize.escape(sequelize.col(value))
        }).join(' || " " || '));
    },

    sequelizify: function (params, model, defaults) {

        var query = defaults || {};
        var me = this;

        if (params.id) {
            query.where = query.where || {};
            query.where.id = params.id;
        }

        if (params.filter) {
            query.where = query.where || {};
            params.filter.forEach(function (filter) {
                var prop = filter.property;
                var value = filter.value;
                var cond = null;

                if (prop === '#search') {
                    // Special case for the "#search" property
                    prop = '$or';
                    cond = me.searchableAttributes(model).map(function (attr) {
                        return { [attr]: { $iLike: '%' + value + '%' } };
                    });
                } else {

                    switch (filter.operator) {
                        case '<': cond = { $lt: value }; break;
                        case '<=': cond = { $lte: value }; break;
                        case '>=': cond = { $gte: value }; break;
                        case '>': cond = { $gt: value }; break;
                        case '!=': cond = { $ne: value }; break;
                        case 'in': cond = { $in: value }; break;
                        case 'notin': cond = { $notIn: value }; break;
                        case 'like': cond = { $iLike: value }; break;
                        case 'notlike': cond = { $notLike: value }; break;

                        case 'between': cond = { $between: value }; break;

                        //case '/=' // NOT SUPPORTED!
                        //case '=':
                        default:
                            cond = value;
                            break;
                    }

                    if (/*!model.tableAttributes ||*/ !(prop in model.tableAttributes)) {
                        // let's try in another table:
                        // https://github.com/sequelize/sequelize/issues/3095#issuecomment-149277205
                        prop = '$' + prop + '$';
                    }


                }

                query.where[prop] = cond;
            });

        }

        if (params.sort) {
            query.order = query.order || [];
            params.sort.forEach(function (sorter) {
                var prop = sorter.property;
                query.order.push([
                    prop in model.tableAttributes ? prop : model.sequelize.col(prop),
                    sorter.direction
                ]);
            });
        }

        if (params.group) {
            query.group = params.group.property;
        }

        if (params.start) {
            query.offset = params.start;
        }

        if (params.limit) {
            query.limit = params.limit;
        }

        return query;
    },


    fetchFilters: function (params, model, defaults) {
        var field = params.field;
        if (!field) {
            throw errors.generate('Missing field argument');
        }

        var searched = params.query && params.query[0];

        if (searched) {
            params.filter = [{
                //property: '#search',
                property: params.label,
                operator: 'like',
                value: '%' + searched + '%'
            }];
        }

        var sequelize = model.sequelize;

        var column = field in model.tableAttributes ? field : sequelize.col(field);
        var label = this.sequelizeConcat([].concat(params.label || field), sequelize);
        var query = this.sequelizify(params, model, Object.assign(defaults || {}, {
            attributes: [[label, 'label'], [column, 'value']],
            group: [column],
            distinct: true,
            plain: false,

            include: [{
                all: true,
                nested: true,
                attributes: []
            }]
        }));

        return model.aggregate(model.name + '.id', 'count', query);
    },

    idsFromParams: function (params) {
        var type = typeof (params);
        if (type === 'string') {
            return [params];
        }

        if (type === 'object') {
            if (params.id) {
                return [params.id];
            } else if (Array.isArray(params)) {
                return params.map(function (param) {
                    return param.id
                });
            }
        }

        return [];
    },

    cleanStr: function (str, doRemoveDigits, replPattern) {
        doRemoveDigits = doRemoveDigits === undefined ? true : doRemoveDigits
        replPattern = replPattern === undefined ? ' ' : replPattern

        const rgx = doRemoveDigits ? /[^a-z]/ig : /[^a-z0-9_]/ig

        str = latinize(str.toLowerCase())
        str = str.replace(rgx, replPattern)
        return str.trim()
    },

    variablize: function (col, doRemoveDigits, replPattern) {
        if (!col) return null

        col = module.exports.cleanStr(col, doRemoveDigits, replPattern)
        col = col.replace(/\s?(de l['’]up|\(.+\))\s?/gi, '')
        col = col.replace(/\s?( d['’]\s?| des? |-|\/|\\)\s?/ig, '_')
        col = col.replace(/\s/g, '_')
        col = col.replace(/^_|_$/g, '')
        col = col.replace(/_{2,}/g, '_')

        return col
    },

    capitalizeFirstLetter: function (str) {
        return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
    },

    titleCase: function (str) {
        return typeof (str) === 'string' ? str.toLowerCase().split(' ').map(function (word) {
            return word ? word.replace(word[0], word[0].toUpperCase()) : ''
        }).join(' ') : ''
    },


    findNonEmpty: function (arr, idx) {
        const len = arr.length
        let val

        do {
            val = arr[idx--]
        } while (!val && idx >= 0)

        return val ? val.toString() : ''
    },

    parseBoolean: function (val) {
        if (val == null || val === '') return false;

        if (!isNaN(val)) return !!parseInt(val);

        if (/\boui\b/i.test(val)) return true;
        if (/\bnon\b/i.test(val)) return false;
        return null;
    },

    extractDate: function (val) {
        if (!val) return null
        if (val instanceof Date) {
            return val.getTime() !== val.getTime() ? null : val;
        }

        if (val.includes('&')) {
            val = val.split('&')[1].trim();
        }

        if (val.includes('et')) {
            val = val.split('et')[1].trim();
        }

        const parsed = moment(val, ["YYYY-MM-DD HH:mm:ss.SSS", "DD/MM/YYYY"], 'fr');
        if (parsed.isValid()) return parsed.utc(true).toDate();

        if (/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2})\:(\d{2})\:(\d{2})/.test(val)) return new Date(val);

        let result = val.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}");

        let dateSplitted;
        let day, month, year, aux;

        if (null != result) {
            dateSplitted = result[0].split(result[1]);
            day = dateSplitted[0];
            month = dateSplitted[1];
            year = dateSplitted[2];
        }

        if (month > 12) {
            aux = day;
            day = month;
            month = aux;
        }

        const dt = new Date(year, month - 1, day, 8, 0, 0, 0);
        return dt.getTime() !== dt.getTime() ? null : dt
    },

    // Accepts the array and key
    groupBy: function (array, key) {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    },


    checkListAuthorization: function (user, params, maxRole) {
        const userRole = user.get('role');

        maxRole = typeof (maxRole) === 'undefined' ? 3 : maxRole;

        if (userRole > maxRole) {
            return false;
        } else if (userRole > 1) {
            const userRegion = user.get('region_code');
            const userProvince = user.get('province_code');
            const userFP = user.get('fondation');
            
            var locationFilter = { property: '', value: '' }

            params['filter'] = params['filter'] || []

            if (userRole === 2) {
                locationFilter.property = 'province_code';
                locationFilter.operator = 'in';

                const regionMatch = decoupageRegions.find(rec => rec.value == userRegion);
                locationFilter.value = regionMatch ? regionMatch.provinces : [];
            } else if (userRole === 3) {
                locationFilter.property = 'province_code'
                locationFilter.value = userProvince
            } else if (userRole === 4) {
                locationFilter.property = 'fondation_partenaire'
                locationFilter.value = userFP
            }

            if (locationFilter.value == null) {
                return false;
            }

            console.log(locationFilter)
            params.filter.push(locationFilter)
        }

        return params.filter;
    },

    checkModifyAuthorization: function (user, rec, maxRole) {
        if (Array.isArray(rec)) rec = rec[0];

        const userRole = user.get('role');
        maxRole = typeof (maxRole) === 'undefined' ? 3 : maxRole;

        if (userRole <= 1) return true;
        else if (userRole > maxRole) return false;

        if (userRole > 1) {
            const recProvince = typeof (rec.get) === 'function' ? rec.get('province_code') : rec.province_code;
            const recFP = typeof (rec.get) === 'function' ? rec.get('fondation_partenaire') : rec.fondation_partenaire;

            const userProvince = user.get('province_code');
            const userRegion = user.get('region_code');
            const regionMatch = decoupageRegions.find(rec => rec.value == userRegion);
            const userRegionProvinces = regionMatch ? regionMatch.provinces : [];
            const userFP = user.get('fondation');

            return (userRole === 2 && userRegionProvinces.includes(recProvince)) ||
                (userRole === 3 && userProvince === recProvince) ||
                (userRole === 4 && userFP === recFP);
        }

        return true;
    }
};

module.exports = Helpers;
