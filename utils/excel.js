const Excel = require('exceljs-lightweight');

const helpers = require('./helpers');
const decoupage = helpers.decoupage;
const provinces = helpers.provinces
const fondations = helpers.fondations

const columns = [
  'id',
  'plan_actions', 'fondation_partenaire', 'annexe_administrative', 'province', 'commune', 'douar_quartier', 'intitule',
  'type_unite', 'nbre_salles', 'nbre_classes', 'programme', 'montant_delegue', 'cout_travaux', 'cout_unitaire', 'cout_equipement', 'cout_fonctionnement',
  'montant_engage', 'montant_emis', 'date_lancement_trvx', 'tx_avancement_physique', 'statut', 'statut_latin', 'phase',
  'difficultes_rencontrees', 'date_ouverture', 'nombre_educatrices_total', 'nombre_educatrices_femme', 'nombre_educatrices_homme',
  'saison_2020_2021_total_moyenne_section', 'saison_2020_2021_moyenne_section_filles', 'saison_2020_2021_moyenne_section_garcons',
  'saison_2020_2021_total_grande_section', 'saison_2020_2021_grande_section_filles', 'saison_2020_2021_grande_section_garcons',
  'saison_2020_2021_total_global',
  'saison_2021_2022_total_moyenne_section', 'saison_2021_2022_moyenne_section_filles',
  'saison_2021_2022_moyenne_section_garcons', 'saison_2021_2022_total_grande_section', 'saison_2021_2022_grande_section_filles',
  'saison_2021_2022_grande_section_garcons', 'saison_2021_2022_total_global',

  'saison_2021_2022_total_filles', 'saison_2021_2022_total_garcons',
  'saison_2020_2021_total_filles', 'saison_2020_2021_total_garcons',
  'dispose_convention_signee', 'est_livree', 'est_ouverte', 'est_programmee', 'est_resiliee',
  'fp_id', 'inscrits_primaire_total', 'inscrits_primaire_filles', 'inscrits_primaire_garcons', 'ms_passe_gs', 'ms_reinscrit_ms', 'ms_passe_primaire', 'gs_primaire', 'gs_refait_gs', 'nbre_arret_scolarite',

  'saison_2019_2020_total_global', 'saison_2019_2020_total_grande_section', 'saison_2019_2020_total_moyenne_section', 'saison_2019_2020_inscrits_primaire_total', 'saison_2019_2020_inscrits_primaire_filles', 'saison_2019_2020_inscrits_primaire_garcons', 'saison_2019_2020_ms_passe_gs', 'saison_2019_2020_ms_reinscrit_ms', 'saison_2019_2020_ms_passe_primaire', 'saison_2019_2020_gs_primaire', 'saison_2019_2020_gs_refait_gs', 'saison_2019_2020_nbre_arret_scolarite'
]

const fmpsMapping = {
  pa: 'plan_actions',
  fp: 'fondation_partenaire',
  up: 'intitule',
  douar: 'douar_quartier',
  datedemiseenservice: 'date_ouverture',
  up_programmees: 'est_programmee',
  up_conv_signee: 'dispose_convention_signee',
  up_conventionnee: 'dispose_convention_signee',
  up_livrees: 'est_livree',
  up_ouvertes: 'est_ouverte',
  up_resiliees: 'est_resiliee',
  nbr_salle: 'nbre_salles',
  nb_salle: 'nbre_salles',
  nb_classe: 'nbre_classes',
  total_educ: 'nombre_educatrices_total',
  nb_postes: 'nombre_educatrices_total',
  f: 'nombre_educatrices_femme',
  h: 'nombre_educatrices_homme',
  total_enf: 'saison_2021_2022_total_global',
  nb_enfants_2021_2022: 'saison_2021_2022_total_global',
  f_1: 'saison_2021_2022_total_filles',
  m: 'saison_2021_2022_total_garcons',
  gs: 'saison_2021_2022_total_grande_section',
  gs_f: 'saison_2021_2022_grande_section_filles',
  gs_m: 'saison_2021_2022_grande_section_garcons',
  ms: 'saison_2021_2022_total_moyenne_section',
  ms_f: 'saison_2021_2022_moyenne_section_filles',
  ms_g: 'saison_2021_2022_moyenne_section_garcons',
  enfant_2020: 'saison_2020_2021_total_global',
  gs_2020: 'saison_2020_2021_total_grande_section',
  ms_2020: 'saison_2020_2021_total_moyenne_section',
  id_dev_douar: 'fp_id',
  primaire: 'inscrits_primaire_total',
  primaire_f: 'inscrits_primaire_filles',
  primaire_m: 'inscrits_primaire_garcons',
  ms_passe_gs: 'ms_passe_gs',
  ms_reinscrit_ms: 'ms_reinscrit_ms',
  ms_passe_primaire: 'ms_passe_primaire',
  gs_primaire: 'gs_primaire',
  gs_refait_gs: 'gs_refait_gs',
  arret_scolarite: 'nbre_arret_scolarite',


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
  up_ouvertes: 'est_ouverte',
  nbr_salle_ouvertes: 'nbre_salles',
  nb_classe_groupe: 'nbre_classes',
  total_educ: 'nombre_educatrices_total',
  f: 'nombre_educatrices_femme',
  h: 'nombre_educatrices_homme',
  annee_scolaire_2021_22_total_enf: 'saison_2021_2022_total_global',
  annee_scolaire_2021_22_f: 'saison_2021_2022_total_filles',
  annee_scolaire_2021_22_m: 'saison_2021_2022_total_garcons',
  annee_scolaire_2021_22_gs: 'saison_2021_2022_total_grande_section',
  annee_scolaire_2021_22_gs_f: 'saison_2021_2022_grande_section_filles',
  annee_scolaire_2021_22_gs_m: 'saison_2021_2022_grande_section_garcons',
  annee_scolaire_2021_22_ms: 'saison_2021_2022_total_moyenne_section',
  annee_scolaire_2021_22_ms_f: 'saison_2021_2022_moyenne_section_filles',
  annee_scolaire_2021_22_ms_g: 'saison_2021_2022_moyenne_section_garcons',
  explication: 'fp_comments'
}

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

