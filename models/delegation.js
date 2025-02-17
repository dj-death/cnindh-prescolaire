"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Delegation", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        plan_actions: { type: Sequelize.STRING, allowNull: false },
        tranche_no: { type: Sequelize.INTEGER, allowNull: false },
        nature_affectation: { type: Sequelize.STRING, allowNull: false, searchable: true },
        date_delegation: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {
                isDate: true
            }
        },

        libelle: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true
        },
        nbre_mois_fonctionnement: { type: Sequelize.INTEGER, allowNull: true },
        est_effective: { type: Sequelize.BOOLEAN, defaultValue: false },
        observations: { type: Sequelize.TEXT, allowNull: true },
        montant_global: { type: Sequelize.DECIMAL(10, 2) },

        unites_list: {
            type: Sequelize.TEXT,
            allowNull: true,
            get: function () {
                return JSON.parse(this.getDataValue('unites_list'));
            },
            set: function (value) {
                return this.setDataValue('unites_list', JSON.stringify(value));
            }
        }
    });

    Model.associate = function (models) {
        Model.belongsTo(models.Lot, { as: 'lot' });
        Model.hasMany(models.SousDelegation, { as: 'sousdelegations' });

        Model.belongsToMany(models.Unite, {
            through: models.DelegationUnites,
            as: 'unites',
            foreignKey: 'delegation_id',
            otherKey: 'unite_id'
        });

        Model.addScope('browse', {
            attributes: {
                include: [
                    //[sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.delegation_id = Delegation.id)'), 'montant_global'],
                    [sequelize.literal('(SELECT COUNT(*) FROM DelegationUnites WHERE DelegationUnites.delegation_id = Delegation.id)'), 'unitescount'],
                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.id IN (SELECT unite_id FROM DelegationUnites WHERE DelegationUnites.delegation_id = Delegation.id))'), 'sallescount'],
                    [sequelize.literal('(SELECT COUNT(DISTINCT province_code) FROM Unites WHERE Unites.id IN (SELECT unite_id FROM DelegationUnites WHERE DelegationUnites.delegation_id = Delegation.id))'), 'provincescount'],

                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'montant_effectif'],
                    [sequelize.literal('(SELECT COUNT(*) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'provincescount_effectif'],
                    //[sequelize.literal('(SELECT SUM(nbre_ups_concernees) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'unitescount_effectif'],
                    //[sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'sallescount_effectif']
                ]
            },
            include: [/*
                { 
                    model: models.Lot,
                    as: 'lot',
                    attributes: [
                        'id', 'libelle'
                    ]
                },
                { 
                    model: models.SousDelegation,
                    as: 'sousdelegations'
                }*/
            ]
        });

        Model.addScope('nested', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM DelegationUnites WHERE DelegationUnites.delegation_id = Delegation.id)'), 'unitescount'],
                    //[sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.delegation_id = Delegation.id)'), 'montant_global'],
                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.id IN (SELECT unite_id FROM DelegationUnites WHERE DelegationUnites.delegation_id = Delegation.id))'), 'sallescount'],
                    //[sequelize.literal('(SELECT COUNT(DISTINCT province_code) FROM Unites WHERE Unites.id IN (SELECT unite_id FROM DelegationUnites WHERE DelegationUnites.delegation_id = Delegation.id))'), 'provincescount'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'montant_effectif'],
                    [sequelize.literal('(SELECT COUNT(*) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'provincescount_effectif'],

                    /*[sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'montant_effectif'],
                    [sequelize.literal('(SELECT COUNT(*) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'provincescount_effectif'],
                    [sequelize.literal('(SELECT SUM(nbre_ups_concernees) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'unitescount_effectif'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.delegation_id = Delegation.id)'), 'sallescount_effectif']*/
                ]
            },
            include: [
                /*{ 
                    model: models.Unite,
                    as: 'unites',
                    attributes: [
                        'id', 'province_code', 'plan_actions', 'fp_code', 'commune_code', 'intitule', 'nbre_salles', 'est_ouverte', 'est_resiliee', 'date_ouverture'
                    ],

                    through: { attributes: ['id', 'montant', 'delegation_id' ] }
                },*/
                { 
                    model: models.Lot,
                    as: 'lot',
                    attributes: [
                        'id', 'libelle'
                    ]
                },
                /*{ 
                    model: models.SousDelegation,
                    as: 'sousdelegations',

                    attributes: [
                        'province_code', 'montant_effectif', 'observations'
                    ]
                }*/
            ]
        });
    };

    return Model;
};
