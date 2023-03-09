"use strict";
const { Sequelize } = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var Model = sequelize.define("Commune", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        code_hcp: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true
        },

        province_code: {
            type: Sequelize.INTEGER,
            allowNull: false,
            searchable: false
        },

        cercle_code: {
            type: Sequelize.INTEGER,
            allowNull: true,
            searchable: false
        },

        est_rural: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },

        label: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true
        },

        label_ar: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true
        },
       
        alt_label: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true
        }      
    });

    Model.associate = function (models) {
        Model.hasMany(models.Unite, { as: 'unites', foreignKey: 'commune_code', sourceKey: 'id' });

        Model.addScope('browse', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.commune_code = Commune.id AND Unites.est_resiliee = FALSE AND Unites.plan_actions <> \'2023\')'), 'nbre_ups_programmees'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.commune_code = Commune.id AND Unites.est_resiliee = FALSE AND Unites.est_ouverte = TRUE AND Unites.plan_actions <> \'2023\')'), 'nbre_ups_ouvertes'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.commune_code = Commune.id AND Unites.plan_actions = \'2023\')'), 'nbre_ups_programmees2023'],
                ]
            }
        });

        Model.addScope('nested', {
            include: [
                { 
                    model: models.Unite,
                    as: 'unites', 
                    attributes: [
                        'id', 'province_code', 'plan_actions', 'fp_code', 'commune_code', 'intitule', 'nbre_salles', 'est_ouverte', 'est_resiliee', 'date_ouverture'
                    ]
                }
            ]
        });
    };

    return Model;
};
