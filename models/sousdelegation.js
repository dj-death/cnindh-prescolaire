"use strict";
const { Sequelize } = require("sequelize");



module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("SousDelegation", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        province_code: { type: Sequelize.INTEGER, allowNull: false },
        nbre_ups_concernees: { type: Sequelize.INTEGER },
        nbre_salles_concernees: { type: Sequelize.INTEGER },
        est_complement: { type: Sequelize.BOOLEAN,  allowNull: false, defaultValue: false },
        credits_restitues: { type: Sequelize.BOOLEAN,  allowNull: false, defaultValue: false },
        nbre_t1: { type: Sequelize.INTEGER },
        nbre_t2: { type: Sequelize.INTEGER },
        nbre_t3: { type: Sequelize.INTEGER },
        nbre_amg: { type: Sequelize.INTEGER },
        nbre_modulaire: { type: Sequelize.INTEGER },

        nbre_ups_ouvertes: { type: Sequelize.INTEGER },
        nbre_ups_achevees: { type: Sequelize.INTEGER },
        nbre_ups_encours: { type: Sequelize.INTEGER },

        montant_effectif: { type: Sequelize.DECIMAL(10, 2) },
        //montant_effectif2: { type: Sequelize.DECIMAL(10, 2) },
        observations: { type: Sequelize.TEXT, allowNull: true }
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
            include: [{ 
                model: models.Delegation,
                as: 'delegation',
                attributes: [
                    'id', 'libelle', 'plan_actions', 'nature_affectation', 'date_delegation', 'tranche_no'
                ]
            }]
        });

        Model.addScope('nested', {
            attributes: {
                include: [
                ]
            },
            
            include: [{ 
                model: models.Delegation,
                as: 'delegation',
                attributes: [
                    'id', 'libelle', 'plan_actions', 'nature_affectation', 'date_delegation', 'tranche_no'
                ]
            }]
        });
    };

    return Model;
};
