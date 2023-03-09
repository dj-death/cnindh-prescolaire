"use strict";
const { Sequelize } = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var Model = sequelize.define("Douar", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        province_code: {
            type: Sequelize.INTEGER,
            allowNull: false,
            searchable: false
        },

        commune_code: {
            type: Sequelize.INTEGER,
            allowNull: false,
            searchable: false
        },

        cercle_code: {
            type: Sequelize.INTEGER,
            allowNull: true,
            searchable: false
        },

        code_douar: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true
        },

        code_hcp: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true
        },

        code_douar_mere: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true
        },

        douar_mere: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true
        },

        est_sousdouar: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },

        commune: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true
        },
       
        nom_fr: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true
        },
       
        nom_ar: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true
        },
       
        type: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

        milieu: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
       
        population: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

        nbre_menages: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
       
        location: {
            type: Sequelize.TEXT,
            allowNull: true,
            get: function () {
                return JSON.parse(this.getDataValue('location'));
            },
            set: function (value) {
                return this.setDataValue('location', JSON.stringify(value));
            }
        },
       
        has_ecole: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },

        has_prescolaire: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }/*, {
        hooks: {
			afterUpdate: function (instance, options) {
				var result = [],
					changed = instance.changed(),
					i = 0, len = changed.length, key;
				
				for (; i < len; i++) {
					key = changed[i];
					
					result.push({
						property: key,
						previous: instance.previous(key),
						current: instance.get(key)
					});
				}
				
				instance.modifiedFields = result;
				
				return true;
			}
        }
    }*/);

    Model.associate = function (models) {
        //Model.belongsTo(models.Unite, { as: 'unite' });
        Model.hasMany(models.Unite, { as: 'unites', foreignKey: 'code_douar', sourceKey: 'code_douar' });

        Model.addScope('browse', {
            include: [
                { 
                    model: models.Unite,
                    as: 'unites', 
                    attributes: [
                        'id', 'plan_actions', 'intitule', 'code_douar'
                    ]
                }
            ]
        });

        Model.addScope('nested', {
            include: [
                { 
                    model: models.Unite,
                    as: 'unites', 
                    attributes: [
                        'id', 'province_code', 'plan_actions', 'fp_code', 'commune_code', 'intitule', 'nbre_salles', 'est_ouverte', 'est_resiliee', 'date_ouverture'
                    ]
                }
            ]
        });
    };

    return Model;
};
