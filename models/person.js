"use strict";

var errors = require('../utils/errors');
var helpers = require('../utils/helpers.js');
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Person", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true,
            validate: {
                isEmail: true
            }
        },
        username: {
            type: Sequelize.STRING,
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
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
        title: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true
        },

        device: {
            type: Sequelize.STRING,
            allowNull: true
        },

        role: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                notEmpty: true
            }
        },

        province_code: { type: Sequelize.INTEGER, allowNull: false },
        region_code: { type: Sequelize.INTEGER, allowNull: false },
        fondation_code: { type: Sequelize.INTEGER, allowNull: true }
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
