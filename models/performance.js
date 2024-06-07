"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var Model = sequelize.define("Performance", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        isUUID: 4
      }
    },

    periode: {
      type: Sequelize.STRING,
      allowNull: false
    },

    mnt_subvention: {
      type: Sequelize.FLOAT,
      defaultValue: 0
    },
    nbre_total_prc: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_formees: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_actives: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_femme: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_homme: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_18_35ans: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_35_50ans: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_age_sup50ans: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_sans_instr: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_primaire: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_secondaire: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_superieur: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_maitrise_arabe: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_maitrise_amazigh: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_prc_maitrise_langues: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    
    nbre_prc_indemnise: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_foyers_charge_par_prc: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_grossesses_recensees: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_visites_sensibilisation: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_orientees_accouchement_surv: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_orientees_cpn_trim1: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_orientees_cpn_trim2_3: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_orientees_acheve_4_visites_cpn: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_orientees_suivi_postnatal: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_enfants_moins5_orientes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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
    tableName: "prc_performances"
  });

  Model.associate = function (models) {
    Model.belongsTo(models.Prc, { as: 'prc' });

    Model.addScope('browse', {
      attributes: {
        include: []
      },
      include: [{
        model: models.Performance,
        as: 'performances'
      }]
    });
  };

  return Model;
};
