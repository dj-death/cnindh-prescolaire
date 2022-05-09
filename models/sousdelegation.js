"use strict";

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("SousDelegation", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        plan_actions: { type: DataTypes.STRING, allowNull: false },
        province_code: { type: DataTypes.INTEGER, allowNull: false },
        nbre_ups_concernees: { type: DataTypes.INTEGER },
        nbre_salles_concernees: { type: DataTypes.INTEGER },
        montant_effectif: { type: DataTypes.DECIMAL(10, 2) },
        montant_effectif2: { type: DataTypes.DECIMAL(10, 2) },
        observations: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: "sousdelegations"
    });

    Model.associate = function (models) {
        Model.belongsTo(models.Delegation, { as: 'delegation' });

        Model.addScope('browse', {
            attributes: {
                include: [
                    
                ]
            },
            include: []
        });
    };

    return Model;
};
