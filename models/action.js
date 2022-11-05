"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Action", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
        subject: {
            type: Sequelize.STRING,
            searchable: true,
            /*validate: {
                notEmpty: true
            }*/
        },
        object: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
    }, {
        //freezeTableName: true
    });

    Model.associate = function (models) {
        Model.belongsTo(models.Person, { as: 'person', constraints: false });

        Model.addScope('browse', {
            include: []
        });

        Model.addScope('nested', {
            include: [{
                model: models.Person,
                as: 'person'
            }]
        });
    };

    Model.noCache = true;

    return Model;
};
