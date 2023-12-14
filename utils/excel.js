const Excel = require('exceljs-lightweight');

const helpers = require('./helpers');
const decoupage = helpers.decoupage;
const provinces = helpers.provinces
const fondations = helpers.fondations

const columns = [
  'id',
  'plan_actions', 'fondation_partenaire', 'annexe_administrative', 'province', 'commune', 'douar_quartier', 'code_douar', 'intitule',
  'type_unite', 'nbre_salles', 'nbre_classes', 'programme', 'montant_delegue', 'cout_travaux', 'cout_unitaire', 'cout_equipement', 'cout_fonctionnement',
  'montant_engage', 'montant_emis', 'date_lancement_trvx', 'tx_avancement_physique', 'statut', 'statut_latin', 'phase',
  'difficultes_rencontrees', 'date_ouverture', 'nombre_postes_total', 'nombre_educatrices_total', 'nombre_educatrices_femme', 'nombre_educatrices_homme',
  'dispose_eau',
  'saison_2022_2023_total_moyenne_section', 'saison_2022_2023_moyenne_section_filles',
  'saison_2022_2023_moyenne_section_garcons', 'saison_2022_2023_total_grande_section', 'saison_2022_2023_grande_section_filles',
  'saison_2022_2023_grande_section_garcons', 'saison_2022_2023_total_global',
  'saison_2022_2023_total_filles', 'saison_2022_2023_total_garcons',
  'proprietaire_foncier', 'mode_creation',

  'saison_2020_2021_total_moyenne_section', 'saison_2020_2021_moyenne_section_filles', 'saison_2020_2021_moyenne_section_garcons',
  'saison_2020_2021_total_grande_section', 'saison_2020_2021_grande_section_filles', 'saison_2020_2021_grande_section_garcons',
  'saison_2020_2021_total_global',
  'saison_2021_2022_total_moyenne_section', 'saison_2021_2022_moyenne_section_filles',
  'saison_2021_2022_moyenne_section_garcons', 'saison_2021_2022_total_grande_section', 'saison_2021_2022_grande_section_filles',
  'saison_2021_2022_grande_section_garcons', 'saison_2021_2022_total_global',
  'saison_2021_2022_total_filles', 'saison_2021_2022_total_garcons',
  'saison_2020_2021_total_filles', 'saison_2020_2021_total_garcons',
  'dispose_convention_signee', 'est_livree', 'est_ouverte', 'est_programmee', 'est_resiliee', 'est_ouverte_fp',
  'fp_id',
  
  'saison_2021_2022_inscrits_primaire_total', 'saison_2021_2022_inscrits_primaire_filles', 'saison_2021_2022_inscrits_primaire_garcons',
  'saison_2021_2022_ms_passe_gs', 'saison_2021_2022_ms_reinscrit_ms', 'saison_2021_2022_ms_passe_primaire', 'saison_2021_2022_gs_primaire',
  'saison_2021_2022_gs_refait_gs', 'saison_2021_2022_nbre_arret_scolarite',

  'saison_2019_2020_total_global',
  'saison_2019_2020_total_grande_section',
  'saison_2019_2020_total_moyenne_section',

  'saison_2019_2020_inscrits_primaire_total', 'saison_2019_2020_inscrits_primaire_filles', 'saison_2019_2020_inscrits_primaire_garcons',
  'saison_2019_2020_ms_passe_gs', 'saison_2019_2020_ms_reinscrit_ms', 'saison_2019_2020_ms_passe_primaire', 'saison_2019_2020_gs_primaire',
  'saison_2019_2020_gs_refait_gs', 'saison_2019_2020_nbre_arret_scolarite', 'fp_comments', 'comments',

  'saison_2022_2023_inscrits_primaire_total', 'saison_2022_2023_inscrits_primaire_filles',
  'saison_2022_2023_inscrits_primaire_garcons', 'saison_2022_2023_ms_passe_gs', 'saison_2022_2023_ms_reinscrit_ms',
  'saison_2022_2023_ms_passe_primaire', 'saison_2022_2023_gs_primaire', 'saison_2022_2023_gs_refait_gs',
  'saison_2022_2023_nbre_arret_scolarite',  'saison_2023_2024_moyenne_section_filles',
  'saison_2023_2024_moyenne_section_garcons', 'saison_2023_2024_total_moyenne_section',
  'saison_2023_2024_grande_section_filles', 'saison_2023_2024_grande_section_garcons',
  'saison_2023_2024_total_grande_section', 'saison_2023_2024_total_global', 'saison_2023_2024_total_filles',
  'saison_2023_2024_total_garcons',
  'saison_2023_2024_total_global_q'
]

