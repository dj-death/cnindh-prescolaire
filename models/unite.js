"use strict";
const { Sequelize } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
    var Douar = require('./douar');
    
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
        cercle_code: { type: Sequelize.INTEGER, allowNull: true },
        commune_code: { type: Sequelize.INTEGER, allowNull: false },
        commune: { type: Sequelize.STRING, searchable: true },
        douar_quartier: { type: Sequelize.STRING, searchable: true },
        code_douar: {
            type: Sequelize.STRING,
            searchable: true,
            references: {
              model: Douar,
              key: 'code_douar'
            }
        },

        code_hcp: {
            type: Sequelize.STRING,
            allowNull: true,
            searchable: true
        },

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
        est_programmee_pp: { type: Sequelize.BOOLEAN, defaultValue: true },
        est_livree: { type: Sequelize.BOOLEAN, defaultValue: true },
        est_ouverte: { type: Sequelize.BOOLEAN, allowNull: true },
        est_ouverte_bilan2022: { type: Sequelize.BOOLEAN, allowNull: true },
        est_ouverte_fp: { type: Sequelize.BOOLEAN, allowNull: true },
        est_resiliee: { type: Sequelize.BOOLEAN, defaultValue: false },
        operationnalite: { type: Sequelize.INTEGER },
        est_en_arret: { type: Sequelize.BOOLEAN, defaultValue: false },

        est_composee: { type: Sequelize.BOOLEAN, defaultValue: false },


        est_retenue: { type: Sequelize.BOOLEAN, allowNull: true },
        objet_etude_impact: { type: Sequelize.BOOLEAN, allowNull: true },
        
        nombre_educatrices_femme: { type: Sequelize.INTEGER },
        nombre_educatrices_homme: { type: Sequelize.INTEGER },
        nombre_educatrices_total: { type: Sequelize.INTEGER },
        nombre_postes_total: { type: Sequelize.INTEGER },

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
        saison_2021_2022_total_global: { type: Sequelize.INTEGER },

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
        saison_2022_2023_total_filles: { type: Sequelize.INTEGER },
        saison_2022_2023_total_garcons: { type: Sequelize.INTEGER },
        
        saison_2021_2022_inscrits_primaire_total: { type: Sequelize.INTEGER },
        saison_2021_2022_inscrits_primaire_filles: { type: Sequelize.INTEGER },
        saison_2021_2022_inscrits_primaire_garcons: { type: Sequelize.INTEGER },
        saison_2021_2022_ms_passe_gs: { type: Sequelize.INTEGER },
        saison_2021_2022_ms_reinscrit_ms: { type: Sequelize.INTEGER },
        saison_2021_2022_ms_passe_primaire: { type: Sequelize.INTEGER },
        saison_2021_2022_gs_primaire: { type: Sequelize.INTEGER },
        saison_2021_2022_gs_refait_gs: { type: Sequelize.INTEGER },
        saison_2021_2022_nbre_arret_scolarite: { type: Sequelize.INTEGER },


        saison_2022_2023_inscrits_primaire_total: { type: Sequelize.INTEGER },
        saison_2022_2023_inscrits_primaire_filles: { type: Sequelize.INTEGER },
        saison_2022_2023_inscrits_primaire_garcons: { type: Sequelize.INTEGER },
        saison_2022_2023_ms_passe_gs: { type: Sequelize.INTEGER },
        saison_2022_2023_ms_reinscrit_ms: { type: Sequelize.INTEGER },
        saison_2022_2023_ms_passe_primaire: { type: Sequelize.INTEGER },
        saison_2022_2023_gs_primaire: { type: Sequelize.INTEGER },
        saison_2022_2023_gs_refait_gs: { type: Sequelize.INTEGER },
        saison_2022_2023_nbre_arret_scolarite: { type: Sequelize.INTEGER },

        saison_2023_2024_moyenne_section_filles: { type: Sequelize.INTEGER },
        saison_2023_2024_moyenne_section_garcons: { type: Sequelize.INTEGER },
        saison_2023_2024_total_moyenne_section: { type: Sequelize.INTEGER },
        saison_2023_2024_grande_section_filles: { type: Sequelize.INTEGER },
        saison_2023_2024_grande_section_garcons: { type: Sequelize.INTEGER },
        saison_2023_2024_total_grande_section: { type: Sequelize.INTEGER },
        saison_2023_2024_total_global: { type: Sequelize.INTEGER },
        saison_2023_2024_total_filles: { type: Sequelize.INTEGER },
        saison_2023_2024_total_garcons: { type: Sequelize.INTEGER },
        saison_2023_2024_total_global_q: { type: Sequelize.INTEGER },
        
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
                var img = this.getDataValue('images');
                if (!img) return null;

                return  JSON.parse(img);
            },
            set: function (value) {
                if (!value) return null;
                return this.setDataValue('images', value);
            }
        },

        fp_id: {
            type: Sequelize.STRING,
            allowNull: false,
            searchable: true,
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
        trans_fiche_completee: { type: Sequelize.BOOLEAN, allowNull: true },
        trans_situation_financiere_regularisee: { type: Sequelize.BOOLEAN, allowNull: true },
        trans_retenue_phase1: { type: Sequelize.BOOLEAN, allowNull: true },

        trans_retenue_phase2: { type: Sequelize.BOOLEAN, allowNull: true },
        trans_phase2_fiche_completee: { type: Sequelize.BOOLEAN, allowNull: true },
        trans_phase2_situation_financiere_regularisee: { type: Sequelize.BOOLEAN, allowNull: true }
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
        Model.belongsTo(models.Unite, { as: 'parent_up', constraints: false });
        Model.belongsTo(models.Douar, { as: 'douar', constraints: false, foreignKey: 'code_douar', targetKey: 'code_douar' });

        Model.belongsToMany(models.Delegation, {
            through: models.DelegationUnites,
            as: 'delegations',
            foreignKey: 'unite_id',
            otherKey: 'delegation_id'
        });

        const commonAttrs = [
            'id', 'fp_id', 'fp_code', 'fp_comments', 'date_situation',
                'province_code', 'cercle_code', 'commune', 'commune_code', 'douar_quartier', 
                'plan_actions', 'intitule', //'parentupid',
                'nbre_salles', 'nbre_salles_ouvertes', 'nbre_classes', 
                'est_ouverte', 'est_ouverte_fp', 'est_resiliee', 'operationnalite', 'est_en_arret', 'date_ouverture', 'est_programmee_pp',
                'nombre_educatrices_total', 'nombre_postes_total', 'nombre_educatrices_femme', 'nombre_educatrices_homme', 
                'saison_2023_2024_total_global', 'saison_2023_2024_total_global_q', 'saison_2022_2023_total_global',
                'saison_2023_2024_moyenne_section_filles', 'saison_2023_2024_moyenne_section_garcons', 'saison_2023_2024_grande_section_filles', 'saison_2023_2024_grande_section_garcons',
                'saison_2022_2023_moyenne_section_filles', 'saison_2022_2023_moyenne_section_garcons', 'saison_2022_2023_grande_section_filles', 'saison_2022_2023_grande_section_garcons',
                'saison_2023_2024_total_moyenne_section', 'saison_2023_2024_total_grande_section', 'saison_2023_2024_total_filles', 'saison_2023_2024_total_garcons',
                'saison_2022_2023_inscrits_primaire_total', 'saison_2022_2023_inscrits_primaire_filles',
                'saison_2022_2023_inscrits_primaire_garcons', 'saison_2022_2023_ms_passe_gs', 'saison_2022_2023_ms_reinscrit_ms',
                'saison_2022_2023_ms_passe_primaire', 'saison_2022_2023_gs_primaire', 'saison_2022_2023_gs_refait_gs', 'saison_2022_2023_nbre_arret_scolarite',

                'trans_fiche_completee', 'trans_situation_financiere_regularisee', 'trans_retenue_phase1',
                'trans_retenue_phase2', 'trans_phase2_fiche_completee', 'trans_phase2_situation_financiere_regularisee',
                'comments', 'statut',
                
                [sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                [sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt'],
                [sequelize.literal('(SELECT array_to_string(array_agg(tranche_no ORDER BY tranche_no ASC), \',\') FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'tranches']
        ]

        Model.addScope('browse', {
            attributes: commonAttrs,
            include: []
        });

        Model.addScope('targa', {
            attributes: [
                ...commonAttrs,
                'code_douar'
            ],
            
            include: [
                { 
                    model: models.Douar,
                    as: 'douar',
                    attributes: [
                        'nom_fr', 'est_sousdouar'
                    ]
                }
            ]
        });

        Model.addScope('browse_effectifs', {
            attributes: {
                include: [
                    [sequelize.literal('(SELECT MAX(tranche_no) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_tranche'],
                    [sequelize.literal('(SELECT MAX(date_delegation) FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'last_delegation_dt']
                ]
            },
            include: []
        });

        Model.addScope('browse_tranches', {
            attributes: {
                
                include: [
                    [sequelize.literal('(SELECT array_to_string(array_agg(tranche_no ORDER BY tranche_no ASC), \',\') FROM Delegations WHERE Delegations.id IN (SELECT delegation_id FROM DelegationUnites WHERE DelegationUnites.unite_id = Unite.id))'), 'tranches']
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
                    'est_en_arret', 'operationnalite',

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
                    'operationnalite',

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
