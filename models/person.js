"use strict";

var errors = require('../utils/errors');
var helpers = require('../utils/helpers.js');

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Person", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            searchable: true,
            validate: {
                isEmail: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            searchable: true,
            unique: {
                msg: 'This username is already taken.'
            },
            validate: {
                len: 6
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
            searchable: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            searchable: true
        },

        device: {
            type: DataTypes.STRING,
            allowNull: true
        },

        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                notEmpty: true
            }
        },

        province_code: { type: DataTypes.INTEGER, allowNull: false },
        region_code: { type: DataTypes.INTEGER, allowNull: false },

        fondation: {
            type: DataTypes.STRING,
            searchable: true,
            allowNull: true
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: ['password']
            }
        }

    }, {
        //freezeTableName: true
    });

    Model.associate = function (models) {
        Model.hasMany(models.Action, { as: 'actions' });
        Model.addScope('browse', {
            attributes: {
                exclude: ['password']
            }
        });

        Model.addScope('nested', {
            attributes: {
                exclude: ['password']
            }
        });
    };

    Model.lookup = function (identifier) {
        return this.findOne({
            where: {
                $or: [
                    { id: identifier },
                    { username: identifier },
                    { email: identifier }
                ]
            }
        }).then(function (row) {
            if (!row) {
                throw errors.generate('Unknown person with id/username/email: ' + identifier);
            }

            return row;
        });
    };

    return Model;
};
