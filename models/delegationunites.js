"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("DelegationUnites", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        lot_id: {
            type: Sequelize.UUID,
            allowNull: false
        },

        delegation_id: {
            type: Sequelize.UUID,
            allowNull: false
        },

        unite_id: {
            type: Sequelize.UUID,
            allowNull: false
        },

        montant: { type: Sequelize.DECIMAL(10, 2) }

    }, {
        tableName: "delegationunites"
    });

    Model.associate = function (models) {
        Model.belongsTo(models.Unite, { as: 'unite' });
        Model.belongsTo(models.Delegation, { as: 'delegation' });
        Model.belongsTo(models.Lot, { as: 'lot' });

        Model.addScope('browse', {
            attributes: {
                include: []
            },

            include: []
        });

        Model.addScope('nested', {
            attributes: {
                include: []
            },

            include: [
                {
                    model: models.Unite,
                    as: 'unite',
                    attributes: [
                        'id', 'province_code', 'plan_actions', 'fp_code', 'commune_code', 'douar_quartier', 'intitule', 'nbre_salles', 'nbre_salles_ouvertes', 'est_ouverte', 'est_resiliee', 'est_en_arret', 'date_ouverture'
                    ]
                },
                { model: models.Delegation, as: 'delegation' }]
        });
    };

    return Model;
};
