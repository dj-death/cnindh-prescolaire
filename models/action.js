"use strict";

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Action", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
        subject: {
            type: DataTypes.STRING,
            searchable: true,
            /*validate: {
                notEmpty: true
            }*/
        },
        object: {
            type: DataTypes.STRING,
            allowNull: true,
            searchable: true,
            validate: {
                notEmpty: true
            }
        },
        author: {
            type: DataTypes.STRING,
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
