"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Implementation", {
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
        cercle_code: { type: Sequelize.INTEGER, allowNull: true },

        AMI_lancee: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_lancement_AMI: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_lancement_AMI: {
            type: Sequelize.DATE,
            allowNull: true
        },
        AMI_cloture: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_cloture_AMI: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_cloture_AMI: {
            type: Sequelize.DATE,
            allowNull: true
        },
        contractualisation_assoc_effectuee: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_contract_association: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_contract_association: {
            type: Sequelize.DATE,
            allowNull: true
        },
        diag_comm_lance: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_lancement_diag_comm: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_lancement_diag_comm: {
            type: Sequelize.DATE,
            allowNull: true
        },
        association_nom: {
            type: Sequelize.STRING,
            allowNull: true
        },
        association_champ_action: {
            type: Sequelize.STRING,
            allowNull: true
        },
        association_territoire_action: {
            type: Sequelize.STRING,
            allowNull: true
        },
        reunion_dept_sante_tenue: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_reunion_dept_sante: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_reunion_dept_sante: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CSR2_retenu_nom: {
            type: Sequelize.STRING,
            allowNull: true
        },
        CSR2_retenu_communes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        CSR2_retenu_population: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        CSR2_retenu_population_plus_6km: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_localites_enclavees: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_naissances_attendues: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_femmes_age_procreer: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_enfants_moins_5_ans: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_femmes_new_prenat_2022: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_accouchements_maison_2022: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_douars_retenus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_moyen_femmes_douar: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        nbre_moyen_enfants_douar: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        douars_retenus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        reunion_comite_tenue: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_reunion_comite: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_reunion_comite: {
            type: Sequelize.DATE,
            allowNull: true
        },
        nbre_foyers_PRC: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        plan_formation_elabore: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_elaboration_plan_formation: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_elaboration_plan_formation: {
            type: Sequelize.DATE,
            allowNull: true
        },
        formateurs_identifies: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_identification_formateurs: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_identification_formateurs: {
            type: Sequelize.DATE,
            allowNull: true
        },
        kits_formation_imprimes: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_impression_kits_formation: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_impression_kits_formation: {
            type: Sequelize.DATE,
            allowNull: true
        },
        formation_ecosysteme_effectuee: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_prev_formation_ecosysteme: {
            type: Sequelize.DATE,
            allowNull: true
        },
        date_formation_ecosysteme: {
            type: Sequelize.DATE,
            allowNull: true
        },

        observations: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        date_situation: {
            type: Sequelize.DATE,
            allowNull: true
        },
        modified_by: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: "implementations"
    });

    Model.associate = function (models) {
        Model.addScope('browse', {
            attributes: {
                include: []
            },
            include: []
        });
    };

    return Model;
};
