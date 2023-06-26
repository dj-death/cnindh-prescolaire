"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Reporting", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            searchable: true
        },
        province_code: { type: Sequelize.INTEGER, allowNull: false },
        plan_actions: { type: Sequelize.STRING, allowNull: false },
        fondation_partenaire: { type: Sequelize.STRING, searchable: true },
        nbre_programmees: { type: Sequelize.INTEGER },
        nbre_programmees_t1: { type: Sequelize.INTEGER },
        nbre_programmees_t2: { type: Sequelize.INTEGER },
        nbre_programmees_t3: { type: Sequelize.INTEGER },
        nbre_programmees_amg: { type: Sequelize.INTEGER },
        nbre_programmees_mod: { type: Sequelize.INTEGER },
        nbre_programmees_man: { type: Sequelize.INTEGER },
        nbre_salles: { type: Sequelize.INTEGER },
        nbre_encours_25: { type: Sequelize.INTEGER },
        nbre_encours_25_50: { type: Sequelize.INTEGER },
        nbre_encours_50_75: { type: Sequelize.INTEGER },
        nbre_encours_75: { type: Sequelize.INTEGER },
        nbre_achevees: { type: Sequelize.INTEGER },
        nbre_achevees_non_ouvertes: { type: Sequelize.INTEGER },
        nbre_livrees_non_ouvertes: { type: Sequelize.INTEGER },
        nbre_encours_reception: { type: Sequelize.INTEGER },
        nbre_encours_inscription: { type: Sequelize.INTEGER },
        nbre_encours_equip: { type: Sequelize.INTEGER },
        nbre_ouvertes: { type: Sequelize.INTEGER },
        nbre_ouvertes_cn: { type: Sequelize.INTEGER },
        nbre_en_arret_fct: { type: Sequelize.INTEGER },
        nbre_livrees: { type: Sequelize.INTEGER },
        nbre_restantes: { type: Sequelize.INTEGER },

        prevision_mois0: { type: Sequelize.INTEGER },
        prevision_mois1: { type: Sequelize.INTEGER },
        prevision_mois2: { type: Sequelize.INTEGER },
        prevision_mois3: { type: Sequelize.INTEGER },
        prevision_mois4: { type: Sequelize.INTEGER },
        prevision_mois5: { type: Sequelize.INTEGER },
        prevision_mois6: { type: Sequelize.INTEGER },

        engag_ouv_baseline: { type: Sequelize.INTEGER },
        engag_ouv_dec22: { type: Sequelize.INTEGER },
        engag_ouv_jan23: { type: Sequelize.INTEGER },
        engag_ouv_fev23: { type: Sequelize.INTEGER },
        engag_ouv_mar23: { type: Sequelize.INTEGER },
        engag_ouv_oct23: { type: Sequelize.INTEGER },

        nbre_etudes_non_lancees: { type: Sequelize.INTEGER },
        nbre_etudes_lancees: { type: Sequelize.INTEGER },
        nbre_etudes_achevees: { type: Sequelize.INTEGER },
        nbre_marches_lances: { type: Sequelize.INTEGER },
        nbre_marches_adjuges: { type: Sequelize.INTEGER },
        cout_global_marches_travaux: { type: Sequelize.DECIMAL(10, 2) },

        date_lancement_etudes: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        nbre_encours_validation: { type: Sequelize.INTEGER },

        remarques: { type: Sequelize.TEXT },
        cnindh_comments: { type: Sequelize.TEXT },

        motif_non_lancement_etudes: { type: Sequelize.TEXT },
        motif_retard_ouverture: { type: Sequelize.TEXT },
        motif_retard_travaux: { type: Sequelize.TEXT },
        motif_retard_demarrage_trvx: { type: Sequelize.TEXT },
        motif_arret_travaux: { type: Sequelize.TEXT },
        motif_arret_fct: { type: Sequelize.TEXT },
        motif_relancement_marches: { type: Sequelize.TEXT },
        nbre_encours_formation: { type: Sequelize.INTEGER },
        date_lancement_marche: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_arret_trvx: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_resiliation: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_relancement_marche: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_adjudication_marche: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        date_implantation: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        date_reception: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        date_remise_cles: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        nbre_en_arret: { type: Sequelize.INTEGER },
        nbre_marches_resilies: { type: Sequelize.INTEGER },
        nbre_marches_infructueux: { type: Sequelize.INTEGER },


        /*salles_delegation_tr1: { type: Sequelize.INTEGER },
        salles_delegation_tr2: { type: Sequelize.INTEGER },
        salles_delegation_tr3: { type: Sequelize.INTEGER },
        salles_delegation_tr4: { type: Sequelize.INTEGER },

        salles_ouvertes_a_deleger_tr1: { type: Sequelize.INTEGER },
        salles_ouvertes_a_deleger_tr2: { type: Sequelize.INTEGER },
        salles_ouvertes_a_deleger_tr3: { type: Sequelize.INTEGER },
        salles_ouvertes_a_deleger_tr4: { type: Sequelize.INTEGER },

        salles_nonouvertes_a_deleger_tr1: { type: Sequelize.INTEGER },
        salles_nonouvertes_a_deleger_tr2: { type: Sequelize.INTEGER },
        salles_nonouvertes_a_deleger_tr3: { type: Sequelize.INTEGER },
        salles_nonouvertes_a_deleger_tr4: { type: Sequelize.INTEGER },
        */

        date_situation: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        modified_by: { type: Sequelize.STRING },
        concernee_visio2022: { type: Sequelize.BOOLEAN, defaultValue: false }

    });

    Model.associate = function (models) {
        Model.addScope('simple', {
            attributes: {
                include: [
                ]
            },

            include: []
        });

        Model.addScope('browse', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_programmee_pp = TRUE)'), 'nbre_ouvertes_fp'], //Unites.est_resiliee = FALSE AND 
                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_programmee_pp = TRUE)'), 'nbre_salles_ouvertes_fp'], //AND Unites.est_resiliee = FALSE 

                    //[sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = FALSE)'), 'nbre_up_fp'],
                    //[sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = FALSE)'), 'nbre_salles_fp']
                ]
            },

            include: []
        });


        Model.addScope('nested', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee_pp = TRUE)'), 'nbre_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee_pp = TRUE)'), 'nbre_salles_ouvertes_fp'],

                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_programmee_pp)'), 'nbre_up_fp'],
                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_programmee_pp)'), 'nbre_salles_fp'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = TRUE)'), 'nbre_resiliees_fp'],
                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = TRUE)'), 'nbre_salles_resiliees_fp'],

                    /*[sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nbre_ouvertes_fp'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nbre_programmees_fp'],
                    [sequelize.literal('(SELECT SUM(nbre_salles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nbre_salles_programmees_fp']
                    */

                    /*[sequelize.literal('(SELECT SUM(nombre_educatrices_total) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nombre_educatrices_total_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(nombre_educatrices_femme) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nombre_educatrices_femme_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(nombre_educatrices_homme) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'nombre_educatrices_homme_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_global) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_global_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_garcons) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_garcons_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_filles) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_filles_ouvertes_fp'],

                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_moyenne_section) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_moyenne_section_ouvertes_fp'],
                    [sequelize.literal('(SELECT SUM(saison_2021_2022_total_grande_section) FROM Unites WHERE Unites.plan_actions = Reporting.plan_actions AND Unites.province_code = Reporting.province_code AND Unites.est_ouverte = TRUE AND Unites.est_resiliee = FALSE AND Unites.est_programmee = TRUE)'), 'saison_2021_2022_total_grande_section_ouvertes_fp'],
                    */

                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 0))'), 'delegations_etudes'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_travaux'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 2))'), 'delegations_equip'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND (Delegations.tranche_no >= 3 AND Delegations.tranche_no <= 9) ))'), 'delegations_fct_2ans'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND (Delegations.tranche_no >= 10 AND Delegations.tranche_no <= 23) ))'), 'delegations_peren'],


                    [sequelize.literal('(SELECT SUM(nbre_ups_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_ups'],
                    [sequelize.literal('(SELECT SUM(nbre_t1) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_t1'],
                    [sequelize.literal('(SELECT SUM(nbre_t2) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_t2'],
                    [sequelize.literal('(SELECT SUM(nbre_t3) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_t3'],
                    [sequelize.literal('(SELECT SUM(nbre_amg) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_amg'],

                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 2 ))'), 'deleg_equip_nbre_salles'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 3 ))'), 'deleg_tr1_nbre_salles'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 4 ))'), 'deleg_tr2_nbre_salles'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 5 ))'), 'deleg_tr3_nbre_salles'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 6 ))'), 'deleg_tr4_nbre_salles']

                ]
            },

            include: []
        });


        Model.addScope('delegations', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 0))'), 'delegations_etudes'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_travaux'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 2))'), 'delegations_equip'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND (Delegations.tranche_no >= 3 AND Delegations.tranche_no <= 9) ))'), 'delegations_fct_2ans'],
                    [sequelize.literal('(SELECT SUM(montant_effectif) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND (Delegations.tranche_no >= 10 AND Delegations.tranche_no <= 23) ))'), 'delegations_peren'],


                    [sequelize.literal('(SELECT SUM(nbre_ups_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_ups'],
                    [sequelize.literal('(SELECT SUM(nbre_t1) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_t1'],
                    [sequelize.literal('(SELECT SUM(nbre_t2) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_t2'],
                    [sequelize.literal('(SELECT SUM(nbre_t3) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_t3'],
                    [sequelize.literal('(SELECT SUM(nbre_amg) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 1))'), 'delegations_nbre_amg'],

                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 2 ))'), 'deleg_equip_nbre_salles'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 3 ))'), 'deleg_tr1_nbre_salles'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 4 ))'), 'deleg_tr2_nbre_salles'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 6 ))'), 'deleg_tr3_nbre_salles'],
                    [sequelize.literal('(SELECT SUM(nbre_salles_concernees) FROM SousDelegations WHERE SousDelegations.province_code = Reporting.province_code AND SousDelegations.est_complement = FALSE AND SousDelegations.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.plan_actions = Reporting.plan_actions AND Delegations.tranche_no = 7 ))'), 'deleg_tr4_nbre_salles']
                ]
            },

            include: []
        });
    }

    return Model;
};
