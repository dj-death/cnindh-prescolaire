"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var Model = sequelize.define("Activite", {
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
    
    nbre_benefs_enceintes_orientees: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_benefs_enceintes_nonorientees: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_benefs_femmes_apres_accouchement: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    duree_moy_sejour: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    prestations_offertes: {
      type: Sequelize.STRING,
      allowNull: true
    },
    nbre_benefs_nouveaux_nes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    nbre_sessions_sensibilisation: {
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
    tableName: "dao_activites"
  });

  Model.associate = function (models) {
    Model.belongsTo(models.Dao, { as: 'dao' });

    Model.addScope('browse', {
      attributes: {
        include: []
      },
      include: []
    });
  };

  return Model;
};
