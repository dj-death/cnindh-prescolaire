"use strict";

var config = require('../utils/config');
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

    apiUrl: (function() {
        var direct = config.direct;
        if (direct.relativeUrl) {
            return '';
        }

        var scheme = direct.protocol;
        var port = direct.port;
        return (scheme? scheme + '://' : '//') + direct.server + (port? ':' + port : '') + '/';
    }()),

    searchableAttributes: function(model) {
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

    sequelizeConcat: function(attributes, sequelize) {
        return sequelize.literal(attributes.map(function(value) {
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

    fetchFilters: function(params, model, defaults) {
        var field = params.field;
        if (!field) {
            throw errors.generate('Missing field argument');
        }

        var sequelize = model.sequelize;
        var column = field in model.tableAttributes? field : sequelize.col(field);
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

    idsFromParams: function(params) {
        var type = typeof(params);
        if (type === 'string') {
            return [ params ];
        }

        if (type === 'object') {
            if (params.id) {
                return [ params.id ];
            } else if (Array.isArray(params)) {
                return params.map(function(param) {
                    return param.id;
                });
            }
        }

        return [];
    },

    extractFields: function(inputs, names) {
        var fields = {};
        names.forEach(function(name) {
            if (inputs.hasOwnProperty(name)) {
                var value = inputs[name];
                if (value !== undefined) {
                    fields[name] = value;
                }
            }
        });
        return fields;
    },

    checkListAuthorization: function (user, params, maxRole) {
        const userRole = user.get('role');

        maxRole = typeof (maxRole) === 'undefined' ? 12 : maxRole;

        params['filter'] = params['filter'] || []

        if (userRole > maxRole || userRole < 10) {
            return false;
        } else if (userRole > 10) {
            const userRegion = user.get('region_code');
            const userProvince = user.get('province_code');

            var locationFilter = { property: '', value: '' }

            if (userRole === 11) {
                locationFilter.property = 'province_code';
                locationFilter.operator = 'in';

                const regionMatch = decoupageRegions.find(rec => rec.value == userRegion);
                locationFilter.value = regionMatch ? regionMatch.provinces : [];
            } else if (userRole === 12) {
                locationFilter.property = 'province_code'
                locationFilter.value = userProvince
            }

            if (locationFilter.value == null) {
                return false;
            }

            params.filter.push(locationFilter)
        }

        return params.filter;
    },

    checkModifyAuthorization: function (user, rec, maxRole) {
        if (Array.isArray(rec)) rec = rec[0];

        const userRole = user.get('role');
        maxRole = typeof (maxRole) === 'undefined' ? 12 : maxRole;

        if (userRole == 10) return true;
        else if (userRole > maxRole || userRole < 10) return false;

        if (userRole > 10) {
            const recProvince = typeof (rec.get) === 'function' ? rec.get('province_code') : rec.province_code;

            if (typeof(recProvince) === 'undefined') return true

            const userProvince = user.get('province_code');
            const userRegion = user.get('region_code');
            const regionMatch = decoupageRegions.find(rec => rec.value == userRegion);
            const userRegionProvinces = regionMatch ? regionMatch.provinces : [];

            return (userRole === 11 && userRegionProvinces.includes(recProvince)) ||
                (userRole === 12 && userProvince === recProvince);
        }

        return true;
    }
};

module.exports = Helpers;