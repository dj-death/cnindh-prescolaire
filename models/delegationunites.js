"use strict";

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("DelegationUnites", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        lot_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        delegation_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        unite_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        montant: { type: DataTypes.DECIMAL(10, 2) }

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
                        'id', 'province_code', 'plan_actions', 'fondation_partenaire', 'commune', 'douar_quartier', 'intitule', 'nbre_salles', 'nbre_salles_ouvertes', 'est_ouverte', 'est_resiliee', 'est_en_arret', 'date_ouverture'
                    ]
                },
                { model: models.Delegation, as: 'delegation' }]
        });
    };

    return Model;
};
