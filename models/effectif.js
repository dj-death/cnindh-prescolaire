"use strict";

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Effectif", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        annee_scolaire: { type:DataTypes.STRING, allowNull: false },
        ms_filles: { type: DataTypes.DECIMAL(3, 0), allowNull: true },
        ms_garcons: { type: DataTypes.DECIMAL(3, 0), allowNull: true },
        gs_filles: { type: DataTypes.DECIMAL(3, 0), allowNull: true },
        gs_garcons: { type: DataTypes.DECIMAL(3, 0), allowNull: true }
    });

    Model.associate = function (models) {
        Model.belongsTo(models.Unite, { as: 'unite' });

        Model.addScope('nested', {
            include: [
                { model: models.Unite, as: 'unite' }
            ]
        });
    };

    return Model;
};