const curr_saison = '2023_2024'

const fmpsMapping = {
  pa: 'plan_actions',
  fp: 'fondation_partenaire',
  up: 'intitule',
  douar: 'douar_quartier',
  ref_douar: 'code_douar',
  datedemiseenservice: 'date_ouverture',
  up_programmees: 'est_programmee',
  up_conv_signee: 'dispose_convention_signee',
  up_conventionnee: 'dispose_convention_signee',
  up_livrees: 'est_livree',
  up_ouvertes: 'est_ouverte_fp',
  up_resiliees: 'est_resiliee',
  nbr_salle: 'nbre_salles',
  nb_salle: 'nbre_salles',
  nb_classe: 'nbre_classes',
  total_educ: 'nombre_educatrices_total',
  nb_postes: 'nombre_postes_total',
  f: 'nombre_educatrices_femme',
  h: 'nombre_educatrices_homme',

  nb_enfants: `saison_${curr_saison}_total_global_q`,
  total_enf: `saison_${curr_saison}_total_global`,
  f_1: `saison_${curr_saison}_total_filles`,
  m: `saison_${curr_saison}_total_garcons`,
  gs: `saison_${curr_saison}_total_grande_section`,
  gs_f: `saison_${curr_saison}_grande_section_filles`,
  gs_m: `saison_${curr_saison}_grande_section_garcons`,
  ms: `saison_${curr_saison}_total_moyenne_section`,
  ms_f: `saison_${curr_saison}_moyenne_section_filles`,
  ms_g: `saison_${curr_saison}_moyenne_section_garcons`,

  nb_enfants_2022_2023: 'saison_2022_2023_total_global',
  nb_enfants_2021_2022: 'saison_2021_2022_total_global',


  enfant_2021: 'saison_2021_2022_total_global',
  gs_2021: 'saison_2021_2022_total_grande_section',
  ms_2021: 'saison_2021_2022_total_moyenne_section',

  enfant_2020: 'saison_2020_2021_total_global',
  gs_2020: 'saison_2020_2021_total_grande_section',
  ms_2020: 'saison_2020_2021_total_moyenne_section',
  id_dev_douar: 'fp_id',

  primaire: 'saison_2021_2022_inscrits_primaire_total',
  primaire_f: 'saison_2021_2022_inscrits_primaire_filles',
  primaire_m: 'saison_2021_2022_inscrits_primaire_garcons',
  ms_passe_gs: 'saison_2021_2022_ms_passe_gs',
  ms_reinscrit_ms: 'saison_2021_2022_ms_reinscrit_ms',
  ms_passe_primaire: 'saison_2021_2022_ms_passe_primaire',
  gs_primaire: 'saison_2021_2022_gs_primaire',
  gs_refait_gs: 'saison_2021_2022_gs_refait_gs',
  arret_scolarite: 'saison_2021_2022_nbre_arret_scolarite',

  enfant_2019: 'saison_2019_2020_total_global',
  gs_2019: 'saison_2019_2020_total_grande_section',
  ms_2019: 'saison_2019_2020_total_moyenne_section',
  primaire_1: 'saison_2019_2020_inscrits_primaire_total',
  primaire_f_1: 'saison_2019_2020_inscrits_primaire_filles',
  primaire_m_1: 'saison_2019_2020_inscrits_primaire_garcons',
  ms_passe_gs_1: 'saison_2019_2020_ms_passe_gs',
  ms_reinscrit_ms_1: 'saison_2019_2020_ms_reinscrit_ms',
  ms_passe_primaire_1: 'saison_2019_2020_ms_passe_primaire',
  gs_primaire_1: 'saison_2019_2020_gs_primaire',
  gs_refait_gs_1: 'saison_2019_2020_gs_refait_gs',
  arret_scolarite_1: 'saison_2019_2020_nbre_arret_scolarite'
}

