"use strict";
const { Sequelize } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Unite", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        plan_actions: { type: Sequelize.STRING, searchable: true },
        fp_code: { type: Sequelize.INTEGER },
        annexe_administrative: { type: Sequelize.STRING },
        province_code: { type: Sequelize.INTEGER, allowNull: false },
        cercle_code: { type: Sequelize.INTEGER, allowNull: false },
        commune_code: { type: Sequelize.INTEGER, allowNull: false },
        commune: { type: Sequelize.STRING, searchable: true },
        douar_quartier: { type: Sequelize.STRING, searchable: true },
        code_douar: { type: Sequelize.STRING, searchable: true },
        dans_ecole: { type: Sequelize.BOOLEAN, defaultValue: false },
        adresse: { type: Sequelize.STRING, searchable: true },
        location: {
            type: Sequelize.TEXT,
            allowNull: true,
            get: function () {
                var val = this.getDataValue('location');
                
                try {
                    return val && JSON.parse(val);
                } catch(e) { 
                    return null; 
                }
			
            },

            set: function (value) {
				if (typeof value == 'object') {
					try {
						var coords = JSON.stringify(value);
						
						this.setDataValue('location', coords);
					} catch (e) {
						console.log(e);
					}
				}
            }
        },

        intitule: { type: Sequelize.STRING, searchable: true },
        type_unite: { type: Sequelize.STRING },
        mode_creation: { type: Sequelize.STRING },
        nbre_salles: { type: Sequelize.INTEGER },
        nbre_salles_ouvertes: { type: Sequelize.INTEGER },
        nbre_classes: { type: Sequelize.INTEGER },
        programme: { type: Sequelize.STRING },

        proprietaire_foncier: {
            type: Sequelize.STRING,
            allowNull: true
        },

        type_foncier: {
            type: Sequelize.STRING,
            allowNull: true
        },

        mode_mobilisation_foncier: {
            type: Sequelize.STRING,
            allowNull: true
        },
        

        montant_delegue: { type: Sequelize.DECIMAL(10, 2) },
        cout_travaux: { type: Sequelize.DECIMAL(10, 2) },
        cout_unitaire: { type: Sequelize.DECIMAL(10, 2) },
        cout_equipement: { type: Sequelize.DECIMAL(10, 2) },
        cout_fonctionnement: { type: Sequelize.DECIMAL(10, 2) },
        montant_engage: { type: Sequelize.DECIMAL(10, 2) },
        montant_emis: { type: Sequelize.DECIMAL(10, 2) },

        cout_travaux_estime: { type: Sequelize.DECIMAL(10, 2) },

        delai_execution: { type: Sequelize.INTEGER },

        date_lancement_trvx: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_lancement_marche: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_ouverture_plis: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_ouverture: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_ouverture_pp: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_ouverture_prevu: {
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

        date_arret: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        tx_avancement_physique: { type: Sequelize.DECIMAL(5, 2) },
        statut: { type: Sequelize.STRING },
        //statut_fp: { type: Sequelize.STRING },
        statut_latin: { type: Sequelize.STRING },
        phase: { type: Sequelize.STRING },
        difficultes_rencontrees: { type: Sequelize.STRING },
        problemes_fonctionnement: {
            type: Sequelize.STRING,
            allowNull: true
        },

        dispose_eau: { type: Sequelize.BOOLEAN, allowNull: true },
        dispose_electricite: { type: Sequelize.BOOLEAN, allowNull: true },
        dispose_assainissement: { type: Sequelize.BOOLEAN, allowNull: true },

        dispose_convention_signee: { type: Sequelize.BOOLEAN, defaultValue: true },
        est_programmee: { type: Sequelize.BOOLEAN, defaultValue: true },
        est_livree: { type: Sequelize.BOOLEAN, defaultValue: true },
        est_ouverte: { type: Sequelize.BOOLEAN, allowNull: true },
        est_resiliee: { type: Sequelize.BOOLEAN, defaultValue: false },
        est_en_arret: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: true },

        nombre_educatrices_femme: { type: Sequelize.INTEGER },
        nombre_educatrices_homme: { type: Sequelize.INTEGER },
        nombre_educatrices_total: { type: Sequelize.INTEGER },

        contact_educateurs: {
            type: Sequelize.STRING,
            allowNull: true
        },

        saison_2019_2020_total_global: { type: Sequelize.INTEGER },
        saison_2019_2020_total_grande_section: { type: Sequelize.INTEGER },
        saison_2019_2020_total_moyenne_section: { type: Sequelize.INTEGER },
        saison_2019_2020_inscrits_primaire_total: { type: Sequelize.INTEGER },
        saison_2019_2020_inscrits_primaire_filles: { type: Sequelize.INTEGER },
        saison_2019_2020_inscrits_primaire_garcons: { type: Sequelize.INTEGER },
        saison_2019_2020_ms_passe_gs: { type: Sequelize.INTEGER },
        saison_2019_2020_ms_reinscrit_ms: { type: Sequelize.INTEGER },
        saison_2019_2020_ms_passe_primaire: { type: Sequelize.INTEGER },
        saison_2019_2020_gs_primaire: { type: Sequelize.INTEGER },
        saison_2019_2020_gs_refait_gs: { type: Sequelize.INTEGER },
        saison_2019_2020_nbre_arret_scolarite: { type: Sequelize.INTEGER },


        saison_2020_2021_moyenne_section_filles: { type: Sequelize.INTEGER },
        saison_2020_2021_moyenne_section_garcons: { type: Sequelize.INTEGER },
        saison_2020_2021_total_moyenne_section: { type: Sequelize.INTEGER },
        saison_2020_2021_grande_section_filles: { type: Sequelize.INTEGER },
        saison_2020_2021_grande_section_garcons: { type: Sequelize.INTEGER },
        saison_2020_2021_total_grande_section: { type: Sequelize.INTEGER },
        saison_2020_2021_total_global: { type: Sequelize.INTEGER },

        saison_2022_2023_moyenne_section_filles: { type: Sequelize.INTEGER },
        saison_2021_2022_moyenne_section_garcons: { type: Sequelize.INTEGER },
        saison_2021_2022_grande_section_filles: { type: Sequelize.INTEGER },
        saison_2021_2022_grande_section_garcons: { type: Sequelize.INTEGER },

        saison_2020_2021_inscrits_primaire_total: { type: Sequelize.INTEGER },
        saison_2020_2021_inscrits_primaire_filles: { type: Sequelize.INTEGER },
        saison_2020_2021_inscrits_primaire_garcons: { type: Sequelize.INTEGER },
        saison_2020_2021_ms_passe_gs: { type: Sequelize.INTEGER },
        saison_2020_2021_ms_reinscrit_ms: { type: Sequelize.INTEGER },
        saison_2020_2021_ms_passe_primaire: { type: Sequelize.INTEGER },
        saison_2020_2021_gs_primaire: { type: Sequelize.INTEGER },
        saison_2020_2021_gs_refait_gs: { type: Sequelize.INTEGER },
        saison_2020_2021_nbre_arret_scolarite: { type: Sequelize.INTEGER },


        saison_2022_2023_moyenne_section_filles: { type: Sequelize.INTEGER },
        saison_2022_2023_moyenne_section_garcons: { type: Sequelize.INTEGER },
        saison_2022_2023_total_moyenne_section: { type: Sequelize.INTEGER },
        saison_2022_2023_grande_section_filles: { type: Sequelize.INTEGER },
        saison_2022_2023_grande_section_garcons: { type: Sequelize.INTEGER },
        saison_2022_2023_total_grande_section: { type: Sequelize.INTEGER },
        saison_2022_2023_total_global: { type: Sequelize.INTEGER },

        saison_2021_2022_inscrits_primaire_total: { type: Sequelize.INTEGER },
        saison_2021_2022_inscrits_primaire_filles: { type: Sequelize.INTEGER },
        saison_2021_2022_inscrits_primaire_garcons: { type: Sequelize.INTEGER },
        saison_2021_2022_ms_passe_gs: { type: Sequelize.INTEGER },
        saison_2021_2022_ms_reinscrit_ms: { type: Sequelize.INTEGER },
        saison_2021_2022_ms_passe_primaire: { type: Sequelize.INTEGER },
        saison_2021_2022_gs_primaire: { type: Sequelize.INTEGER },
        saison_2021_2022_gs_refait_gs: { type: Sequelize.INTEGER },
        saison_2021_2022_nbre_arret_scolarite: { type: Sequelize.INTEGER },


        date_situation: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        modified_by: { type: Sequelize.STRING },

        fp_comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        images: {
            type: Sequelize.TEXT,
            allowNull: true,
            get: function () {
                return JSON.parse(this.getDataValue('images'));
            },
            set: function (value) {
                return this.setDataValue('images', JSON.stringify(value));
            }
        },

        fp_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: 'ID FP existe déjà'
            },
            validate: {
                notEmpty: true
            }
        },

        /*montant_delegue_fct: { type: Sequelize.DECIMAL(10, 2) },
        last_tranche: { type: Sequelize.INTEGER },
        last_delegation_dt: {
            type: Sequelize.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        }*/

    }, {
        indexes: [
          {
            unique: true,
            fields: ['fp_id']
          }
        ]
    });

    Model.associate = function (models) {
        Model.hasMany(models.Effectif, { as: 'effectifs'});

        Model.belongsTo(models.Douar, { as: 'douar' });


        Model.belongsToMany(models.Delegation, {
            through: models.DelegationUnites,
            as: 'delegations',
            foreignKey: 'unite_id',
            otherKey: 'delegation_id'
        });

        Model.addScope('browse', {
            attributes: [
                'id', 'fp_id', 'fp_code', 'fp_comments', 'date_situation',
                'province_code', 'cercle_code', 'commune_code', 'douar_quartier', 
                'plan_actions', 'intitule',
                'nbre_salles', 'nbre_salles_ouvertes', 'nbre_classes', 
                'est_ouverte', 'est_resiliee', 'est_en_arret', 'date_ouverture',
                'nombre_educatrices_total', 'nombre_educatrices_femme', 'nombre_educatrices_homme', 
                'saison_2022_2023_moyenne_section_filles', 'saison_2022_2023_moyenne_section_garcons', 'saison_2022_2023_grande_section_filles', 'saison_2022_2023_grande_section_garcons',
                'saison_2021_2022_moyenne_section_filles', 'saison_2021_2022_moyenne_section_garcons', 'saison_2021_2022_grande_section_filles', 'saison_2021_2022_grande_section_garcons',
                
                'saison_2021_2022_inscrits_primaire_total', 'saison_2021_2022_inscrits_primaire_filles',
                'saison_2021_2022_inscrits_primaire_garcons', 'saison_2021_2022_ms_passe_gs', 'saison_2021_2022_ms_reinscrit_ms',
                'saison_2021_2022_ms_passe_primaire', 'saison_2021_2022_gs_primaire', 'saison_2021_2022_gs_refait_gs', 'saison_2021_2022_nbre_arret_scolarite',

                [sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                [sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt']
            ],
            
            include: [
                
            ]
        });

        Model.addScope('browse_effectifs', {
            attributes: {
                /*'id', 'fp_id', 'created', 'updated', 'province_code', 'cercle_code', 'commune_code', 'annexe_administrative',
                'douar_quartier', 'adresse', 'plan_actions', 'fp_code', 'intitule', 'nbre_salles', 'nbre_salles_ouvertes', 'nbre_classes', 
                'est_programmee', 'dispose_convention_signee', 'est_livree', 'est_ouverte', 'est_resiliee', 'est_en_arret', 'modified_by', 
                'date_ouverture',
                'nombre_educatrices_total', 'nombre_educatrices_femme', 'nombre_educatrices_homme',*/
                
                include: [
                    [sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                    [sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt']
                ]
            },
            include: [
               
            ]
        });


        Model.addScope('nested', {
            attributes: {
                include: [
                    //[sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id)'), 'total_delegue'],
                    [sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id AND DelegationUnites.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.nature_affectation = \'Fonctionnement\'))'), 'montant_delegue_fct'],
                    [sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                    [sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt'],
                    [sequelize.literal('(SELECT array_to_string(array_agg(tranche_no ORDER BY tranche_no ASC), \',\') FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'tranches']
                ]
            },

            include: [/*{
                model: models.Delegation,
                as: 'delegations'
            }, {
                model: models.Effectif,
                as: 'effectifs'
            }*/]
        });

        Model.addScope('projections', {
            attributes: {
                include: [
                    'id',
                    'plan_actions',
                    'fp_code',
                    'province_code',
                    'commune_code',
                    'intitule',
                    'nbre_salles',
                    'nbre_salles_ouvertes',
                    'cout_travaux_estime',
                    'delai_execution',
                    'date_ouverture',
                    'date_resiliation',
                    'date_arret',
                    'tx_avancement_physique',
                    'statut',
                    'est_ouverte',
                    'est_resiliee',
                    'est_en_arret',

                    //[sequelize.literal('(SELECT COUNT(*) FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id)'), 'delegationscount'],
                    
                    [sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id AND DelegationUnites.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.nature_affectation = \'Fonctionnement\'))'), 'montant_delegue_fct'],
                    [sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                    [sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt']
                ]
            },

            include: []
        });


        Model.addScope('lastdelegation', {
            attributes: {
                include: [
                    'id',
                    'plan_actions',
                    'fp_code',
                    'province_code',
                    'commune_code',
                    'intitule',
                    'nbre_salles',
                    'nbre_salles_ouvertes',
                    'date_ouverture',
                    'est_ouverte',
                    'est_resiliee',
                    'est_en_arret',

                    [sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                    [sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt']
                ]
            },

            include: []
        });
    }

    /*afterUpdate: function (instance, options) {
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
    }*/

    return Model;
};
