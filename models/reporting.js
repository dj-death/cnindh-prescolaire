"use strict";


module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Reporting", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            searchable: true
        },
        province_code: { type: DataTypes.INTEGER, allowNull: false },
        plan_actions: { type: DataTypes.STRING, allowNull: false },
        fondation_partenaire: { type: DataTypes.STRING, searchable: true },
        nbre_programmees: { type: DataTypes.INTEGER },
        nbre_programmees_t1: { type: DataTypes.INTEGER },
        nbre_programmees_t2: { type: DataTypes.INTEGER },
        nbre_programmees_t3: { type: DataTypes.INTEGER },
        nbre_programmees_amg: { type: DataTypes.INTEGER },
        nbre_salles: { type: DataTypes.INTEGER },
        nbre_non_demarrees: { type: DataTypes.INTEGER },
        nbre_encours_25: { type: DataTypes.INTEGER },
        nbre_encours_25_50: { type: DataTypes.INTEGER },
        nbre_encours_50_75: { type: DataTypes.INTEGER },
        nbre_encours_75: { type: DataTypes.INTEGER },
        nbre_achevees: { type: DataTypes.INTEGER },
        nbre_encours_reception: { type: DataTypes.INTEGER },
        nbre_encours_inscription: { type: DataTypes.INTEGER },
        nbre_encours_equip: { type: DataTypes.INTEGER },
        nbre_ouvertes: { type: DataTypes.INTEGER },
        nbre_livrees: { type: DataTypes.INTEGER },
        nbre_restantes: { type: DataTypes.INTEGER },

        prevision_mois0: { type: DataTypes.INTEGER },
        prevision_mois1: { type: DataTypes.INTEGER },
        prevision_mois2: { type: DataTypes.INTEGER },
        nbre_etudes_non_lancees: { type: DataTypes.INTEGER },
        nbre_etudes_lancees: { type: DataTypes.INTEGER },
        nbre_etudes_achevees: { type: DataTypes.INTEGER },
        nbre_marches_lances: { type: DataTypes.INTEGER },
        nbre_marches_adjuges: { type: DataTypes.INTEGER },
        cout_global_marches_travaux: { type: DataTypes.DECIMAL(10, 2) },
        cout_unitaire_moyen_marches_travaux: { type: DataTypes.DECIMAL(10, 2) },

        remarques: { type: DataTypes.TEXT },

        date_situation: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        modified_by: { type: DataTypes.STRING }
    });

    Model.associate = function (models) {
        Model.addScope('browse', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nbre_ouvertes_fp'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = FALSE)'), 'nbre_up_fp'],
                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = FALSE)'), 'nbre_salles_fp']
                ]
            },

            include: []
        });


        Model.addScope('nested', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nbre_ouvertes_fp'],

                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nbre_programmees_fp'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = TRUE)'), 'nbre_resiliees_fp'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code)'), 'nbre_up_fp'],

                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nbre_salles_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(nombre_educatrices_total) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nombre_educatrices_total_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(nombre_educatrices_femme) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nombre_educatrices_femme_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(nombre_educatrices_homme) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nombre_educatrices_homme_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_global) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_global_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_garcons) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_garcons_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_filles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_filles_ouvertes_fp'],

                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_moyenne_section) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_moyenne_section_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_grande_section) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_grande_section_ouvertes_fp'],

                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nbre_salles_programmees_fp'],
                ]
            },

            include: []
        });
    }

    return Model;
};
