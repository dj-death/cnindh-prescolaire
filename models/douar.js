"use strict";

module.exports = function(sequelize, DataTypes) {
    var Model = sequelize.define("Douar", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        province_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            searchable: false
        },

        commune_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            searchable: false
        },

        cercle_code: {
            type: DataTypes.INTEGER,
            allowNull: true,
            searchable: false
        },

        code_douar: {
            type: DataTypes.STRING,
            allowNull: false,
            searchable: true
        },

        code_douar_mere: {
            type: DataTypes.STRING,
            allowNull: true,
            searchable: true
        },

        est_sousdouar: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },

        commune: {
            type: DataTypes.STRING,
            allowNull: false,
            searchable: true
        },
       
        nom_fr: {
            type: DataTypes.STRING,
            allowNull: false,
            searchable: true
        },
       
        nom_ar: {
            type: DataTypes.STRING,
            allowNull: true,
            searchable: true
        },
       
        type: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        milieu: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
       
        population: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        nbre_menages: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
       
        location: {
            type: DataTypes.TEXT,
            allowNull: true,
            get: function () {
                return JSON.parse(this.getDataValue('location'));
            },
            set: function (value) {
                return this.setDataValue('location', JSON.stringify(value));
            }
        },
       
        has_ecole: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },

        has_prescolaire: {
            type: DataTypes.BOOLEAN,
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
        Model.hasMany(models.Unite, { as: 'unites' });

        Model.addScope('browse', {
            include: []
        });

        Model.addScope('nested', {
            include: [
                //{ model: models.Unite, as: 'unite' }
            ]
        });
    };

    return Model;
};
