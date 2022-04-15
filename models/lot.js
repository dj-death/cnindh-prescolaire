"use strict";

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Lot", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        date_delegation: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        libelle: { type: DataTypes.STRING, allowNull: false, searchable: true },
        observations: { type: DataTypes.TEXT, allowNull: true }
    });

    Model.associate = function (models) {
        Model.hasMany(models.Delegation, { as: 'delegations' });

        Model.addScope('browse', {
            attributes: {
                include: [
                    //[sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.lot_id = Lot.id)'), 'montant_global'],
                    //[sequelize.literal('(SELECT COUNT(*) FROM Delegations WHERE Delegations.lot_id = Lot.id)'), 'delegationscount'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.delegation_id IN (select id FROM Delegations WHERE Delegations.lot_id = Lot.id))'), 'montant_effectif']
                ]
            },
            include: []
        });

        Model.addScope('nested', {
            attributes: {
                include: [
                    //[sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.lot_id = Lot.id)'), 'montant_global'],
                    //[sequelize.literal('(SELECT COUNT(*) FROM Delegations WHERE Delegations.lot_id = Lot.id)'), 'delegationscount'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.delegation_id IN (select id FROM Delegations WHERE Delegations.lot_id = Lot.id))'), 'montant_effectif']
                ]
            },
            include: [{
                model: models.Delegation,
                as: 'delegations',
                required: true,
                attributes: {
                    include: [
                        [sequelize.literal('(SELECT COUNT(*) FROM DelegationUnites WHERE DelegationUnites.delegation_id = delegations.id)'), 'unitescount'],
                        //[sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.delegation_id = delegations.id)'), 'montant_global'],
                        [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.id IN (SELECT unite_id FROM DelegationUnites WHERE DelegationUnites.delegation_id = delegations.id))'), 'sallescount'],
                        //[sequelize.literal('(SELECT COUNT(DISTINCT province_code) FROM Unites WHERE Unites.id IN (SELECT unite_id FROM DelegationUnites WHERE DelegationUnites.delegation_id = delegations.id))'), 'provincescount'],

                        [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.delegation_id = delegations.id)'), 'montant_effectif'],
                        [sequelize.literal('(SELECT COUNT(*) FROM SousDelegations WHERE SousDelegations.delegation_id = delegations.id)'), 'provincescount_effectif'],
                        //[sequelize.literal('(SELECT SUM(nbre_ups_concernees) FROM SousDelegations WHERE SousDelegations.delegation_id = delegations.id)'), 'unitescount_effectif'],
                        //[sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.delegation_id = delegations.id)'), 'sallescount_effectif']
                    ]
                }
            }]
        });
    };

    return Model;
};
