"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Effectif", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        annee_scolaire: { type:Sequelize.STRING, allowNull: false },
        ms_filles: { type: Sequelize.DECIMAL(3, 0), allowNull: true },
        ms_garcons: { type: Sequelize.DECIMAL(3, 0), allowNull: true },
        gs_filles: { type: Sequelize.DECIMAL(3, 0), allowNull: true },
        gs_garcons: { type: Sequelize.DECIMAL(3, 0), allowNull: true },
        inscrits_primaire_total: { type: Sequelize.INTEGER },
        inscrits_primaire_filles: { type: Sequelize.INTEGER },
        inscrits_primaire_garcons: { type: Sequelize.INTEGER },
        ms_passe_gs: { type: Sequelize.INTEGER },
        ms_reinscrit_ms: { type: Sequelize.INTEGER },
        ms_passe_primaire: { type: Sequelize.INTEGER },
        gs_primaire: { type: Sequelize.INTEGER },
        gs_refait_gs: { type: Sequelize.INTEGER },
        nbre_arret_scolarite: { type: Sequelize.INTEGER },
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
