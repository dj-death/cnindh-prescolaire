"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Transfert", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },

        province_code: { type: Sequelize.INTEGER, allowNull: false },
        ordre: { type: Sequelize.INTEGER, allowNull: false },
        date_debut: {
            type: Sequelize.DATE,
            allowNull: false,

            validate: {
                isDate: true 
            }
        },

        date_fin: {
            type: Sequelize.DATE,
            allowNull: false,

            validate: {
                isDate: true 
            }
        },

        statut: {
            type: Sequelize.STRING,
            allowNull: true
        },

        label: {
            type: Sequelize.STRING,
            allowNull: true
        },

        arrete_commission_signe: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_signature_arrete_commission: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        situation_financiere_etablie: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        pv_transfert_signe: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_signature_pv_transfert: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        convention_envoyee: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_envoi_convention: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        convention_signee_fp: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        convention_signee_aref: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },

        convention_signee: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        date_signature_convention: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        nbre_ups_retenues_conventions: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

        nbre_ups_retenues_conv_cat1: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_ups_retenues_conv_cat2: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nbre_ups_retenues_conv_cat3: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

        observations: {
            type: Sequelize.STRING,
            allowNull: true
        },
        complement_perennisation_verse: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        regularisation_2annees: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        besoin_delegation_credits: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        conv_verser_credits_requis: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        credits_requis: { 
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        date_demande_delegation_credits: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        date_dernier_versement: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        comments_credits_fonctionnement: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mesures_accompagnement_foncier: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mesures_traitement_ups_particulieres: {
            type: Sequelize.STRING,
            allowNull: true
        },
        date_situation: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },
        modified_by: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: "transferts"
    });

    Model.associate = function (models) {
        Model.addScope('browse', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.province_code = Transfert.province_code AND Unites.trans_retenue_phase1 = TRUE)'), 'trans_retenue_phase1'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.province_code = Transfert.province_code AND Unites.trans_situation_financiere_regularisee = TRUE)'), 'trans_situation_financiere_regularisee'],
                    [sequelize.literal('(SELECT COUNT(*) FROM Unites WHERE Unites.province_code = Transfert.province_code AND Unites.est_ouverte = TRUE AND Unites.est_programmee_pp = TRUE)'), 'total_up_ouvertes']
                ]
            },
            include: []
        });
    };

    return Model;
};
