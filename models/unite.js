"use strict";


module.exports = function (sequelize, DataTypes) {
    var Model = sequelize.define("Unite", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },

        plan_actions: { type: DataTypes.STRING, searchable: true },
        fp_code: { type: DataTypes.INTEGER },
        annexe_administrative: { type: DataTypes.STRING },
        province_code: { type: DataTypes.INTEGER, allowNull: false },
        cercle_code: { type: DataTypes.INTEGER, allowNull: false },
        commune_code: { type: DataTypes.INTEGER, allowNull: false },
        commune: { type: DataTypes.STRING, searchable: true },
        douar_quartier: { type: DataTypes.STRING, searchable: true },
        code_douar: { type: DataTypes.STRING, searchable: true },
        dans_ecole: { type: DataTypes.BOOLEAN, defaultValue: false },
        adresse: { type: DataTypes.STRING, searchable: true },
        location: {
            type: DataTypes.TEXT,
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

        intitule: { type: DataTypes.STRING, searchable: true },
        type_unite: { type: DataTypes.STRING },
        mode_creation: { type: DataTypes.STRING },
        nbre_salles: { type: DataTypes.INTEGER },
        nbre_salles_ouvertes: { type: DataTypes.INTEGER },
        nbre_classes: { type: DataTypes.INTEGER },
        programme: { type: DataTypes.STRING },

        proprietaire_foncier: {
            type: DataTypes.STRING,
            allowNull: true
        },

        type_foncier: {
            type: DataTypes.STRING,
            allowNull: true
        },

        mode_mobilisation_foncier: {
            type: DataTypes.STRING,
            allowNull: true
        },
        

        montant_delegue: { type: DataTypes.DECIMAL(10, 2) },
        cout_travaux: { type: DataTypes.DECIMAL(10, 2) },
        cout_unitaire: { type: DataTypes.DECIMAL(10, 2) },
        cout_equipement: { type: DataTypes.DECIMAL(10, 2) },
        cout_fonctionnement: { type: DataTypes.DECIMAL(10, 2) },
        montant_engage: { type: DataTypes.DECIMAL(10, 2) },
        montant_emis: { type: DataTypes.DECIMAL(10, 2) },

        cout_travaux_estime: { type: DataTypes.DECIMAL(10, 2) },

        delai_execution: { type: DataTypes.INTEGER },

        date_lancement_trvx: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_lancement_marche: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_ouverture_plis: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_ouverture: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_ouverture_pp: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_ouverture_prevu: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_resiliation: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        date_arret: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        tx_avancement_physique: { type: DataTypes.DECIMAL(5, 2) },
        statut: { type: DataTypes.STRING },
        //statut_fp: { type: DataTypes.STRING },
        statut_latin: { type: DataTypes.STRING },
        phase: { type: DataTypes.STRING },
        difficultes_rencontrees: { type: DataTypes.STRING },
        problemes_fonctionnement: {
            type: DataTypes.STRING,
            allowNull: true
        },

        dispose_eau: { type: DataTypes.BOOLEAN, allowNull: true },
        dispose_electricite: { type: DataTypes.BOOLEAN, allowNull: true },
        dispose_assainissement: { type: DataTypes.BOOLEAN, allowNull: true },

        dispose_convention_signee: { type: DataTypes.BOOLEAN, defaultValue: true },
        est_programmee: { type: DataTypes.BOOLEAN, defaultValue: true },
        est_livree: { type: DataTypes.BOOLEAN, defaultValue: true },
        est_ouverte: { type: DataTypes.BOOLEAN, allowNull: true },
        est_resiliee: { type: DataTypes.BOOLEAN, defaultValue: false },
        est_en_arret: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },

        nombre_educatrices_femme: { type: DataTypes.INTEGER },
        nombre_educatrices_homme: { type: DataTypes.INTEGER },
        nombre_educatrices_total: { type: DataTypes.INTEGER },

        contact_educateurs: {
            type: DataTypes.STRING,
            allowNull: true
        },

        saison_2019_2020_total_global: { type: DataTypes.INTEGER },
        saison_2019_2020_total_grande_section: { type: DataTypes.INTEGER },
        saison_2019_2020_total_moyenne_section: { type: DataTypes.INTEGER },
        saison_2019_2020_inscrits_primaire_total: { type: DataTypes.INTEGER },
        saison_2019_2020_inscrits_primaire_filles: { type: DataTypes.INTEGER },
        saison_2019_2020_inscrits_primaire_garcons: { type: DataTypes.INTEGER },
        saison_2019_2020_ms_passe_gs: { type: DataTypes.INTEGER },
        saison_2019_2020_ms_reinscrit_ms: { type: DataTypes.INTEGER },
        saison_2019_2020_ms_passe_primaire: { type: DataTypes.INTEGER },
        saison_2019_2020_gs_primaire: { type: DataTypes.INTEGER },
        saison_2019_2020_gs_refait_gs: { type: DataTypes.INTEGER },
        saison_2019_2020_nbre_arret_scolarite: { type: DataTypes.INTEGER },


        saison_2020_2021_moyenne_section_filles: { type: DataTypes.INTEGER },
        saison_2020_2021_moyenne_section_garcons: { type: DataTypes.INTEGER },
        saison_2020_2021_total_moyenne_section: { type: DataTypes.INTEGER },

        saison_2020_2021_grande_section_filles: { type: DataTypes.INTEGER },
        saison_2020_2021_grande_section_garcons: { type: DataTypes.INTEGER },
        saison_2020_2021_total_grande_section: { type: DataTypes.INTEGER },

        saison_2020_2021_total_global: { type: DataTypes.INTEGER },

        saison_2021_2022_moyenne_section_filles: { type: DataTypes.INTEGER },
        saison_2021_2022_moyenne_section_garcons: { type: DataTypes.INTEGER },
        saison_2021_2022_grande_section_filles: { type: DataTypes.INTEGER },
        saison_2021_2022_grande_section_garcons: { type: DataTypes.INTEGER },

        inscrits_primaire_total: { type: DataTypes.INTEGER },
        inscrits_primaire_filles: { type: DataTypes.INTEGER },
        inscrits_primaire_garcons: { type: DataTypes.INTEGER },
        ms_passe_gs: { type: DataTypes.INTEGER },
        ms_reinscrit_ms: { type: DataTypes.INTEGER },
        ms_passe_primaire: { type: DataTypes.INTEGER },
        gs_primaire: { type: DataTypes.INTEGER },
        gs_refait_gs: { type: DataTypes.INTEGER },
        nbre_arret_scolarite: { type: DataTypes.INTEGER },

        date_situation: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        },

        modified_by: { type: DataTypes.STRING },

        fp_comments: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        comments: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        images: {
            type: DataTypes.TEXT,
            allowNull: true,
            get: function () {
                return JSON.parse(this.getDataValue('images'));
            },
            set: function (value) {
                return this.setDataValue('images', JSON.stringify(value));
            }
        },

        fp_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'ID FP existe déjà'
            },
            validate: {
                notEmpty: true
            }
        },

        montant_delegue_fct: { type: DataTypes.DECIMAL(10, 2) },
        last_tranche: { type: DataTypes.INTEGER },
        last_delegation_dt: {
            type: DataTypes.DATE,
            allowNull: true,

            validate: {
                isDate: true
            }
        }

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

        Model.belongsToMany(models.Delegation, {
            through: models.DelegationUnites,
            as: 'delegations',
            foreignKey: 'unite_id',
            otherKey: 'delegation_id'
        });

        Model.addScope('browse', {
            attributes: [
                'id', 'fp_id',
                'province_code', 'cercle_code', 'commune_code', 'douar_quartier', 
                'plan_actions', 'intitule',
                'nbre_salles', 'nbre_salles_ouvertes', 'nbre_classes', 
                'est_ouverte', 'est_resiliee', 'est_en_arret', 'date_ouverture',
                'nombre_educatrices_total', 'nombre_educatrices_femme', 'nombre_educatrices_homme', 
                'saison_2021_2022_moyenne_section_filles', 'saison_2021_2022_moyenne_section_garcons', 'saison_2021_2022_grande_section_filles', 'saison_2021_2022_grande_section_garcons',
                'inscrits_primaire_total', 'inscrits_primaire_filles', 'inscrits_primaire_garcons', 'ms_passe_gs', 'ms_reinscrit_ms', 'ms_passe_primaire', 'gs_primaire', 'gs_refait_gs', 'nbre_arret_scolarite',

                'last_tranche',
                'last_delegation_dt'
            ],
            include: []
        });

        Model.addScope('browse_effectifs', {
            attributes: [
                'id', 'fp_id', 'created', 'updated', 'province_code', 'cercle_code', 'commune_code', 'annexe_administrative', 'douar_quartier', 'adresse', 'plan_actions', 'fp_code', 'intitule', 'nbre_salles', 'nbre_salles_ouvertes', 'nbre_classes', 'est_programmee', 'dispose_convention_signee', 'est_livree', 'est_ouverte', 'est_resiliee', 'est_en_arret', 'modified_by', 'date_ouverture',
                'nombre_educatrices_total', 'nombre_educatrices_femme', 'nombre_educatrices_homme', 'saison_2020_2021_moyenne_section_filles', 'saison_2020_2021_moyenne_section_garcons', 'saison_2020_2021_grande_section_filles', 'saison_2020_2021_grande_section_garcons', 'saison_2021_2022_moyenne_section_filles', 'saison_2021_2022_moyenne_section_garcons', 'saison_2021_2022_grande_section_filles', 'saison_2021_2022_grande_section_garcons',
                'inscrits_primaire_total', 'inscrits_primaire_filles', 'inscrits_primaire_garcons', 'ms_passe_gs', 'ms_reinscrit_ms', 'ms_passe_primaire', 'gs_primaire', 'gs_refait_gs', 'nbre_arret_scolarite',
                'saison_2019_2020_total_global', 'saison_2019_2020_total_grande_section', 'saison_2019_2020_total_moyenne_section', 'saison_2019_2020_inscrits_primaire_total', 'saison_2019_2020_inscrits_primaire_filles', 'saison_2019_2020_inscrits_primaire_garcons', 'saison_2019_2020_ms_passe_gs', 'saison_2019_2020_ms_reinscrit_ms', 'saison_2019_2020_ms_passe_primaire', 'saison_2019_2020_gs_primaire', 'saison_2019_2020_gs_refait_gs', 'saison_2019_2020_nbre_arret_scolarite',

                'last_tranche',
                'last_delegation_dt'
            ],
            include: []
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
                    
                    //[sequelize.literal('(SELECT SUM(montant) FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id AND DelegationUnites.delegation_id IN (SELECT id FROM Delegations WHERE Delegations.nature_affectation = \'Fonctionnement\'))'), 'montant_delegue_fct'],
                    //[sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                    //[sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt'],
                
                    'montant_delegue_fct',
                    'last_tranche',
                    'last_delegation_dt'
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

                    //[sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                    //[sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt']
                
                    'last_tranche',
                    'last_delegation_dt'
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
