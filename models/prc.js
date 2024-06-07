"use strict";
const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var Model = sequelize.define("Prc", {
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
      allowNull: false
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
    tableName: "prcs"
  });

  Model.associate = function (models) {
    Model.hasMany(models.Performance, { as: 'performances'});

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
        model: models.Performance,
        as: 'performances'
      }]
    });
  };

  return Model;
};