const fzMapping = {
  id_cn: 'id',
  fp: 'fondation_partenaire',
  up_programmees: 'intitule',
  douar: 'douar_quartier',
  up_conv_signee: 'dispose_convention_signee',
  up_livrees: 'est_livree',
  up_ouvertes: 'est_ouverte_fp',
  nbr_salle_ouvertes: 'nbre_salles',
  nb_classe_groupe: 'nbre_classes',
  total_educ: 'nombre_educatrices_total',
  f: 'nombre_educatrices_femme',
  h: 'nombre_educatrices_homme',

  total_enf: `saison_${curr_saison}_total_global`,
  filles: `saison_${curr_saison}_total_filles`,
  garcons: `saison_${curr_saison}_total_garcons`,
  gs: `saison_${curr_saison}_total_grande_section`,
  gs_f: `saison_${curr_saison}_grande_section_filles`,
  gs_m: `saison_${curr_saison}_grande_section_garcons`,
  gs_g: `saison_${curr_saison}_grande_section_garcons`,
  ms: `saison_${curr_saison}_total_moyenne_section`,
  ms_f: `saison_${curr_saison}_moyenne_section_filles`,
  ms_g: `saison_${curr_saison}_moyenne_section_garcons`,
  ms_m: `saison_${curr_saison}_moyenne_section_garcons`,

  explication: 'fp_comments'
}

const alhaouzUPReportees2023 = [
  '25625',
'25627',
'25628',
'25656',
'25657',
'25629',
'39276',
'39213',
'24630',
'24627',
'24628',
'25615',
'25616',
'25617',
'25676',
'25677',
'25678',
'25679',
'25680',
'25681',
'25682',
'25683',
'25684',
'25685',
'25675',
'25619',
'25622',
'25623',
'25686',
'25687',
'25688',
'25689',
'25690',
'25691',
'25692',
'25728',
'25693',
'26056'
]

const formatCell = function (val) {
  if (val === null) return ''

  if (typeof (val) === 'string') {
    return val.match(/^\s*(NULL|-|_)\s*$/i) ? null : helpers.capitalizeFirstLetter(val.replace(/\s{2,}/g, ' ').trim())
  } else if (typeof (val) === 'object') {
    if (val.result !== undefined) return val.result
    if (val.richText !== undefined) return val.richText.map(txt => txt.text).join(' ').replace(/\s{2,}/g, ' ').trim()
    else if (val instanceof Date) return val
    else {
      return val.toString()
    }
  } else {
    return val
  }
}

const hideUncompleteFields = function (titles, fields) {
  var check = fields.map(function (f) {
    return titles.includes(f) ? 1 : 0;
  })
  
  if (check > 0 && check < fields.length) {
    titles = titles.filter(function (t) {
      if (fields.includes(t)) return false;
      return true;
    })
  }

  return titles;
}