var ExcelUtils = {
  readWorkbook: async (file, nature) => {
    const workbook = new Excel.Workbook();
    let records = []

    try {
      await workbook.xlsx.load(file.buffer, {
        dateFormats: ["YYYY-MM-DD HH:mm:ss.SSS", "DD/MM/YYYY"],
        dateUTC: true
      });

      workbook.eachSheet(function (worksheet, sheetId) {
        //console.log(sheetId)
        const results = module.exports.readWorksheet(worksheet, sheetId, nature)
        if (results) {
          records = records.concat(results)
        }
      });

    } catch (err) {
      console.error(err)
    }

    return records
  },

  readWorksheet: (worksheet, sheetId, nature) => {
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

    for (; i <= totalRow; i++) {
      row = worksheet.getRow(i)
      let values = row.values.map(val => formatCell(val))
      // skip empty rows
      if (!values.length) {
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

    if (headers.length === 0) {
      // assume first line is header
      headers = allRows.splice(0, 1)
      lines = allRows
    }

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

    console.log(titles);

    let samples = lines.slice(10).reduce((acc, curr) => {
      if (!curr || !curr.length) return acc;

      curr.forEach((val, idx) => {
        acc[idx] = Array.isArray(curr[idx]) ? curr[idx] : [];
        acc[idx].push(val);
      })

      return acc;
    }, []);

    titles = module.exports.sanitizeColumns(titles, nature, samples);

    const data = lines.map(row => {
      let objRow = {}
      row.forEach((cell, colIdx) => {
        const title = titles[colIdx];
        objRow[title] = cell;

        if (title.startsWith('est_') || title.startsWith('dispose_')) {
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

      if (objRow.province && !provinces.includes(objRow.province)) {
        objRow.province = helpers.closestEntry(objRow.province, provinces, true, true);
      }

      if (objRow.province) objRow.province_code = decoupage.find(rec => rec.label ===  objRow.province).value;
      if (!objRow.province_code) {
        console.log(objRow.province);
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
        objRow.commune_code = commune_code;

        var communeMatch = helpers.communesCfg.find(comm => comm.value === commune_code);
        var cercleMatch = communeMatch ? helpers.cerclesCfg.find(cercle => cercle.value === communeMatch.cercle_code) : null;
        objRow.cercle_code = cercleMatch ? cercleMatch.value : null;
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

      if (objRow.est_ouverte == null) objRow.est_ouverte = false;

      if (nature === 'FZ') {
        objRow.fp_id =  `${objRow.province_code}/${objRow.plan_actions}/${objRow.commune_code}/${helpers.nameSig(objRow.douar_quartier)}/${helpers.nameSig(objRow.intitule)}`; 

        if (!objRow.est_ouverte && objRow.est_livree && objRow.date_ouverture && objRow.fp_comments) {
          objRow.est_ouverte = true
          objRow.est_en_arret = true
        }
      }

      if (objRow.id) objRow.id = objRow.id.toLowerCase();


      if (objRow.est_ouverte) {
        objRow.statut = 'Opérationnel';
        objRow.tx_avancement_physique = 100;
      }

      objRow.fp_code = objRow.fondation_partenaire === 'FMPS' ? 0 : 1;
      delete objRow.fondation_partenaire;

      delete objRow.province;

      objRow.date_situation = new Date();

      return objRow
    }).filter(row => !!row.intitule)

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