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
        gs_garcons: { type: DataTypes.DECIMAL(3, 0), allowNull: true },
        inscrits_primaire_total: { type: DataTypes.INTEGER },
        inscrits_primaire_filles: { type: DataTypes.INTEGER },
        inscrits_primaire_garcons: { type: DataTypes.INTEGER },
        ms_passe_gs: { type: DataTypes.INTEGER },
        ms_reinscrit_ms: { type: DataTypes.INTEGER },
        ms_passe_primaire: { type: DataTypes.INTEGER },
        gs_primaire: { type: DataTypes.INTEGER },
        gs_refait_gs: { type: DataTypes.INTEGER },
        nbre_arret_scolarite: { type: DataTypes.INTEGER },
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
