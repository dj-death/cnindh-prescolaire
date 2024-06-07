"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var Model = sequelize.define("Dao", {
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
    cercle_code: { type: Sequelize.INTEGER, allowNull: false },

    gestionnaire: {
      type: Sequelize.STRING,
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
    tableName: "daos"
  });

  Model.associate = function (models) {
    Model.hasMany(models.Activite, { as: 'activites'});

    Model.addScope('browse', {
      attributes: {
        include: []
      },
      
      include: []
    });

    Model.addScope('nested', {
      attributes: {
        include: []
      },
      include: [{
        model: models.Activite,
        as: 'activites'
      }]
    });
  };

  return Model;
};