var ExcelUtils = {
  readWorkbook: async (file, cfg) => {
    const workbook = new Excel.Workbook();
    let records = [];

    const nature = cfg.nature;
    const date_situation = new Date(parseInt(cfg.date_situation) * 1000);

    try {
      await workbook.xlsx.load(file.buffer, {
        dateFormats: ["YYYY-MM-DD HH:mm:ss.SSS", "DD/MM/YYYY"],
        dateUTC: true
      });

      //console.log(workbook)

      workbook.eachSheet(function (worksheet, sheetId) {
        //console.log(sheetId)
        const results = module.exports.readWorksheet(worksheet, sheetId, nature, date_situation)
        if (results) {
          records = records.concat(results)
        }
      });

    } catch (err) {
      console.error('readWorkbook error: ', err)
    }

    return records
  },

  readWorksheet: (worksheet, sheetId, nature, date_situation) => {
    let isColorChanged = false;
    let isColoured = false
    let previousFill

    const totalRow = worksheet.rowCount
    let row, i = 1

    let headers = []
    let titles = []
    let lines = []
    let continuousEmptyRows = 0
    let isHeaderEndDetected = false
    let firstHeaderCol

    const allRows = []
    let criticalErrorsCount = 0

    for (; i <= totalRow; i++) {
      row = worksheet.getRow(i)
      let values = row.values.map(val => formatCell(val))

      //if (i < 2) console.log(i, '-', values)

      // skip empty rows
      let vals = values.filter(v => v !== null && typeof(v) !== 'undefined');
      if (vals.length < 2 || [...new Set(vals)].length === 1) {
        ++continuousEmptyRows

        if (continuousEmptyRows > 10) {
          break
        }

        continue
      } else {
        continuousEmptyRows = 0
      }

      allRows.push(values)

      const colsCount = worksheet.columnCount
      let cell, j = 1
      let colorChecked = false

      if (!isHeaderEndDetected) {

        for (; j <= colsCount; j++) {
          cell = row.getCell(j)

          if (cell.value && !colorChecked) {
            colorChecked = true

            let cellClr = cell.fill && cell.fill.bgColor && cell.fill.bgColor.indexed
            isColoured = cellClr > 0
            isColorChanged = (previousFill && previousFill.bgColor && previousFill.bgColor.indexed) !== cellClr

            if (isColoured) {
              //console.debug(values, cell.fill)
              headers.push(values)
            } else if (isColorChanged && headers.length) {
              isHeaderEndDetected = true
              firstHeaderCol = headers[headers.length - 1].findIndex(val => val != null)
              break
            }

            previousFill = cell.fill
          }
        }
      }

      if (isHeaderEndDetected) {
        // first non empty value is so far
        //if (values.findIndex(val => val != null) > (firstHeaderCol + 2) && values.filter(val => val != null).length <= 2)
        lines.push(values)
      }

    }

    //console.log('headers found by color', headers)

    if (headers.length === 0) {
      // assume first line is header
      if (nature === 'FMPS') {
        headers = allRows.splice(0, 1)
        lines = allRows
      } else if (nature === 'FZ') {
        headers = allRows.splice(1, 2)
        lines = allRows

      }
    }

    //console.table(headers)

    // Process Headers
    const maxColumns = Math.max(...headers.map(hRow => hRow.length))

    let x = 0
    let combinedTitles

    for (; x < maxColumns; x++) {
      combinedTitles = headers.map(rowCells => {
        let col = helpers.findNonEmpty(rowCells, x)
        return helpers.variablize(col, false)
      }).filter(val => !!val)

      let title = [...new Set(combinedTitles)].join('_')
      if (title && titles.includes(title)) title += '_1'

      titles.push(title)
    }

    console.log('found titles', titles);

    let samples = lines.slice(10).reduce((acc, curr) => {
      if (!curr || !curr.length) return acc;

      curr.forEach((val, idx) => {
        acc[idx] = Array.isArray(curr[idx]) ? curr[idx] : [];
        acc[idx].push(val);
      })

      return acc;
    }, []);

    titles = module.exports.sanitizeColumns(titles, nature, samples);

    // check for total fields
    titles = hideUncompleteFields(titles, [`saison_${curr_saison}_grande_section_filles`, `saison_${curr_saison}_grande_section_garcons`, `saison_${curr_saison}_moyenne_section_garcons`, `saison_${curr_saison}_moyenne_section_filles`])
    titles = hideUncompleteFields(titles, ['nombre_educatrices_total', 'nombre_educatrices_femme', 'nombre_educatrices_homme'])

    //console.log('sanitized titles', titles);

    const data = lines.map(row => {
      let objRow = {}
      row.forEach((cell, colIdx) => {
        const title = titles[colIdx];
        objRow[title] = cell;

        if (title && (title.startsWith('est_') || title.startsWith('dispose_'))) {
          objRow[title] = helpers.parseBoolean(objRow[title]);
        }
      })

      if (nature === 'FMPS') {
        if (!objRow.plan_actions) {
          objRow.plan_actions = worksheet.name
        }
      } else if (nature === 'FZ') {
        if (!objRow.plan_actions && objRow.province) {
          const groups = objRow.province.match(/(\D+)[-\s]+(\d{4})/)
          const year = groups && groups[2]
          if (year) {
            objRow.plan_actions = year
            objRow.province = groups[1]
          } else {
            objRow.plan_actions = worksheet.name
          }
        }
      }

      if (objRow.plan_actions && isNaN(objRow.plan_actions)) {
        const anneeMatch = objRow.plan_actions.match(/\d{4}/)
        if (anneeMatch && anneeMatch[0]) objRow.plan_actions = anneeMatch[0]
      }
      
      if (objRow.fp_id == '42375' && objRow.plan_actions == '2019') {
        objRow.plan_actions = '2021'
      } else if (alhaouzUPReportees2023.includes(objRow.fp_id.toString()) && objRow.plan_actions == '2022') { // al haouz
        objRow.plan_actions = '2023'
      } else if (objRow.fp_id == '10154' && objRow.plan_actions == '2021') { // boulemane
        objRow.plan_actions = '2023'
      }  else if (objRow.fp_id == '52737' && objRow.plan_actions == '2020') { // fahs
        objRow.plan_actions = '2023'
      }

      if (objRow.province && !provinces.includes(objRow.province)) {
        objRow.province = helpers.closestEntry(objRow.province, provinces, true, true);
      }

      if (objRow.province) objRow.province_code = decoupage.find(rec => rec.label ===  objRow.province).value;
      if (!objRow.province_code) {
        console.log('no province', objRow);
        ++criticalErrorsCount;
      }

      if (criticalErrorsCount > 3) throw new Error('Must finish for serious error !')

      if (objRow.fp_id == '17147' && objRow.plan_actions == '2021' && objRow.province_code == 28) {
        return null;
      }


      if (objRow.fondation_partenaire) {
        objRow.fondation_partenaire = objRow.fondation_partenaire.toUpperCase()
      }

      if (!objRow.fondation_partenaire || !fondations.includes(objRow.fondation_partenaire)) {
        var provinceMatch = decoupage.find(rec => rec.label ===  objRow.province);
        objRow.fondation_partenaire = provinceMatch ? provinceMatch.fp : nature;
      }

      if (objRow.commune) {
        objRow.commune = helpers.titleCase(objRow.commune);
        let commune_code = helpers.getCommuneCode(objRow.commune, objRow.province_code);
        if (commune_code != null) {
          objRow.commune_code = commune_code;

          var communeMatch = helpers.communesCfg.find(comm => comm.value === commune_code);
          var cercleMatch = communeMatch ? helpers.cerclesCfg.find(cercle => cercle.value === communeMatch.cercle_code) : null;
          objRow.cercle_code = cercleMatch ? cercleMatch.value : null;
        }
      }

      let hasIntituleAndDouar = !!objRow.douar_quartier && !!objRow.intitule;

      if (objRow.douar_quartier) objRow.douar_quartier = helpers.titleCase(objRow.douar_quartier);

      if (objRow.intitule) {
        objRow.intitule = helpers.titleCase(objRow.intitule)
      } else {
        if (objRow.douar_quartier) objRow.intitule = objRow.douar_quartier
      }

      objRow.intitule = objRow.intitule ? helpers.sanitizeDouar(objRow.intitule) : null;

      if (!objRow.douar_quartier && objRow.intitule) {
        objRow.douar_quartier = objRow.intitule
      } else if (objRow.douar_quartier) {
        objRow.douar_quartier = helpers.sanitizeDouar(objRow.douar_quartier);
      }


      if (objRow.douar_quartier) {
        let douar_quartier = objRow.douar_quartier;
        douar_quartier = douar_quartier.replace(/\b(douar|up)\.?\b\s/ig, '');
        douar_quartier = douar_quartier.replace(/\s?\([a-zA-Zé ]+\)\s?/, "");
        douar_quartier = douar_quartier.replace(/^(ecole|nm_|nm_ecole)\s?/i, '');

        if (!hasIntituleAndDouar && (douar_quartier.match(/\d/g) || []).length === 1) {
          douar_quartier = douar_quartier.replace(/[\-\s]{0,2}[1-4][\-\s]{0,2}$/, '');
        }

        douar_quartier = helpers.titleCase(douar_quartier);
        objRow.douar_quartier = helpers.sanitizeDouar(douar_quartier);
      }

      if (objRow.date_ouverture) objRow.date_ouverture = helpers.extractDate(objRow.date_ouverture)

      if (objRow.est_ouverte_fp == null) objRow.est_ouverte_fp = false;

      if (objRow.id) {
        objRow.id = objRow.id.toLowerCase();
      }


      if (nature === 'FZ') {
        objRow.fp_id =  objRow.id //`${objRow.province_code}/${objRow.plan_actions}/${objRow.commune_code}/${helpers.nameSig(objRow.douar_quartier)}/${helpers.nameSig(objRow.intitule)}`; 
        objRow.nombre_postes_total = objRow.nombre_educatrices_total
      }

      if (objRow.est_ouverte_fp) {
        objRow.statut = 'Opérationnel';
        objRow.tx_avancement_physique = 100;
        objRow.est_ouverte = true;
      }

      if (objRow.est_resiliee) {
        objRow.operationnalite = 2

        if (objRow.est_ouverte_fp == true) {
          objRow.est_ouverte_fp = false;
        }

      } else if (objRow.est_ouverte_fp) {
        objRow.operationnalite = !objRow.saison_2023_2024_total_global ? 4 : 3
      } else if (objRow.date_ouverture != null || objRow.saison_2019_2020_total_global > 0 || objRow.saison_2020_2021_total_global > 0 || objRow.saison_2021_2022_total_global > 0 || objRow.saison_2022_2023_total_global > 0) {
        objRow.operationnalite = 1
      } else {
        objRow.operationnalite = 0
      }

      objRow.fp_code = objRow.fondation_partenaire === 'FMPS' ? 0 : 1;
      delete objRow.fondation_partenaire;

      delete objRow.province;

      objRow.date_situation = date_situation;

      if (objRow.fp_id == '1769') {
        console.log('ERRRRRR: ', objRow)
      }

      return objRow
    }).filter(row => row && !!row.intitule)

    console.debug("Headers", titles, maxColumns)
    //console.debug(data, nature)
    return data
  },


  sanitizeColumns: (titles, nature, samples) => {
    const result = [];

    titles.forEach(function (col) {
      if (columns.includes(col)) {
        result.push(col);
        return;
      }

      let mapping

      if (nature === 'FMPS') mapping = fmpsMapping
      else if (nature === 'FZ') mapping = fzMapping

      col = mapping && mapping[col] || col

      if (columns.includes(col)) {
        if (col === 'est_programmee') {
          const nbreMinChars = Math.min(...samples.map(val => typeof (val) === 'string' ? val.length : 0).filter(val => val > 0))
          if (nbreMinChars > 3 && result.indexOf('intitule') === -1) {
            col = 'intitule'
          }
        }

        if (result.indexOf(col) === -1) {
          result.push(col);
          return;
        }
      }


      const near = helpers.closestEntry(col, columns, true, false, 0.6);

      if (near && result.indexOf(near) === -1) {
        result.push(near);
        return;
      }

      result.push(col);
    })


    return result
  }
}

module.exports = ExcelUtils