"use strict";

const config = require('../utils/config');
const latinize = require('latinize');
const moment = require('moment');
const accents = require('remove-accents');
const { transliterate } = require('transliteration');
const unvowel = require('unvowel');

const {lig2} = require('talisman/metrics/lig');
const namesig = require('talisman/keyers/name-sig');
const { NumberToLetter } = require("convertir-nombre-lettre");

const decoupage = [
    {
        "value": 1,
        "label": "Tanger-Assilah",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS",
        "email": "Wdas.tanger@gmail.com"
    },
    {
        "value": 2,
        "label": "M’diq-Fnideq",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS"
    },
    {
        "value": 3,
        "label": "Tétouan",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS",
        "email": "brirhetm@gmail.com"
    },
    {
        "value": 4,
        "label": "Fahs-Anjra",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS",
        "email": "Tassammite.mohammed@gmail.com"
    },
    {
        "value": 5,
        "label": "Larache",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FZ",
        "email": "Taimi.outhman@gmail.com"
    },
    {
        "value": 6,
        "label": "Al Hoceima",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS",
        "email": "dasalhoceima@gmail.com"
    },
    {
        "value": 7,
        "label": "Chefchaouen",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FZ",
        "email": "mrinimd@gmail.com"
    },
    {
        "value": 8,
        "label": "Ouezzane",
        "region_code": 0,
        "region": "Tanger-Tétouan-Al Hoceima",
        "fp": "FMPS"
    },
    {
        "value": 9,
        "label": "Oujda-Angad",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "Hafida.mi@hotmail.fr"
    },
    {
        "value": 10,
        "label": "Nador",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "mohamedwariachi@yahoo.fr"
    },
    {
        "value": 11,
        "label": "Driouch",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "Abdellaari@gmail.com"
    },
    {
        "value": 12,
        "label": "Jerada",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "Jalal.tagmouti@gmail.com"
    },
    {
        "value": 13,
        "label": "Berkane",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FZ",
        "email": "Mohammed.mimouni@hotmail.com"
    },
    {
        "value": 14,
        "label": "Taourirt",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "AKHTIB@taourirt.interieur.gov.ma"
    },
    {
        "value": 15,
        "label": "Guercif",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "dasguercif@gmail.com"
    },
    {
        "value": 16,
        "label": "Figuig",
        "region_code": 1,
        "region": "L’Oriental",
        "fp": "FMPS",
        "email": "dassgprfiguig@yahoo.fr"
    },
    {
        "value": 17,
        "label": "Fès",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "ramibahae@yahoo.fr"
    },
    {
        "value": 18,
        "label": "Meknès",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "dasmeknes@gmail.com"
    },
    {
        "value": 19,
        "label": "El Hajeb",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "daselhajeb@yahoo.fr"
    },
    {
        "value": 20,
        "label": "Ifrane",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": ""
    },
    {
        "value": 21,
        "label": "Moulay Yacoub",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "dasmyyacoub@gmail.com"
    },
    {
        "value": 22,
        "label": "Sefrou",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": ""
    },
    {
        "value": 23,
        "label": "Boulemane",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "dascomboulemane@gmail.com"
    },
    {
        "value": 24,
        "label": "Taounate",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "aminaoufal@gmail.com"
    },
    {
        "value": 25,
        "label": "Taza",
        "region_code": 2,
        "region": "Fès-Meknès",
        "fp": "FMPS",
        "email": "Abdelkrim.mouhoute@gmail.com"
    },
    {
        "value": 26,
        "label": "Rabat",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "email": "mbellakbircharfi@rabat.interieur.gov.ma"
    },
    {
        "value": 27,
        "label": "Salé",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FZ",
        "email": ""
    },
    {
        "value": 28,
        "label": "Skhirate-Témara",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FMPS",
        "email": "rguignaoual@hotmail.com/ addi.afnane@gmail.com"
    },
    {
        "value": 29,
        "label": "Kénitra",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FMPS",
        "email": "ebtissamwilaya@gmail.com"
    },
    {
        "value": 30,
        "label": "Khémisset",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FMPS",
        "email": "Dassfrc05@gmail.com"
    },
    {
        "value": 31,
        "label": "Sidi Kacem",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FZ",
        "email": ""
    },
    {
        "value": 32,
        "label": "Sidi Slimane",
        "region_code": 3,
        "region": "Rabat-Salé-Kénitra",
        "fp": "FMPS",
        "email": "Das.sidislimane@gmail.com"
    },
    {
        "value": 33,
        "label": "Béni Mellal",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FMPS",
        "email": "Jaberabderrahman@yahoo.fr"
    },
    {
        "value": 34,
        "label": "Azilal",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FMPS",
        "email": "azilaldas@gmail.com"
    },
    {
        "value": 35,
        "label": "Fquih Ben Salah",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FZ",
        "email": "larbi.bouabidi@gmail.com"
    },
    {
        "value": 36,
        "label": "Khénifra",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FMPS",
        "email": "Ziani_das@yahoo.fr"
    },
    {
        "value": 37,
        "label": "Khouribga",
        "region_code": 4,
        "region": "Beni Mellal-Khénifra",
        "fp": "FZ",
        "email": "daskhouribga@gmail.com"
    },
    {
        "value": 38,
        "label": "Casablanca",
        "region_code": 5,
        "region": "Casablanca-Settat"
    },
    {
        "value": 39,
        "label": "Mohammadia",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FZ"
    },
    {
        "value": 40,
        "label": "El Jadida",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "m.houboub@gmail.com"
    },
    {
        "value": 41,
        "label": "Nouaceur",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "Das.prnouaceur@gmail.com"
    },
    {
        "value": 42,
        "label": "Médiouna",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS"
    },
    {
        "value": 43,
        "label": "Benslimane",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "hassandas@gmail.com"
    },
    {
        "value": 44,
        "label": "Berrechid",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "das.berrechid@gmail.com"
    },
    {
        "value": 45,
        "label": "Settat",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FZ",
        "email": "dasettat@gmail.com"
    },
    {
        "value": 46,
        "label": "Sidi Bennour",
        "region_code": 5,
        "region": "Casablanca-Settat",
        "fp": "FMPS",
        "email": "Indh.sidibennour@gmail.com"
    },
    {
        "value": 47,
        "label": "Marrakech",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "Anouar.dbira@gmail.com"
    },
    {
        "value": 48,
        "label": "Chichaoua",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FZ",
        "email": "Loudinisa1966@gmail.com"
    },
    {
        "value": 49,
        "label": "Al Haouz",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "dashaouz@gmail.com"
    },
    {
        "value": 50,
        "label": "El Kelâa des Sraghna",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FZ",
        "email": "m002siraj@yahoo.fr"
    },
    {
        "value": 51,
        "label": "Essaouira",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "khairiprovince@gmail.com"
    },
    {
        "value": 52,
        "label": "Rehamna",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "dasrhamna@gmail.com"
    },
    {
        "value": 53,
        "label": "Safi",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "mi.dassafi@gmail.com"
    },
    {
        "value": 54,
        "label": "Youssoufia",
        "region_code": 6,
        "region": "Marrakech-Safi",
        "fp": "FMPS",
        "email": "dasprovinceyoussoufia@gmail.com"
    },
    {
        "value": 55,
        "label": "Errachidia",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "tzeggwagh@gmail.com"
    },
    {
        "value": 56,
        "label": "Ouarzazate",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "dasouarzazate@gmail.com"
    },
    {
        "value": 57,
        "label": "Midelt",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "dasmidelt@gmail.com"
    },
    {
        "value": 58,
        "label": "Tinghir",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "indhtinghir@gmail.com"
    },
    {
        "value": 59,
        "label": "Zagora",
        "region_code": 7,
        "region": "Drâa-Tafilalet",
        "fp": "FMPS",
        "email": "hassanbtb@gmail.com"
    },
    {
        "value": 60,
        "label": "Agadir-Ida-Ou-Tanane",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FMPS",
        "email": "benkiranesaloua@gmail.com"
    },
    {
        "value": 61,
        "label": "Inezgane-Aït Melloul",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FMPS",
        "email": "draissislimane@gmail.com"
    },
    {
        "value": 62,
        "label": "Chtouka-Aït Baha",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FZ",
        "email": "Das.chtouka@gmail.com"
    },
    {
        "value": 63,
        "label": "Taroudannt",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FZ",
        "email": "dastaroudannt@taroudann.interieur.gov.ma"
    },
    {
        "value": 64,
        "label": "Tiznit",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FZ",
        "email": "dastiznit@gmail.com"
    },
    {
        "value": 65,
        "label": "Tata",
        "region_code": 8,
        "region": "Souss-Massa",
        "fp": "FZ",
        "email": "Mkhaldi6@gmail.com"
    },
    {
        "value": 66,
        "label": "Guelmim",
        "region_code": 9,
        "region": "Guelmim-Oued Noun",
        "fp": "FMPS",
        "email": "M.joumani@gmail.com"
    },
    {
        "value": 67,
        "label": "Assa-Zag",
        "region_code": 9,
        "region": "Guelmim-Oued Noun",
        "fp": "FMPS",
        "email": ""
    },
    {
        "value": 68,
        "label": "Tan-Tan",
        "region_code": 9,
        "region": "Guelmim-Oued Noun",
        "fp": "FMPS",
        "email": "dastantan@yahoo.fr"
    },
    {
        "value": 69,
        "label": "Sidi Ifni",
        "region_code": 9,
        "region": "Guelmim-Oued Noun",
        "fp": "FMPS",
        "email": "dassidiifni@gmail.com"
    },
    {
        "value": 70,
        "label": "Laâyoune",
        "region_code": 10,
        "region": "Laâyoune-Sakia Al Hamra",
        "fp": "FMPS",
        "email": "dailadaila1972@gmail.com"
    },
    {
        "value": 71,
        "label": "Boujdour",
        "region_code": 10,
        "region": "Laâyoune-Sakia Al Hamra",
        "fp": "FMPS",
        "email": "boujdourprovince@yahoo.fr"
    },
    {
        "value": 72,
        "label": "Tarfaya",
        "region_code": 10,
        "region": "Laâyoune-Sakia Al Hamra",
        "fp": "FMPS",
        "email": "Talbi.hasanna@gmail.com"
    },
    {
        "value": 73,
        "label": "Es-Semara",
        "region_code": 10,
        "region": "Laâyoune-Sakia Al Hamra",
        "email": ""
    },
    {
        "value": 74,
        "label": "Oued Ed-Dahab",
        "region_code": 11,
        "region": "Dakhla-Oued Eddahab",
        "fp": "FMPS",
        "email": "DAS@ouededdahab.interieur.gov.ma"
    },
    {
        "value": 75,
        "label": "Aousserd",
        "region_code": 11,
        "region": "Dakhla-Oued Eddahab",
        "fp": "FMPS",
        "email": "dasprovinceaousserd@gmail.com"
    }
];

const decoupageRegions = [
    {
        "value": 0,
        "label": "Tanger-Tétouan-Al Hoceima",
        "provinces": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8
        ]
    },
    {
        "value": 1,
        "label": "L’Oriental",
        "provinces": [
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16
        ]
    },
    {
        "value": 2,
        "label": "Fès-Meknès",
        "provinces": [
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25
        ]
    },
    {
        "value": 3,
        "label": "Rabat-Salé-Kénitra",
        "provinces": [
            26,
            27,
            28,
            29,
            30,
            31,
            32
        ]
    },
    {
        "value": 4,
        "label": "Beni Mellal-Khénifra",
        "provinces": [
            33,
            34,
            35,
            36,
            37
        ]
    },
    {
        "value": 5,
        "label": "Casablanca-Settat",
        "provinces": [
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46
        ]
    },
    {
        "value": 6,
        "label": "Marrakech-Safi",
        "provinces": [
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54
        ]
    },
    {
        "value": 7,
        "label": "Drâa-Tafilalet",
        "provinces": [
            55,
            56,
            57,
            58,
            59
        ]
    },
    {
        "value": 8,
        "label": "Souss-Massa",
        "provinces": [
            60,
            61,
            62,
            63,
            64,
            65
        ]
    },
    {
        "value": 9,
        "label": "Guelmim-Oued Noun",
        "provinces": [
            66,
            67,
            68,
            69
        ]
    },
    {
        "value": 10,
        "label": "Laâyoune-Sakia Al Hamra",
        "provinces": [
            70,
            71,
            72,
            73
        ]
    },
    {
        "value": 11,
        "label": "Dakhla-Oued Eddahab",
        "provinces": [
            74,
            75
        ]
    }
];

var communesCfg = [
    {
        "value": 1,
        "province_code": 6,
        "cercle_code": null,
        "label": "Al Hoceima",
        "altLabel": null
    },
    {
        "value": 2,
        "province_code": 6,
        "cercle_code": null,
        "label": "Bni Bouayach",
        "altLabel": null
    },
    {
        "value": 3,
        "province_code": 6,
        "cercle_code": null,
        "label": "Imzouren",
        "altLabel": null
    },
    {
        "value": 4,
        "province_code": 6,
        "cercle_code": null,
        "label": "Targuist",
        "altLabel": null
    },
    {
        "value": 5,
        "province_code": 6,
        "cercle_code": null,
        "label": "Ajdir",
        "altLabel": null
    },
    {
        "value": 6,
        "province_code": 6,
        "cercle_code": 1,
        "label": "Bni Boufrah",
        "altLabel": null
    },
    {
        "value": 7,
        "province_code": 6,
        "cercle_code": 1,
        "label": "Bni Gmil",
        "altLabel": null
    },
    {
        "value": 8,
        "province_code": 6,
        "cercle_code": 1,
        "label": "Bni Gmil Maksouline",
        "altLabel": null
    },
    {
        "value": 9,
        "province_code": 6,
        "cercle_code": 1,
        "label": "Senada",
        "altLabel": null
    },
    {
        "value": 10,
        "province_code": 6,
        "cercle_code": 194,
        "label": "Ait Kamra",
        "altLabel": null
    },
    {
        "value": 11,
        "province_code": 6,
        "cercle_code": 2,
        "label": "Ait Youssef Ou Ali",
        "altLabel": null
    },
    {
        "value": 12,
        "province_code": 6,
        "cercle_code": 2,
        "label": "Arbaa Taourirt",
        "altLabel": null
    },
    {
        "value": 13,
        "province_code": 6,
        "cercle_code": 194,
        "label": "Bni Abdallah",
        "altLabel": "Bni Abdellah"
    },
    {
        "value": 14,
        "province_code": 6,
        "cercle_code": 194,
        "label": "Bni Hadifa",
        "altLabel": null
    },
    {
        "value": 15,
        "province_code": 6,
        "cercle_code": 2,
        "label": "Chakrane",
        "altLabel": null
    },
    {
        "value": 16,
        "province_code": 6,
        "cercle_code": 2,
        "label": "Imrabten",
        "altLabel": null
    },
    {
        "value": 17,
        "province_code": 6,
        "cercle_code": 194,
        "label": "Izemmouren",
        "altLabel": "Izzemouren"
    },
    {
        "value": 18,
        "province_code": 6,
        "cercle_code": 2,
        "label": "Louta",
        "altLabel": null
    },
    {
        "value": 19,
        "province_code": 6,
        "cercle_code": 2,
        "label": "Nekkour",
        "altLabel": null
    },
    {
        "value": 20,
        "province_code": 6,
        "cercle_code": 194,
        "label": "Rouadi",
        "altLabel": null
    },
    {
        "value": 21,
        "province_code": 6,
        "cercle_code": 2,
        "label": "Tifarouine",
        "altLabel": null
    },
    {
        "value": 22,
        "province_code": 6,
        "cercle_code": 194,
        "label": "Zaouiat Sidi Abdelkader",
        "altLabel": null
    },
    {
        "value": 23,
        "province_code": 6,
        "cercle_code": 3,
        "label": "Bni Ahmed Imoukzan",
        "altLabel": null
    },
    {
        "value": 24,
        "province_code": 6,
        "cercle_code": 3,
        "label": "Bni Ammart",
        "altLabel": null
    },
    {
        "value": 25,
        "province_code": 6,
        "cercle_code": 3,
        "label": "Bni Bchir",
        "altLabel": null
    },
    {
        "value": 26,
        "province_code": 6,
        "cercle_code": 3,
        "label": "Bni Bounsar",
        "altLabel": null
    },
    {
        "value": 27,
        "province_code": 6,
        "cercle_code": 3,
        "label": "Sidi Boutmim",
        "altLabel": null
    },
    {
        "value": 28,
        "province_code": 6,
        "cercle_code": 3,
        "label": "Sidi Bouzineb",
        "altLabel": null
    },
    {
        "value": 29,
        "province_code": 6,
        "cercle_code": 3,
        "label": "Zarkt",
        "altLabel": null
    },
    {
        "value": 30,
        "province_code": 6,
        "cercle_code": 4,
        "label": "Abdelghaya Souahel",
        "altLabel": null
    },
    {
        "value": 31,
        "province_code": 6,
        "cercle_code": 4,
        "label": "Bni Bouchibet",
        "altLabel": null
    },
    {
        "value": 32,
        "province_code": 6,
        "cercle_code": 4,
        "label": "Issaguen",
        "altLabel": null
    },
    {
        "value": 33,
        "province_code": 6,
        "cercle_code": 4,
        "label": "Ketama",
        "altLabel": null
    },
    {
        "value": 34,
        "province_code": 6,
        "cercle_code": 4,
        "label": "Moulay Ahmed Cherif",
        "altLabel": null
    },
    {
        "value": 35,
        "province_code": 6,
        "cercle_code": 4,
        "label": "Taghzout",
        "altLabel": null
    },
    {
        "value": 36,
        "province_code": 6,
        "cercle_code": 4,
        "label": "Tamsaout",
        "altLabel": null
    },
    {
        "value": 37,
        "province_code": 7,
        "cercle_code": null,
        "label": "Chefchaouen",
        "altLabel": null
    },
    {
        "value": 38,
        "province_code": 7,
        "cercle_code": 5,
        "label": "Bab Berred",
        "altLabel": null
    },
    {
        "value": 39,
        "province_code": 7,
        "cercle_code": 5,
        "label": "Iounane",
        "altLabel": null
    },
    {
        "value": 40,
        "province_code": 7,
        "cercle_code": 5,
        "label": "Tamorot",
        "altLabel": null
    },
    {
        "value": 41,
        "province_code": 7,
        "cercle_code": 6,
        "label": "Bab Taza",
        "altLabel": null
    },
    {
        "value": 42,
        "province_code": 7,
        "cercle_code": 6,
        "label": "Bni Darkoul",
        "altLabel": null
    },
    {
        "value": 43,
        "province_code": 7,
        "cercle_code": 6,
        "label": "Bni Faghloum",
        "altLabel": null
    },
    {
        "value": 44,
        "province_code": 7,
        "cercle_code": 6,
        "label": "Bni Salah",
        "altLabel": null
    },
    {
        "value": 45,
        "province_code": 7,
        "cercle_code": 6,
        "label": "Derdara",
        "altLabel": null
    },
    {
        "value": 46,
        "province_code": 7,
        "cercle_code": 6,
        "label": "Fifi",
        "altLabel": null
    },
    {
        "value": 47,
        "province_code": 7,
        "cercle_code": 6,
        "label": "Laghdir",
        "altLabel": null
    },
    {
        "value": 48,
        "province_code": 7,
        "cercle_code": 6,
        "label": "Tanaqoub",
        "altLabel": null
    },
    {
        "value": 49,
        "province_code": 7,
        "cercle_code": 7,
        "label": "Bni Ahmed Cherqia",
        "altLabel": null
    },
    {
        "value": 50,
        "province_code": 7,
        "cercle_code": 7,
        "label": "Bni Ahmed Gharbia",
        "altLabel": null
    },
    {
        "value": 51,
        "province_code": 7,
        "cercle_code": 7,
        "label": "Mansoura",
        "altLabel": null
    },
    {
        "value": 52,
        "province_code": 7,
        "cercle_code": 7,
        "label": "Oued Malha",
        "altLabel": null
    },
    {
        "value": 53,
        "province_code": 7,
        "cercle_code": 8,
        "label": "Bni Bouzra",
        "altLabel": null
    },
    {
        "value": 54,
        "province_code": 7,
        "cercle_code": 202,
        "label": "Bni Mansour",
        "altLabel": null
    },
    {
        "value": 55,
        "province_code": 7,
        "cercle_code": 202,
        "label": "Bni Selmane",
        "altLabel": null
    },
    {
        "value": 56,
        "province_code": 7,
        "cercle_code": 8,
        "label": "Steha",
        "altLabel": null
    },
    {
        "value": 57,
        "province_code": 7,
        "cercle_code": 8,
        "label": "Talambote",
        "altLabel": null
    },
    {
        "value": 58,
        "province_code": 7,
        "cercle_code": 8,
        "label": "Tassift",
        "altLabel": null
    },
    {
        "value": 59,
        "province_code": 7,
        "cercle_code": 8,
        "label": "Tizgane",
        "altLabel": null
    },
    {
        "value": 60,
        "province_code": 7,
        "cercle_code": 9,
        "label": "Amtar",
        "altLabel": null
    },
    {
        "value": 61,
        "province_code": 7,
        "cercle_code": 9,
        "label": "Bni Rzine",
        "altLabel": null
    },
    {
        "value": 62,
        "province_code": 7,
        "cercle_code": 9,
        "label": "Bni Smih",
        "altLabel": null
    },
    {
        "value": 63,
        "province_code": 7,
        "cercle_code": 9,
        "label": "M'Tioua",
        "altLabel": null
    },
    {
        "value": 64,
        "province_code": 7,
        "cercle_code": 9,
        "label": "Ouaouzgane",
        "altLabel": null
    },
    {
        "value": 65,
        "province_code": 4,
        "cercle_code": 10,
        "label": "Anjra",
        "altLabel": null
    },
    {
        "value": 66,
        "province_code": 4,
        "cercle_code": 10,
        "label": "Jouamaa",
        "altLabel": null
    },
    {
        "value": 67,
        "province_code": 4,
        "cercle_code": 10,
        "label": "Ksar El Majaz",
        "altLabel": null
    },
    {
        "value": 68,
        "province_code": 4,
        "cercle_code": 10,
        "label": "Taghramt",
        "altLabel": null
    },
    {
        "value": 69,
        "province_code": 4,
        "cercle_code": 11,
        "label": "Al Bahraoyine",
        "altLabel": null
    },
    {
        "value": 70,
        "province_code": 4,
        "cercle_code": 11,
        "label": "Ksar Sghir",
        "altLabel": null
    },
    {
        "value": 71,
        "province_code": 4,
        "cercle_code": 11,
        "label": "Malloussa",
        "altLabel": null
    },
    {
        "value": 72,
        "province_code": 5,
        "cercle_code": null,
        "label": "Ksar El Kebir",
        "altLabel": null
    },
    {
        "value": 73,
        "province_code": 5,
        "cercle_code": null,
        "label": "Larache",
        "altLabel": null
    },
    {
        "value": 74,
        "province_code": 5,
        "cercle_code": 12,
        "label": "Bou Jedyane",
        "altLabel": null
    },
    {
        "value": 75,
        "province_code": 5,
        "cercle_code": 12,
        "label": "Ksar Bjir",
        "altLabel": null
    },
    {
        "value": 76,
        "province_code": 5,
        "cercle_code": 12,
        "label": "Laouamra",
        "altLabel": null
    },
    {
        "value": 77,
        "province_code": 5,
        "cercle_code": 12,
        "label": "Souk L'Qolla",
        "altLabel": null
    },
    {
        "value": 78,
        "province_code": 5,
        "cercle_code": 12,
        "label": "Tatoft",
        "altLabel": null
    },
    {
        "value": 79,
        "province_code": 5,
        "cercle_code": 12,
        "label": "Zouada",
        "altLabel": null
    },
    {
        "value": 80,
        "province_code": 5,
        "cercle_code": 13,
        "label": "Ayacha",
        "altLabel": null
    },
    {
        "value": 81,
        "province_code": 5,
        "cercle_code": 13,
        "label": "Bni Arouss",
        "altLabel": null
    },
    {
        "value": 82,
        "province_code": 5,
        "cercle_code": 13,
        "label": "Bni Garfett",
        "altLabel": null
    },
    {
        "value": 83,
        "province_code": 5,
        "cercle_code": 13,
        "label": "Tazroute",
        "altLabel": null
    },
    {
        "value": 84,
        "province_code": 5,
        "cercle_code": 13,
        "label": "Zaaroura",
        "altLabel": null
    },
    {
        "value": 85,
        "province_code": 5,
        "cercle_code": 14,
        "label": "Oulad Ouchih",
        "altLabel": null
    },
    {
        "value": 86,
        "province_code": 5,
        "cercle_code": 14,
        "label": "Rissana Chamalia",
        "altLabel": null
    },
    {
        "value": 87,
        "province_code": 5,
        "cercle_code": 14,
        "label": "Rissana Janoubia",
        "altLabel": null
    },
    {
        "value": 88,
        "province_code": 5,
        "cercle_code": 14,
        "label": "Sahel",
        "altLabel": null
    },
    {
        "value": 89,
        "province_code": 5,
        "cercle_code": 14,
        "label": "Souaken",
        "altLabel": null
    },
    {
        "value": 90,
        "province_code": 5,
        "cercle_code": 14,
        "label": "Souk Tolba",
        "altLabel": null
    },
    {
        "value": 91,
        "province_code": 8,
        "cercle_code": null,
        "label": "Ouezzane",
        "altLabel": null
    },
    {
        "value": 92,
        "province_code": 8,
        "cercle_code": 15,
        "label": "Bni Quolla",
        "altLabel": null
    },
    {
        "value": 93,
        "province_code": 8,
        "cercle_code": 197,
        "label": "Lamjaara",
        "altLabel": null
    },
    {
        "value": 94,
        "province_code": 8,
        "cercle_code": 15,
        "label": "Masmouda",
        "altLabel": null
    },
    {
        "value": 95,
        "province_code": 8,
        "cercle_code": 15,
        "label": "Mzefroune",
        "altLabel": null
    },
    {
        "value": 96,
        "province_code": 8,
        "cercle_code": 197,
        "label": "Ounnana",
        "altLabel": null
    },
    {
        "value": 97,
        "province_code": 8,
        "cercle_code": 197,
        "label": "Sidi Ahmed Cherif",
        "altLabel": null
    },
    {
        "value": 98,
        "province_code": 8,
        "cercle_code": 197,
        "label": "Sidi Bousber",
        "altLabel": null
    },
    {
        "value": 99,
        "province_code": 8,
        "cercle_code": 15,
        "label": "Sidi Redouane",
        "altLabel": null
    },
    {
        "value": 100,
        "province_code": 8,
        "cercle_code": 197,
        "label": "Teroual",
        "altLabel": null
    },
    {
        "value": 101,
        "province_code": 8,
        "cercle_code": 197,
        "label": "Zghira",
        "altLabel": null
    },
    {
        "value": 102,
        "province_code": 8,
        "cercle_code": 16,
        "label": "Ain Beida",
        "altLabel": null
    },
    {
        "value": 103,
        "province_code": 8,
        "cercle_code": 16,
        "label": "Asjen",
        "altLabel": null
    },
    {
        "value": 104,
        "province_code": 8,
        "cercle_code": 16,
        "label": "Brikcha",
        "altLabel": null
    },
    {
        "value": 105,
        "province_code": 8,
        "cercle_code": 16,
        "label": "Moqrisset",
        "altLabel": "Moqrissat"
    },
    {
        "value": 106,
        "province_code": 8,
        "cercle_code": 17,
        "label": "Kalaat Bouqorra",
        "altLabel": null
    },
    {
        "value": 107,
        "province_code": 8,
        "cercle_code": 17,
        "label": "Zoumi",
        "altLabel": null
    },
    {
        "value": 108,
        "province_code": 1,
        "cercle_code": null,
        "label": "Assilah",
        "altLabel": null
    },
    {
        "value": 109,
        "province_code": 1,
        "cercle_code": null,
        "label": "Bni Makada (arrond.)",
        "altLabel": null
    },
    {
        "value": 110,
        "province_code": 1,
        "cercle_code": null,
        "label": "Charf-Mghogha (arrond.)",
        "altLabel": "Mghogha"
    },
    {
        "value": 111,
        "province_code": 1,
        "cercle_code": null,
        "label": "Charf-Souani (arrond.)",
        "altLabel": "Souani"
    },
    {
        "value": 112,
        "province_code": 1,
        "cercle_code": null,
        "label": "Tanger-Médina (arrond.)",
        "altLabel": "Medina"
    },
    {
        "value": 113,
        "province_code": 1,
        "cercle_code": null,
        "label": "Gueznaia",
        "altLabel": null
    },
    {
        "value": 114,
        "province_code": 1,
        "cercle_code": 201,
        "label": "Al Manzla",
        "altLabel": null
    },
    {
        "value": 115,
        "province_code": 1,
        "cercle_code": 18,
        "label": "Aquouass Briech",
        "altLabel": "Aqouass Briech"
    },
    {
        "value": 116,
        "province_code": 1,
        "cercle_code": 201,
        "label": "Sebt Azzinate",
        "altLabel": "Azzinate"
    },
    {
        "value": 117,
        "province_code": 1,
        "cercle_code": 201,
        "label": "Dar Chaoui",
        "altLabel": null
    },
    {
        "value": 118,
        "province_code": 1,
        "cercle_code": 18,
        "label": "Sahel Chamali",
        "altLabel": null
    },
    {
        "value": 119,
        "province_code": 1,
        "cercle_code": 18,
        "label": "Sidi Lyamani",
        "altLabel": null
    },
    {
        "value": 120,
        "province_code": 1,
        "cercle_code": 18,
        "label": "Had Al Gharbia",
        "altLabel": null
    },
    {
        "value": 121,
        "province_code": 1,
        "cercle_code": 201,
        "label": "Laaouama",
        "altLabel": null
    },
    {
        "value": 122,
        "province_code": 1,
        "cercle_code": 201,
        "label": "Hjar Ennhal",
        "altLabel": null
    },
    {
        "value": 123,
        "province_code": 3,
        "cercle_code": null,
        "label": "Oued Laou",
        "altLabel": null
    },
    {
        "value": 124,
        "province_code": 3,
        "cercle_code": null,
        "label": "Tétouan",
        "altLabel": null
    },
    {
        "value": 125,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Ain Lahsan",
        "altLabel": null
    },
    {
        "value": 126,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Al Kharroub",
        "altLabel": null
    },
    {
        "value": 127,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Bghaghza",
        "altLabel": null
    },
    {
        "value": 128,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Bni Harchen",
        "altLabel": null
    },
    {
        "value": 129,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Jbel Lahbib",
        "altLabel": null
    },
    {
        "value": 130,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Bni Idder",
        "altLabel": null
    },
    {
        "value": 131,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Mallalienne",
        "altLabel": null
    },
    {
        "value": 132,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Saddina",
        "altLabel": null
    },
    {
        "value": 133,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Souk Kdim",
        "altLabel": null
    },
    {
        "value": 134,
        "province_code": 3,
        "cercle_code": 19,
        "label": "Sahtryine",
        "altLabel": null
    },
    {
        "value": 135,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Al Hamra",
        "altLabel": null
    },
    {
        "value": 136,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Al Oued",
        "altLabel": "Elouad"
    },
    {
        "value": 137,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Azla",
        "altLabel": null
    },
    {
        "value": 138,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Bni Leit",
        "altLabel": null
    },
    {
        "value": 139,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Bni Said",
        "altLabel": null
    },
    {
        "value": 140,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Dar Bni Karrich",
        "altLabel": null
    },
    {
        "value": 141,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Oulad Ali Mansour",
        "altLabel": null
    },
    {
        "value": 142,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Zaitoune",
        "altLabel": null
    },
    {
        "value": 143,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Zaouiat Sidi Kacem",
        "altLabel": null
    },
    {
        "value": 144,
        "province_code": 3,
        "cercle_code": 20,
        "label": "Zinat",
        "altLabel": null
    },
    {
        "value": 145,
        "province_code": 2,
        "cercle_code": null,
        "label": "Fnideq",
        "altLabel": "Fnidq"
    },
    {
        "value": 146,
        "province_code": 2,
        "cercle_code": null,
        "label": "Martil",
        "altLabel": null
    },
    {
        "value": 147,
        "province_code": 2,
        "cercle_code": null,
        "label": "M'Diq",
        "altLabel": null
    },
    {
        "value": 148,
        "province_code": 2,
        "cercle_code": null,
        "label": "Allyene",
        "altLabel": null
    },
    {
        "value": 149,
        "province_code": 2,
        "cercle_code": null,
        "label": "Belyounech",
        "altLabel": null
    },
    {
        "value": 150,
        "province_code": 13,
        "cercle_code": null,
        "label": "Ahfir",
        "altLabel": null
    },
    {
        "value": 151,
        "province_code": 13,
        "cercle_code": null,
        "label": "Ain Erreggada",
        "altLabel": null
    },
    {
        "value": 152,
        "province_code": 13,
        "cercle_code": null,
        "label": "Aklim",
        "altLabel": null
    },
    {
        "value": 153,
        "province_code": 13,
        "cercle_code": null,
        "label": "Berkane",
        "altLabel": null
    },
    {
        "value": 154,
        "province_code": 13,
        "cercle_code": null,
        "label": "Saidia",
        "altLabel": null
    },
    {
        "value": 155,
        "province_code": 13,
        "cercle_code": null,
        "label": "Sidi Slimane Echcharraa",
        "altLabel": "Sidi Slimane Echcharaa"
    },
    {
        "value": 156,
        "province_code": 13,
        "cercle_code": 21,
        "label": "Aghbal",
        "altLabel": null
    },
    {
        "value": 157,
        "province_code": 13,
        "cercle_code": 21,
        "label": "Fezouane",
        "altLabel": null
    },
    {
        "value": 158,
        "province_code": 13,
        "cercle_code": 21,
        "label": "Laatamna",
        "altLabel": null
    },
    {
        "value": 159,
        "province_code": 13,
        "cercle_code": 21,
        "label": "Madagh",
        "altLabel": null
    },
    {
        "value": 160,
        "province_code": 13,
        "cercle_code": 22,
        "label": "Boughriba",
        "altLabel": null
    },
    {
        "value": 161,
        "province_code": 13,
        "cercle_code": 22,
        "label": "Chouihia",
        "altLabel": null
    },
    {
        "value": 162,
        "province_code": 13,
        "cercle_code": 22,
        "label": "Rislane",
        "altLabel": null
    },
    {
        "value": 163,
        "province_code": 13,
        "cercle_code": 22,
        "label": "Sidi Bouhria",
        "altLabel": null
    },
    {
        "value": 164,
        "province_code": 13,
        "cercle_code": 22,
        "label": "Tafoughalt",
        "altLabel": null
    },
    {
        "value": 165,
        "province_code": 13,
        "cercle_code": 22,
        "label": "Zegzel",
        "altLabel": null
    },
    {
        "value": 166,
        "province_code": 11,
        "cercle_code": null,
        "label": "Ben Taieb",
        "altLabel": null
    },
    {
        "value": 167,
        "province_code": 11,
        "cercle_code": null,
        "label": "Driouch",
        "altLabel": null
    },
    {
        "value": 168,
        "province_code": 11,
        "cercle_code": null,
        "label": "Midar",
        "altLabel": null
    },
    {
        "value": 169,
        "province_code": 11,
        "cercle_code": 23,
        "label": "Ain Zohra",
        "altLabel": "Ain-Zohra"
    },
    {
        "value": 170,
        "province_code": 11,
        "cercle_code": 23,
        "label": "Ait Mait",
        "altLabel": "Ait-Mait"
    },
    {
        "value": 171,
        "province_code": 11,
        "cercle_code": 23,
        "label": "Amejjaou",
        "altLabel": null
    },
    {
        "value": 172,
        "province_code": 11,
        "cercle_code": 23,
        "label": "Dar El Kebdani",
        "altLabel": "Dar-El-Kebdani"
    },
    {
        "value": 173,
        "province_code": 11,
        "cercle_code": 23,
        "label": "Mtalssa",
        "altLabel": null
    },
    {
        "value": 174,
        "province_code": 11,
        "cercle_code": 23,
        "label": "Oulad Boubker",
        "altLabel": null
    },
    {
        "value": 175,
        "province_code": 11,
        "cercle_code": 23,
        "label": "Tazaghine",
        "altLabel": null
    },
    {
        "value": 176,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Azlaf",
        "altLabel": null
    },
    {
        "value": 177,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Bni Marghnine",
        "altLabel": null
    },
    {
        "value": 178,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Boudinar",
        "altLabel": null
    },
    {
        "value": 179,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Iferni",
        "altLabel": null
    },
    {
        "value": 180,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Ijermaouas",
        "altLabel": null
    },
    {
        "value": 181,
        "province_code": 11,
        "cercle_code": 24,
        "label": "M'Hajer",
        "altLabel": "Mhajer"
    },
    {
        "value": 182,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Ouardana",
        "altLabel": null
    },
    {
        "value": 183,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Oulad Amghar",
        "altLabel": null
    },
    {
        "value": 184,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Tafersit",
        "altLabel": null
    },
    {
        "value": 185,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Talilit",
        "altLabel": null
    },
    {
        "value": 186,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Temsamane",
        "altLabel": null
    },
    {
        "value": 187,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Trougout",
        "altLabel": null
    },
    {
        "value": 188,
        "province_code": 11,
        "cercle_code": 24,
        "label": "Tsaft",
        "altLabel": null
    },
    {
        "value": 189,
        "province_code": 16,
        "cercle_code": null,
        "label": "Bouarfa",
        "altLabel": null
    },
    {
        "value": 190,
        "province_code": 16,
        "cercle_code": null,
        "label": "Figuig",
        "altLabel": null
    },
    {
        "value": 191,
        "province_code": 16,
        "cercle_code": 25,
        "label": "Ain Chouater",
        "altLabel": null
    },
    {
        "value": 192,
        "province_code": 16,
        "cercle_code": 25,
        "label": "Bni Tadjite",
        "altLabel": null
    },
    {
        "value": 193,
        "province_code": 16,
        "cercle_code": 25,
        "label": "Bouanane",
        "altLabel": null
    },
    {
        "value": 194,
        "province_code": 16,
        "cercle_code": 203,
        "label": "Bouchaouene",
        "altLabel": null
    },
    {
        "value": 195,
        "province_code": 16,
        "cercle_code": 203,
        "label": "Boumerieme",
        "altLabel": null
    },
    {
        "value": 196,
        "province_code": 16,
        "cercle_code": 203,
        "label": "Talsint",
        "altLabel": null
    },
    {
        "value": 197,
        "province_code": 16,
        "cercle_code": 25,
        "label": "Ain Chair",
        "altLabel": null
    },
    {
        "value": 198,
        "province_code": 16,
        "cercle_code": 26,
        "label": "Abbou Lakhal",
        "altLabel": null
    },
    {
        "value": 199,
        "province_code": 16,
        "cercle_code": 26,
        "label": "Bni Guil",
        "altLabel": null
    },
    {
        "value": 200,
        "province_code": 16,
        "cercle_code": 26,
        "label": "Maatarka",
        "altLabel": null
    },
    {
        "value": 201,
        "province_code": 16,
        "cercle_code": 26,
        "label": "Tendrara",
        "altLabel": null
    },
    {
        "value": 202,
        "province_code": 15,
        "cercle_code": null,
        "label": "Guercif",
        "altLabel": null
    },
    {
        "value": 203,
        "province_code": 15,
        "cercle_code": 27,
        "label": "Assebbab",
        "altLabel": null
    },
    {
        "value": 204,
        "province_code": 15,
        "cercle_code": 27,
        "label": "Barkine",
        "altLabel": null
    },
    {
        "value": 205,
        "province_code": 15,
        "cercle_code": 27,
        "label": "Houara Oulad Raho",
        "altLabel": null
    },
    {
        "value": 206,
        "province_code": 15,
        "cercle_code": 27,
        "label": "Lamrija",
        "altLabel": null
    },
    {
        "value": 207,
        "province_code": 15,
        "cercle_code": 27,
        "label": "Saka",
        "altLabel": null
    },
    {
        "value": 208,
        "province_code": 15,
        "cercle_code": 28,
        "label": "Mazguitam",
        "altLabel": null
    },
    {
        "value": 209,
        "province_code": 15,
        "cercle_code": 28,
        "label": "Oulad Bourima",
        "altLabel": null
    },
    {
        "value": 210,
        "province_code": 15,
        "cercle_code": 28,
        "label": "Ras Laksar",
        "altLabel": null
    },
    {
        "value": 211,
        "province_code": 15,
        "cercle_code": 28,
        "label": "Taddart",
        "altLabel": null
    },
    {
        "value": 212,
        "province_code": 12,
        "cercle_code": null,
        "label": "Ain Bni Mathar",
        "altLabel": null
    },
    {
        "value": 213,
        "province_code": 12,
        "cercle_code": null,
        "label": "Jerada",
        "altLabel": null
    },
    {
        "value": 214,
        "province_code": 12,
        "cercle_code": null,
        "label": "Touissit",
        "altLabel": null
    },
    {
        "value": 215,
        "province_code": 12,
        "cercle_code": 207,
        "label": "Gafait",
        "altLabel": null
    },
    {
        "value": 216,
        "province_code": 12,
        "cercle_code": 29,
        "label": "Guenfouda",
        "altLabel": null
    },
    {
        "value": 217,
        "province_code": 12,
        "cercle_code": 207,
        "label": "Laaouinate",
        "altLabel": null
    },
    {
        "value": 218,
        "province_code": 12,
        "cercle_code": 207,
        "label": "Lebkhata",
        "altLabel": null
    },
    {
        "value": 219,
        "province_code": 12,
        "cercle_code": 29,
        "label": "Ras Asfour",
        "altLabel": null
    },
    {
        "value": 220,
        "province_code": 12,
        "cercle_code": 29,
        "label": "Sidi Boubker",
        "altLabel": null
    },
    {
        "value": 221,
        "province_code": 12,
        "cercle_code": 29,
        "label": "Tiouli",
        "altLabel": null
    },
    {
        "value": 222,
        "province_code": 12,
        "cercle_code": 30,
        "label": "Bni Mathar",
        "altLabel": null
    },
    {
        "value": 223,
        "province_code": 12,
        "cercle_code": 30,
        "label": "Mrija",
        "altLabel": "Lamrija"
    },
    {
        "value": 224,
        "province_code": 12,
        "cercle_code": 30,
        "label": "Oulad Ghziyel",
        "altLabel": "Ouled Ghziyel"
    },
    {
        "value": 225,
        "province_code": 12,
        "cercle_code": 30,
        "label": "Oulad Sidi Abdelhakem",
        "altLabel": "Ouled Sidi Abdelhakem"
    },
    {
        "value": 226,
        "province_code": 10,
        "cercle_code": null,
        "label": "Al Aaroui",
        "altLabel": null
    },
    {
        "value": 227,
        "province_code": 10,
        "cercle_code": null,
        "label": "Bni Ansar",
        "altLabel": null
    },
    {
        "value": 228,
        "province_code": 10,
        "cercle_code": null,
        "label": "Nador",
        "altLabel": null
    },
    {
        "value": 229,
        "province_code": 10,
        "cercle_code": null,
        "label": "Zaio",
        "altLabel": null
    },
    {
        "value": 230,
        "province_code": 10,
        "cercle_code": null,
        "label": "Zeghanghane",
        "altLabel": null
    },
    {
        "value": 231,
        "province_code": 10,
        "cercle_code": null,
        "label": "Ras El Ma",
        "altLabel": "Ras-El-Ma"
    },
    {
        "value": 232,
        "province_code": 10,
        "cercle_code": null,
        "label": "Selouane",
        "altLabel": null
    },
    {
        "value": 233,
        "province_code": 10,
        "cercle_code": 31,
        "label": "Bni Bouifrour",
        "altLabel": null
    },
    {
        "value": 234,
        "province_code": 10,
        "cercle_code": 31,
        "label": "Bni Chiker",
        "altLabel": null
    },
    {
        "value": 235,
        "province_code": 10,
        "cercle_code": 31,
        "label": "Bni Sidel Jbel",
        "altLabel": null
    },
    {
        "value": 236,
        "province_code": 10,
        "cercle_code": 31,
        "label": "Bni Sidel Louta",
        "altLabel": "Bni Sidel-Louta"
    },
    {
        "value": 237,
        "province_code": 10,
        "cercle_code": 31,
        "label": "Bouarg",
        "altLabel": null
    },
    {
        "value": 238,
        "province_code": 10,
        "cercle_code": 31,
        "label": "Iaazzanene",
        "altLabel": null
    },
    {
        "value": 239,
        "province_code": 10,
        "cercle_code": 31,
        "label": "Ihaddadene",
        "altLabel": null
    },
    {
        "value": 240,
        "province_code": 10,
        "cercle_code": 31,
        "label": "Iksane",
        "altLabel": null
    },
    {
        "value": 241,
        "province_code": 10,
        "cercle_code": 32,
        "label": "Afsou",
        "altLabel": null
    },
    {
        "value": 242,
        "province_code": 10,
        "cercle_code": 32,
        "label": "Al Barkanyene",
        "altLabel": null
    },
    {
        "value": 243,
        "province_code": 10,
        "cercle_code": 32,
        "label": "Arekmane",
        "altLabel": null
    },
    {
        "value": 244,
        "province_code": 10,
        "cercle_code": 32,
        "label": "Bni Oukil Oulad M'Hand",
        "altLabel": null
    },
    {
        "value": 245,
        "province_code": 10,
        "cercle_code": 32,
        "label": "Hassi Berkane",
        "altLabel": null
    },
    {
        "value": 246,
        "province_code": 10,
        "cercle_code": 32,
        "label": "Oulad Daoud Zkhanine",
        "altLabel": null
    },
    {
        "value": 247,
        "province_code": 10,
        "cercle_code": 32,
        "label": "Oulad Settout",
        "altLabel": null
    },
    {
        "value": 248,
        "province_code": 10,
        "cercle_code": 32,
        "label": "Tiztoutine",
        "altLabel": null
    },
    {
        "value": 249,
        "province_code": 9,
        "cercle_code": null,
        "label": "Bni Drar",
        "altLabel": null
    },
    {
        "value": 250,
        "province_code": 9,
        "cercle_code": null,
        "label": "Naima",
        "altLabel": null
    },
    {
        "value": 251,
        "province_code": 9,
        "cercle_code": null,
        "label": "Oujda",
        "altLabel": null
    },
    {
        "value": 252,
        "province_code": 9,
        "cercle_code": 33,
        "label": "Ahl Angad",
        "altLabel": null
    },
    {
        "value": 253,
        "province_code": 9,
        "cercle_code": 33,
        "label": "Ain Sfa",
        "altLabel": null
    },
    {
        "value": 254,
        "province_code": 9,
        "cercle_code": 33,
        "label": "Bni Khaled",
        "altLabel": null
    },
    {
        "value": 255,
        "province_code": 9,
        "cercle_code": 33,
        "label": "Bsara",
        "altLabel": null
    },
    {
        "value": 256,
        "province_code": 9,
        "cercle_code": 34,
        "label": "Isly",
        "altLabel": null
    },
    {
        "value": 257,
        "province_code": 9,
        "cercle_code": 34,
        "label": "Mestferki",
        "altLabel": null
    },
    {
        "value": 258,
        "province_code": 9,
        "cercle_code": 34,
        "label": "Sidi Boulenouar",
        "altLabel": null
    },
    {
        "value": 259,
        "province_code": 9,
        "cercle_code": 34,
        "label": "Sidi Moussa Lemhaya",
        "altLabel": null
    },
    {
        "value": 260,
        "province_code": 14,
        "cercle_code": null,
        "label": "Debdou",
        "altLabel": null
    },
    {
        "value": 261,
        "province_code": 14,
        "cercle_code": null,
        "label": "El Aioun Sidi Mellouk",
        "altLabel": null
    },
    {
        "value": 262,
        "province_code": 14,
        "cercle_code": null,
        "label": "Taourirt",
        "altLabel": null
    },
    {
        "value": 263,
        "province_code": 14,
        "cercle_code": 35,
        "label": "El Atef",
        "altLabel": null
    },
    {
        "value": 264,
        "province_code": 14,
        "cercle_code": 35,
        "label": "Oulad M'Hammed",
        "altLabel": "Ouled M'Hamed"
    },
    {
        "value": 265,
        "province_code": 14,
        "cercle_code": 35,
        "label": "Sidi Ali Bel Quassem",
        "altLabel": null
    },
    {
        "value": 266,
        "province_code": 14,
        "cercle_code": 35,
        "label": "Sidi Lahsen",
        "altLabel": null
    },
    {
        "value": 267,
        "province_code": 14,
        "cercle_code": 36,
        "label": "Ain Lehjer",
        "altLabel": null
    },
    {
        "value": 268,
        "province_code": 14,
        "cercle_code": 36,
        "label": "Mechraa Hammadi",
        "altLabel": null
    },
    {
        "value": 269,
        "province_code": 14,
        "cercle_code": 36,
        "label": "Mestegmer",
        "altLabel": null
    },
    {
        "value": 270,
        "province_code": 14,
        "cercle_code": 36,
        "label": "Tancherfi",
        "altLabel": "Tangherfi"
    },
    {
        "value": 271,
        "province_code": 14,
        "cercle_code": 37,
        "label": "Ahl Oued Za",
        "altLabel": null
    },
    {
        "value": 272,
        "province_code": 14,
        "cercle_code": 37,
        "label": "Gteter",
        "altLabel": null
    },
    {
        "value": 273,
        "province_code": 14,
        "cercle_code": 37,
        "label": "Melg El Ouidane",
        "altLabel": null
    },
    {
        "value": 274,
        "province_code": 18,
        "cercle_code": null,
        "label": "Meknès",
        "altLabel": null
    },
    {
        "value": 275,
        "province_code": 18,
        "cercle_code": null,
        "label": "Al Machouar-Stinia",
        "altLabel": null
    },
    {
        "value": 276,
        "province_code": 18,
        "cercle_code": null,
        "label": "Boufakrane",
        "altLabel": null
    },
    {
        "value": 277,
        "province_code": 18,
        "cercle_code": null,
        "label": "Toulal",
        "altLabel": null
    },
    {
        "value": 278,
        "province_code": 18,
        "cercle_code": null,
        "label": "Moulay Driss Zerhoun",
        "altLabel": "My Driss Zerhoun"
    },
    {
        "value": 279,
        "province_code": 18,
        "cercle_code": null,
        "label": "Ouislane",
        "altLabel": null
    },
    {
        "value": 280,
        "province_code": 18,
        "cercle_code": 38,
        "label": "Ain Jemaa",
        "altLabel": null
    },
    {
        "value": 281,
        "province_code": 18,
        "cercle_code": 38,
        "label": "Ain Karma-Oued Rommane",
        "altLabel": "Ain Karma"
    },
    {
        "value": 282,
        "province_code": 18,
        "cercle_code": 38,
        "label": "Ain Orma",
        "altLabel": null
    },
    {
        "value": 283,
        "province_code": 18,
        "cercle_code": 38,
        "label": "Ait Ouallal",
        "altLabel": null
    },
    {
        "value": 284,
        "province_code": 18,
        "cercle_code": 38,
        "label": "Dar Oum Soltane",
        "altLabel": null
    },
    {
        "value": 285,
        "province_code": 18,
        "cercle_code": 39,
        "label": "Dkhissa",
        "altLabel": null
    },
    {
        "value": 286,
        "province_code": 18,
        "cercle_code": 39,
        "label": "Majjate",
        "altLabel": null
    },
    {
        "value": 287,
        "province_code": 18,
        "cercle_code": 39,
        "label": "M'Haya",
        "altLabel": null
    },
    {
        "value": 288,
        "province_code": 18,
        "cercle_code": 39,
        "label": "Oued Jdida",
        "altLabel": null
    },
    {
        "value": 289,
        "province_code": 18,
        "cercle_code": 39,
        "label": "Sidi Slimane Moul Al Kifane",
        "altLabel": null
    },
    {
        "value": 290,
        "province_code": 18,
        "cercle_code": 40,
        "label": "Charqaoua",
        "altLabel": null
    },
    {
        "value": 291,
        "province_code": 18,
        "cercle_code": 40,
        "label": "Mrhassiyine",
        "altLabel": "M'Rhassiyine"
    },
    {
        "value": 292,
        "province_code": 18,
        "cercle_code": 40,
        "label": "N'Zalat Bni Amar",
        "altLabel": null
    },
    {
        "value": 293,
        "province_code": 18,
        "cercle_code": 40,
        "label": "Oualili",
        "altLabel": null
    },
    {
        "value": 294,
        "province_code": 18,
        "cercle_code": 40,
        "label": "Sidi Abdallah Al Khayat",
        "altLabel": "Sidi Abdellah Al Khayat"
    },
    {
        "value": 295,
        "province_code": 23,
        "cercle_code": null,
        "label": "Boulemane",
        "altLabel": null
    },
    {
        "value": 296,
        "province_code": 23,
        "cercle_code": null,
        "label": "Imouzzer Marmoucha",
        "altLabel": null
    },
    {
        "value": 297,
        "province_code": 23,
        "cercle_code": null,
        "label": "Missour",
        "altLabel": null
    },
    {
        "value": 298,
        "province_code": 23,
        "cercle_code": null,
        "label": "Outat El Haj",
        "altLabel": null
    },
    {
        "value": 299,
        "province_code": 23,
        "cercle_code": 204,
        "label": "Ait Bazza",
        "altLabel": null
    },
    {
        "value": 300,
        "province_code": 23,
        "cercle_code": 204,
        "label": "Ait El Mane",
        "altLabel": null
    },
    {
        "value": 301,
        "province_code": 23,
        "cercle_code": 204,
        "label": "Almis Marmoucha",
        "altLabel": null
    },
    {
        "value": 302,
        "province_code": 23,
        "cercle_code": 204,
        "label": "El Mers",
        "altLabel": null
    },
    {
        "value": 303,
        "province_code": 23,
        "cercle_code": 41,
        "label": "Enjil",
        "altLabel": null
    },
    {
        "value": 304,
        "province_code": 23,
        "cercle_code": 41,
        "label": "Guigou",
        "altLabel": null
    },
    {
        "value": 305,
        "province_code": 23,
        "cercle_code": 204,
        "label": "Serghina",
        "altLabel": null
    },
    {
        "value": 306,
        "province_code": 23,
        "cercle_code": 41,
        "label": "Skoura M'Daz",
        "altLabel": null
    },
    {
        "value": 307,
        "province_code": 23,
        "cercle_code": 204,
        "label": "Talzemt",
        "altLabel": null
    },
    {
        "value": 308,
        "province_code": 23,
        "cercle_code": 42,
        "label": "Ksabi Moulouya",
        "altLabel": null
    },
    {
        "value": 309,
        "province_code": 23,
        "cercle_code": 42,
        "label": "Ouizeght",
        "altLabel": null
    },
    {
        "value": 310,
        "province_code": 23,
        "cercle_code": 42,
        "label": "Sidi Boutayeb",
        "altLabel": null
    },
    {
        "value": 311,
        "province_code": 23,
        "cercle_code": 43,
        "label": "El Orjane",
        "altLabel": null
    },
    {
        "value": 312,
        "province_code": 23,
        "cercle_code": 43,
        "label": "Ermila",
        "altLabel": null
    },
    {
        "value": 313,
        "province_code": 23,
        "cercle_code": 43,
        "label": "Fritissa",
        "altLabel": null
    },
    {
        "value": 314,
        "province_code": 23,
        "cercle_code": 43,
        "label": "Oulad Ali Youssef",
        "altLabel": null
    },
    {
        "value": 315,
        "province_code": 23,
        "cercle_code": 43,
        "label": "Tissaf",
        "altLabel": null
    },
    {
        "value": 316,
        "province_code": 19,
        "cercle_code": null,
        "label": "Agourai",
        "altLabel": null
    },
    {
        "value": 317,
        "province_code": 19,
        "cercle_code": null,
        "label": "Ain Taoujdate",
        "altLabel": null
    },
    {
        "value": 318,
        "province_code": 19,
        "cercle_code": null,
        "label": "El Hajeb",
        "altLabel": "El-Hajeb"
    },
    {
        "value": 319,
        "province_code": 19,
        "cercle_code": null,
        "label": "Sabaa Aiyoun",
        "altLabel": null
    },
    {
        "value": 320,
        "province_code": 19,
        "cercle_code": 44,
        "label": "Ait Ouikhalfen",
        "altLabel": null
    },
    {
        "value": 321,
        "province_code": 19,
        "cercle_code": 44,
        "label": "Ait Yaazem",
        "altLabel": null
    },
    {
        "value": 322,
        "province_code": 19,
        "cercle_code": 44,
        "label": "Jahjouh",
        "altLabel": null
    },
    {
        "value": 323,
        "province_code": 19,
        "cercle_code": 44,
        "label": "Ras Ijerri",
        "altLabel": null
    },
    {
        "value": 324,
        "province_code": 19,
        "cercle_code": 44,
        "label": "Tamchachate",
        "altLabel": null
    },
    {
        "value": 325,
        "province_code": 19,
        "cercle_code": 45,
        "label": "Ait Boubidmane",
        "altLabel": null
    },
    {
        "value": 326,
        "province_code": 19,
        "cercle_code": 45,
        "label": "Ait Harz Allah",
        "altLabel": null
    },
    {
        "value": 327,
        "province_code": 19,
        "cercle_code": 45,
        "label": "Bitit",
        "altLabel": null
    },
    {
        "value": 328,
        "province_code": 19,
        "cercle_code": 45,
        "label": "Laqsir",
        "altLabel": null
    },
    {
        "value": 329,
        "province_code": 19,
        "cercle_code": 46,
        "label": "Ait Bourzouine",
        "altLabel": null
    },
    {
        "value": 330,
        "province_code": 19,
        "cercle_code": 46,
        "label": "Ait Naamane",
        "altLabel": null
    },
    {
        "value": 331,
        "province_code": 19,
        "cercle_code": 46,
        "label": "Iqaddar",
        "altLabel": null
    },
    {
        "value": 332,
        "province_code": 17,
        "cercle_code": null,
        "label": "Agdal (arrond.)",
        "altLabel": null
    },
    {
        "value": 333,
        "province_code": 17,
        "cercle_code": null,
        "label": "Méchouar Fès Jdid",
        "altLabel": "Mechouar-Fes-El Jadid"
    },
    {
        "value": 334,
        "province_code": 17,
        "cercle_code": null,
        "label": "Saiss (arrond.)",
        "altLabel": null
    },
    {
        "value": 335,
        "province_code": 17,
        "cercle_code": null,
        "label": "Fès-Médina (arrond.)",
        "altLabel": "Fès-Medina (arrond.)"
    },
    {
        "value": 336,
        "province_code": 17,
        "cercle_code": null,
        "label": "Jnan El Ouard (arrond.)",
        "altLabel": null
    },
    {
        "value": 337,
        "province_code": 17,
        "cercle_code": null,
        "label": "El Mariniyine (arrond.)",
        "altLabel": "Al Marinyne (arrond.)"
    },
    {
        "value": 338,
        "province_code": 17,
        "cercle_code": null,
        "label": "Zouagha (arrond.)",
        "altLabel": null
    },
    {
        "value": 339,
        "province_code": 17,
        "cercle_code": 47,
        "label": "Oulad Tayeb (arrond.)",
        "altLabel": null
    },
    {
        "value": 340,
        "province_code": 17,
        "cercle_code": 47,
        "label": "Ain Bida",
        "altLabel": null
    },
    {
        "value": 341,
        "province_code": 17,
        "cercle_code": 47,
        "label": "Sidi Harazem",
        "altLabel": null
    },
    {
        "value": 342,
        "province_code": 20,
        "cercle_code": null,
        "label": "Azrou",
        "altLabel": null
    },
    {
        "value": 343,
        "province_code": 20,
        "cercle_code": null,
        "label": "Ifrane",
        "altLabel": null
    },
    {
        "value": 344,
        "province_code": 20,
        "cercle_code": 48,
        "label": "Ain Leuh",
        "altLabel": "Ain-Leuh"
    },
    {
        "value": 345,
        "province_code": 20,
        "cercle_code": 48,
        "label": "Ben Smim",
        "altLabel": null
    },
    {
        "value": 346,
        "province_code": 20,
        "cercle_code": 48,
        "label": "Oued Ifrane",
        "altLabel": null
    },
    {
        "value": 347,
        "province_code": 20,
        "cercle_code": 48,
        "label": "Sidi El Makhfi",
        "altLabel": "Sidi Elmakhfi"
    },
    {
        "value": 348,
        "province_code": 20,
        "cercle_code": 48,
        "label": "Tigrigra",
        "altLabel": null
    },
    {
        "value": 349,
        "province_code": 20,
        "cercle_code": 48,
        "label": "Timahdite",
        "altLabel": null
    },
    {
        "value": 350,
        "province_code": 20,
        "cercle_code": null,
        "label": "Dayat Aoua",
        "altLabel": "Dayate-Aoua"
    },
    {
        "value": 351,
        "province_code": 20,
        "cercle_code": null,
        "label": "Tizguite",
        "altLabel": null
    },
    {
        "value": 352,
        "province_code": 22,
        "cercle_code": null,
        "label": "Bhalil",
        "altLabel": null
    },
    {
        "value": 353,
        "province_code": 22,
        "cercle_code": null,
        "label": "El Menzel",
        "altLabel": null
    },
    {
        "value": 354,
        "province_code": 22,
        "cercle_code": null,
        "label": "Imouzzer Kandar",
        "altLabel": "Imouzzer-Kandar"
    },
    {
        "value": 355,
        "province_code": 22,
        "cercle_code": null,
        "label": "Ribate El Kheir",
        "altLabel": null
    },
    {
        "value": 356,
        "province_code": 22,
        "cercle_code": null,
        "label": "Sefrou",
        "altLabel": null
    },
    {
        "value": 357,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Adrej",
        "altLabel": null
    },
    {
        "value": 358,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Ain Timguenai",
        "altLabel": null
    },
    {
        "value": 359,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Bir Tam Tam",
        "altLabel": "Bir Tam-Tam"
    },
    {
        "value": 360,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Dar El Hamra",
        "altLabel": null
    },
    {
        "value": 361,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Ighzrane",
        "altLabel": "Irhzrane"
    },
    {
        "value": 362,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Mtarnagha",
        "altLabel": null
    },
    {
        "value": 363,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Oulad Mkoudou",
        "altLabel": null
    },
    {
        "value": 364,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Ras Tabouda",
        "altLabel": null
    },
    {
        "value": 365,
        "province_code": 22,
        "cercle_code": 49,
        "label": "Tafajight",
        "altLabel": null
    },
    {
        "value": 366,
        "province_code": 22,
        "cercle_code": 50,
        "label": "Ain Cheggag",
        "altLabel": null
    },
    {
        "value": 367,
        "province_code": 22,
        "cercle_code": 50,
        "label": "Ait Sebaa Lajrouf",
        "altLabel": null
    },
    {
        "value": 368,
        "province_code": 22,
        "cercle_code": 51,
        "label": "Aghbalou Aqorar",
        "altLabel": null
    },
    {
        "value": 369,
        "province_code": 22,
        "cercle_code": 51,
        "label": "Ahl Sidi Lahcen",
        "altLabel": null
    },
    {
        "value": 370,
        "province_code": 22,
        "cercle_code": 51,
        "label": "Azzaba",
        "altLabel": null
    },
    {
        "value": 371,
        "province_code": 22,
        "cercle_code": 51,
        "label": "Kandar Sidi Khiar",
        "altLabel": null
    },
    {
        "value": 372,
        "province_code": 22,
        "cercle_code": 51,
        "label": "Laanoussar",
        "altLabel": null
    },
    {
        "value": 373,
        "province_code": 22,
        "cercle_code": 51,
        "label": "Sidi Youssef Ben Ahmed",
        "altLabel": null
    },
    {
        "value": 374,
        "province_code": 22,
        "cercle_code": 51,
        "label": "Tazouta",
        "altLabel": null
    },
    {
        "value": 375,
        "province_code": 24,
        "cercle_code": null,
        "label": "Ghafsai",
        "altLabel": "Rhafsai"
    },
    {
        "value": 376,
        "province_code": 24,
        "cercle_code": null,
        "label": "Karia Ba Mohamed",
        "altLabel": null
    },
    {
        "value": 377,
        "province_code": 24,
        "cercle_code": null,
        "label": "Taounate",
        "altLabel": null
    },
    {
        "value": 378,
        "province_code": 24,
        "cercle_code": null,
        "label": "Thar Es-Souk",
        "altLabel": null
    },
    {
        "value": 379,
        "province_code": 24,
        "cercle_code": null,
        "label": "Tissa",
        "altLabel": null
    },
    {
        "value": 380,
        "province_code": 24,
        "cercle_code": 52,
        "label": "El Bibane",
        "altLabel": null
    },
    {
        "value": 381,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Galaz",
        "altLabel": null
    },
    {
        "value": 382,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Kissane",
        "altLabel": null
    },
    {
        "value": 383,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Oudka",
        "altLabel": null
    },
    {
        "value": 384,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Ouartzagh",
        "altLabel": "Ourtzarh"
    },
    {
        "value": 385,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Ratba",
        "altLabel": null
    },
    {
        "value": 386,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Sidi Haj M'Hamed",
        "altLabel": null
    },
    {
        "value": 387,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Sidi Mokhfi",
        "altLabel": null
    },
    {
        "value": 388,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Sidi Yahya Bni Zeroual",
        "altLabel": "Sidi Yahia Bni Zeroual"
    },
    {
        "value": 389,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Tabouda",
        "altLabel": null
    },
    {
        "value": 390,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Tafrant",
        "altLabel": null
    },
    {
        "value": 391,
        "province_code": 24,
        "cercle_code": 52,
        "label": "Timezgana",
        "altLabel": null
    },
    {
        "value": 392,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Bni Snous",
        "altLabel": null
    },
    {
        "value": 393,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Bouchabel",
        "altLabel": null
    },
    {
        "value": 394,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Rhouazi",
        "altLabel": null
    },
    {
        "value": 395,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Jbabra",
        "altLabel": null
    },
    {
        "value": 396,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Loulja",
        "altLabel": "El Ouelja"
    },
    {
        "value": 397,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Mkansa",
        "altLabel": null
    },
    {
        "value": 398,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Moulay Abdelkrim",
        "altLabel": null
    },
    {
        "value": 399,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Moulay Bouchta",
        "altLabel": null
    },
    {
        "value": 400,
        "province_code": 24,
        "cercle_code": 53,
        "label": "Sidi El Abed",
        "altLabel": null
    },
    {
        "value": 401,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Ain Mediouna",
        "altLabel": null
    },
    {
        "value": 402,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Bni Oulid",
        "altLabel": null
    },
    {
        "value": 403,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Bni Ounjel Tafraout",
        "altLabel": null
    },
    {
        "value": 404,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Bouadel",
        "altLabel": null
    },
    {
        "value": 405,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Bouhouda",
        "altLabel": null
    },
    {
        "value": 406,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Fennassa Bab El Hit",
        "altLabel": null
    },
    {
        "value": 407,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Khlalfa",
        "altLabel": null
    },
    {
        "value": 408,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Mezraoua",
        "altLabel": null
    },
    {
        "value": 409,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Rghioua",
        "altLabel": null
    },
    {
        "value": 410,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Tamedit",
        "altLabel": null
    },
    {
        "value": 411,
        "province_code": 24,
        "cercle_code": 54,
        "label": "Zrizer",
        "altLabel": null
    },
    {
        "value": 412,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Ain Aicha",
        "altLabel": null
    },
    {
        "value": 413,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Ain Legdah",
        "altLabel": null
    },
    {
        "value": 414,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Ain Maatouf",
        "altLabel": null
    },
    {
        "value": 415,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Bouarouss",
        "altLabel": null
    },
    {
        "value": 416,
        "province_code": 24,
        "cercle_code": 55,
        "label": "El Bsabsa",
        "altLabel": null
    },
    {
        "value": 417,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Messassa",
        "altLabel": null
    },
    {
        "value": 418,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Oued Jemaa",
        "altLabel": null
    },
    {
        "value": 419,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Oulad Ayyad",
        "altLabel": null
    },
    {
        "value": 420,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Oulad Daoud",
        "altLabel": null
    },
    {
        "value": 421,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Outabouabane",
        "altLabel": null
    },
    {
        "value": 422,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Ras El Oued",
        "altLabel": null
    },
    {
        "value": 423,
        "province_code": 24,
        "cercle_code": 55,
        "label": "Sidi M'Hamed Ben Lahcen",
        "altLabel": null
    },
    {
        "value": 424,
        "province_code": 25,
        "cercle_code": null,
        "label": "Aknoul",
        "altLabel": null
    },
    {
        "value": 425,
        "province_code": 25,
        "cercle_code": null,
        "label": "Oued Amlil",
        "altLabel": "Ouad Amlil"
    },
    {
        "value": 426,
        "province_code": 25,
        "cercle_code": null,
        "label": "Tahla",
        "altLabel": null
    },
    {
        "value": 427,
        "province_code": 25,
        "cercle_code": null,
        "label": "Taza",
        "altLabel": null
    },
    {
        "value": 428,
        "province_code": 25,
        "cercle_code": 56,
        "label": "Ajdir",
        "altLabel": null
    },
    {
        "value": 429,
        "province_code": 25,
        "cercle_code": 56,
        "label": "Bourd",
        "altLabel": null
    },
    {
        "value": 430,
        "province_code": 25,
        "cercle_code": 56,
        "label": "Gzenaya Al Janoubia",
        "altLabel": null
    },
    {
        "value": 431,
        "province_code": 25,
        "cercle_code": 56,
        "label": "Jbarna",
        "altLabel": null
    },
    {
        "value": 432,
        "province_code": 25,
        "cercle_code": 56,
        "label": "Sidi Ali Bourakba",
        "altLabel": null
    },
    {
        "value": 433,
        "province_code": 25,
        "cercle_code": 56,
        "label": "Tizi Ouasli",
        "altLabel": null
    },
    {
        "value": 434,
        "province_code": 25,
        "cercle_code": 57,
        "label": "Bni Frassen",
        "altLabel": null
    },
    {
        "value": 435,
        "province_code": 25,
        "cercle_code": 57,
        "label": "Bouchfaa",
        "altLabel": null
    },
    {
        "value": 436,
        "province_code": 25,
        "cercle_code": 57,
        "label": "Bouhlou",
        "altLabel": null
    },
    {
        "value": 437,
        "province_code": 25,
        "cercle_code": 57,
        "label": "Ghiata Al Gharbia",
        "altLabel": null
    },
    {
        "value": 438,
        "province_code": 25,
        "cercle_code": 57,
        "label": "Oulad Zbair",
        "altLabel": null
    },
    {
        "value": 439,
        "province_code": 25,
        "cercle_code": 57,
        "label": "Rbaa El Fouki",
        "altLabel": null
    },
    {
        "value": 440,
        "province_code": 25,
        "cercle_code": 58,
        "label": "Ait Saghrouchen",
        "altLabel": null
    },
    {
        "value": 441,
        "province_code": 25,
        "cercle_code": 58,
        "label": "Bouyablane",
        "altLabel": null
    },
    {
        "value": 442,
        "province_code": 25,
        "cercle_code": 58,
        "label": "Matmata",
        "altLabel": null
    },
    {
        "value": 443,
        "province_code": 25,
        "cercle_code": 58,
        "label": "Smià",
        "altLabel": "Smia"
    },
    {
        "value": 444,
        "province_code": 25,
        "cercle_code": 58,
        "label": "Tazarine",
        "altLabel": null
    },
    {
        "value": 445,
        "province_code": 25,
        "cercle_code": 58,
        "label": "Zrarda",
        "altLabel": null
    },
    {
        "value": 446,
        "province_code": 25,
        "cercle_code": 59,
        "label": "Bni Ftah",
        "altLabel": null
    },
    {
        "value": 447,
        "province_code": 25,
        "cercle_code": 59,
        "label": "Brarha",
        "altLabel": null
    },
    {
        "value": 448,
        "province_code": 25,
        "cercle_code": 59,
        "label": "El Gouzate",
        "altLabel": null
    },
    {
        "value": 449,
        "province_code": 25,
        "cercle_code": 59,
        "label": "Kaf El Ghar",
        "altLabel": null
    },
    {
        "value": 450,
        "province_code": 25,
        "cercle_code": 59,
        "label": "Msila",
        "altLabel": null
    },
    {
        "value": 451,
        "province_code": 25,
        "cercle_code": 59,
        "label": "Taifa",
        "altLabel": null
    },
    {
        "value": 452,
        "province_code": 25,
        "cercle_code": 59,
        "label": "Tainaste",
        "altLabel": null
    },
    {
        "value": 453,
        "province_code": 25,
        "cercle_code": 59,
        "label": "Traiba",
        "altLabel": null
    },
    {
        "value": 454,
        "province_code": 25,
        "cercle_code": 60,
        "label": "Bab Boudir",
        "altLabel": null
    },
    {
        "value": 455,
        "province_code": 25,
        "cercle_code": 60,
        "label": "Bab Marzouka",
        "altLabel": null
    },
    {
        "value": 456,
        "province_code": 25,
        "cercle_code": 60,
        "label": "Bni Lent",
        "altLabel": null
    },
    {
        "value": 457,
        "province_code": 25,
        "cercle_code": 60,
        "label": "Galdamane",
        "altLabel": null
    },
    {
        "value": 458,
        "province_code": 25,
        "cercle_code": 60,
        "label": "Meknassa Acharqia",
        "altLabel": null
    },
    {
        "value": 459,
        "province_code": 25,
        "cercle_code": 60,
        "label": "Meknassa Al Gharbia",
        "altLabel": null
    },
    {
        "value": 460,
        "province_code": 25,
        "cercle_code": 60,
        "label": "Oulad Chrif",
        "altLabel": null
    },
    {
        "value": 461,
        "province_code": 25,
        "cercle_code": 60,
        "label": "Maghraoua",
        "altLabel": null
    },
    {
        "value": 462,
        "province_code": 21,
        "cercle_code": null,
        "label": "Moulay Yacoub",
        "altLabel": null
    },
    {
        "value": 463,
        "province_code": 21,
        "cercle_code": null,
        "label": "Ain Chkef",
        "altLabel": null
    },
    {
        "value": 464,
        "province_code": 21,
        "cercle_code": 61,
        "label": "Mikkes",
        "altLabel": null
    },
    {
        "value": 465,
        "province_code": 21,
        "cercle_code": 61,
        "label": "Sebaa Rouadi",
        "altLabel": null
    },
    {
        "value": 466,
        "province_code": 21,
        "cercle_code": 61,
        "label": "Sebt Loudaya",
        "altLabel": null
    },
    {
        "value": 467,
        "province_code": 21,
        "cercle_code": 62,
        "label": "Ain Bou Ali",
        "altLabel": null
    },
    {
        "value": 468,
        "province_code": 21,
        "cercle_code": 62,
        "label": "Ain Kansra",
        "altLabel": "Ain Kansara"
    },
    {
        "value": 469,
        "province_code": 21,
        "cercle_code": 62,
        "label": "Laajajra",
        "altLabel": null
    },
    {
        "value": 470,
        "province_code": 21,
        "cercle_code": 62,
        "label": "Louadaine",
        "altLabel": null
    },
    {
        "value": 471,
        "province_code": 21,
        "cercle_code": 62,
        "label": "Oulad Mimoun",
        "altLabel": null
    },
    {
        "value": 472,
        "province_code": 21,
        "cercle_code": 62,
        "label": "Sidi Daoud",
        "altLabel": null
    },
    {
        "value": 473,
        "province_code": 29,
        "cercle_code": null,
        "label": "Kénitra",
        "altLabel": null
    },
    {
        "value": 474,
        "province_code": 29,
        "cercle_code": null,
        "label": "Mehdya",
        "altLabel": null
    },
    {
        "value": 475,
        "province_code": 29,
        "cercle_code": null,
        "label": "Souk El Arbaa",
        "altLabel": null
    },
    {
        "value": 476,
        "province_code": 29,
        "cercle_code": 63,
        "label": "Ameur Seflia",
        "altLabel": null
    },
    {
        "value": 477,
        "province_code": 29,
        "cercle_code": 63,
        "label": "Haddada",
        "altLabel": "Lehdada"
    },
    {
        "value": 478,
        "province_code": 29,
        "cercle_code": 63,
        "label": "Ouled Slama",
        "altLabel": null
    },
    {
        "value": 479,
        "province_code": 29,
        "cercle_code": null,
        "label": "Sidi Taibi",
        "altLabel": null
    },
    {
        "value": 480,
        "province_code": 29,
        "cercle_code": 64,
        "label": "Ben Mansour",
        "altLabel": null
    },
    {
        "value": 481,
        "province_code": 29,
        "cercle_code": 64,
        "label": "Mnasra",
        "altLabel": null
    },
    {
        "value": 482,
        "province_code": 29,
        "cercle_code": 64,
        "label": "Mograne",
        "altLabel": "Almkren"
    },
    {
        "value": 483,
        "province_code": 29,
        "cercle_code": 64,
        "label": "Sidi Mohamed Ben Mansour",
        "altLabel": "Sidi Mohamed Benmansour"
    },
    {
        "value": 484,
        "province_code": 29,
        "cercle_code": 65,
        "label": "Arbaoua",
        "altLabel": null
    },
    {
        "value": 485,
        "province_code": 29,
        "cercle_code": 65,
        "label": "Beni Malek",
        "altLabel": null
    },
    {
        "value": 486,
        "province_code": 29,
        "cercle_code": 65,
        "label": "Kariat Ben Aouda",
        "altLabel": null
    },
    {
        "value": 487,
        "province_code": 29,
        "cercle_code": 65,
        "label": "Oued El Makhazine",
        "altLabel": null
    },
    {
        "value": 488,
        "province_code": 29,
        "cercle_code": 66,
        "label": "Bahhara Ouled Ayad",
        "altLabel": null
    },
    {
        "value": 489,
        "province_code": 29,
        "cercle_code": 66,
        "label": "Sidi Allal Tazi",
        "altLabel": null
    },
    {
        "value": 490,
        "province_code": 29,
        "cercle_code": 66,
        "label": "Sidi Mohamed Lahmar",
        "altLabel": null
    },
    {
        "value": 491,
        "province_code": 29,
        "cercle_code": 66,
        "label": "Souk Tlet El Gharb",
        "altLabel": null
    },
    {
        "value": 492,
        "province_code": 29,
        "cercle_code": 67,
        "label": "Chouafaa",
        "altLabel": null
    },
    {
        "value": 493,
        "province_code": 29,
        "cercle_code": 67,
        "label": "Lalla Mimouna",
        "altLabel": null
    },
    {
        "value": 494,
        "province_code": 29,
        "cercle_code": 67,
        "label": "Moulay Bousselham",
        "altLabel": null
    },
    {
        "value": 495,
        "province_code": 29,
        "cercle_code": 67,
        "label": "Sidi Boubker El Haj",
        "altLabel": null
    },
    {
        "value": 496,
        "province_code": 30,
        "cercle_code": null,
        "label": "Khémisset",
        "altLabel": "Khemisset"
    },
    {
        "value": 497,
        "province_code": 30,
        "cercle_code": null,
        "label": "Rommani",
        "altLabel": null
    },
    {
        "value": 498,
        "province_code": 30,
        "cercle_code": null,
        "label": "Tiflet",
        "altLabel": null
    },
    {
        "value": 499,
        "province_code": 30,
        "cercle_code": null,
        "label": "Sidi Allal El Bahraoui",
        "altLabel": null
    },
    {
        "value": 500,
        "province_code": 30,
        "cercle_code": 68,
        "label": "Ait Mimoune",
        "altLabel": null
    },
    {
        "value": 501,
        "province_code": 30,
        "cercle_code": 68,
        "label": "Ait Ouribel",
        "altLabel": null
    },
    {
        "value": 502,
        "province_code": 30,
        "cercle_code": 68,
        "label": "Ait Siberne",
        "altLabel": null
    },
    {
        "value": 503,
        "province_code": 30,
        "cercle_code": 68,
        "label": "Ait Yadine",
        "altLabel": null
    },
    {
        "value": 504,
        "province_code": 30,
        "cercle_code": 68,
        "label": "El Ganzra",
        "altLabel": null
    },
    {
        "value": 505,
        "province_code": 30,
        "cercle_code": 68,
        "label": "Majmaa Tolba",
        "altLabel": null
    },
    {
        "value": 506,
        "province_code": 30,
        "cercle_code": 68,
        "label": "Sfassif",
        "altLabel": null
    },
    {
        "value": 507,
        "province_code": 30,
        "cercle_code": 68,
        "label": "Sidi Allal Lamsadder",
        "altLabel": null
    },
    {
        "value": 508,
        "province_code": 30,
        "cercle_code": 68,
        "label": "Sidi El Ghandour",
        "altLabel": "Sidi El Rhandour"
    },
    {
        "value": 509,
        "province_code": 30,
        "cercle_code": 69,
        "label": "Ait Ichou",
        "altLabel": null
    },
    {
        "value": 510,
        "province_code": 30,
        "cercle_code": 69,
        "label": "Ait Ikkou",
        "altLabel": null
    },
    {
        "value": 511,
        "province_code": 30,
        "cercle_code": 69,
        "label": "Bouqachmir",
        "altLabel": null
    },
    {
        "value": 512,
        "province_code": 30,
        "cercle_code": 69,
        "label": "Houderrane",
        "altLabel": null
    },
    {
        "value": 513,
        "province_code": 30,
        "cercle_code": 69,
        "label": "Maaziz",
        "altLabel": null
    },
    {
        "value": 514,
        "province_code": 30,
        "cercle_code": 69,
        "label": "Oulmes",
        "altLabel": null
    },
    {
        "value": 515,
        "province_code": 30,
        "cercle_code": 69,
        "label": "Tiddas",
        "altLabel": null
    },
    {
        "value": 516,
        "province_code": 30,
        "cercle_code": 70,
        "label": "Ain Sbit",
        "altLabel": null
    },
    {
        "value": 517,
        "province_code": 30,
        "cercle_code": 70,
        "label": "Brachoua",
        "altLabel": null
    },
    {
        "value": 518,
        "province_code": 30,
        "cercle_code": 70,
        "label": "Ezzhiliga",
        "altLabel": null
    },
    {
        "value": 519,
        "province_code": 30,
        "cercle_code": 70,
        "label": "Jemaat Moul Blad",
        "altLabel": null
    },
    {
        "value": 520,
        "province_code": 30,
        "cercle_code": 70,
        "label": "Laghoualem",
        "altLabel": null
    },
    {
        "value": 521,
        "province_code": 30,
        "cercle_code": 70,
        "label": "Marchouch",
        "altLabel": null
    },
    {
        "value": 522,
        "province_code": 30,
        "cercle_code": 70,
        "label": "Moulay Driss Aghbal",
        "altLabel": "My Driss Aghbal"
    },
    {
        "value": 523,
        "province_code": 30,
        "cercle_code": 71,
        "label": "Ain Johra-Sidi Boukhalkhal",
        "altLabel": null
    },
    {
        "value": 524,
        "province_code": 30,
        "cercle_code": 71,
        "label": "Ait Belkacem",
        "altLabel": null
    },
    {
        "value": 525,
        "province_code": 30,
        "cercle_code": 71,
        "label": "Ait Buyahya El Hajjama",
        "altLabel": "Ait Bouyahia El Hajjama"
    },
    {
        "value": 526,
        "province_code": 30,
        "cercle_code": 71,
        "label": "Ait Malek",
        "altLabel": null
    },
    {
        "value": 527,
        "province_code": 30,
        "cercle_code": 71,
        "label": "Khemis Sidi Yahya",
        "altLabel": null
    },
    {
        "value": 528,
        "province_code": 30,
        "cercle_code": 71,
        "label": "M'Qam Tolba",
        "altLabel": null
    },
    {
        "value": 529,
        "province_code": 30,
        "cercle_code": 71,
        "label": "Sidi Abderrazak",
        "altLabel": null
    },
    {
        "value": 530,
        "province_code": 30,
        "cercle_code": 71,
        "label": "Ait Ali Ou Lahcen",
        "altLabel": null
    },
    {
        "value": 531,
        "province_code": 26,
        "cercle_code": null,
        "label": "Agdal Riyad (arrond.)",
        "altLabel": "Agdal-Riyad (arrond.)"
    },
    {
        "value": 532,
        "province_code": 26,
        "cercle_code": null,
        "label": "El Youssoufia (arrond.)",
        "altLabel": null
    },
    {
        "value": 533,
        "province_code": 26,
        "cercle_code": null,
        "label": "Hassan (arrond.)",
        "altLabel": null
    },
    {
        "value": 534,
        "province_code": 26,
        "cercle_code": null,
        "label": "Souissi (arrond.)",
        "altLabel": null
    },
    {
        "value": 535,
        "province_code": 26,
        "cercle_code": null,
        "label": "Touarga",
        "altLabel": null
    },
    {
        "value": 536,
        "province_code": 26,
        "cercle_code": null,
        "label": "Yacoub El Mansour (arrond.)",
        "altLabel": null
    },
    {
        "value": 537,
        "province_code": 27,
        "cercle_code": null,
        "label": "Bab Lamrissa (arrond.)",
        "altLabel": null
    },
    {
        "value": 538,
        "province_code": 27,
        "cercle_code": null,
        "label": "Bettana (arrond.)",
        "altLabel": null
    },
    {
        "value": 539,
        "province_code": 27,
        "cercle_code": null,
        "label": "Hssaine (arrond.)",
        "altLabel": null
    },
    {
        "value": 540,
        "province_code": 27,
        "cercle_code": null,
        "label": "Layayda (arrond.)",
        "altLabel": null
    },
    {
        "value": 541,
        "province_code": 27,
        "cercle_code": null,
        "label": "Sidi Bouknadel",
        "altLabel": null
    },
    {
        "value": 542,
        "province_code": 27,
        "cercle_code": null,
        "label": "Tabriquet (arrond.)",
        "altLabel": null
    },
    {
        "value": 543,
        "province_code": 27,
        "cercle_code": null,
        "label": "Shoul",
        "altLabel": null
    },
    {
        "value": 544,
        "province_code": 27,
        "cercle_code": null,
        "label": "Ameur",
        "altLabel": null
    },
    {
        "value": 545,
        "province_code": 31,
        "cercle_code": null,
        "label": "Dar Gueddari",
        "altLabel": null
    },
    {
        "value": 546,
        "province_code": 31,
        "cercle_code": null,
        "label": "Had Kourt",
        "altLabel": null
    },
    {
        "value": 547,
        "province_code": 31,
        "cercle_code": null,
        "label": "Jorf El Melha",
        "altLabel": null
    },
    {
        "value": 548,
        "province_code": 31,
        "cercle_code": null,
        "label": "Mechraa Bel Ksiri",
        "altLabel": "Mechra Bel Ksiri"
    },
    {
        "value": 549,
        "province_code": 31,
        "cercle_code": null,
        "label": "Sidi Kacem",
        "altLabel": null
    },
    {
        "value": 550,
        "province_code": 31,
        "cercle_code": 73,
        "label": "Ain Dfali",
        "altLabel": null
    },
    {
        "value": 551,
        "province_code": 31,
        "cercle_code": 73,
        "label": "Bni Oual",
        "altLabel": null
    },
    {
        "value": 552,
        "province_code": 31,
        "cercle_code": 73,
        "label": "Moulay Abdelkader",
        "altLabel": null
    },
    {
        "value": 553,
        "province_code": 31,
        "cercle_code": 73,
        "label": "Sidi Ahmed Benaissa",
        "altLabel": null
    },
    {
        "value": 554,
        "province_code": 31,
        "cercle_code": 73,
        "label": "Sidi Ameur Al Hadi",
        "altLabel": null
    },
    {
        "value": 555,
        "province_code": 31,
        "cercle_code": 73,
        "label": "Sidi Azzouz",
        "altLabel": null
    },
    {
        "value": 556,
        "province_code": 31,
        "cercle_code": 74,
        "label": "Al Haouafate",
        "altLabel": null
    },
    {
        "value": 557,
        "province_code": 31,
        "cercle_code": 74,
        "label": "Nouirate",
        "altLabel": null
    },
    {
        "value": 558,
        "province_code": 31,
        "cercle_code": 74,
        "label": "Sefsaf",
        "altLabel": null
    },
    {
        "value": 559,
        "province_code": 31,
        "cercle_code": 75,
        "label": "Khnichet",
        "altLabel": null
    },
    {
        "value": 560,
        "province_code": 31,
        "cercle_code": 75,
        "label": "Lamrabih",
        "altLabel": null
    },
    {
        "value": 561,
        "province_code": 31,
        "cercle_code": 75,
        "label": "Oulad Nouel",
        "altLabel": null
    },
    {
        "value": 562,
        "province_code": 31,
        "cercle_code": 75,
        "label": "Sidi M'Hamed Chelh",
        "altLabel": null
    },
    {
        "value": 563,
        "province_code": 31,
        "cercle_code": 75,
        "label": "Taoughilt",
        "altLabel": null
    },
    {
        "value": 564,
        "province_code": 31,
        "cercle_code": 76,
        "label": "Bab Tiouka",
        "altLabel": null
    },
    {
        "value": 565,
        "province_code": 31,
        "cercle_code": 76,
        "label": "Bir Taleb",
        "altLabel": null
    },
    {
        "value": 566,
        "province_code": 31,
        "cercle_code": 76,
        "label": "Chbanate",
        "altLabel": null
    },
    {
        "value": 567,
        "province_code": 31,
        "cercle_code": 76,
        "label": "Selfat",
        "altLabel": null
    },
    {
        "value": 568,
        "province_code": 31,
        "cercle_code": 76,
        "label": "Tekna",
        "altLabel": null
    },
    {
        "value": 569,
        "province_code": 31,
        "cercle_code": 76,
        "label": "Zaggota",
        "altLabel": null
    },
    {
        "value": 570,
        "province_code": 31,
        "cercle_code": 76,
        "label": "Zirara",
        "altLabel": null
    },
    {
        "value": 571,
        "province_code": 31,
        "cercle_code": 77,
        "label": "Dar Laaslouji",
        "altLabel": null
    },
    {
        "value": 572,
        "province_code": 31,
        "cercle_code": 77,
        "label": "Rmilat",
        "altLabel": null
    },
    {
        "value": 573,
        "province_code": 31,
        "cercle_code": 77,
        "label": "Sidi Al Kamel",
        "altLabel": null
    },
    {
        "value": 574,
        "province_code": 32,
        "cercle_code": null,
        "label": "Sidi Slimane",
        "altLabel": null
    },
    {
        "value": 575,
        "province_code": 32,
        "cercle_code": null,
        "label": "Sidi Yahya El Gharb",
        "altLabel": "Sidi Yahia El Gharb"
    },
    {
        "value": 576,
        "province_code": 32,
        "cercle_code": 78,
        "label": "Kceibya",
        "altLabel": null
    },
    {
        "value": 577,
        "province_code": 32,
        "cercle_code": 78,
        "label": "Sfafaa",
        "altLabel": null
    },
    {
        "value": 578,
        "province_code": 32,
        "cercle_code": 78,
        "label": "Ameur Chamalia",
        "altLabel": null
    },
    {
        "value": 579,
        "province_code": 32,
        "cercle_code": 79,
        "label": "Azghar",
        "altLabel": null
    },
    {
        "value": 580,
        "province_code": 32,
        "cercle_code": 79,
        "label": "Boumaiz",
        "altLabel": null
    },
    {
        "value": 581,
        "province_code": 32,
        "cercle_code": 79,
        "label": "Dar Bel Amri",
        "altLabel": null
    },
    {
        "value": 582,
        "province_code": 32,
        "cercle_code": 79,
        "label": "M'Saada",
        "altLabel": null
    },
    {
        "value": 583,
        "province_code": 32,
        "cercle_code": 79,
        "label": "Ouled Ben Hammadi",
        "altLabel": null
    },
    {
        "value": 584,
        "province_code": 32,
        "cercle_code": 79,
        "label": "Ouled H'Cine",
        "altLabel": null
    },
    {
        "value": 585,
        "province_code": 28,
        "cercle_code": null,
        "label": "Ain El Aouda",
        "altLabel": null
    },
    {
        "value": 586,
        "province_code": 28,
        "cercle_code": null,
        "label": "Harhoura",
        "altLabel": null
    },
    {
        "value": 587,
        "province_code": 28,
        "cercle_code": null,
        "label": "Skhirate",
        "altLabel": null
    },
    {
        "value": 588,
        "province_code": 28,
        "cercle_code": null,
        "label": "Témara",
        "altLabel": "Temara"
    },
    {
        "value": 589,
        "province_code": 28,
        "cercle_code": null,
        "label": "Ain Attig",
        "altLabel": null
    },
    {
        "value": 590,
        "province_code": 28,
        "cercle_code": 80,
        "label": "El Menzeh",
        "altLabel": null
    },
    {
        "value": 591,
        "province_code": 28,
        "cercle_code": 80,
        "label": "Oumazza",
        "altLabel": null
    },
    {
        "value": 592,
        "province_code": 28,
        "cercle_code": 80,
        "label": "Sidi Yahya Zaer",
        "altLabel": null
    },
    {
        "value": 593,
        "province_code": 28,
        "cercle_code": 81,
        "label": "Mers El Kheir",
        "altLabel": null
    },
    {
        "value": 594,
        "province_code": 28,
        "cercle_code": 81,
        "label": "Sabbah",
        "altLabel": null
    },
    {
        "value": 595,
        "province_code": 34,
        "cercle_code": null,
        "label": "Azilal",
        "altLabel": null
    },
    {
        "value": 596,
        "province_code": 34,
        "cercle_code": null,
        "label": "Demnate",
        "altLabel": null
    },
    {
        "value": 597,
        "province_code": 34,
        "cercle_code": 82,
        "label": "Agoudi N'Lkhair",
        "altLabel": null
    },
    {
        "value": 598,
        "province_code": 34,
        "cercle_code": 82,
        "label": "Ait Abbas",
        "altLabel": null
    },
    {
        "value": 599,
        "province_code": 34,
        "cercle_code": 82,
        "label": "Ait Bou Oulli",
        "altLabel": null
    },
    {
        "value": 600,
        "province_code": 34,
        "cercle_code": 82,
        "label": "Ait M'Hamed",
        "altLabel": null
    },
    {
        "value": 601,
        "province_code": 34,
        "cercle_code": 82,
        "label": "Tabant",
        "altLabel": null
    },
    {
        "value": 602,
        "province_code": 34,
        "cercle_code": 82,
        "label": "Tamda Noumercid",
        "altLabel": null
    },
    {
        "value": 603,
        "province_code": 34,
        "cercle_code": 82,
        "label": "Zaouiat Ahansal",
        "altLabel": null
    },
    {
        "value": 604,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Ait Taguella",
        "altLabel": null
    },
    {
        "value": 605,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Bni Hassane",
        "altLabel": null
    },
    {
        "value": 606,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Bzou",
        "altLabel": null
    },
    {
        "value": 607,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Foum Jemaa",
        "altLabel": null
    },
    {
        "value": 608,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Moulay Aissa Ben Driss",
        "altLabel": null
    },
    {
        "value": 609,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Rfala",
        "altLabel": null
    },
    {
        "value": 610,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Tabia",
        "altLabel": null
    },
    {
        "value": 611,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Tanant",
        "altLabel": null
    },
    {
        "value": 612,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Taounza",
        "altLabel": null
    },
    {
        "value": 613,
        "province_code": 34,
        "cercle_code": 83,
        "label": "Tisqi",
        "altLabel": null
    },
    {
        "value": 614,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Ait Mazigh",
        "altLabel": null
    },
    {
        "value": 615,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Ait Ouqabli",
        "altLabel": null
    },
    {
        "value": 616,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Anergui",
        "altLabel": null
    },
    {
        "value": 617,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Bin El Ouidane",
        "altLabel": null
    },
    {
        "value": 618,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Isseksi",
        "altLabel": null
    },
    {
        "value": 619,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Ouaouizeght",
        "altLabel": null
    },
    {
        "value": 620,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Tabaroucht",
        "altLabel": null
    },
    {
        "value": 621,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Tagleft",
        "altLabel": null
    },
    {
        "value": 622,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Tiffert N'Ait Hamza",
        "altLabel": null
    },
    {
        "value": 623,
        "province_code": 34,
        "cercle_code": 84,
        "label": "Tilougguite",
        "altLabel": "Tiloukit"
    },
    {
        "value": 624,
        "province_code": 34,
        "cercle_code": 85,
        "label": "Afourar",
        "altLabel": null
    },
    {
        "value": 625,
        "province_code": 34,
        "cercle_code": 85,
        "label": "Bni Ayat",
        "altLabel": null
    },
    {
        "value": 626,
        "province_code": 34,
        "cercle_code": 85,
        "label": "Ait Ouaarda",
        "altLabel": null
    },
    {
        "value": 627,
        "province_code": 34,
        "cercle_code": 85,
        "label": "Timoulilt",
        "altLabel": null
    },
    {
        "value": 628,
        "province_code": 34,
        "cercle_code": 86,
        "label": "Ait Oumdis",
        "altLabel": null
    },
    {
        "value": 629,
        "province_code": 34,
        "cercle_code": 86,
        "label": "Ait Tamlil",
        "altLabel": null
    },
    {
        "value": 630,
        "province_code": 34,
        "cercle_code": 86,
        "label": "Anzou",
        "altLabel": null
    },
    {
        "value": 631,
        "province_code": 34,
        "cercle_code": 86,
        "label": "Sidi Yacoub",
        "altLabel": null
    },
    {
        "value": 632,
        "province_code": 34,
        "cercle_code": 86,
        "label": "Tidili Fetouaka",
        "altLabel": null
    },
    {
        "value": 633,
        "province_code": 34,
        "cercle_code": 87,
        "label": "Ait Blal",
        "altLabel": null
    },
    {
        "value": 634,
        "province_code": 34,
        "cercle_code": 87,
        "label": "Ait Majden",
        "altLabel": null
    },
    {
        "value": 635,
        "province_code": 34,
        "cercle_code": 87,
        "label": "Imlil",
        "altLabel": null
    },
    {
        "value": 636,
        "province_code": 34,
        "cercle_code": 87,
        "label": "Ouaoula",
        "altLabel": null
    },
    {
        "value": 637,
        "province_code": 34,
        "cercle_code": 87,
        "label": "Sidi Boulkhalf",
        "altLabel": null
    },
    {
        "value": 638,
        "province_code": 34,
        "cercle_code": 87,
        "label": "Tifni",
        "altLabel": null
    },
    {
        "value": 639,
        "province_code": 33,
        "cercle_code": null,
        "label": "Béni Mellal",
        "altLabel": "Beni Mellal"
    },
    {
        "value": 640,
        "province_code": 33,
        "cercle_code": null,
        "label": "El Ksiba",
        "altLabel": null
    },
    {
        "value": 641,
        "province_code": 33,
        "cercle_code": null,
        "label": "Kasba Tadla",
        "altLabel": null
    },
    {
        "value": 642,
        "province_code": 33,
        "cercle_code": null,
        "label": "Zaouiat Cheikh",
        "altLabel": null
    },
    {
        "value": 643,
        "province_code": 33,
        "cercle_code": 88,
        "label": "Foum Oudi",
        "altLabel": null
    },
    {
        "value": 644,
        "province_code": 33,
        "cercle_code": 88,
        "label": "Ouled Gnaou",
        "altLabel": null
    },
    {
        "value": 645,
        "province_code": 33,
        "cercle_code": 88,
        "label": "Ouled M'Barek",
        "altLabel": null
    },
    {
        "value": 646,
        "province_code": 33,
        "cercle_code": 88,
        "label": "Ouled Yaich",
        "altLabel": null
    },
    {
        "value": 647,
        "province_code": 33,
        "cercle_code": 88,
        "label": "Sidi Jaber",
        "altLabel": null
    },
    {
        "value": 648,
        "province_code": 33,
        "cercle_code": 88,
        "label": "Foum El Anceur",
        "altLabel": null
    },
    {
        "value": 649,
        "province_code": 33,
        "cercle_code": 89,
        "label": "Aghbala",
        "altLabel": null
    },
    {
        "value": 650,
        "province_code": 33,
        "cercle_code": 89,
        "label": "Boutferda",
        "altLabel": null
    },
    {
        "value": 651,
        "province_code": 33,
        "cercle_code": 89,
        "label": "Tizi N'Isly",
        "altLabel": null
    },
    {
        "value": 652,
        "province_code": 33,
        "cercle_code": 90,
        "label": "Ait Oum El Bekht",
        "altLabel": null
    },
    {
        "value": 653,
        "province_code": 33,
        "cercle_code": 90,
        "label": "Dir El Ksiba",
        "altLabel": null
    },
    {
        "value": 654,
        "province_code": 33,
        "cercle_code": 90,
        "label": "Naour",
        "altLabel": null
    },
    {
        "value": 655,
        "province_code": 33,
        "cercle_code": 90,
        "label": "Taghzirt",
        "altLabel": null
    },
    {
        "value": 656,
        "province_code": 33,
        "cercle_code": 90,
        "label": "Tanougha",
        "altLabel": null
    },
    {
        "value": 657,
        "province_code": 33,
        "cercle_code": 91,
        "label": "Guettaya",
        "altLabel": null
    },
    {
        "value": 658,
        "province_code": 33,
        "cercle_code": 91,
        "label": "Ouled Youssef",
        "altLabel": null
    },
    {
        "value": 659,
        "province_code": 33,
        "cercle_code": 91,
        "label": "Ouled Said L'Oued",
        "altLabel": "Ouled Said Loued"
    },
    {
        "value": 660,
        "province_code": 33,
        "cercle_code": 91,
        "label": "Semguet",
        "altLabel": null
    },
    {
        "value": 661,
        "province_code": 35,
        "cercle_code": null,
        "label": "Fquih Ben Salah",
        "altLabel": null
    },
    {
        "value": 662,
        "province_code": 35,
        "cercle_code": null,
        "label": "Ouled Ayad",
        "altLabel": null
    },
    {
        "value": 663,
        "province_code": 35,
        "cercle_code": null,
        "label": "Souk Sebt Ouled Nemma",
        "altLabel": null
    },
    {
        "value": 664,
        "province_code": 35,
        "cercle_code": 92,
        "label": "Ouled Bourahmoune",
        "altLabel": null
    },
    {
        "value": 665,
        "province_code": 35,
        "cercle_code": 92,
        "label": "Ouled Zmam",
        "altLabel": null
    },
    {
        "value": 666,
        "province_code": 35,
        "cercle_code": 92,
        "label": "Sidi Aissa Ben Ali",
        "altLabel": null
    },
    {
        "value": 667,
        "province_code": 35,
        "cercle_code": 92,
        "label": "Sidi Hammadi",
        "altLabel": null
    },
    {
        "value": 668,
        "province_code": 35,
        "cercle_code": 93,
        "label": "Khalfia",
        "altLabel": null
    },
    {
        "value": 669,
        "province_code": 35,
        "cercle_code": 93,
        "label": "Bni Chegdale",
        "altLabel": null
    },
    {
        "value": 670,
        "province_code": 35,
        "cercle_code": 93,
        "label": "Bni Oukil",
        "altLabel": null
    },
    {
        "value": 671,
        "province_code": 35,
        "cercle_code": 93,
        "label": "Bradia",
        "altLabel": null
    },
    {
        "value": 672,
        "province_code": 35,
        "cercle_code": 93,
        "label": "Hel Merbaa",
        "altLabel": null
    },
    {
        "value": 673,
        "province_code": 35,
        "cercle_code": 93,
        "label": "Krifate",
        "altLabel": null
    },
    {
        "value": 674,
        "province_code": 35,
        "cercle_code": 94,
        "label": "Dar Ould Zidouh",
        "altLabel": null
    },
    {
        "value": 675,
        "province_code": 35,
        "cercle_code": 94,
        "label": "Had Boumoussa",
        "altLabel": null
    },
    {
        "value": 676,
        "province_code": 35,
        "cercle_code": 94,
        "label": "Ouled Nacer",
        "altLabel": null
    },
    {
        "value": 677,
        "province_code": 36,
        "cercle_code": null,
        "label": "Khenifra",
        "altLabel": null
    },
    {
        "value": 678,
        "province_code": 36,
        "cercle_code": null,
        "label": "M'Rirt",
        "altLabel": null
    },
    {
        "value": 679,
        "province_code": 36,
        "cercle_code": 95,
        "label": "Ait Ishaq",
        "altLabel": null
    },
    {
        "value": 680,
        "province_code": 36,
        "cercle_code": 95,
        "label": "Ait Saadelli",
        "altLabel": null
    },
    {
        "value": 681,
        "province_code": 36,
        "cercle_code": 95,
        "label": "El Kbab",
        "altLabel": null
    },
    {
        "value": 682,
        "province_code": 36,
        "cercle_code": 95,
        "label": "Kerrouchen",
        "altLabel": null
    },
    {
        "value": 683,
        "province_code": 36,
        "cercle_code": 95,
        "label": "Ouaoumana",
        "altLabel": null
    },
    {
        "value": 684,
        "province_code": 36,
        "cercle_code": 95,
        "label": "Sidi Yahya Ou Saad",
        "altLabel": null
    },
    {
        "value": 685,
        "province_code": 36,
        "cercle_code": 95,
        "label": "Tighassaline",
        "altLabel": null
    },
    {
        "value": 686,
        "province_code": 36,
        "cercle_code": 96,
        "label": "Aguelmam Azegza",
        "altLabel": null
    },
    {
        "value": 687,
        "province_code": 36,
        "cercle_code": 96,
        "label": "El Borj",
        "altLabel": null
    },
    {
        "value": 688,
        "province_code": 36,
        "cercle_code": 96,
        "label": "Lehri",
        "altLabel": "El Hri"
    },
    {
        "value": 689,
        "province_code": 36,
        "cercle_code": 96,
        "label": "Moha Ou Hammou Zayani",
        "altLabel": "Moha Ou Hammou-Zayani"
    },
    {
        "value": 690,
        "province_code": 36,
        "cercle_code": 96,
        "label": "Sidi Amar",
        "altLabel": null
    },
    {
        "value": 691,
        "province_code": 36,
        "cercle_code": 96,
        "label": "Sidi Lamine",
        "altLabel": null
    },
    {
        "value": 692,
        "province_code": 36,
        "cercle_code": 97,
        "label": "Aguelmous",
        "altLabel": null
    },
    {
        "value": 693,
        "province_code": 36,
        "cercle_code": 97,
        "label": "El Hammam",
        "altLabel": null
    },
    {
        "value": 694,
        "province_code": 36,
        "cercle_code": 97,
        "label": "Had Bouhssoussen",
        "altLabel": null
    },
    {
        "value": 695,
        "province_code": 36,
        "cercle_code": 97,
        "label": "Moulay Bouazza",
        "altLabel": null
    },
    {
        "value": 696,
        "province_code": 36,
        "cercle_code": 97,
        "label": "Oum Rabia",
        "altLabel": null
    },
    {
        "value": 697,
        "province_code": 36,
        "cercle_code": 97,
        "label": "Sebt Ait Rahou",
        "altLabel": null
    },
    {
        "value": 698,
        "province_code": 36,
        "cercle_code": 97,
        "label": "Sidi Hcine",
        "altLabel": null
    },
    {
        "value": 699,
        "province_code": 37,
        "cercle_code": null,
        "label": "Bejaad",
        "altLabel": null
    },
    {
        "value": 700,
        "province_code": 37,
        "cercle_code": null,
        "label": "Boujniba",
        "altLabel": null
    },
    {
        "value": 701,
        "province_code": 37,
        "cercle_code": null,
        "label": "Hattane",
        "altLabel": null
    },
    {
        "value": 702,
        "province_code": 37,
        "cercle_code": null,
        "label": "Khouribga",
        "altLabel": null
    },
    {
        "value": 703,
        "province_code": 37,
        "cercle_code": null,
        "label": "Oued Zem",
        "altLabel": null
    },
    {
        "value": 704,
        "province_code": 37,
        "cercle_code": 98,
        "label": "Ain Kaicher",
        "altLabel": null
    },
    {
        "value": 705,
        "province_code": 37,
        "cercle_code": 98,
        "label": "Bni Bataou",
        "altLabel": null
    },
    {
        "value": 706,
        "province_code": 37,
        "cercle_code": 98,
        "label": "Bni Zrantel",
        "altLabel": null
    },
    {
        "value": 707,
        "province_code": 37,
        "cercle_code": 98,
        "label": "Boukhrisse",
        "altLabel": null
    },
    {
        "value": 708,
        "province_code": 37,
        "cercle_code": 98,
        "label": "Chougrane",
        "altLabel": null
    },
    {
        "value": 709,
        "province_code": 37,
        "cercle_code": 98,
        "label": "Oulad Gouaouch",
        "altLabel": null
    },
    {
        "value": 710,
        "province_code": 37,
        "cercle_code": 98,
        "label": "Rouached",
        "altLabel": null
    },
    {
        "value": 711,
        "province_code": 37,
        "cercle_code": 98,
        "label": "Tachraft",
        "altLabel": "Tachrafat"
    },
    {
        "value": 712,
        "province_code": 37,
        "cercle_code": 99,
        "label": "Bir Mezoui",
        "altLabel": null
    },
    {
        "value": 713,
        "province_code": 37,
        "cercle_code": 99,
        "label": "Bni Ykhlef",
        "altLabel": null
    },
    {
        "value": 714,
        "province_code": 37,
        "cercle_code": 99,
        "label": "Boulanouare",
        "altLabel": null
    },
    {
        "value": 715,
        "province_code": 37,
        "cercle_code": 99,
        "label": "Lagfaf",
        "altLabel": null
    },
    {
        "value": 716,
        "province_code": 37,
        "cercle_code": 99,
        "label": "El Foqra",
        "altLabel": null
    },
    {
        "value": 717,
        "province_code": 37,
        "cercle_code": 99,
        "label": "M'Fassis",
        "altLabel": null
    },
    {
        "value": 718,
        "province_code": 37,
        "cercle_code": 99,
        "label": "Oulad Abdoune",
        "altLabel": null
    },
    {
        "value": 719,
        "province_code": 37,
        "cercle_code": 99,
        "label": "Oulad Azzouz",
        "altLabel": null
    },
    {
        "value": 720,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Ait Ammar",
        "altLabel": null
    },
    {
        "value": 721,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Bni Smir",
        "altLabel": null
    },
    {
        "value": 722,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Braksa",
        "altLabel": null
    },
    {
        "value": 723,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Kasbat Troch",
        "altLabel": null
    },
    {
        "value": 724,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Lagnadiz",
        "altLabel": null
    },
    {
        "value": 725,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Maadna",
        "altLabel": null
    },
    {
        "value": 726,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Oulad Aissa",
        "altLabel": null
    },
    {
        "value": 727,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Oulad Boughadi",
        "altLabel": null
    },
    {
        "value": 728,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Oulad Fennane",
        "altLabel": null
    },
    {
        "value": 729,
        "province_code": 37,
        "cercle_code": 100,
        "label": "Oulad Ftata",
        "altLabel": null
    },
    {
        "value": 730,
        "province_code": 43,
        "cercle_code": null,
        "label": "Benslimane",
        "altLabel": null
    },
    {
        "value": 731,
        "province_code": 43,
        "cercle_code": null,
        "label": "Bouznika",
        "altLabel": null
    },
    {
        "value": 732,
        "province_code": 43,
        "cercle_code": null,
        "label": "El Mansouria",
        "altLabel": null
    },
    {
        "value": 733,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Ahlaf",
        "altLabel": null
    },
    {
        "value": 734,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Ain Tizgha",
        "altLabel": null
    },
    {
        "value": 735,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Fdalate",
        "altLabel": null
    },
    {
        "value": 736,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Mellila",
        "altLabel": null
    },
    {
        "value": 737,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Moualine El Oued",
        "altLabel": null
    },
    {
        "value": 738,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Oulad Ali Toualaa",
        "altLabel": "Oulad Ali Taoulaa"
    },
    {
        "value": 739,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Oulad Yahya Louta",
        "altLabel": null
    },
    {
        "value": 740,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Rdadna Oulad Malek",
        "altLabel": null
    },
    {
        "value": 741,
        "province_code": 43,
        "cercle_code": 101,
        "label": "Ziaida",
        "altLabel": null
    },
    {
        "value": 742,
        "province_code": 43,
        "cercle_code": 102,
        "label": "Bir Ennasr",
        "altLabel": null
    },
    {
        "value": 743,
        "province_code": 43,
        "cercle_code": 102,
        "label": "Sidi Bettache",
        "altLabel": null
    },
    {
        "value": 744,
        "province_code": 43,
        "cercle_code": 102,
        "label": "Charrate",
        "altLabel": null
    },
    {
        "value": 745,
        "province_code": 44,
        "cercle_code": null,
        "label": "Berrechid",
        "altLabel": null
    },
    {
        "value": 746,
        "province_code": 44,
        "cercle_code": null,
        "label": "Deroua",
        "altLabel": null
    },
    {
        "value": 747,
        "province_code": 44,
        "cercle_code": null,
        "label": "El Gara",
        "altLabel": null
    },
    {
        "value": 748,
        "province_code": 44,
        "cercle_code": null,
        "label": "Had Soualem",
        "altLabel": null
    },
    {
        "value": 749,
        "province_code": 44,
        "cercle_code": null,
        "label": "Oulad Abbou",
        "altLabel": null
    },
    {
        "value": 750,
        "province_code": 44,
        "cercle_code": null,
        "label": "Sidi Rahal Chatai",
        "altLabel": null
    },
    {
        "value": 751,
        "province_code": 44,
        "cercle_code": 103,
        "label": "Ben Maachou",
        "altLabel": null
    },
    {
        "value": 752,
        "province_code": 44,
        "cercle_code": 103,
        "label": "Laghnimyine",
        "altLabel": null
    },
    {
        "value": 753,
        "province_code": 44,
        "cercle_code": 103,
        "label": "Lahsasna",
        "altLabel": null
    },
    {
        "value": 754,
        "province_code": 44,
        "cercle_code": 103,
        "label": "Sahel Oulad H'Riz",
        "altLabel": null
    },
    {
        "value": 755,
        "province_code": 44,
        "cercle_code": 103,
        "label": "Sidi Abdelkhaleq",
        "altLabel": null
    },
    {
        "value": 756,
        "province_code": 44,
        "cercle_code": 103,
        "label": "Sidi El Mekki",
        "altLabel": null
    },
    {
        "value": 757,
        "province_code": 44,
        "cercle_code": 103,
        "label": "Soualem Trifiya",
        "altLabel": null
    },
    {
        "value": 758,
        "province_code": 44,
        "cercle_code": 103,
        "label": "Zaouiat Sidi Ben Hamdoun",
        "altLabel": null
    },
    {
        "value": 759,
        "province_code": 44,
        "cercle_code": 104,
        "label": "Foqra Oulad Aameur",
        "altLabel": null
    },
    {
        "value": 760,
        "province_code": 44,
        "cercle_code": 104,
        "label": "Jaqma",
        "altLabel": null
    },
    {
        "value": 761,
        "province_code": 44,
        "cercle_code": 104,
        "label": "Kasbat Ben Mchich",
        "altLabel": null
    },
    {
        "value": 762,
        "province_code": 44,
        "cercle_code": 104,
        "label": "Lambarkiyine",
        "altLabel": null
    },
    {
        "value": 763,
        "province_code": 44,
        "cercle_code": 104,
        "label": "Ouled Cebbah",
        "altLabel": null
    },
    {
        "value": 764,
        "province_code": 44,
        "cercle_code": 104,
        "label": "Oulad Ziyane",
        "altLabel": null
    },
    {
        "value": 765,
        "province_code": 44,
        "cercle_code": 104,
        "label": "Ouled Zidane",
        "altLabel": "Oulad Zidane"
    },
    {
        "value": 766,
        "province_code": 44,
        "cercle_code": 104,
        "label": "Riah",
        "altLabel": null
    },
    {
        "value": 767,
        "province_code": 38,
        "cercle_code": null,
        "label": "Anfa",
        "altLabel": null
    },
    {
        "value": 768,
        "province_code": 38,
        "cercle_code": null,
        "label": "El Maarif",
        "altLabel": null
    },
    {
        "value": 769,
        "province_code": 38,
        "cercle_code": null,
        "label": "Sidi Belyout",
        "altLabel": null
    },
    {
        "value": 770,
        "province_code": 38,
        "cercle_code": null,
        "label": "Al-Fida",
        "altLabel": "Al Fida"
    },
    {
        "value": 771,
        "province_code": 38,
        "cercle_code": null,
        "label": "Mers-Sultan",
        "altLabel": "Mers Sultan"
    },
    {
        "value": 772,
        "province_code": 38,
        "cercle_code": null,
        "label": "Aîn-Sebaâ",
        "altLabel": "Ain Sebaa"
    },
    {
        "value": 773,
        "province_code": 38,
        "cercle_code": null,
        "label": "Assoukhour Assawda",
        "altLabel": null
    },
    {
        "value": 774,
        "province_code": 38,
        "cercle_code": null,
        "label": "Hay Mohammadi",
        "altLabel": "Hay Mohammadi"
    },
    {
        "value": 775,
        "province_code": 38,
        "cercle_code": null,
        "label": "Hay-Hassani",
        "altLabel": "Hay Hassani"
    },
    {
        "value": 776,
        "province_code": 38,
        "cercle_code": null,
        "label": "Aîn-Chock",
        "altLabel": "Ain Chok"
    },
    {
        "value": 777,
        "province_code": 38,
        "cercle_code": null,
        "label": "Sidi Bernoussi",
        "altLabel": null
    },
    {
        "value": 778,
        "province_code": 38,
        "cercle_code": null,
        "label": "Sidi Moumen",
        "altLabel": null
    },
    {
        "value": 779,
        "province_code": 38,
        "cercle_code": null,
        "label": "Ben M'Sick",
        "altLabel": null
    },
    {
        "value": 780,
        "province_code": 38,
        "cercle_code": null,
        "label": "Sbata",
        "altLabel": null
    },
    {
        "value": 781,
        "province_code": 38,
        "cercle_code": null,
        "label": "Moulay Rachid",
        "altLabel": null
    },
    {
        "value": 782,
        "province_code": 38,
        "cercle_code": null,
        "label": "Sidi Othmane",
        "altLabel": null
    },
    {
        "value": 783,
        "province_code": 38,
        "cercle_code": null,
        "label": "Mechouar de Casablanca",
        "altLabel": null
    },
    {
      "value": 1539,
      "province_code": 38,
      "cercle_code": null,
      "label": "Casablanca",
      "altLabel": null
  },
    {
        "value": 784,
        "province_code": 40,
        "cercle_code": null,
        "label": "Azemmour",
        "altLabel": null
    },
    {
        "value": 785,
        "province_code": 40,
        "cercle_code": null,
        "label": "El Jadida",
        "altLabel": null
    },
    {
        "value": 786,
        "province_code": 40,
        "cercle_code": null,
        "label": "Lbir Jdid",
        "altLabel": "Labir Jdid"
    },
    {
        "value": 787,
        "province_code": 40,
        "cercle_code": 105,
        "label": "Chtouka",
        "altLabel": null
    },
    {
        "value": 788,
        "province_code": 40,
        "cercle_code": 105,
        "label": "Laghdira",
        "altLabel": null
    },
    {
        "value": 789,
        "province_code": 40,
        "cercle_code": 105,
        "label": "Lamharza Essahel",
        "altLabel": null
    },
    {
        "value": 790,
        "province_code": 40,
        "cercle_code": 105,
        "label": "Sidi Ali Ben Hamdouche",
        "altLabel": null
    },
    {
        "value": 791,
        "province_code": 40,
        "cercle_code": 106,
        "label": "My Abdellah",
        "altLabel": null
    },
    {
        "value": 792,
        "province_code": 40,
        "cercle_code": 106,
        "label": "Oulad Aissa",
        "altLabel": null
    },
    {
        "value": 793,
        "province_code": 40,
        "cercle_code": 106,
        "label": "Ouled Ghanem",
        "altLabel": null
    },
    {
        "value": 794,
        "province_code": 40,
        "cercle_code": 106,
        "label": "Ouled Hcine",
        "altLabel": null
    },
    {
        "value": 795,
        "province_code": 40,
        "cercle_code": 106,
        "label": "Sidi Abed",
        "altLabel": null
    },
    {
        "value": 796,
        "province_code": 40,
        "cercle_code": 106,
        "label": "Sidi M'Hamed Akhdim",
        "altLabel": null
    },
    {
        "value": 797,
        "province_code": 40,
        "cercle_code": 107,
        "label": "Haouzia",
        "altLabel": null
    },
    {
        "value": 798,
        "province_code": 40,
        "cercle_code": 107,
        "label": "Oulad Rahmoune",
        "altLabel": null
    },
    {
        "value": 799,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Boulaouane",
        "altLabel": null
    },
    {
        "value": 800,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Chaibate",
        "altLabel": null
    },
    {
        "value": 801,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Mettouh",
        "altLabel": null
    },
    {
        "value": 802,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Mogress",
        "altLabel": null
    },
    {
        "value": 803,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Oulad Hamdane",
        "altLabel": null
    },
    {
        "value": 804,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Oulad Sidi Ali Ben Youssef",
        "altLabel": null
    },
    {
        "value": 805,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Ouled Frej",
        "altLabel": null
    },
    {
        "value": 806,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Sebt Saiss",
        "altLabel": null
    },
    {
        "value": 807,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Si Hsaien Ben Abderrahmane",
        "altLabel": null
    },
    {
        "value": 808,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Sidi Smail",
        "altLabel": "Zaouiat Sidi Ismail"
    },
    {
        "value": 809,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Zaouiat Saiss",
        "altLabel": null
    },
    {
        "value": 810,
        "province_code": 40,
        "cercle_code": 108,
        "label": "Zaouiat Lakouacem",
        "altLabel": null
    },
    {
        "value": 811,
        "province_code": 42,
        "cercle_code": null,
        "label": "Lahraouyine",
        "altLabel": null
    },
    {
        "value": 812,
        "province_code": 42,
        "cercle_code": null,
        "label": "Mediouna",
        "altLabel": null
    },
    {
        "value": 813,
        "province_code": 42,
        "cercle_code": null,
        "label": "Tit Mellil",
        "altLabel": null
    },
    {
        "value": 814,
        "province_code": 42,
        "cercle_code": 109,
        "label": "Al Majjatia Oulad Taleb",
        "altLabel": null
    },
    {
        "value": 815,
        "province_code": 42,
        "cercle_code": 109,
        "label": "Sidi Hajjaj Oued Hassar",
        "altLabel": null
    },
    {
        "value": 816,
        "province_code": 39,
        "cercle_code": null,
        "label": "Mohammadia",
        "altLabel": null
    },
    {
        "value": 817,
        "province_code": 39,
        "cercle_code": null,
        "label": "Ain Harrouda",
        "altLabel": null
    },
    {
        "value": 818,
        "province_code": 39,
        "cercle_code": null,
        "label": "Bni Yakhlef",
        "altLabel": null
    },
    {
        "value": 819,
        "province_code": 39,
        "cercle_code": 110,
        "label": "Ech-Challalate",
        "altLabel": null
    },
    {
        "value": 820,
        "province_code": 39,
        "cercle_code": 110,
        "label": "Sidi Moussa Ben Ali",
        "altLabel": null
    },
    {
        "value": 821,
        "province_code": 39,
        "cercle_code": 110,
        "label": "Sidi Moussa Majdoub",
        "altLabel": "Sidi Moussa El Majdoub"
    },
    {
        "value": 822,
        "province_code": 41,
        "cercle_code": null,
        "label": "Bouskoura",
        "altLabel": null
    },
    {
        "value": 823,
        "province_code": 41,
        "cercle_code": null,
        "label": "Dar Bouazza",
        "altLabel": null
    },
    {
        "value": 824,
        "province_code": 41,
        "cercle_code": null,
        "label": "Nouaceur",
        "altLabel": null
    },
    {
        "value": 825,
        "province_code": 41,
        "cercle_code": null,
        "label": "Oulad Azzouz",
        "altLabel": null
    },
    {
        "value": 826,
        "province_code": 41,
        "cercle_code": null,
        "label": "Oulad Salah",
        "altLabel": null
    },
    {
        "value": 827,
        "province_code": 45,
        "cercle_code": null,
        "label": "Ben Ahmed",
        "altLabel": null
    },
    {
        "value": 828,
        "province_code": 45,
        "cercle_code": null,
        "label": "El Borouj",
        "altLabel": null
    },
    {
        "value": 829,
        "province_code": 45,
        "cercle_code": null,
        "label": "Loulad",
        "altLabel": null
    },
    {
        "value": 830,
        "province_code": 45,
        "cercle_code": null,
        "label": "Oulad M'Rah",
        "altLabel": null
    },
    {
        "value": 831,
        "province_code": 45,
        "cercle_code": null,
        "label": "Settat",
        "altLabel": null
    },
    {
        "value": 832,
        "province_code": 45,
        "cercle_code": 112,
        "label": "Ain Dorbane-Lahlaf",
        "altLabel": null
    },
    {
        "value": 833,
        "province_code": 45,
        "cercle_code": 112,
        "label": "Bouguargouh",
        "altLabel": null
    },
    {
        "value": 834,
        "province_code": 45,
        "cercle_code": 112,
        "label": "Lakhzazra",
        "altLabel": null
    },
    {
        "value": 835,
        "province_code": 45,
        "cercle_code": 195,
        "label": "Mniaa",
        "altLabel": null
    },
    {
        "value": 836,
        "province_code": 45,
        "cercle_code": 195,
        "label": "Mrizigue",
        "altLabel": null
    },
    {
        "value": 837,
        "province_code": 45,
        "cercle_code": 112,
        "label": "M'Garto",
        "altLabel": null
    },
    {
        "value": 838,
        "province_code": 45,
        "cercle_code": 112,
        "label": "N'Khila",
        "altLabel": null
    },
    {
        "value": 839,
        "province_code": 45,
        "cercle_code": 195,
        "label": "Oued Naanaa",
        "altLabel": null
    },
    {
        "value": 840,
        "province_code": 45,
        "cercle_code": 195,
        "label": "Oulad Chbana",
        "altLabel": null
    },
    {
        "value": 841,
        "province_code": 45,
        "cercle_code": 195,
        "label": "Oulad Fares",
        "altLabel": null
    },
    {
        "value": 842,
        "province_code": 45,
        "cercle_code": 112,
        "label": "Oulad M'Hamed",
        "altLabel": "Ouled M'Hamed"
    },
    {
        "value": 843,
        "province_code": 45,
        "cercle_code": 195,
        "label": "Ras El Ain Chaouia",
        "altLabel": null
    },
    {
        "value": 844,
        "province_code": 45,
        "cercle_code": 195,
        "label": "Sgamna",
        "altLabel": null
    },
    {
        "value": 845,
        "province_code": 45,
        "cercle_code": 112,
        "label": "Sidi Abdelkrim",
        "altLabel": null
    },
    {
        "value": 846,
        "province_code": 45,
        "cercle_code": 112,
        "label": "Sidi Dahbi",
        "altLabel": null
    },
    {
        "value": 847,
        "province_code": 45,
        "cercle_code": 195,
        "label": "Sidi Hajjaj",
        "altLabel": null
    },
    {
        "value": 848,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Ain Blal",
        "altLabel": null
    },
    {
        "value": 849,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Bni Khloug",
        "altLabel": null
    },
    {
        "value": 850,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Dar Chaffai",
        "altLabel": null
    },
    {
        "value": 851,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Laqraqra",
        "altLabel": null
    },
    {
        "value": 852,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Meskoura",
        "altLabel": null
    },
    {
        "value": 853,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Oulad Amer",
        "altLabel": null
    },
    {
        "value": 854,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Oulad Bouali Nouaja",
        "altLabel": null
    },
    {
        "value": 855,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Oulad Fares El Halla",
        "altLabel": null
    },
    {
        "value": 856,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Oulad Freiha",
        "altLabel": null
    },
    {
        "value": 857,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Sidi Ahmed El Khadir",
        "altLabel": null
    },
    {
        "value": 858,
        "province_code": 45,
        "cercle_code": 113,
        "label": "Sidi Boumehdi",
        "altLabel": null
    },
    {
        "value": 859,
        "province_code": 45,
        "cercle_code": 196,
        "label": "Bni Yagrine",
        "altLabel": null
    },
    {
        "value": 860,
        "province_code": 45,
        "cercle_code": 114,
        "label": "Gdana",
        "altLabel": null
    },
    {
        "value": 861,
        "province_code": 45,
        "cercle_code": 196,
        "label": "Guisser",
        "altLabel": null
    },
    {
        "value": 862,
        "province_code": 45,
        "cercle_code": 114,
        "label": "Khemisset Chaouia",
        "altLabel": null
    },
    {
        "value": 863,
        "province_code": 45,
        "cercle_code": 114,
        "label": "Lahouaza",
        "altLabel": null
    },
    {
        "value": 864,
        "province_code": 45,
        "cercle_code": 196,
        "label": "Machraa Ben Abbou",
        "altLabel": null
    },
    {
        "value": 865,
        "province_code": 45,
        "cercle_code": 114,
        "label": "Mzamza Janoubia",
        "altLabel": null
    },
    {
        "value": 866,
        "province_code": 45,
        "cercle_code": 114,
        "label": "Mzoura",
        "altLabel": null
    },
    {
        "value": 867,
        "province_code": 45,
        "cercle_code": 114,
        "label": "Oulad Said",
        "altLabel": null
    },
    {
        "value": 868,
        "province_code": 45,
        "cercle_code": 196,
        "label": "Oulad Sghir",
        "altLabel": null
    },
    {
        "value": 869,
        "province_code": 45,
        "cercle_code": 196,
        "label": "Rima",
        "altLabel": null
    },
    {
        "value": 870,
        "province_code": 45,
        "cercle_code": 114,
        "label": "Sidi El Aidi",
        "altLabel": null
    },
    {
        "value": 871,
        "province_code": 45,
        "cercle_code": 196,
        "label": "Sidi Mohammed Ben Rahal",
        "altLabel": null
    },
    {
        "value": 872,
        "province_code": 45,
        "cercle_code": 196,
        "label": "Toualet",
        "altLabel": null
    },
    {
        "value": 873,
        "province_code": 46,
        "cercle_code": null,
        "label": "Sidi Bennour",
        "altLabel": null
    },
    {
        "value": 874,
        "province_code": 46,
        "cercle_code": null,
        "label": "Zemamra",
        "altLabel": "Zmamra"
    },
    {
        "value": 875,
        "province_code": 46,
        "cercle_code": 198,
        "label": "Bni Hilal",
        "altLabel": null
    },
    {
        "value": 876,
        "province_code": 46,
        "cercle_code": 198,
        "label": "Bni Tsiriss",
        "altLabel": null
    },
    {
        "value": 877,
        "province_code": 46,
        "cercle_code": 115,
        "label": "Bouhmame",
        "altLabel": null
    },
    {
        "value": 878,
        "province_code": 46,
        "cercle_code": 115,
        "label": "Jabria",
        "altLabel": null
    },
    {
        "value": 879,
        "province_code": 46,
        "cercle_code": 198,
        "label": "Khmis Ksiba",
        "altLabel": null
    },
    {
        "value": 880,
        "province_code": 46,
        "cercle_code": 199,
        "label": "Koudiat Bni Dghough",
        "altLabel": null
    },
    {
        "value": 881,
        "province_code": 46,
        "cercle_code": 199,
        "label": "Kridid",
        "altLabel": null
    },
    {
        "value": 882,
        "province_code": 46,
        "cercle_code": 199,
        "label": "Laagagcha",
        "altLabel": null
    },
    {
        "value": 883,
        "province_code": 46,
        "cercle_code": 198,
        "label": "Laamria",
        "altLabel": null
    },
    {
        "value": 884,
        "province_code": 46,
        "cercle_code": 198,
        "label": "Laaounate",
        "altLabel": null
    },
    {
        "value": 885,
        "province_code": 46,
        "cercle_code": 115,
        "label": "Laatatra",
        "altLabel": null
    },
    {
        "value": 886,
        "province_code": 46,
        "cercle_code": 115,
        "label": "Lmechrek",
        "altLabel": null
    },
    {
        "value": 887,
        "province_code": 46,
        "cercle_code": 198,
        "label": "Metrane",
        "altLabel": null
    },
    {
        "value": 888,
        "province_code": 46,
        "cercle_code": 115,
        "label": "M'Tal",
        "altLabel": null
    },
    {
        "value": 889,
        "province_code": 46,
        "cercle_code": 199,
        "label": "Oulad Amrane",
        "altLabel": null
    },
    {
        "value": 890,
        "province_code": 46,
        "cercle_code": 198,
        "label": "Oulad Boussaken",
        "altLabel": null
    },
    {
        "value": 891,
        "province_code": 46,
        "cercle_code": 115,
        "label": "Oulad Si Bouhya",
        "altLabel": null
    },
    {
        "value": 892,
        "province_code": 46,
        "cercle_code": 199,
        "label": "Tamda",
        "altLabel": null
    },
    {
        "value": 893,
        "province_code": 46,
        "cercle_code": 116,
        "label": "Laghnadra",
        "altLabel": null
    },
    {
        "value": 894,
        "province_code": 46,
        "cercle_code": 116,
        "label": "Lgharbia",
        "altLabel": null
    },
    {
        "value": 895,
        "province_code": 46,
        "cercle_code": null,
        "label": "Loualidia",
        "altLabel": "Oualidia"
    },
    {
        "value": 896,
        "province_code": 46,
        "cercle_code": 116,
        "label": "Oulad Sbaita",
        "altLabel": null
    },
    {
        "value": 897,
        "province_code": 46,
        "cercle_code": 116,
        "label": "Saniat Berguig",
        "altLabel": null
    },
    {
        "value": 898,
        "province_code": 49,
        "cercle_code": null,
        "label": "Ait Ourir",
        "altLabel": null
    },
    {
        "value": 899,
        "province_code": 49,
        "cercle_code": null,
        "label": "Amizmiz",
        "altLabel": null
    },
    {
        "value": 900,
        "province_code": 49,
        "cercle_code": null,
        "label": "Tahannaout",
        "altLabel": null
    },
    {
        "value": 901,
        "province_code": 49,
        "cercle_code": 117,
        "label": "Ait Faska",
        "altLabel": null
    },
    {
        "value": 902,
        "province_code": 49,
        "cercle_code": 117,
        "label": "Ait Sidi Daoud",
        "altLabel": null
    },
    {
        "value": 903,
        "province_code": 49,
        "cercle_code": 117,
        "label": "Ghmate",
        "altLabel": null
    },
    {
        "value": 904,
        "province_code": 49,
        "cercle_code": 117,
        "label": "Iguerferouane",
        "altLabel": null
    },
    {
        "value": 905,
        "province_code": 49,
        "cercle_code": 117,
        "label": "Sidi Abdallah Ghiat",
        "altLabel": "Sidi Abdellah Ghiat"
    },
    {
        "value": 906,
        "province_code": 49,
        "cercle_code": 117,
        "label": "Tamazouzte",
        "altLabel": null
    },
    {
        "value": 907,
        "province_code": 49,
        "cercle_code": 117,
        "label": "Tidili Mesfioua",
        "altLabel": null
    },
    {
        "value": 908,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Amghras",
        "altLabel": null
    },
    {
        "value": 909,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Anougal",
        "altLabel": null
    },
    {
        "value": 910,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Azgour",
        "altLabel": null
    },
    {
        "value": 911,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Dar Jamaa",
        "altLabel": null
    },
    {
        "value": 912,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Lalla Takarkoust",
        "altLabel": null
    },
    {
        "value": 913,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Ouazguita",
        "altLabel": null
    },
    {
        "value": 914,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Oulad Mtaa",
        "altLabel": null
    },
    {
        "value": 915,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Sidi Badhaj",
        "altLabel": null
    },
    {
        "value": 916,
        "province_code": 49,
        "cercle_code": 118,
        "label": "Tizguine",
        "altLabel": null
    },
    {
        "value": 917,
        "province_code": 49,
        "cercle_code": 119,
        "label": "Aghbar",
        "altLabel": null
    },
    {
        "value": 918,
        "province_code": 49,
        "cercle_code": 119,
        "label": "Asni",
        "altLabel": null
    },
    {
        "value": 919,
        "province_code": 49,
        "cercle_code": 119,
        "label": "Ighil",
        "altLabel": null
    },
    {
        "value": 920,
        "province_code": 49,
        "cercle_code": 119,
        "label": "Ijoukak",
        "altLabel": null
    },
    {
        "value": 921,
        "province_code": 49,
        "cercle_code": 119,
        "label": "Imgdal",
        "altLabel": null
    },
    {
        "value": 922,
        "province_code": 49,
        "cercle_code": 119,
        "label": "Ouirgane",
        "altLabel": null
    },
    {
        "value": 923,
        "province_code": 49,
        "cercle_code": 119,
        "label": "Talat N'Yaaqoub",
        "altLabel": null
    },
    {
        "value": 924,
        "province_code": 49,
        "cercle_code": 120,
        "label": "Moulay Brahim",
        "altLabel": null
    },
    {
        "value": 925,
        "province_code": 49,
        "cercle_code": 120,
        "label": "Oukaimden",
        "altLabel": null
    },
    {
        "value": 926,
        "province_code": 49,
        "cercle_code": 120,
        "label": "Ourika",
        "altLabel": null
    },
    {
        "value": 927,
        "province_code": 49,
        "cercle_code": 120,
        "label": "Sti Fadma",
        "altLabel": null
    },
    {
        "value": 928,
        "province_code": 49,
        "cercle_code": 120,
        "label": "Tameslohte",
        "altLabel": null
    },
    {
        "value": 929,
        "province_code": 49,
        "cercle_code": 120,
        "label": "Aghouatim",
        "altLabel": null
    },
    {
        "value": 930,
        "province_code": 49,
        "cercle_code": 121,
        "label": "Abadou",
        "altLabel": null
    },
    {
        "value": 931,
        "province_code": 49,
        "cercle_code": 121,
        "label": "Ait Aadel",
        "altLabel": null
    },
    {
        "value": 932,
        "province_code": 49,
        "cercle_code": 121,
        "label": "Ait Hkim-Ait Yzid",
        "altLabel": "Ait Hkim Ait Yzid"
    },
    {
        "value": 933,
        "province_code": 49,
        "cercle_code": 121,
        "label": "Tamaguert",
        "altLabel": null
    },
    {
        "value": 934,
        "province_code": 49,
        "cercle_code": 121,
        "label": "Tazart",
        "altLabel": null
    },
    {
        "value": 935,
        "province_code": 49,
        "cercle_code": 121,
        "label": "Tighedouine",
        "altLabel": null
    },
    {
        "value": 936,
        "province_code": 49,
        "cercle_code": 121,
        "label": "Touama",
        "altLabel": null
    },
    {
        "value": 937,
        "province_code": 49,
        "cercle_code": 121,
        "label": "Zerkten",
        "altLabel": null
    },
    {
        "value": 938,
        "province_code": 48,
        "cercle_code": null,
        "label": "Chichaoua",
        "altLabel": null
    },
    {
        "value": 939,
        "province_code": 48,
        "cercle_code": null,
        "label": "Imintanoute",
        "altLabel": null
    },
    {
        "value": 940,
        "province_code": 48,
        "cercle_code": 122,
        "label": "Ahdil",
        "altLabel": null
    },
    {
        "value": 941,
        "province_code": 48,
        "cercle_code": 122,
        "label": "Ait Hadi",
        "altLabel": null
    },
    {
        "value": 942,
        "province_code": 48,
        "cercle_code": 122,
        "label": "Lamzoudia",
        "altLabel": null
    },
    {
        "value": 943,
        "province_code": 48,
        "cercle_code": 122,
        "label": "Oulad Moumna",
        "altLabel": null
    },
    {
        "value": 944,
        "province_code": 48,
        "cercle_code": 122,
        "label": "Saidate",
        "altLabel": null
    },
    {
        "value": 945,
        "province_code": 48,
        "cercle_code": 122,
        "label": "Sid L'Mokhtar",
        "altLabel": null
    },
    {
        "value": 946,
        "province_code": 48,
        "cercle_code": 122,
        "label": "Sidi Bouzid Arragragui",
        "altLabel": null
    },
    {
        "value": 947,
        "province_code": 48,
        "cercle_code": 122,
        "label": "Sidi M'Hamed Dalil",
        "altLabel": null
    },
    {
        "value": 948,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Afalla Issen",
        "altLabel": null
    },
    {
        "value": 949,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Ain Tazitounte",
        "altLabel": null
    },
    {
        "value": 950,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Ait Haddou Youssef",
        "altLabel": null
    },
    {
        "value": 951,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Irohalen",
        "altLabel": null
    },
    {
        "value": 952,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Lalla Aaziza",
        "altLabel": null
    },
    {
        "value": 953,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Nfifa",
        "altLabel": null
    },
    {
        "value": 954,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Ouad L'Bour",
        "altLabel": null
    },
    {
        "value": 955,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Sidi Ghanem",
        "altLabel": null
    },
    {
        "value": 956,
        "province_code": 48,
        "cercle_code": 123,
        "label": "Timezgadiouine",
        "altLabel": null
    },
    {
        "value": 957,
        "province_code": 48,
        "cercle_code": 124,
        "label": "Adassil",
        "altLabel": null
    },
    {
        "value": 958,
        "province_code": 48,
        "cercle_code": 124,
        "label": "Assif El Mal",
        "altLabel": null
    },
    {
        "value": 959,
        "province_code": 48,
        "cercle_code": 124,
        "label": "Douirane",
        "altLabel": null
    },
    {
        "value": 960,
        "province_code": 48,
        "cercle_code": 124,
        "label": "Gmassa",
        "altLabel": null
    },
    {
        "value": 961,
        "province_code": 48,
        "cercle_code": 124,
        "label": "Imindounit",
        "altLabel": null
    },
    {
        "value": 962,
        "province_code": 48,
        "cercle_code": 124,
        "label": "Majjat",
        "altLabel": null
    },
    {
        "value": 963,
        "province_code": 48,
        "cercle_code": 124,
        "label": "M'Zouda",
        "altLabel": null
    },
    {
        "value": 964,
        "province_code": 48,
        "cercle_code": 124,
        "label": "Zaouia Annahlia",
        "altLabel": null
    },
    {
        "value": 965,
        "province_code": 48,
        "cercle_code": 125,
        "label": "Bouabout",
        "altLabel": null
    },
    {
        "value": 966,
        "province_code": 48,
        "cercle_code": 125,
        "label": "Bouabout Amdlane",
        "altLabel": null
    },
    {
        "value": 967,
        "province_code": 48,
        "cercle_code": 125,
        "label": "Ichamraren",
        "altLabel": null
    },
    {
        "value": 968,
        "province_code": 48,
        "cercle_code": 125,
        "label": "Kouzemt",
        "altLabel": null
    },
    {
        "value": 969,
        "province_code": 48,
        "cercle_code": 125,
        "label": "Rahhala",
        "altLabel": null
    },
    {
        "value": 970,
        "province_code": 48,
        "cercle_code": 125,
        "label": "Sidi Abdelmoumen",
        "altLabel": null
    },
    {
        "value": 971,
        "province_code": 48,
        "cercle_code": 125,
        "label": "Taouloukoult",
        "altLabel": null
    },
    {
        "value": 972,
        "province_code": 48,
        "cercle_code": 125,
        "label": "Timlilt",
        "altLabel": null
    },
    {
        "value": 973,
        "province_code": 50,
        "cercle_code": null,
        "label": "El Kelaâ des Sraghna",
        "altLabel": "Kelaat Sraghna"
    },
    {
        "value": 974,
        "province_code": 50,
        "cercle_code": null,
        "label": "Laattaouia",
        "altLabel": null
    },
    {
        "value": 975,
        "province_code": 50,
        "cercle_code": null,
        "label": "Sidi Rahhal",
        "altLabel": "Sidi Rahal"
    },
    {
        "value": 976,
        "province_code": 50,
        "cercle_code": null,
        "label": "Tamallalt",
        "altLabel": null
    },
    {
        "value": 977,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Chtaiba",
        "altLabel": null
    },
    {
        "value": 978,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Eddachra",
        "altLabel": null
    },
    {
        "value": 979,
        "province_code": 50,
        "cercle_code": 209,
        "label": "El Aamria",
        "altLabel": null
    },
    {
        "value": 980,
        "province_code": 50,
        "cercle_code": 126,
        "label": "El Marbouh",
        "altLabel": "El Merbouh"
    },
    {
        "value": 981,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Errafiaya",
        "altLabel": null
    },
    {
        "value": 982,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Hiadna",
        "altLabel": "Lahyadna"
    },
    {
        "value": 983,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Lounasda",
        "altLabel": null
    },
    {
        "value": 984,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Mayate",
        "altLabel": null
    },
    {
        "value": 985,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Oulad Aamer",
        "altLabel": null
    },
    {
        "value": 986,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Oulad Bouali Loued",
        "altLabel": null
    },
    {
        "value": 987,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Oulad Cherki",
        "altLabel": null
    },
    {
        "value": 988,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Oulad El Garne",
        "altLabel": "Oulad Lgern"
    },
    {
        "value": 989,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Oulad Massaoud",
        "altLabel": null
    },
    {
        "value": 990,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Oulad Msabbel",
        "altLabel": null
    },
    {
        "value": 991,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Oulad Sbih",
        "altLabel": null
    },
    {
        "value": 992,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Oulad Yaacoub",
        "altLabel": null
    },
    {
        "value": 993,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Oulad Zarrad",
        "altLabel": null
    },
    {
        "value": 994,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Sidi El Hattab",
        "altLabel": null
    },
    {
        "value": 995,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Sidi Moussa",
        "altLabel": null
    },
    {
        "value": 996,
        "province_code": 50,
        "cercle_code": 209,
        "label": "Taouzint",
        "altLabel": null
    },
    {
        "value": 997,
        "province_code": 50,
        "cercle_code": 126,
        "label": "Znada",
        "altLabel": null
    },
    {
        "value": 998,
        "province_code": 50,
        "cercle_code": 208,
        "label": "Assahrij",
        "altLabel": null
    },
    {
        "value": 999,
        "province_code": 50,
        "cercle_code": 127,
        "label": "Bouya Omar",
        "altLabel": null
    },
    {
        "value": 1000,
        "province_code": 50,
        "cercle_code": 127,
        "label": "Choara",
        "altLabel": null
    },
    {
        "value": 1001,
        "province_code": 50,
        "cercle_code": 127,
        "label": "Dzouz",
        "altLabel": null
    },
    {
        "value": 1002,
        "province_code": 50,
        "cercle_code": 127,
        "label": "Fraita",
        "altLabel": null
    },
    {
        "value": 1003,
        "province_code": 50,
        "cercle_code": 127,
        "label": "Laatamna",
        "altLabel": null
    },
    {
        "value": 1004,
        "province_code": 50,
        "cercle_code": 127,
        "label": "Laattaouia Ech-Chaibia",
        "altLabel": null
    },
    {
        "value": 1005,
        "province_code": 50,
        "cercle_code": 208,
        "label": "Louad Lakhdar",
        "altLabel": null
    },
    {
        "value": 1006,
        "province_code": 50,
        "cercle_code": 208,
        "label": "M'Zem Sanhaja",
        "altLabel": null
    },
    {
        "value": 1007,
        "province_code": 50,
        "cercle_code": 127,
        "label": "Ouargui",
        "altLabel": null
    },
    {
        "value": 1008,
        "province_code": 50,
        "cercle_code": 127,
        "label": "Oulad Aarrad",
        "altLabel": null
    },
    {
        "value": 1009,
        "province_code": 50,
        "cercle_code": 208,
        "label": "Oulad Khallouf",
        "altLabel": null
    },
    {
        "value": 1010,
        "province_code": 50,
        "cercle_code": 208,
        "label": "Sidi Aissa Ben Slimane",
        "altLabel": null
    },
    {
        "value": 1011,
        "province_code": 50,
        "cercle_code": 208,
        "label": "Sour El Aaz",
        "altLabel": null
    },
    {
        "value": 1012,
        "province_code": 50,
        "cercle_code": 128,
        "label": "Jbiel",
        "altLabel": null
    },
    {
        "value": 1013,
        "province_code": 50,
        "cercle_code": 128,
        "label": "Jouala",
        "altLabel": null
    },
    {
        "value": 1014,
        "province_code": 50,
        "cercle_code": 128,
        "label": "Zemrane",
        "altLabel": null
    },
    {
        "value": 1015,
        "province_code": 50,
        "cercle_code": 128,
        "label": "Zemrane Charqia",
        "altLabel": "Zemrane Cherqia"
    },
    {
        "value": 1016,
        "province_code": 51,
        "cercle_code": null,
        "label": "Ait Daoud",
        "altLabel": null
    },
    {
        "value": 1017,
        "province_code": 51,
        "cercle_code": null,
        "label": "El Hanchane",
        "altLabel": null
    },
    {
        "value": 1018,
        "province_code": 51,
        "cercle_code": null,
        "label": "Essaouira",
        "altLabel": null
    },
    {
        "value": 1019,
        "province_code": 51,
        "cercle_code": null,
        "label": "Talmest",
        "altLabel": null
    },
    {
        "value": 1020,
        "province_code": 51,
        "cercle_code": null,
        "label": "Tamanar",
        "altLabel": null
    },
    {
        "value": 1021,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Ait Said",
        "altLabel": null
    },
    {
        "value": 1022,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Aquermoud",
        "altLabel": null
    },
    {
        "value": 1023,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Had Dra",
        "altLabel": null
    },
    {
        "value": 1024,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Kechoula",
        "altLabel": null
    },
    {
        "value": 1025,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Korimate",
        "altLabel": null
    },
    {
        "value": 1026,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Lagdadra",
        "altLabel": null
    },
    {
        "value": 1027,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Lahsinate",
        "altLabel": null
    },
    {
        "value": 1028,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Mejji",
        "altLabel": null
    },
    {
        "value": 1029,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Meskala",
        "altLabel": null
    },
    {
        "value": 1030,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Mouarid",
        "altLabel": null
    },
    {
        "value": 1031,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Moulay Bouzarqtoune",
        "altLabel": null
    },
    {
        "value": 1032,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Mzilate",
        "altLabel": null
    },
    {
        "value": 1033,
        "province_code": 51,
        "cercle_code": 129,
        "label": "M'Khalif",
        "altLabel": null
    },
    {
        "value": 1034,
        "province_code": 51,
        "cercle_code": 210,
        "label": "M'Ramer",
        "altLabel": null
    },
    {
        "value": 1035,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Oulad M'Rabet",
        "altLabel": null
    },
    {
        "value": 1036,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Ounagha",
        "altLabel": null
    },
    {
        "value": 1037,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Sidi Abdeljalil",
        "altLabel": null
    },
    {
        "value": 1038,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Sidi Aissa Regragui",
        "altLabel": null
    },
    {
        "value": 1039,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Sidi Ali El Korati",
        "altLabel": null
    },
    {
        "value": 1040,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Sidi Boulaalam",
        "altLabel": null
    },
    {
        "value": 1041,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Sidi Ishaq",
        "altLabel": null
    },
    {
        "value": 1042,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Sidi Laaroussi",
        "altLabel": null
    },
    {
        "value": 1043,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Sidi M'Hamed Ou Marzouq",
        "altLabel": null
    },
    {
        "value": 1044,
        "province_code": 51,
        "cercle_code": 210,
        "label": "Tafetachte",
        "altLabel": null
    },
    {
        "value": 1045,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Takate",
        "altLabel": null
    },
    {
        "value": 1046,
        "province_code": 51,
        "cercle_code": 129,
        "label": "Zaouiat Ben Hmida",
        "altLabel": null
    },
    {
        "value": 1047,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Adaghas",
        "altLabel": null
    },
    {
        "value": 1048,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Aglif",
        "altLabel": null
    },
    {
        "value": 1049,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Aguerd",
        "altLabel": null
    },
    {
        "value": 1050,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Ait Aissi Ihahane",
        "altLabel": null
    },
    {
        "value": 1051,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Assais",
        "altLabel": null
    },
    {
        "value": 1052,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Bizdad",
        "altLabel": null
    },
    {
        "value": 1053,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Bouzemmour",
        "altLabel": null
    },
    {
        "value": 1054,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Ezzaouite",
        "altLabel": null
    },
    {
        "value": 1055,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Ida Ou Aazza",
        "altLabel": null
    },
    {
        "value": 1056,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Ida Ou Guelloul",
        "altLabel": null
    },
    {
        "value": 1057,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Ida Ou Kazzou",
        "altLabel": null
    },
    {
        "value": 1058,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Imgrade",
        "altLabel": null
    },
    {
        "value": 1059,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Imi N'Tlit",
        "altLabel": "Imi-Ntlit"
    },
    {
        "value": 1060,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Sidi Ahmed Essayeh",
        "altLabel": null
    },
    {
        "value": 1061,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Sidi El Jazouli",
        "altLabel": null
    },
    {
        "value": 1062,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Sidi Ghaneme",
        "altLabel": null
    },
    {
        "value": 1063,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Sidi H'Mad Ou M'Barek",
        "altLabel": "Sidi Hmad Ou M'Barek"
    },
    {
        "value": 1064,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Sidi Hmad Ou Hamed",
        "altLabel": "Sidi H'Mad Ou Hamed"
    },
    {
        "value": 1065,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Sidi Kaouki",
        "altLabel": null
    },
    {
        "value": 1066,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Smimou",
        "altLabel": null
    },
    {
        "value": 1067,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Tafedna",
        "altLabel": null
    },
    {
        "value": 1068,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Tahelouante",
        "altLabel": null
    },
    {
        "value": 1069,
        "province_code": 51,
        "cercle_code": 211,
        "label": "Takoucht",
        "altLabel": null
    },
    {
        "value": 1070,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Targante",
        "altLabel": null
    },
    {
        "value": 1071,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Tidzi",
        "altLabel": null
    },
    {
        "value": 1072,
        "province_code": 51,
        "cercle_code": 130,
        "label": "Timizguida-Ouftas",
        "altLabel": "Timzguida-Ouftas"
    },
    {
        "value": 1073,
        "province_code": 47,
        "cercle_code": null,
        "label": "Méchouar-Kasba",
        "altLabel": "Mechouar-Kasba"
    },
    {
        "value": 1074,
        "province_code": 47,
        "cercle_code": null,
        "label": "Annakhil (arrond.)",
        "altLabel": "Ennakhil (arrond.)"
    },
    {
        "value": 1075,
        "province_code": 47,
        "cercle_code": null,
        "label": "Gueliz (arrond.)",
        "altLabel": "Guéliz (arrond.)"
    },
    {
        "value": 1076,
        "province_code": 47,
        "cercle_code": null,
        "label": "Marrakech-Médina (arrond.)",
        "altLabel": "Marrakech-Medina (arrond.)"
    },
    {
        "value": 1077,
        "province_code": 47,
        "cercle_code": null,
        "label": "Ménara (arrond.)",
        "altLabel": "Menara (arrond.)"
    },
    {
        "value": 1078,
        "province_code": 47,
        "cercle_code": null,
        "label": "Sidi Youssef Ben Ali (arrond.)",
        "altLabel": null
    },
    {
        "value": 1079,
        "province_code": 47,
        "cercle_code": 131,
        "label": "Alouidane",
        "altLabel": "Al Ouidane"
    },
    {
        "value": 1080,
        "province_code": 47,
        "cercle_code": 131,
        "label": "Ouahat Sidi Brahim",
        "altLabel": null
    },
    {
        "value": 1081,
        "province_code": 47,
        "cercle_code": 131,
        "label": "Oulad Hassoune",
        "altLabel": null
    },
    {
        "value": 1082,
        "province_code": 47,
        "cercle_code": 132,
        "label": "Harbil",
        "altLabel": null
    },
    {
        "value": 1083,
        "province_code": 47,
        "cercle_code": 132,
        "label": "M'Nabha",
        "altLabel": null
    },
    {
        "value": 1084,
        "province_code": 47,
        "cercle_code": 132,
        "label": "Ouled Dlim",
        "altLabel": null
    },
    {
        "value": 1085,
        "province_code": 47,
        "cercle_code": 133,
        "label": "Agafay",
        "altLabel": null
    },
    {
        "value": 1086,
        "province_code": 47,
        "cercle_code": 133,
        "label": "Ait Imour",
        "altLabel": null
    },
    {
        "value": 1087,
        "province_code": 47,
        "cercle_code": 133,
        "label": "Loudaya",
        "altLabel": null
    },
    {
        "value": 1088,
        "province_code": 47,
        "cercle_code": 133,
        "label": "Sid Zouine",
        "altLabel": null
    },
    {
        "value": 1089,
        "province_code": 47,
        "cercle_code": 134,
        "label": "Saada",
        "altLabel": null
    },
    {
        "value": 1090,
        "province_code": 47,
        "cercle_code": 134,
        "label": "Souihla",
        "altLabel": null
    },
    {
        "value": 1091,
        "province_code": 47,
        "cercle_code": null,
        "label": "Tassoultante",
        "altLabel": null
    },
    {
        "value": 1092,
        "province_code": 52,
        "cercle_code": null,
        "label": "Ben Guerir",
        "altLabel": null
    },
    {
        "value": 1093,
        "province_code": 52,
        "cercle_code": null,
        "label": "Sidi Bou Othmane",
        "altLabel": null
    },
    {
        "value": 1094,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Ait Hammou",
        "altLabel": null
    },
    {
        "value": 1095,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Ait Taleb",
        "altLabel": null
    },
    {
        "value": 1096,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Bouchane",
        "altLabel": null
    },
    {
        "value": 1097,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Jaafra",
        "altLabel": null
    },
    {
        "value": 1098,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Labrikiyne",
        "altLabel": null
    },
    {
        "value": 1099,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Oulad Aamer Tizmarine",
        "altLabel": null
    },
    {
        "value": 1100,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Oulad Hassoune Hamri",
        "altLabel": null
    },
    {
        "value": 1101,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Sidi Abdallah",
        "altLabel": "Sidi Abdellah"
    },
    {
        "value": 1102,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Sidi Ali Labrahla",
        "altLabel": null
    },
    {
        "value": 1103,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Sidi Ghanem",
        "altLabel": null
    },
    {
        "value": 1104,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Sidi Mansour",
        "altLabel": null
    },
    {
        "value": 1105,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Skhour Rehamna",
        "altLabel": "Skhour Rhamna"
    },
    {
        "value": 1106,
        "province_code": 52,
        "cercle_code": 135,
        "label": "Skoura Lhadra",
        "altLabel": null
    },
    {
        "value": 1107,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Akarma",
        "altLabel": null
    },
    {
        "value": 1108,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Bourrous",
        "altLabel": null
    },
    {
        "value": 1109,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Jaidate",
        "altLabel": null
    },
    {
        "value": 1110,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Jbilate",
        "altLabel": null
    },
    {
        "value": 1111,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Lamharra",
        "altLabel": null
    },
    {
        "value": 1112,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Nzalat Laadam",
        "altLabel": null
    },
    {
        "value": 1113,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Oulad Imloul",
        "altLabel": null
    },
    {
        "value": 1114,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Ras Ain Rhamna",
        "altLabel": null
    },
    {
        "value": 1115,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Sidi Boubker",
        "altLabel": null
    },
    {
        "value": 1116,
        "province_code": 52,
        "cercle_code": 136,
        "label": "Tlauh",
        "altLabel": null
    },
    {
        "value": 1117,
        "province_code": 53,
        "cercle_code": null,
        "label": "Safi",
        "altLabel": null
    },
    {
        "value": 1118,
        "province_code": 53,
        "cercle_code": null,
        "label": "Jamaat Shaim",
        "altLabel": null
    },
    {
        "value": 1119,
        "province_code": 53,
        "cercle_code": null,
        "label": "Sebt Gzoula",
        "altLabel": null
    },
    {
        "value": 1120,
        "province_code": 53,
        "cercle_code": 137,
        "label": "Bouguedra",
        "altLabel": null
    },
    {
        "value": 1121,
        "province_code": 53,
        "cercle_code": 137,
        "label": "Chahda",
        "altLabel": null
    },
    {
        "value": 1122,
        "province_code": 53,
        "cercle_code": 137,
        "label": "El Gouraani",
        "altLabel": null
    },
    {
        "value": 1123,
        "province_code": 53,
        "cercle_code": 137,
        "label": "Labkhati",
        "altLabel": null
    },
    {
        "value": 1124,
        "province_code": 53,
        "cercle_code": 137,
        "label": "Lahdar",
        "altLabel": null
    },
    {
        "value": 1125,
        "province_code": 53,
        "cercle_code": 137,
        "label": "Lamrasla",
        "altLabel": null
    },
    {
        "value": 1126,
        "province_code": 53,
        "cercle_code": 137,
        "label": "Lamsabih",
        "altLabel": null
    },
    {
        "value": 1127,
        "province_code": 53,
        "cercle_code": 137,
        "label": "Sidi Aissa",
        "altLabel": null
    },
    {
        "value": 1128,
        "province_code": 53,
        "cercle_code": 137,
        "label": "Sidi Ettiji",
        "altLabel": null
    },
    {
        "value": 1129,
        "province_code": 53,
        "cercle_code": 138,
        "label": "Atouabet",
        "altLabel": null
    },
    {
        "value": 1130,
        "province_code": 53,
        "cercle_code": 138,
        "label": "El Ghiate",
        "altLabel": null
    },
    {
        "value": 1131,
        "province_code": 53,
        "cercle_code": 138,
        "label": "Khatazakane",
        "altLabel": null
    },
    {
        "value": 1132,
        "province_code": 53,
        "cercle_code": 138,
        "label": "Laamamra",
        "altLabel": null
    },
    {
        "value": 1133,
        "province_code": 53,
        "cercle_code": 138,
        "label": "Lamaachate",
        "altLabel": null
    },
    {
        "value": 1134,
        "province_code": 53,
        "cercle_code": 138,
        "label": "Nagga",
        "altLabel": null
    },
    {
        "value": 1135,
        "province_code": 53,
        "cercle_code": 138,
        "label": "Ouled Salmane",
        "altLabel": null
    },
    {
        "value": 1136,
        "province_code": 53,
        "cercle_code": 139,
        "label": "Ayir",
        "altLabel": null
    },
    {
        "value": 1137,
        "province_code": 53,
        "cercle_code": 139,
        "label": "Dar Si Aissa",
        "altLabel": null
    },
    {
        "value": 1138,
        "province_code": 53,
        "cercle_code": 139,
        "label": "El Beddouza",
        "altLabel": null
    },
    {
        "value": 1139,
        "province_code": 53,
        "cercle_code": 139,
        "label": "Hrara",
        "altLabel": null
    },
    {
        "value": 1140,
        "province_code": 53,
        "cercle_code": 139,
        "label": "Moul El Bergui",
        "altLabel": null
    },
    {
        "value": 1141,
        "province_code": 53,
        "cercle_code": 139,
        "label": "Saadla",
        "altLabel": null
    },
    {
        "value": 1142,
        "province_code": 54,
        "cercle_code": null,
        "label": "Echemmaia",
        "altLabel": null
    },
    {
        "value": 1143,
        "province_code": 54,
        "cercle_code": null,
        "label": "Youssoufia",
        "altLabel": null
    },
    {
        "value": 1144,
        "province_code": 54,
        "cercle_code": 140,
        "label": "Ighoud",
        "altLabel": null
    },
    {
        "value": 1145,
        "province_code": 54,
        "cercle_code": 140,
        "label": "Jdour",
        "altLabel": null
    },
    {
        "value": 1146,
        "province_code": 54,
        "cercle_code": 140,
        "label": "Jnane Bouih",
        "altLabel": null
    },
    {
        "value": 1147,
        "province_code": 54,
        "cercle_code": 140,
        "label": "Sidi Chiker",
        "altLabel": null
    },
    {
        "value": 1148,
        "province_code": 54,
        "cercle_code": 141,
        "label": "Atiamim",
        "altLabel": null
    },
    {
        "value": 1149,
        "province_code": 54,
        "cercle_code": 141,
        "label": "El Gantour",
        "altLabel": null
    },
    {
        "value": 1150,
        "province_code": 54,
        "cercle_code": 141,
        "label": "Esbiaat",
        "altLabel": null
    },
    {
        "value": 1151,
        "province_code": 54,
        "cercle_code": 141,
        "label": "Lakhoualqa",
        "altLabel": null
    },
    {
        "value": 1152,
        "province_code": 54,
        "cercle_code": 141,
        "label": "Ras El Ain",
        "altLabel": null
    },
    {
        "value": 1153,
        "province_code": 55,
        "cercle_code": null,
        "label": "Arfoud",
        "altLabel": null
    },
    {
        "value": 1154,
        "province_code": 55,
        "cercle_code": null,
        "label": "Boudnib",
        "altLabel": null
    },
    {
        "value": 1155,
        "province_code": 55,
        "cercle_code": null,
        "label": "Errachidia",
        "altLabel": null
    },
    {
        "value": 1156,
        "province_code": 55,
        "cercle_code": null,
        "label": "Goulmima",
        "altLabel": null
    },
    {
        "value": 1157,
        "province_code": 55,
        "cercle_code": null,
        "label": "Jorf",
        "altLabel": null
    },
    {
        "value": 1158,
        "province_code": 55,
        "cercle_code": null,
        "label": "Moulay Ali Cherif",
        "altLabel": null
    },
    {
        "value": 1159,
        "province_code": 55,
        "cercle_code": null,
        "label": "Tinejdad",
        "altLabel": null
    },
    {
        "value": 1160,
        "province_code": 55,
        "cercle_code": 142,
        "label": "Aarab Sebbah Gheris",
        "altLabel": null
    },
    {
        "value": 1161,
        "province_code": 55,
        "cercle_code": 142,
        "label": "Aarab Sebbah Ziz",
        "altLabel": null
    },
    {
        "value": 1162,
        "province_code": 55,
        "cercle_code": 142,
        "label": "Es-Sifa",
        "altLabel": null
    },
    {
        "value": 1163,
        "province_code": 55,
        "cercle_code": 142,
        "label": "Fezna",
        "altLabel": null
    },
    {
        "value": 1164,
        "province_code": 55,
        "cercle_code": 143,
        "label": "Aoufous",
        "altLabel": null
    },
    {
        "value": 1165,
        "province_code": 55,
        "cercle_code": 143,
        "label": "Chorfa M'Daghra",
        "altLabel": null
    },
    {
        "value": 1166,
        "province_code": 55,
        "cercle_code": 143,
        "label": "Er-Rteb",
        "altLabel": null
    },
    {
        "value": 1167,
        "province_code": 55,
        "cercle_code": 143,
        "label": "Lkheng",
        "altLabel": null
    },
    {
        "value": 1168,
        "province_code": 55,
        "cercle_code": 143,
        "label": "Oued Naam",
        "altLabel": null
    },
    {
        "value": 1169,
        "province_code": 55,
        "cercle_code": 144,
        "label": "Bni M'Hamed-Sijelmassa",
        "altLabel": null
    },
    {
        "value": 1170,
        "province_code": 55,
        "cercle_code": 144,
        "label": "Er-Rissani",
        "altLabel": null
    },
    {
        "value": 1171,
        "province_code": 55,
        "cercle_code": 144,
        "label": "Es-Sfalat",
        "altLabel": null
    },
    {
        "value": 1172,
        "province_code": 55,
        "cercle_code": 144,
        "label": "Et-Taous",
        "altLabel": null
    },
    {
        "value": 1173,
        "province_code": 55,
        "cercle_code": 144,
        "label": "Sidi Ali",
        "altLabel": null
    },
    {
        "value": 1174,
        "province_code": 55,
        "cercle_code": 206,
        "label": "Aghbalou N'Kerdous",
        "altLabel": null
    },
    {
        "value": 1175,
        "province_code": 55,
        "cercle_code": 145,
        "label": "Amellagou",
        "altLabel": null
    },
    {
        "value": 1176,
        "province_code": 55,
        "cercle_code": 206,
        "label": "Ferkla El Oulia",
        "altLabel": null
    },
    {
        "value": 1177,
        "province_code": 55,
        "cercle_code": 206,
        "label": "Ferkla Es-Soufla",
        "altLabel": "Ferkla-Es-Soufla"
    },
    {
        "value": 1178,
        "province_code": 55,
        "cercle_code": 145,
        "label": "Gheris El Ouloui",
        "altLabel": null
    },
    {
        "value": 1179,
        "province_code": 55,
        "cercle_code": 145,
        "label": "Gheris Es-Soufla",
        "altLabel": null
    },
    {
        "value": 1180,
        "province_code": 55,
        "cercle_code": 206,
        "label": "Melaab",
        "altLabel": null
    },
    {
        "value": 1181,
        "province_code": 55,
        "cercle_code": 145,
        "label": "Tadighoust",
        "altLabel": null
    },
    {
        "value": 1182,
        "province_code": 57,
        "cercle_code": null,
        "label": "Midelt",
        "altLabel": null
    },
    {
        "value": 1183,
        "province_code": 57,
        "cercle_code": null,
        "label": "Er-Rich",
        "altLabel": null
    },
    {
        "value": 1184,
        "province_code": 57,
        "cercle_code": 146,
        "label": "Aghbalou",
        "altLabel": null
    },
    {
        "value": 1185,
        "province_code": 57,
        "cercle_code": 146,
        "label": "Agoudim",
        "altLabel": null
    },
    {
        "value": 1186,
        "province_code": 57,
        "cercle_code": 146,
        "label": "Anemzi",
        "altLabel": null
    },
    {
        "value": 1187,
        "province_code": 57,
        "cercle_code": null,
        "label": "Boumia",
        "altLabel": null
    },
    {
        "value": 1188,
        "province_code": 57,
        "cercle_code": 146,
        "label": "Sidi Yahya Ou Youssef",
        "altLabel": "Sidi Yahia Ou Youssef"
    },
    {
        "value": 1189,
        "province_code": 57,
        "cercle_code": 146,
        "label": "Tanourdi",
        "altLabel": null
    },
    {
        "value": 1190,
        "province_code": 57,
        "cercle_code": 146,
        "label": "Tizi N'Ghachou",
        "altLabel": null
    },
    {
        "value": 1191,
        "province_code": 57,
        "cercle_code": 146,
        "label": "Tounfite",
        "altLabel": null
    },
    {
        "value": 1192,
        "province_code": 57,
        "cercle_code": 147,
        "label": "Ait Ayach",
        "altLabel": null
    },
    {
        "value": 1193,
        "province_code": 57,
        "cercle_code": 147,
        "label": "Ait Ben Yacoub",
        "altLabel": null
    },
    {
        "value": 1194,
        "province_code": 57,
        "cercle_code": 147,
        "label": "Ait Izdeg",
        "altLabel": null
    },
    {
        "value": 1195,
        "province_code": 57,
        "cercle_code": 147,
        "label": "Amersid",
        "altLabel": null
    },
    {
        "value": 1196,
        "province_code": 57,
        "cercle_code": 147,
        "label": "Itzer",
        "altLabel": null
    },
    {
        "value": 1197,
        "province_code": 57,
        "cercle_code": 147,
        "label": "Mibladen",
        "altLabel": null
    },
    {
        "value": 1198,
        "province_code": 57,
        "cercle_code": 147,
        "label": "Zaida",
        "altLabel": null
    },
    {
        "value": 1199,
        "province_code": 57,
        "cercle_code": 148,
        "label": "En-Nzala",
        "altLabel": null
    },
    {
        "value": 1200,
        "province_code": 57,
        "cercle_code": 148,
        "label": "Gourrama",
        "altLabel": null
    },
    {
        "value": 1201,
        "province_code": 57,
        "cercle_code": 148,
        "label": "Guers Tiaallaline",
        "altLabel": null
    },
    {
        "value": 1202,
        "province_code": 57,
        "cercle_code": 148,
        "label": "Guir",
        "altLabel": null
    },
    {
        "value": 1203,
        "province_code": 57,
        "cercle_code": 148,
        "label": "M'Zizel",
        "altLabel": null
    },
    {
        "value": 1204,
        "province_code": 57,
        "cercle_code": 148,
        "label": "Sidi Aayad",
        "altLabel": "Sid Aayad"
    },
    {
        "value": 1205,
        "province_code": 57,
        "cercle_code": 148,
        "label": "Zaouiat Sidi Hamza",
        "altLabel": null
    },
    {
        "value": 1206,
        "province_code": 57,
        "cercle_code": 149,
        "label": "Ait Yahya",
        "altLabel": null
    },
    {
        "value": 1207,
        "province_code": 57,
        "cercle_code": 149,
        "label": "Amouguer",
        "altLabel": null
    },
    {
        "value": 1208,
        "province_code": 57,
        "cercle_code": 149,
        "label": "Bou Azmou",
        "altLabel": "Bou-Azmou"
    },
    {
        "value": 1209,
        "province_code": 57,
        "cercle_code": 149,
        "label": "Imilchil",
        "altLabel": null
    },
    {
        "value": 1210,
        "province_code": 57,
        "cercle_code": 149,
        "label": "Outerbat",
        "altLabel": null
    },
    {
        "value": 1211,
        "province_code": 56,
        "cercle_code": null,
        "label": "Ouarzazate",
        "altLabel": null
    },
    {
        "value": 1212,
        "province_code": 56,
        "cercle_code": null,
        "label": "Taznakht",
        "altLabel": null
    },
    {
        "value": 1213,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Ait Zineb",
        "altLabel": null
    },
    {
        "value": 1214,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Amerzgane",
        "altLabel": null
    },
    {
        "value": 1215,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Iznaguen",
        "altLabel": null
    },
    {
        "value": 1216,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Ighrem N'Ougdal",
        "altLabel": null
    },
    {
        "value": 1217,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Khouzama",
        "altLabel": null
    },
    {
        "value": 1218,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Ouisselsate",
        "altLabel": null
    },
    {
        "value": 1219,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Siroua",
        "altLabel": null
    },
    {
        "value": 1220,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Telouet",
        "altLabel": null
    },
    {
        "value": 1221,
        "province_code": 56,
        "cercle_code": 150,
        "label": "Tidli",
        "altLabel": "Tidili"
    },
    {
        "value": 1222,
        "province_code": 56,
        "cercle_code": 151,
        "label": "Ghassate",
        "altLabel": null
    },
    {
        "value": 1223,
        "province_code": 56,
        "cercle_code": 151,
        "label": "Idelsane",
        "altLabel": null
    },
    {
        "value": 1224,
        "province_code": 56,
        "cercle_code": 151,
        "label": "Imi N'Oulaoune",
        "altLabel": "Imi-N'Oulaoune"
    },
    {
        "value": 1225,
        "province_code": 56,
        "cercle_code": 151,
        "label": "Skoura Ahl El Oust",
        "altLabel": null
    },
    {
        "value": 1226,
        "province_code": 56,
        "cercle_code": 151,
        "label": "Tarmigt",
        "altLabel": null
    },
    {
        "value": 1227,
        "province_code": 56,
        "cercle_code": 151,
        "label": "Toundoute",
        "altLabel": null
    },
    {
        "value": 1228,
        "province_code": 58,
        "cercle_code": null,
        "label": "Boumalne Dades",
        "altLabel": null
    },
    {
        "value": 1229,
        "province_code": 58,
        "cercle_code": null,
        "label": "Kalaat M'Gouna",
        "altLabel": null
    },
    {
        "value": 1230,
        "province_code": 58,
        "cercle_code": null,
        "label": "Tinghir",
        "altLabel": null
    },
    {
        "value": 1231,
        "province_code": 58,
        "cercle_code": 152,
        "label": "Alnif",
        "altLabel": null
    },
    {
        "value": 1232,
        "province_code": 58,
        "cercle_code": 152,
        "label": "H'Ssyia",
        "altLabel": null
    },
    {
        "value": 1233,
        "province_code": 58,
        "cercle_code": 152,
        "label": "M'Ssici",
        "altLabel": null
    },
    {
        "value": 1234,
        "province_code": 58,
        "cercle_code": 153,
        "label": "Ait Hani",
        "altLabel": "Ait-Hani"
    },
    {
        "value": 1235,
        "province_code": 58,
        "cercle_code": 153,
        "label": "Assoul",
        "altLabel": null
    },
    {
        "value": 1236,
        "province_code": 58,
        "cercle_code": 154,
        "label": "Ait Ouassif",
        "altLabel": null
    },
    {
        "value": 1237,
        "province_code": 58,
        "cercle_code": 154,
        "label": "Ait Sedrate Jbel El Oulia",
        "altLabel": null
    },
    {
        "value": 1238,
        "province_code": 58,
        "cercle_code": 154,
        "label": "Ait Sedrate Jbel EL Soufla",
        "altLabel": "Ait Sedrate Jbel Soufla"
    },
    {
        "value": 1239,
        "province_code": 58,
        "cercle_code": 200,
        "label": "Ait Sedrate Sahl Charkia",
        "altLabel": null
    },
    {
        "value": 1240,
        "province_code": 58,
        "cercle_code": 200,
        "label": "Ait Sedrate Sahl El Gharbia",
        "altLabel": null
    },
    {
        "value": 1241,
        "province_code": 58,
        "cercle_code": 154,
        "label": "Ait Youl",
        "altLabel": null
    },
    {
        "value": 1242,
        "province_code": 58,
        "cercle_code": 154,
        "label": "Ighil N'Oumgoun",
        "altLabel": null
    },
    {
        "value": 1243,
        "province_code": 58,
        "cercle_code": 154,
        "label": "Ikniouen",
        "altLabel": null
    },
    {
        "value": 1244,
        "province_code": 58,
        "cercle_code": 154,
        "label": "M'Semrir",
        "altLabel": null
    },
    {
        "value": 1245,
        "province_code": 58,
        "cercle_code": 154,
        "label": "Souk Lakhmis Dades",
        "altLabel": null
    },
    {
        "value": 1246,
        "province_code": 58,
        "cercle_code": 154,
        "label": "Tilmi",
        "altLabel": null
    },
    {
        "value": 1247,
        "province_code": 58,
        "cercle_code": 155,
        "label": "Ait El Farsi",
        "altLabel": null
    },
    {
        "value": 1248,
        "province_code": 58,
        "cercle_code": 155,
        "label": "Imider",
        "altLabel": null
    },
    {
        "value": 1249,
        "province_code": 58,
        "cercle_code": 155,
        "label": "Ouaklim",
        "altLabel": null
    },
    {
        "value": 1250,
        "province_code": 58,
        "cercle_code": 155,
        "label": "Taghzoute N'Ait Atta",
        "altLabel": null
    },
    {
        "value": 1251,
        "province_code": 58,
        "cercle_code": 155,
        "label": "Toudgha El Oulia",
        "altLabel": null
    },
    {
        "value": 1252,
        "province_code": 58,
        "cercle_code": 155,
        "label": "Toudgha Essoufla",
        "altLabel": "Toudgha El Soufla"
    },
    {
        "value": 1253,
        "province_code": 59,
        "cercle_code": null,
        "label": "Agdz",
        "altLabel": null
    },
    {
        "value": 1254,
        "province_code": 59,
        "cercle_code": null,
        "label": "Zagora",
        "altLabel": null
    },
    {
        "value": 1255,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Afella N'Dra",
        "altLabel": "Aflandra"
    },
    {
        "value": 1256,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Afra",
        "altLabel": null
    },
    {
        "value": 1257,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Ait Boudaoud",
        "altLabel": null
    },
    {
        "value": 1258,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Ait Ouallal",
        "altLabel": null
    },
    {
        "value": 1259,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Mezguita",
        "altLabel": null
    },
    {
        "value": 1260,
        "province_code": 59,
        "cercle_code": 156,
        "label": "N'Kob",
        "altLabel": null
    },
    {
        "value": 1261,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Oulad Yahia Lagraire",
        "altLabel": null
    },
    {
        "value": 1262,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Taghbalte",
        "altLabel": null
    },
    {
        "value": 1263,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Tamezmoute",
        "altLabel": null
    },
    {
        "value": 1264,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Tansifte",
        "altLabel": null
    },
    {
        "value": 1265,
        "province_code": 59,
        "cercle_code": 156,
        "label": "Tazarine",
        "altLabel": null
    },
    {
        "value": 1266,
        "province_code": 59,
        "cercle_code": 157,
        "label": "Bleida",
        "altLabel": null
    },
    {
        "value": 1267,
        "province_code": 59,
        "cercle_code": 157,
        "label": "Bni Zoli",
        "altLabel": null
    },
    {
        "value": 1268,
        "province_code": 59,
        "cercle_code": 157,
        "label": "Bouzeroual",
        "altLabel": null
    },
    {
        "value": 1269,
        "province_code": 59,
        "cercle_code": 157,
        "label": "Errouha",
        "altLabel": null
    },
    {
        "value": 1270,
        "province_code": 59,
        "cercle_code": 157,
        "label": "Taftechna",
        "altLabel": null
    },
    {
        "value": 1271,
        "province_code": 59,
        "cercle_code": 157,
        "label": "Ternata",
        "altLabel": null
    },
    {
        "value": 1272,
        "province_code": 59,
        "cercle_code": 157,
        "label": "Tinzouline",
        "altLabel": null
    },
    {
        "value": 1273,
        "province_code": 59,
        "cercle_code": 158,
        "label": "Fezouata",
        "altLabel": null
    },
    {
        "value": 1274,
        "province_code": 59,
        "cercle_code": 158,
        "label": "Ktaoua",
        "altLabel": null
    },
    {
        "value": 1275,
        "province_code": 59,
        "cercle_code": 158,
        "label": "M'Hamid El Ghizlane",
        "altLabel": null
    },
    {
        "value": 1276,
        "province_code": 59,
        "cercle_code": 158,
        "label": "Tagounite",
        "altLabel": null
    },
    {
        "value": 1277,
        "province_code": 59,
        "cercle_code": 158,
        "label": "Tamegroute",
        "altLabel": null
    },
    {
        "value": 1278,
        "province_code": 60,
        "cercle_code": null,
        "label": "Agadir",
        "altLabel": null
    },
    {
        "value": 1279,
        "province_code": 60,
        "cercle_code": 159,
        "label": "Amskroud",
        "altLabel": null
    },
    {
        "value": 1280,
        "province_code": 60,
        "cercle_code": 159,
        "label": "Drargua",
        "altLabel": null
    },
    {
        "value": 1281,
        "province_code": 60,
        "cercle_code": 159,
        "label": "Idmine",
        "altLabel": null
    },
    {
        "value": 1282,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Aourir",
        "altLabel": null
    },
    {
        "value": 1283,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Aqesri",
        "altLabel": "Aqsri"
    },
    {
        "value": 1284,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Aziar",
        "altLabel": null
    },
    {
        "value": 1285,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Imouzzer",
        "altLabel": null
    },
    {
        "value": 1286,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Imsouane",
        "altLabel": null
    },
    {
        "value": 1287,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Tadrart",
        "altLabel": null
    },
    {
        "value": 1288,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Taghazout",
        "altLabel": null
    },
    {
        "value": 1289,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Tamri",
        "altLabel": null
    },
    {
        "value": 1290,
        "province_code": 60,
        "cercle_code": 160,
        "label": "Tiqqi",
        "altLabel": null
    },
    {
        "value": 1291,
        "province_code": 62,
        "cercle_code": null,
        "label": "Ait Baha",
        "altLabel": null
    },
    {
        "value": 1292,
        "province_code": 62,
        "cercle_code": null,
        "label": "Biougra",
        "altLabel": null
    },
    {
        "value": 1293,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Ait Mzal",
        "altLabel": null
    },
    {
        "value": 1294,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Ait Ouadrim",
        "altLabel": null
    },
    {
        "value": 1295,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Aouguenz",
        "altLabel": null
    },
    {
        "value": 1296,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Hilala",
        "altLabel": null
    },
    {
        "value": 1297,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Ida Ougnidif",
        "altLabel": "Ida-Ougnidif"
    },
    {
        "value": 1298,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Sidi Abdallah El Bouchouari",
        "altLabel": null
    },
    {
        "value": 1299,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Tanalt",
        "altLabel": null
    },
    {
        "value": 1300,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Targua Ntouchka",
        "altLabel": "Targua-Ntouchka"
    },
    {
        "value": 1301,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Tassegdelt",
        "altLabel": null
    },
    {
        "value": 1302,
        "province_code": 62,
        "cercle_code": 161,
        "label": "Tizi Ntakoucht",
        "altLabel": null
    },
    {
        "value": 1303,
        "province_code": 62,
        "cercle_code": 162,
        "label": "Ait Milk",
        "altLabel": null
    },
    {
        "value": 1304,
        "province_code": 62,
        "cercle_code": 162,
        "label": "Belfaa",
        "altLabel": null
    },
    {
        "value": 1305,
        "province_code": 62,
        "cercle_code": 162,
        "label": "Inchaden",
        "altLabel": null
    },
    {
        "value": 1306,
        "province_code": 62,
        "cercle_code": 162,
        "label": "Massa",
        "altLabel": null
    },
    {
        "value": 1307,
        "province_code": 62,
        "cercle_code": 162,
        "label": "Sidi Ouassay",
        "altLabel": null
    },
    {
        "value": 1308,
        "province_code": 62,
        "cercle_code": 163,
        "label": "Ait Amira",
        "altLabel": null
    },
    {
        "value": 1309,
        "province_code": 62,
        "cercle_code": 163,
        "label": "Imi Mqourn",
        "altLabel": "Imi-Mqourn"
    },
    {
        "value": 1310,
        "province_code": 62,
        "cercle_code": 163,
        "label": "Ouad Essafa",
        "altLabel": "Oued Essafa"
    },
    {
        "value": 1311,
        "province_code": 62,
        "cercle_code": 163,
        "label": "Sidi Bibi",
        "altLabel": null
    },
    {
        "value": 1312,
        "province_code": 62,
        "cercle_code": 163,
        "label": "Sidi Boushab",
        "altLabel": null
    },
    {
        "value": 1313,
        "province_code": 61,
        "cercle_code": null,
        "label": "Ait Melloul",
        "altLabel": null
    },
    {
        "value": 1314,
        "province_code": 61,
        "cercle_code": null,
        "label": "Dcheira El Jihadia",
        "altLabel": null
    },
    {
        "value": 1315,
        "province_code": 61,
        "cercle_code": null,
        "label": "Inezgane",
        "altLabel": null
    },
    {
        "value": 1316,
        "province_code": 61,
        "cercle_code": null,
        "label": "Lqliaa",
        "altLabel": null
    },
    {
        "value": 1317,
        "province_code": 61,
        "cercle_code": 164,
        "label": "Oulad Dahou",
        "altLabel": null
    },
    {
        "value": 1318,
        "province_code": 61,
        "cercle_code": 164,
        "label": "Temsia",
        "altLabel": null
    },
    {
        "value": 1319,
        "province_code": 63,
        "cercle_code": null,
        "label": "Ait Iaaza",
        "altLabel": null
    },
    {
        "value": 1320,
        "province_code": 63,
        "cercle_code": null,
        "label": "Aoulouz",
        "altLabel": null
    },
    {
        "value": 1321,
        "province_code": 63,
        "cercle_code": null,
        "label": "El Guerdane",
        "altLabel": null
    },
    {
        "value": 1322,
        "province_code": 63,
        "cercle_code": null,
        "label": "Irherm",
        "altLabel": null
    },
    {
        "value": 1323,
        "province_code": 63,
        "cercle_code": null,
        "label": "Oulad Berhil",
        "altLabel": null
    },
    {
        "value": 1324,
        "province_code": 63,
        "cercle_code": null,
        "label": "Oulad Teima",
        "altLabel": null
    },
    {
        "value": 1325,
        "province_code": 63,
        "cercle_code": null,
        "label": "Taliouine",
        "altLabel": null
    },
    {
        "value": 1326,
        "province_code": 63,
        "cercle_code": null,
        "label": "Taroudannt",
        "altLabel": null
    },
    {
        "value": 1327,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Adar",
        "altLabel": null
    },
    {
        "value": 1328,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Ait Abdallah",
        "altLabel": null
    },
    {
        "value": 1329,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Amalou",
        "altLabel": null
    },
    {
        "value": 1330,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Azaghar N'Irs",
        "altLabel": null
    },
    {
        "value": 1331,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Imaouen",
        "altLabel": null
    },
    {
        "value": 1332,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Imi N'Tayart",
        "altLabel": "Imi Ntayart"
    },
    {
        "value": 1333,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Nihit",
        "altLabel": null
    },
    {
        "value": 1334,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Oualqadi",
        "altLabel": null
    },
    {
        "value": 1335,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Sidi Boaal",
        "altLabel": null
    },
    {
        "value": 1336,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Sidi Mzal",
        "altLabel": null
    },
    {
        "value": 1337,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Tabia",
        "altLabel": null
    },
    {
        "value": 1338,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Tataoute",
        "altLabel": null
    },
    {
        "value": 1339,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Tindine",
        "altLabel": null
    },
    {
        "value": 1340,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Tisfane",
        "altLabel": null
    },
    {
        "value": 1341,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Toufelaazt",
        "altLabel": null
    },
    {
        "value": 1342,
        "province_code": 63,
        "cercle_code": 165,
        "label": "Toumliline",
        "altLabel": null
    },
    {
        "value": 1343,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Arazane",
        "altLabel": null
    },
    {
        "value": 1344,
        "province_code": 63,
        "cercle_code": 166,
        "label": "El Faid",
        "altLabel": null
    },
    {
        "value": 1345,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Ida Ou Gailal",
        "altLabel": null
    },
    {
        "value": 1346,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Ida Ougoummad",
        "altLabel": null
    },
    {
        "value": 1347,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Igli",
        "altLabel": null
    },
    {
        "value": 1348,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Igoudar Mnabha",
        "altLabel": null
    },
    {
        "value": 1349,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Lamhara",
        "altLabel": null
    },
    {
        "value": 1350,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Oulad Aissa",
        "altLabel": null
    },
    {
        "value": 1351,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Ouneine",
        "altLabel": null
    },
    {
        "value": 1352,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Sidi Abdellah Ou Said",
        "altLabel": null
    },
    {
        "value": 1353,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Sidi Ouaaziz",
        "altLabel": null
    },
    {
        "value": 1354,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Tafingoult",
        "altLabel": null
    },
    {
        "value": 1355,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Talgjount",
        "altLabel": null
    },
    {
        "value": 1356,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Tigouga",
        "altLabel": null
    },
    {
        "value": 1357,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Tinzart",
        "altLabel": null
    },
    {
        "value": 1358,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Tizi N'Test",
        "altLabel": null
    },
    {
        "value": 1359,
        "province_code": 63,
        "cercle_code": 166,
        "label": "Toughmart",
        "altLabel": null
    },
    {
        "value": 1360,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Ahl Ramel",
        "altLabel": null
    },
    {
        "value": 1361,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Argana",
        "altLabel": null
    },
    {
        "value": 1362,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Assads",
        "altLabel": null
    },
    {
        "value": 1363,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Bigoudine",
        "altLabel": null
    },
    {
        "value": 1364,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Eddir",
        "altLabel": null
    },
    {
        "value": 1365,
        "province_code": 63,
        "cercle_code": 167,
        "label": "El Koudia El Beida",
        "altLabel": null
    },
    {
        "value": 1366,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Imilmaiss",
        "altLabel": null
    },
    {
        "value": 1367,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Issen",
        "altLabel": null
    },
    {
        "value": 1368,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Lagfifat",
        "altLabel": null
    },
    {
        "value": 1369,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Lakhnafif",
        "altLabel": null
    },
    {
        "value": 1370,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Lamhadi",
        "altLabel": null
    },
    {
        "value": 1371,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Machraa El Ain",
        "altLabel": null
    },
    {
        "value": 1372,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Sidi Ahmed Ou Amar",
        "altLabel": null
    },
    {
        "value": 1373,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Sidi Boumoussa",
        "altLabel": null
    },
    {
        "value": 1374,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Sidi Moussa Lhamri",
        "altLabel": null
    },
    {
        "value": 1375,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Talmakante",
        "altLabel": null
    },
    {
        "value": 1376,
        "province_code": 63,
        "cercle_code": 167,
        "label": "Tidsi Nissendalene",
        "altLabel": "Tidsi-Nissendalene"
    },
    {
        "value": 1377,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Agadir Melloul",
        "altLabel": null
    },
    {
        "value": 1378,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Ahl Tifnoute",
        "altLabel": null
    },
    {
        "value": 1379,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Askaouen",
        "altLabel": null
    },
    {
        "value": 1380,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Assaisse",
        "altLabel": null
    },
    {
        "value": 1381,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Assaki",
        "altLabel": null
    },
    {
        "value": 1382,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Azrar",
        "altLabel": null
    },
    {
        "value": 1383,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Iguidi",
        "altLabel": null
    },
    {
        "value": 1384,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Sidi Hsaine",
        "altLabel": null
    },
    {
        "value": 1385,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Taouyalte",
        "altLabel": null
    },
    {
        "value": 1386,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Tassousfi",
        "altLabel": null
    },
    {
        "value": 1387,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Tizgzaouine",
        "altLabel": null
    },
    {
        "value": 1388,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Toubkal",
        "altLabel": null
    },
    {
        "value": 1389,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Zagmouzen",
        "altLabel": null
    },
    {
        "value": 1390,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Ouzioua",
        "altLabel": null
    },
    {
        "value": 1391,
        "province_code": 63,
        "cercle_code": 168,
        "label": "Tisrasse",
        "altLabel": null
    },
    {
        "value": 1392,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Ahmar Laglalcha",
        "altLabel": null
    },
    {
        "value": 1393,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Ait Igas",
        "altLabel": null
    },
    {
        "value": 1394,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Ait Makhlouf",
        "altLabel": null
    },
    {
        "value": 1395,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Bounrar",
        "altLabel": null
    },
    {
        "value": 1396,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Freija",
        "altLabel": null
    },
    {
        "value": 1397,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Ida Ou Moumen",
        "altLabel": null
    },
    {
        "value": 1398,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Imoulass",
        "altLabel": null
    },
    {
        "value": 1399,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Lamnizla",
        "altLabel": null
    },
    {
        "value": 1400,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Sidi Ahmed Ou Abdallah",
        "altLabel": null
    },
    {
        "value": 1401,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Sidi Borja",
        "altLabel": null
    },
    {
        "value": 1402,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Sidi Dahmane",
        "altLabel": null
    },
    {
        "value": 1403,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Tafraouten",
        "altLabel": null
    },
    {
        "value": 1404,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Tamaloukte",
        "altLabel": null
    },
    {
        "value": 1405,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Tazemmourt",
        "altLabel": null
    },
    {
        "value": 1406,
        "province_code": 63,
        "cercle_code": 169,
        "label": "Tiout",
        "altLabel": null
    },
    {
        "value": 1407,
        "province_code": 63,
        "cercle_code": 205,
        "label": "Zaouia Sidi Tahar",
        "altLabel": "Sidi Tahar"
    },
    {
        "value": 1408,
        "province_code": 65,
        "cercle_code": null,
        "label": "Akka",
        "altLabel": null
    },
    {
        "value": 1409,
        "province_code": 65,
        "cercle_code": null,
        "label": "Fam El Hisn",
        "altLabel": null
    },
    {
        "value": 1410,
        "province_code": 65,
        "cercle_code": null,
        "label": "Foum Zguid",
        "altLabel": "Foum-Zguid"
    },
    {
        "value": 1411,
        "province_code": 65,
        "cercle_code": null,
        "label": "Tata",
        "altLabel": null
    },
    {
        "value": 1412,
        "province_code": 65,
        "cercle_code": 170,
        "label": "Ait Ouabelli",
        "altLabel": null
    },
    {
        "value": 1413,
        "province_code": 65,
        "cercle_code": 170,
        "label": "Kasbat Sidi Abdellah Ben M'Barek",
        "altLabel": "Kasbat Sidi Abdellah-Ben M'Barek"
    },
    {
        "value": 1414,
        "province_code": 65,
        "cercle_code": 170,
        "label": "Tamanarte",
        "altLabel": null
    },
    {
        "value": 1415,
        "province_code": 65,
        "cercle_code": 170,
        "label": "Tizounine",
        "altLabel": null
    },
    {
        "value": 1416,
        "province_code": 65,
        "cercle_code": 171,
        "label": "Aguinane",
        "altLabel": null
    },
    {
        "value": 1417,
        "province_code": 65,
        "cercle_code": 171,
        "label": "Akka Ighane",
        "altLabel": "Akka-Ighane"
    },
    {
        "value": 1418,
        "province_code": 65,
        "cercle_code": 171,
        "label": "Allougoum",
        "altLabel": null
    },
    {
        "value": 1419,
        "province_code": 65,
        "cercle_code": 171,
        "label": "Ibn Yacoub",
        "altLabel": null
    },
    {
        "value": 1420,
        "province_code": 65,
        "cercle_code": 171,
        "label": "Tissint",
        "altLabel": null
    },
    {
        "value": 1421,
        "province_code": 65,
        "cercle_code": 171,
        "label": "Tlite",
        "altLabel": null
    },
    {
        "value": 1422,
        "province_code": 65,
        "cercle_code": 172,
        "label": "Adis",
        "altLabel": null
    },
    {
        "value": 1423,
        "province_code": 65,
        "cercle_code": 172,
        "label": "Issafen",
        "altLabel": null
    },
    {
        "value": 1424,
        "province_code": 65,
        "cercle_code": 172,
        "label": "Oum El Guerdane",
        "altLabel": null
    },
    {
        "value": 1425,
        "province_code": 65,
        "cercle_code": 172,
        "label": "Tagmout",
        "altLabel": null
    },
    {
        "value": 1426,
        "province_code": 65,
        "cercle_code": 172,
        "label": "Tigzmerte",
        "altLabel": null
    },
    {
        "value": 1427,
        "province_code": 65,
        "cercle_code": 172,
        "label": "Tizaghte",
        "altLabel": null
    },
    {
        "value": 1428,
        "province_code": 64,
        "cercle_code": null,
        "label": "Tafraout",
        "altLabel": null
    },
    {
        "value": 1429,
        "province_code": 64,
        "cercle_code": null,
        "label": "Tiznit",
        "altLabel": null
    },
    {
        "value": 1430,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Ait Issafen",
        "altLabel": null
    },
    {
        "value": 1431,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Anzi",
        "altLabel": null
    },
    {
        "value": 1432,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Arbaa Ait Ahmed",
        "altLabel": null
    },
    {
        "value": 1433,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Ida Ou Gougmar",
        "altLabel": null
    },
    {
        "value": 1434,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Sidi Ahmed Ou Moussa",
        "altLabel": null
    },
    {
        "value": 1435,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Tafraout El Mouloud",
        "altLabel": null
    },
    {
        "value": 1436,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Tighmi",
        "altLabel": null
    },
    {
        "value": 1437,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Tizoughrane",
        "altLabel": null
    },
    {
        "value": 1438,
        "province_code": 64,
        "cercle_code": 173,
        "label": "Tnine Aday",
        "altLabel": null
    },
    {
        "value": 1439,
        "province_code": 64,
        "cercle_code": 174,
        "label": "Afella Ighir",
        "altLabel": null
    },
    {
        "value": 1440,
        "province_code": 64,
        "cercle_code": 174,
        "label": "Ait Ouafqa",
        "altLabel": null
    },
    {
        "value": 1441,
        "province_code": 64,
        "cercle_code": 174,
        "label": "Ammelne",
        "altLabel": null
    },
    {
        "value": 1442,
        "province_code": 64,
        "cercle_code": 174,
        "label": "Irigh N'Tahala",
        "altLabel": null
    },
    {
        "value": 1443,
        "province_code": 64,
        "cercle_code": 174,
        "label": "Tarsouat",
        "altLabel": null
    },
    {
        "value": 1444,
        "province_code": 64,
        "cercle_code": 174,
        "label": "Tassrirt",
        "altLabel": null
    },
    {
        "value": 1445,
        "province_code": 64,
        "cercle_code": 175,
        "label": "Arbaa Rasmouka",
        "altLabel": null
    },
    {
        "value": 1446,
        "province_code": 64,
        "cercle_code": 175,
        "label": "Arbaa Sahel",
        "altLabel": null
    },
    {
        "value": 1447,
        "province_code": 64,
        "cercle_code": 175,
        "label": "Bounaamane",
        "altLabel": null
    },
    {
        "value": 1448,
        "province_code": 64,
        "cercle_code": 175,
        "label": "El Maader El Kabir",
        "altLabel": null
    },
    {
        "value": 1449,
        "province_code": 64,
        "cercle_code": 175,
        "label": "Ouijjane",
        "altLabel": null
    },
    {
        "value": 1450,
        "province_code": 64,
        "cercle_code": 175,
        "label": "Reggada",
        "altLabel": null
    },
    {
        "value": 1451,
        "province_code": 64,
        "cercle_code": 175,
        "label": "Sidi Bouabdelli",
        "altLabel": null
    },
    {
        "value": 1452,
        "province_code": 64,
        "cercle_code": 175,
        "label": "Tnine Aglou",
        "altLabel": null
    },
    {
        "value": 1453,
        "province_code": 67,
        "cercle_code": null,
        "label": "Assa",
        "altLabel": null
    },
    {
        "value": 1454,
        "province_code": 67,
        "cercle_code": null,
        "label": "Zag",
        "altLabel": null
    },
    {
        "value": 1455,
        "province_code": 67,
        "cercle_code": 176,
        "label": "Aouint Lahna",
        "altLabel": null
    },
    {
        "value": 1456,
        "province_code": 67,
        "cercle_code": 176,
        "label": "Aouint Yghomane",
        "altLabel": null
    },
    {
        "value": 1457,
        "province_code": 67,
        "cercle_code": 176,
        "label": "Touizgui",
        "altLabel": null
    },
    {
        "value": 1458,
        "province_code": 67,
        "cercle_code": 177,
        "label": "Al Mahbass",
        "altLabel": null
    },
    {
        "value": 1459,
        "province_code": 67,
        "cercle_code": 177,
        "label": "Labouirat",
        "altLabel": null
    },
    {
        "value": 1460,
        "province_code": 66,
        "cercle_code": null,
        "label": "Bouizakarne",
        "altLabel": null
    },
    {
        "value": 1461,
        "province_code": 66,
        "cercle_code": null,
        "label": "Guelmim",
        "altLabel": null
    },
    {
        "value": 1462,
        "province_code": 66,
        "cercle_code": 178,
        "label": "Aday",
        "altLabel": null
    },
    {
        "value": 1463,
        "province_code": 66,
        "cercle_code": 178,
        "label": "Ait Boufoulen",
        "altLabel": null
    },
    {
        "value": 1464,
        "province_code": 66,
        "cercle_code": 178,
        "label": "Amtdi",
        "altLabel": null
    },
    {
        "value": 1465,
        "province_code": 66,
        "cercle_code": 178,
        "label": "Ifrane Atlas Saghir",
        "altLabel": null
    },
    {
        "value": 1466,
        "province_code": 66,
        "cercle_code": 178,
        "label": "Tagante",
        "altLabel": null
    },
    {
        "value": 1467,
        "province_code": 66,
        "cercle_code": 178,
        "label": "Taghjijt",
        "altLabel": null
    },
    {
        "value": 1468,
        "province_code": 66,
        "cercle_code": 178,
        "label": "Timoulay",
        "altLabel": null
    },
    {
        "value": 1469,
        "province_code": 66,
        "cercle_code": 179,
        "label": "Aferkat",
        "altLabel": null
    },
    {
        "value": 1470,
        "province_code": 66,
        "cercle_code": 179,
        "label": "Asrir",
        "altLabel": null
    },
    {
        "value": 1471,
        "province_code": 66,
        "cercle_code": 179,
        "label": "Fask",
        "altLabel": null
    },
    {
        "value": 1472,
        "province_code": 66,
        "cercle_code": 179,
        "label": "Tiglit",
        "altLabel": null
    },
    {
        "value": 1473,
        "province_code": 66,
        "cercle_code": 180,
        "label": "Abaynou",
        "altLabel": null
    },
    {
        "value": 1474,
        "province_code": 66,
        "cercle_code": 180,
        "label": "Echatea El Abied",
        "altLabel": null
    },
    {
        "value": 1475,
        "province_code": 66,
        "cercle_code": 180,
        "label": "Labyar",
        "altLabel": null
    },
    {
        "value": 1476,
        "province_code": 66,
        "cercle_code": 180,
        "label": "Laqsabi Tagoust",
        "altLabel": null
    },
    {
        "value": 1477,
        "province_code": 66,
        "cercle_code": 180,
        "label": "Rass Oumlil",
        "altLabel": null
    },
    {
        "value": 1478,
        "province_code": 66,
        "cercle_code": 180,
        "label": "Taliouine Assaka",
        "altLabel": null
    },
    {
        "value": 1479,
        "province_code": 66,
        "cercle_code": 180,
        "label": "Targa Wassay",
        "altLabel": null
    },
    {
        "value": 1480,
        "province_code": 69,
        "cercle_code": null,
        "label": "Lakhsas",
        "altLabel": null
    },
    {
        "value": 1481,
        "province_code": 69,
        "cercle_code": null,
        "label": "Sidi Ifni",
        "altLabel": null
    },
    {
        "value": 1482,
        "province_code": 69,
        "cercle_code": 181,
        "label": "Arbaa Ait Abdellah",
        "altLabel": null
    },
    {
        "value": 1483,
        "province_code": 69,
        "cercle_code": 181,
        "label": "Imi N'Fast",
        "altLabel": "Imi-N'Fast"
    },
    {
        "value": 1484,
        "province_code": 69,
        "cercle_code": 181,
        "label": "Mesti",
        "altLabel": null
    },
    {
        "value": 1485,
        "province_code": 69,
        "cercle_code": null,
        "label": "Mirleft",
        "altLabel": null
    },
    {
        "value": 1486,
        "province_code": 69,
        "cercle_code": 181,
        "label": "Sbouya",
        "altLabel": null
    },
    {
        "value": 1487,
        "province_code": 69,
        "cercle_code": 181,
        "label": "Tangarfa",
        "altLabel": null
    },
    {
        "value": 1488,
        "province_code": 69,
        "cercle_code": 181,
        "label": "Tioughza",
        "altLabel": null
    },
    {
        "value": 1489,
        "province_code": 69,
        "cercle_code": 181,
        "label": "Tnine Amellou",
        "altLabel": null
    },
    {
        "value": 1490,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Ait Erkha",
        "altLabel": null
    },
    {
        "value": 1491,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Anfeg",
        "altLabel": null
    },
    {
        "value": 1492,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Boutrouch",
        "altLabel": null
    },
    {
        "value": 1493,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Ibdar",
        "altLabel": null
    },
    {
        "value": 1494,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Sebt Ennabour",
        "altLabel": null
    },
    {
        "value": 1495,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Sidi Abdallah Ou Belaid",
        "altLabel": "Sidi Abdellah Ou Belaid"
    },
    {
        "value": 1496,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Sidi H'Saine Ou Ali",
        "altLabel": null
    },
    {
        "value": 1497,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Sidi M'Bark",
        "altLabel": null
    },
    {
        "value": 1498,
        "province_code": 69,
        "cercle_code": 182,
        "label": "Tighirt",
        "altLabel": null
    },
    {
        "value": 1499,
        "province_code": 68,
        "cercle_code": null,
        "label": "Tan Tan",
        "altLabel": null
    },
    {
        "value": 1500,
        "province_code": 68,
        "cercle_code": null,
        "label": "El Ouatia",
        "altLabel": null
    },
    {
        "value": 1501,
        "province_code": 68,
        "cercle_code": 183,
        "label": "Msied",
        "altLabel": null
    },
    {
        "value": 1502,
        "province_code": 68,
        "cercle_code": 183,
        "label": "Tilemzoun",
        "altLabel": null
    },
    {
        "value": 1503,
        "province_code": 68,
        "cercle_code": 184,
        "label": "Abteh",
        "altLabel": null
    },
    {
        "value": 1504,
        "province_code": 68,
        "cercle_code": 184,
        "label": "Ben Khlil",
        "altLabel": null
    },
    {
        "value": 1505,
        "province_code": 68,
        "cercle_code": 184,
        "label": "Chbika",
        "altLabel": null
    },
    {
        "value": 1506,
        "province_code": 71,
        "cercle_code": null,
        "label": "Boujdour",
        "altLabel": null
    },
    {
        "value": 1507,
        "province_code": 71,
        "cercle_code": 185,
        "label": "Gueltat Zemmour",
        "altLabel": null
    },
    {
        "value": 1508,
        "province_code": 71,
        "cercle_code": 185,
        "label": "Jraifia",
        "altLabel": null
    },
    {
        "value": 1509,
        "province_code": 71,
        "cercle_code": 185,
        "label": "Lamssid",
        "altLabel": null
    },
    {
        "value": 1510,
        "province_code": 73,
        "cercle_code": null,
        "label": "Es-Semara",
        "altLabel": "Es-Smara"
    },
    {
        "value": 1511,
        "province_code": 73,
        "cercle_code": 186,
        "label": "Amgala",
        "altLabel": null
    },
    {
        "value": 1512,
        "province_code": 73,
        "cercle_code": 186,
        "label": "Haouza",
        "altLabel": null
    },
    {
        "value": 1513,
        "province_code": 73,
        "cercle_code": 186,
        "label": "Jdiriya",
        "altLabel": null
    },
    {
        "value": 1514,
        "province_code": 73,
        "cercle_code": 186,
        "label": "Sidi Ahmed Laaroussi",
        "altLabel": null
    },
    {
        "value": 1515,
        "province_code": 73,
        "cercle_code": 186,
        "label": "Tifariti",
        "altLabel": null
    },
    {
        "value": 1516,
        "province_code": 70,
        "cercle_code": null,
        "label": "El Marsa",
        "altLabel": null
    },
    {
        "value": 1517,
        "province_code": 70,
        "cercle_code": null,
        "label": "Laayoune",
        "altLabel": null
    },
    {
        "value": 1518,
        "province_code": 70,
        "cercle_code": 187,
        "label": "Boukraa",
        "altLabel": null
    },
    {
        "value": 1519,
        "province_code": 70,
        "cercle_code": 187,
        "label": "Dcheira",
        "altLabel": null
    },
    {
        "value": 1520,
        "province_code": 70,
        "cercle_code": 187,
        "label": "Foum El Oued",
        "altLabel": null
    },
    {
        "value": 1521,
        "province_code": 72,
        "cercle_code": null,
        "label": "Tarfaya",
        "altLabel": null
    },
    {
        "value": 1522,
        "province_code": 72,
        "cercle_code": 188,
        "label": "Daoura",
        "altLabel": null
    },
    {
        "value": 1523,
        "province_code": 72,
        "cercle_code": 188,
        "label": "El Hagounia",
        "altLabel": null
    },
    {
        "value": 1524,
        "province_code": 72,
        "cercle_code": 189,
        "label": "Akhfennir",
        "altLabel": null
    },
    {
        "value": 1525,
        "province_code": 72,
        "cercle_code": 189,
        "label": "Tah",
        "altLabel": null
    },
    {
        "value": 1526,
        "province_code": 75,
        "cercle_code": null,
        "label": "Lagouira",
        "altLabel": null
    },
    {
        "value": 1527,
        "province_code": 75,
        "cercle_code": 190,
        "label": "Aghouinite",
        "altLabel": null
    },
    {
        "value": 1528,
        "province_code": 75,
        "cercle_code": 190,
        "label": "Aousserd",
        "altLabel": null
    },
    {
        "value": 1529,
        "province_code": 75,
        "cercle_code": 190,
        "label": "Tichla",
        "altLabel": null
    },
    {
        "value": 1530,
        "province_code": 75,
        "cercle_code": 190,
        "label": "Zoug",
        "altLabel": null
    },
    {
        "value": 1531,
        "province_code": 75,
        "cercle_code": 191,
        "label": "Bir Gandouz",
        "altLabel": null
    },
    {
        "value": 1532,
        "province_code": 74,
        "cercle_code": null,
        "label": "Dakhla",
        "altLabel": null
    },
    {
        "value": 1533,
        "province_code": 74,
        "cercle_code": 192,
        "label": "Bir Anzarane",
        "altLabel": null
    },
    {
        "value": 1534,
        "province_code": 74,
        "cercle_code": 192,
        "label": "Gleibat El Foula",
        "altLabel": null
    },
    {
        "value": 1535,
        "province_code": 74,
        "cercle_code": 192,
        "label": "Mijik",
        "altLabel": null
    },
    {
        "value": 1536,
        "province_code": 74,
        "cercle_code": 192,
        "label": "Oum Dreyga",
        "altLabel": null
    },
    {
        "value": 1537,
        "province_code": 74,
        "cercle_code": 193,
        "label": "El Argoub",
        "altLabel": null
    },
    {
        "value": 1538,
        "province_code": 74,
        "cercle_code": 193,
        "label": "Imlili",
        "altLabel": null
    }
];

var cerclesCfg = [
    {
        "province_code": 6,
        "label": "Bni Boufrah",
        "value": 1
    },
    {
        "province_code": 6,
        "label": "Bni Ouriaghel Acharkia",
        "value": 2
    },
    {
        "province_code": 6,
        "label": "Bni Ouriaghel Algharbia",
        "value": 194
    },
    {
        "province_code": 6,
        "label": "Targuist",
        "value": 3
    },
    {
        "province_code": 6,
        "label": "Ketama",
        "value": 4
    },
    {
        "province_code": 7,
        "label": "Assifane",
        "value": 202
    },
    {
        "province_code": 7,
        "label": "Bab Berred",
        "value": 5
    },
    {
        "province_code": 7,
        "label": "Bab Taza",
        "value": 6
    },
    {
        "province_code": 7,
        "label": "Bni Ahmed",
        "value": 7
    },
    {
        "province_code": 7,
        "label": "Bou Ahmed",
        "value": 8
    },
    {
        "province_code": 7,
        "label": "Jebha",
        "value": 9
    },
    {
        "province_code": 4,
        "label": "Anjra",
        "value": 10
    },
    {
        "province_code": 4,
        "label": "Fahs",
        "value": 11
    },
    {
        "province_code": 5,
        "label": "Loukouss",
        "value": 12
    },
    {
        "province_code": 5,
        "label": "Moulay Abdeslem-Ben M'chich",
        "value": 13
    },
    {
        "province_code": 5,
        "label": "Oued El Makhazine",
        "value": 14
    },
    {
        "province_code": 8,
        "label": "Ouezzane",
        "value": 15
    },
    {
        "province_code": 8,
        "label": "El Wahda",
        "value": 197
    },
    {
        "province_code": 8,
        "label": "Moqrisset",
        "value": 16
    },
    {
        "province_code": 8,
        "label": "Zoumi",
        "value": 17
    },
    {
        "province_code": 1,
        "label": "Tanger",
        "value": 201
    },
    {
        "province_code": 1,
        "label": "Assilah",
        "value": 18
    },
    {
        "province_code": 3,
        "label": "Jebala",
        "value": 19
    },
    {
        "province_code": 3,
        "label": "Tétouan",
        "value": 20
    },
    {
        "province_code": 13,
        "label": "Ahfir",
        "value": 21
    },
    {
        "province_code": 13,
        "label": "Aklim",
        "value": 22
    },
    {
        "province_code": 11,
        "label": "Driouch",
        "value": 23
    },
    {
        "province_code": 11,
        "label": "Rif",
        "value": 24
    },
    {
        "province_code": 16,
        "label": "Bni Tadjite",
        "value": 25
    },
    {
        "province_code": 16,
        "label": "Figuig",
        "value": 26
    },
    {
        "province_code": 16,
        "label": "Talsint",
        "value": 203
    },
    {
        "province_code": 15,
        "label": "Guercif",
        "value": 27
    },
    {
        "province_code": 15,
        "label": "Taddart",
        "value": 28
    },
    {
        "province_code": 12,
        "label": "Jerada Banlieue Chamalia",
        "value": 29
    },
    {
        "province_code": 12,
        "label": "Jerada Banlieue El Janobiya",
        "value": 207
    },
    {
        "province_code": 12,
        "label": "Ain Bni Mathar",
        "value": 30
    },
    {
        "province_code": 10,
        "label": "Guelaia",
        "value": 31
    },
    {
        "province_code": 10,
        "label": "Louta",
        "value": 32
    },
    {
        "province_code": 9,
        "label": "Oujda Banlieue Nord",
        "value": 33
    },
    {
        "province_code": 9,
        "label": "Oujda Banlieue Sud",
        "value": 34
    },
    {
        "province_code": 14,
        "label": "Debdou",
        "value": 35
    },
    {
        "province_code": 14,
        "label": "El Aioun",
        "value": 36
    },
    {
        "province_code": 14,
        "label": "Taourirt",
        "value": 37
    },
    {
        "province_code": 18,
        "label": "Ain Orma",
        "value": 38
    },
    {
        "province_code": 18,
        "label": "Meknès Banlieue",
        "value": 39
    },
    {
        "province_code": 18,
        "label": "Zerhoun",
        "value": 40
    },
    {
        "province_code": 23,
        "label": "Boulemane",
        "value": 41
    },
    {
        "province_code": 23,
        "label": "Marmoucha",
        "value": 204
    },
    {
        "province_code": 23,
        "label": "Missour",
        "value": 42
    },
    {
        "province_code": 23,
        "label": "Outat El Haj",
        "value": 43
    },
    {
        "province_code": 19,
        "label": "Agourai",
        "value": 44
    },
    {
        "province_code": 19,
        "label": "Ain Taoujdate",
        "value": 45
    },
    {
        "province_code": 19,
        "label": "El Hajeb",
        "value": 46
    },
    {
        "province_code": 17,
        "label": "Fès Banlieue",
        "value": 47
    },
    {
        "province_code": 20,
        "label": "Azrou",
        "value": 48
    },
    {
        "province_code": 22,
        "label": "El Menzel",
        "value": 49
    },
    {
        "province_code": 22,
        "label": "Imouzzer Kandar",
        "value": 50
    },
    {
        "province_code": 22,
        "label": "Sefrou",
        "value": 51
    },
    {
        "province_code": 24,
        "label": "Ghafsai",
        "value": 52
    },
    {
        "province_code": 24,
        "label": "Karia Ba Mohamed",
        "value": 53
    },
    {
        "province_code": 24,
        "label": "Taounate",
        "value": 54
    },
    {
        "province_code": 24,
        "label": "Tissa",
        "value": 55
    },
    {
        "province_code": 25,
        "label": "Aknoul",
        "value": 56
    },
    {
        "province_code": 25,
        "label": "Oued Amlil",
        "value": 57
    },
    {
        "province_code": 25,
        "label": "Tahla",
        "value": 58
    },
    {
        "province_code": 25,
        "label": "Tainaste",
        "value": 59
    },
    {
        "province_code": 25,
        "label": "Taza",
        "value": 60
    },
    {
        "province_code": 21,
        "label": "Moulay Yacoub",
        "value": 61
    },
    {
        "province_code": 21,
        "label": "Oulad Jemaa Lemta",
        "value": 62
    },
    {
        "province_code": 29,
        "label": "Kénitra-Banlieue",
        "value": 63
    },
    {
        "province_code": 29,
        "label": "Ben Mansour",
        "value": 64
    },
    {
        "province_code": 29,
        "label": "Souk Arbaa El Gharb",
        "value": 65
    },
    {
        "province_code": 29,
        "label": "Souk Tlet El Gharb",
        "value": 66
    },
    {
        "province_code": 29,
        "label": "Lalla Mimouna",
        "value": 67
    },
    {
        "province_code": 30,
        "label": "Khémisset",
        "value": 68
    },
    {
        "province_code": 30,
        "label": "Oulmes",
        "value": 69
    },
    {
        "province_code": 30,
        "label": "Rommani",
        "value": 70
    },
    {
        "province_code": 30,
        "label": "Tiflet",
        "value": 71
    },
    {
        "province_code": 31,
        "label": "Tilal Al Gharb",
        "value": 73
    },
    {
        "province_code": 31,
        "label": "Gharb-Bni Malek",
        "value": 74
    },
    {
        "province_code": 31,
        "label": "Ouargha",
        "value": 75
    },
    {
        "province_code": 31,
        "label": "Chrarda",
        "value": 76
    },
    {
        "province_code": 31,
        "label": "Baht",
        "value": 77
    },
    {
        "province_code": 32,
        "label": "Kceibya",
        "value": 78
    },
    {
        "province_code": 32,
        "label": "Sidi slimane",
        "value": 79
    },
    {
        "province_code": 28,
        "label": "Ain El Aouda",
        "value": 80
    },
    {
        "province_code": 28,
        "label": "Témara",
        "value": 81
    },
    {
        "province_code": 34,
        "label": "Azilal",
        "value": 82
    },
    {
        "province_code": 34,
        "label": "Bzou",
        "value": 83
    },
    {
        "province_code": 34,
        "label": "Ouaouizeght",
        "value": 84
    },
    {
        "province_code": 34,
        "label": "Afourar",
        "value": 85
    },
    {
        "province_code": 34,
        "label": "Fetouqka",
        "value": 86
    },
    {
        "province_code": 34,
        "label": "Oultana",
        "value": 87
    },
    {
        "province_code": 33,
        "label": "Béni Mellal",
        "value": 88
    },
    {
        "province_code": 33,
        "label": "Aghbala",
        "value": 89
    },
    {
        "province_code": 33,
        "label": "El Ksiba",
        "value": 90
    },
    {
        "province_code": 33,
        "label": "Kasba Tadla",
        "value": 91
    },
    {
        "province_code": 35,
        "label": "Bni Moussa Charquia",
        "value": 92
    },
    {
        "province_code": 35,
        "label": "Fqih Ben Salah",
        "value": 93
    },
    {
        "province_code": 35,
        "label": "Bni Moussa Gharbia",
        "value": 94
    },
    {
        "province_code": 36,
        "label": "El Kbab",
        "value": 95
    },
    {
        "province_code": 36,
        "label": "Khénifra",
        "value": 96
    },
    {
        "province_code": 36,
        "label": "Aguelmous",
        "value": 97
    },
    {
        "province_code": 37,
        "label": "Bejaad",
        "value": 98
    },
    {
        "province_code": 37,
        "label": "Khouribga",
        "value": 99
    },
    {
        "province_code": 37,
        "label": "Oued-Zem",
        "value": 100
    },
    {
        "province_code": 43,
        "label": "Benslimane",
        "value": 101
    },
    {
        "province_code": 43,
        "label": "Bouznika",
        "value": 102
    },
    {
        "province_code": 44,
        "label": "Berrechid",
        "value": 103
    },
    {
        "province_code": 44,
        "label": "El Gara",
        "value": 104
    },
    {
        "province_code": 40,
        "label": "Azemmour",
        "value": 105
    },
    {
        "province_code": 40,
        "label": "El Jadida",
        "value": 106
    },
    {
        "province_code": 40,
        "label": "Haouzia",
        "value": 107
    },
    {
        "province_code": 40,
        "label": "Sidi Smail",
        "value": 108
    },
    {
        "province_code": 42,
        "label": "Tit Mellil",
        "value": 109
    },
    {
        "province_code": 39,
        "label": "Znata",
        "value": 110
    },
    {
        "province_code": 45,
        "label": "Ben Ahmed Chamalia",
        "value": 112
    },
    {
        "province_code": 45,
        "label": "Ben Ahmed El Janobiya",
        "value": 195
    },
    {
        "province_code": 45,
        "label": "El Borouj",
        "value": 113
    },
    {
        "province_code": 45,
        "label": "Settat Chamalia",
        "value": 114
    },
    {
        "province_code": 45,
        "label": "Settat El Janobiya",
        "value": 196
    },
    {
        "province_code": 46,
        "label": "Sidi Bennour",
        "value": 115
    },
    {
        "province_code": 46,
        "label": "Bni Hilal-Laaounate",
        "value": 198
    },
    {
        "province_code": 46,
        "label": "Oulad Amrane",
        "value": 199
    },
    {
        "province_code": 46,
        "label": "Zemamra",
        "value": 116
    },
    {
        "province_code": 49,
        "label": "Ait Ourir",
        "value": 117
    },
    {
        "province_code": 49,
        "label": "Amizmiz",
        "value": 118
    },
    {
        "province_code": 49,
        "label": "Asni",
        "value": 119
    },
    {
        "province_code": 49,
        "label": "Tahannaout",
        "value": 120
    },
    {
        "province_code": 49,
        "label": "Touama",
        "value": 121
    },
    {
        "province_code": 48,
        "label": "Chichaoua",
        "value": 122
    },
    {
        "province_code": 48,
        "label": "Imintanoute",
        "value": 123
    },
    {
        "province_code": 48,
        "label": "Majjat",
        "value": 124
    },
    {
        "province_code": 48,
        "label": "Mtouga",
        "value": 125
    },
    {
        "province_code": 50,
        "label": "Assahrij-Sanhaja",
        "value": 208
    },
    {
        "province_code": 50,
        "label": "El Kelaa-Ahl Ghaba",
        "value": 126
    },
    {
        "province_code": 50,
        "label": "El Kelaa-Bni Aamr",
        "value": 209
    },
    {
        "province_code": 50,
        "label": "Laattaouia",
        "value": 127
    },
    {
        "province_code": 50,
        "label": "Tamallalt",
        "value": 128
    },
    {
        "province_code": 51,
        "label": "Ait Daoud",
        "value": 211
    },
    {
        "province_code": 51,
        "label": "El Hanchane",
        "value": 210
    },
    {
        "province_code": 51,
        "label": "Essaouira",
        "value": 129
    },
    {
        "province_code": 51,
        "label": "Tamanar",
        "value": 130
    },
    {
        "province_code": 47,
        "label": "Alouidane",
        "value": 131
    },
    {
        "province_code": 47,
        "label": "Bour",
        "value": 132
    },
    {
        "province_code": 47,
        "label": "Loudaya",
        "value": 133
    },
    {
        "province_code": 47,
        "label": "Saada",
        "value": 134
    },
    {
        "province_code": 52,
        "label": "Rehamna",
        "value": 135
    },
    {
        "province_code": 52,
        "label": "Sidi Bou Othmane",
        "value": 136
    },
    {
        "province_code": 53,
        "label": "Abda",
        "value": 137
    },
    {
        "province_code": 53,
        "label": "Gzoula",
        "value": 138
    },
    {
        "province_code": 53,
        "label": "Hrara",
        "value": 139
    },
    {
        "province_code": 54,
        "label": "Ahmar",
        "value": 140
    },
    {
        "province_code": 54,
        "label": "Al Gantour",
        "value": 141
    },
    {
        "province_code": 55,
        "label": "Arfoud",
        "value": 142
    },
    {
        "province_code": 55,
        "label": "Errachidia",
        "value": 143
    },
    {
        "province_code": 55,
        "label": "Er-Rissani",
        "value": 144
    },
    {
        "province_code": 55,
        "label": "Goulmima",
        "value": 145
    },
    {
        "province_code": 55,
        "label": "Tinjdad",
        "value": 206
    },
    {
        "province_code": 57,
        "label": "Boumia",
        "value": 146
    },
    {
        "province_code": 57,
        "label": "Midelt",
        "value": 147
    },
    {
        "province_code": 57,
        "label": "Er-Rich",
        "value": 148
    },
    {
        "province_code": 57,
        "label": "Imilchil",
        "value": 149
    },
    {
        "province_code": 56,
        "label": "Amerzgane",
        "value": 150
    },
    {
        "province_code": 56,
        "label": "Ouarzazate",
        "value": 151
    },
    {
        "province_code": 58,
        "label": "Alnif",
        "value": 152
    },
    {
        "province_code": 58,
        "label": "Assoul",
        "value": 153
    },
    {
        "province_code": 58,
        "label": "Boumalne Dades",
        "value": 154
    },
    {
        "province_code": 58,
        "label": "Tinghir",
        "value": 155
    },
    {
        "province_code": 58,
        "label": "Kalaat M'Gouna",
        "value": 200
    },
    {
        "province_code": 59,
        "label": "Agdz",
        "value": 156
    },
    {
        "province_code": 59,
        "label": "Tinzouline",
        "value": 157
    },
    {
        "province_code": 59,
        "label": "Zagora",
        "value": 158
    },
    {
        "province_code": 60,
        "label": "Agadir Banlieue",
        "value": 159
    },
    {
        "province_code": 60,
        "label": "Agadir Atlantique",
        "value": 160
    },
    {
        "province_code": 62,
        "label": "Ait Baha",
        "value": 161
    },
    {
        "province_code": 62,
        "label": "Belfaa- Massa",
        "value": 162
    },
    {
        "province_code": 62,
        "label": "Biougra",
        "value": 163
    },
    {
        "province_code": 61,
        "label": "Ait Melloul",
        "value": 164
    },
    {
        "province_code": 63,
        "label": "Irherm",
        "value": 165
    },
    {
        "province_code": 63,
        "label": "Oulad Berhil",
        "value": 166
    },
    {
        "province_code": 63,
        "label": "Oulad Teima",
        "value": 167
    },
    {
        "province_code": 63,
        "label": "Sidi Moussa Lhamri",
        "value": 205
    },
    {
        "province_code": 63,
        "label": "Taliouine",
        "value": 168
    },
    {
        "province_code": 63,
        "label": "Taroudannt",
        "value": 169
    },
    {
        "province_code": 65,
        "label": "Akka",
        "value": 170
    },
    {
        "province_code": 65,
        "label": "Foum Zguid",
        "value": 171
    },
    {
        "province_code": 65,
        "label": "Tata",
        "value": 172
    },
    {
        "province_code": 64,
        "label": "Anezi",
        "value": 173
    },
    {
        "province_code": 64,
        "label": "Tafraout",
        "value": 174
    },
    {
        "province_code": 64,
        "label": "Tiznit",
        "value": 175
    },
    {
        "province_code": 67,
        "label": "Assa",
        "value": 176
    },
    {
        "province_code": 67,
        "label": "Zag",
        "value": 177
    },
    {
        "province_code": 66,
        "label": "Bouizakarne",
        "value": 178
    },
    {
        "province_code": 66,
        "label": "Guelmim",
        "value": 179
    },
    {
        "province_code": 66,
        "label": "Laqsabi",
        "value": 180
    },
    {
        "province_code": 69,
        "label": "Ifni",
        "value": 181
    },
    {
        "province_code": 69,
        "label": "Lakhsas",
        "value": 182
    },
    {
        "province_code": 68,
        "label": "Msied",
        "value": 183
    },
    {
        "province_code": 68,
        "label": "Tan Tan",
        "value": 184
    },
    {
        "province_code": 71,
        "label": "Jraifia",
        "value": 185
    },
    {
        "province_code": 73,
        "label": "Es-Semara",
        "value": 186
    },
    {
        "province_code": 70,
        "label": "Laayoune",
        "value": 187
    },
    {
        "province_code": 72,
        "label": "Daoura -el Hagounia",
        "value": 188
    },
    {
        "province_code": 72,
        "label": "Tarfaya",
        "value": 189
    },
    {
        "province_code": 75,
        "label": "Aousserd",
        "value": 190
    },
    {
        "province_code": 75,
        "label": "Bir Gandouz",
        "value": 191
    },
    {
        "province_code": 74,
        "label": "Bir Anzarane",
        "value": 192
    },
    {
        "province_code": 74,
        "label": "El Argoub",
        "value": 193
    }
];

var communes = communesCfg.map(com => com.label);

var mistypedCommunesMapping = {
    "Taklfat": "Tagleft",
    "Aghzaren": "Ighzrane",
    "Idawaaza": "Ida Ou Aazza",
    "Iyeere": "Ayir",
    "Lehdada": "Haddada",
    "Mars Lkhir": "Mers El Kheir",
    "M.h.zayani": "Moha Ou Hammou Zayani",
    "Mzamza Sud": "Mzamza Janoubia",
    "Beni Mhamed": "Bni M'Hamed-Sijelmassa",
    "Hssiya": "H'Ssyia",
    "Ait Sbaa": "Ait Sebaa Lajrouf",
    "zrrd@": "Zrarda",
    "bny frsn": "Bni Frassen",
    "Rass Ain": "Ras El Ain Chaouia",
    "Ras Ain": "Ras El Ain Chaouia",
    "Z Nahliya": "Zaouia Annahlia",
    "Ouled Lgarn": "Oulad El Garne",
    "Jebeil": "Jbiel",
    "Miat": "Mayate",
    "Lafrayta": "Fraita",
    "Lahdayna": "Hiadna",
    "Lahyadna": "Hiadna",
    "Almkren": "Mograne",
    "El Hri": "Lehri",
    "mGrw~": "Maghraoua",
    "wld zbyr": "Oulad Zbair",
    "Takzmirt": "Tigzmerte",
    "Belaaguid": "Ouahat Sidi Brahim"
};

var misInterpretedCommunes = [
    {
        "province_code": 5,
        "commune": "Rissana",
        "commune_juste": "Rissana Chamalia"
    },
    {
        "province_code": 7,
        "commune": "Malha",
        "commune_juste": "Oued Malha"
    },
    {
        "province_code": 15,
        "commune": "Lamrija Guercif",
        "commune_juste": "Lamrija"
    },
    {
        "province_code": 12,
        "commune": "Lamrija Jerrada",
        "commune_juste": "Mrija"
    },
    {
        "province_code": 37,
        "commune": "Old Ahmed",
        "commune_juste": "Oulad Aissa"
    },
    {
        "province_code": 54,
        "commune": "Ras El Ain Youssoufia",
        "commune_juste": "Ras El Ain"
    }
];

var Helpers = {
    decoupage,
    decoupageRegions,
    provinces: decoupage.map(pp => pp.label),
    regions: decoupageRegions.map(pp => pp.label),
    communes,
    cerclesCfg,
    communesCfg,
    fondations: ['FMPS', 'FZ'],
    apiUrl: (function () {
        var direct = config.direct;
        if (direct.relativeUrl) {
            return '';
        }

        var scheme = direct.protocol;
        var port = direct.port;
        return (scheme ? scheme + '://' : '//') + direct.server + (port ? ':' + port : '') + '/';
    }()),

    searchableAttributes: function (model) {
        var attributes = model.tableAttributes || [];
        var keys = Object.keys(attributes);
        var result = [];
        var key;

        for (var i = 0, ilen = keys.length; i < ilen; ++i) {
            key = keys[i];
            if (attributes[key].searchable) {
                result.push(key);
            }
        }

        return result;
    },

    // [TODO] advanced search:
    // regex: /(?:(\w+):(?:"([^"]+)"|([^"\s]*)))|(?:"([^"]+)"|([^\s]+))/g

    sequelizeConcat: function (attributes, sequelize) {
        return sequelize.literal(attributes.map(function (value) {
            return sequelize.escape(sequelize.col(value))
        }).join(' || " " || '));
    },

    sequelizify: function (params, model, defaults) {

        var query = defaults || {};
        var me = this;

        if (params.id) {
            query.where = query.where || {};
            query.where.id = params.id;
        }

        if (params.filter) {
            query.where = query.where || {};
            params.filter.forEach(function (filter) {
                var prop = filter.property;
                var value = filter.value;
                var cond = null;

                if (prop === '#search') {
                    // Special case for the "#search" property
                    prop = '$or';
                    cond = me.searchableAttributes(model).map(function (attr) {
                        return { [attr]: { $iLike: '%' + value + '%' } };
                    });
                } else {

                    switch (filter.operator) {
                        case '<': cond = { $lt: value }; break;
                        case '<=': cond = { $lte: value }; break;
                        case '>=': cond = { $gte: value }; break;
                        case '>': cond = { $gt: value }; break;
                        case '!=': cond = { $ne: value }; break;
                        case 'in': cond = { $in: value }; break;
                        case 'notin': cond = { $notIn: value }; break;
                        case 'like': cond = { $iLike: value }; break;
                        case 'notlike': cond = { $notLike: value }; break;

                        case 'between': cond = { $between: value }; break;

                        //case '/=' // NOT SUPPORTED!
                        //case '=':
                        default:
                            cond = value;
                            break;
                    }

                    if (/*!model.tableAttributes ||*/ !(prop in model.tableAttributes)) {
                        // let's try in another table:
                        // https://github.com/sequelize/sequelize/issues/3095#issuecomment-149277205
                        prop = '$' + prop + '$';
                    }


                }

                query.where[prop] = cond;
            });

        }

        if (params.sort) {
            query.order = query.order || [];
            params.sort.forEach(function (sorter) {
                var prop = sorter.property;
                query.order.push([
                    prop in model.tableAttributes ? prop : model.sequelize.col(prop),
                    sorter.direction
                ]);
            });
        }

        if (params.group) {
            query.group = params.group.property;
        }

        if (params.start) {
            query.offset = params.start;
        }

        if (params.limit) {
            query.limit = params.limit;
        }

        return query;
    },


    fetchFilters: function (params, model, defaults) {
        var field = params.field;
        if (!field) {
            throw errors.generate('Missing field argument');
        }

        var searched = params.query && params.query[0];

        if (searched) {
            params.filter = [{
                //property: '#search',
                property: params.label,
                operator: 'like',
                value: '%' + searched + '%'
            }];
        }

        var sequelize = model.sequelize;

        var column = field in model.tableAttributes ? field : sequelize.col(field);
        var label = this.sequelizeConcat([].concat(params.label || field), sequelize);
        var query = this.sequelizify(params, model, Object.assign(defaults || {}, {
            attributes: [[label, 'label'], [column, 'value']],
            group: [column],
            distinct: true,
            plain: false,

            include: [{
                all: true,
                nested: true,
                attributes: []
            }]
        }));

        return model.aggregate(model.name + '.id', 'count', query);
    },

    idsFromParams: function (params) {
        var type = typeof (params);
        if (type === 'string') {
            return [params];
        }

        if (type === 'object') {
            if (params.id) {
                return [params.id];
            } else if (Array.isArray(params)) {
                return params.map(function (param) {
                    return param.id
                });
            }
        }

        return [];
    },

    cleanStr: function (str, doRemoveDigits, replPattern) {
        doRemoveDigits = doRemoveDigits === undefined ? true : doRemoveDigits
        replPattern = replPattern === undefined ? ' ' : replPattern

        const rgx = doRemoveDigits ? /[^a-z]/ig : /[^a-z0-9_]/ig

        str = latinize(str.toLowerCase())
        str = str.replace(rgx, replPattern)
        return str.trim()
    },

    variablize: function (col, doRemoveDigits, replPattern) {
        if (!col) return null

        col = module.exports.cleanStr(col, doRemoveDigits, replPattern)
        col = col.replace(/\s?(de l['’]up|\(.+\))\s?/gi, '')
        col = col.replace(/\s?( d['’]\s?| des? |-|\/|\\)\s?/ig, '_')
        col = col.replace(/\s/g, '_')
        col = col.replace(/^_|_$/g, '')
        col = col.replace(/_{2,}/g, '_')

        return col
    },

    capitalizeFirstLetter: function (str) {
        return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
    },

    titleCase: function (str) {
        let result = typeof (str) === 'string' ? str.toLowerCase().split(' ').map(function (word) {
            return word ? word.replace(word[0], word[0].toUpperCase()) : ''
        }).join(' ') : '';

        if (result.length) {
            result = result.replace(/\s?([\-'’/])\s?/g, '$1');
            result = result.replace(/(\w{2,})\s?\/\s?(\w{2,})/g, '$1 / $2');
            result = result.replace(/\s?\(\s?/g, ' (').replace(/\s?\)\s?/g, ') ');
            result = result.replace(/\s{2,}/g, ' ').trim();
        }

        return result;
    },

    sanitizeDouar: function (intitule) {
        intitule = intitule.replace(/(^|\s)\bdr?\.?\s/i, ' Douar ');
        intitule = intitule.replace(/(^|\s)\bCoop[a-zé]*\.?\s/i, ' Coopérative ');
        intitule = intitule.replace(/(^|\s)\bzte?\.?\s/i, ' Zaouiat ');
        intitule = intitule.replace(/(^|\s)\bmy\.?\s/i, ' Moulay ');
        intitule = intitule.replace(/(^|\s)\bsd\.?\s/i, ' Sidi ');
        intitule = intitule.replace(/(^|\s)\bol?d?\s/i, ' Oulad ');
        intitule = intitule.replace(/(^|\s)\bct\s/i, ' Centre ');
        intitule = intitule.replace(/(\w)-(\d)/i, '$1 $2').trim();
        intitule = intitule.replace(/(\w)\s?-\s?centre( commune)?\s*$/i, '$1 Centre');
        intitule = intitule.replace(/^(centre( commune)?)[\s\-]{1,3}(.+)/i, "$3 Centre")

        return Helpers.titleCase(intitule);
    },


    findNonEmpty: function (arr, idx) {
        const len = arr.length
        let val

        do {
            val = arr[idx--]
        } while (!val && idx >= 0)

        return val ? val.toString() : ''
    },

    parseBoolean: function (val) {
        if (val == null || val === '') return false;

        if (!isNaN(val)) return !!parseInt(val);

        if (/\boui\b/i.test(val)) return true;
        if (/\bnon\b/i.test(val)) return false;
        return null;
    },

    extractDate: function (val) {
        if (!val) return null
        if (val instanceof Date) {
            return val.getTime() !== val.getTime() ? null : val;
        }

        if ((val.match(/[\/\-]/g) || []).length > 2 || val.includes('&') || val.includes('et')) {
            const parts = val.match(/[0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4}/g);
            if (parts.length) val = parts.pop();
        }

        const parsed = moment(val, ["YYYY-MM-DD HH:mm:ss.SSS", "DD/MM/YYYY"], 'fr');
        if (parsed.isValid()) return parsed.utc(true).toDate();

        if (/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2})\:(\d{2})\:(\d{2})/.test(val)) return new Date(val);

        let result = val.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}");

        let dateSplitted;
        let day, month, year, aux;

        if (null != result) {
            dateSplitted = result[0].split(result[1]);
            day = dateSplitted[0];
            month = dateSplitted[1];
            year = dateSplitted[2];
        }

        if (month > 12) {
            aux = day;
            day = month;
            month = aux;
        }

        const dt = new Date(year, month - 1, day, 8, 0, 0, 0);
        return dt.getTime() !== dt.getTime() ? null : dt
    },

    // Accepts the array and key
    groupBy: function (array, key) {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    },


    checkListAuthorization: function (user, params, maxRole) {
        const userRole = user.get('role');

        maxRole = typeof (maxRole) === 'undefined' ? 3 : maxRole;

        if (userRole > maxRole) {
            return false;
        } else if (userRole > 1) {
            const userRegion = user.get('region_code');
            const userProvince = user.get('province_code');
            const userFP = user.get('fondation_code');

            var locationFilter = { property: '', value: '' }

            params['filter'] = params['filter'] || []

            if (userRole === 2) {
                locationFilter.property = 'province_code';
                locationFilter.operator = 'in';

                const regionMatch = decoupageRegions.find(rec => rec.value == userRegion);
                locationFilter.value = regionMatch ? regionMatch.provinces : [];
            } else if (userRole === 3) {
                locationFilter.property = 'province_code'
                locationFilter.value = userProvince
            } else if (userRole === 4) {
                locationFilter.property = 'fp_code'
                locationFilter.value = userFP
            }

            if (locationFilter.value == null) {
                return false;
            }

            console.log(locationFilter)
            params.filter.push(locationFilter)
        }

        return params.filter;
    },

    checkModifyAuthorization: function (user, rec, maxRole) {
        if (Array.isArray(rec)) rec = rec[0];

        const userRole = user.get('role');
        maxRole = typeof (maxRole) === 'undefined' ? 3 : maxRole;

        if (userRole <= 1) return true;
        else if (userRole > maxRole) return false;

        if (userRole > 1) {
            const recProvince = typeof (rec.get) === 'function' ? rec.get('province_code') : rec.province_code;
            const recFP = typeof (rec.get) === 'function' ? rec.get('fp_code') : rec.fp_code;

            const userProvince = user.get('province_code');
            const userRegion = user.get('region_code');
            const regionMatch = decoupageRegions.find(rec => rec.value == userRegion);
            const userRegionProvinces = regionMatch ? regionMatch.provinces : [];
            const userFP = user.get('fondation_code');

            return (userRole === 2 && userRegionProvinces.includes(recProvince)) ||
                (userRole === 3 && userProvince === recProvince) ||
                (userRole === 4 && userFP === recFP);
        }

        return true;
    },

    getCommuneCode: function (commune, provinceCode) {
        if (!commune) return null;

        var provinceCommunesCfg = communesCfg.filter(com => com.province_code === provinceCode);
        var provinceCommunes = [];

        provinceCommunesCfg.forEach(com => {
            provinceCommunes.push(com.label);
            if (com.altLabel) provinceCommunes.push(com.altLabel);
        })

        if (/[\u0621-\u064A]+/.test(commune)) {
            //console.log('AR', commune, transliterate(commune));
            commune = transliterate(commune);
        }

        if (!provinceCommunes.includes(commune)) {
            var justeMatch = misInterpretedCommunes.find(entry => entry.province_code === provinceCode && entry.commune === commune);
            if (justeMatch) {
                commune = justeMatch.commune_juste;
            } else if (mistypedCommunesMapping.hasOwnProperty(commune)) {
                commune = mistypedCommunesMapping[commune];
            } else {
                var closestCommune = Helpers.closestEntry(commune, provinceCommunes);
                commune = closestCommune;
                /*var similarCommune = stringSimilarity.findBestMatch(commune, provinceCommunes);
                if (similarCommune.bestMatch.rating > 0.7 && closestCommune === similarCommune.bestMatch.target) {
                    commune = closestCommune;
                } else {
                    var dist = distance(commune, closestCommune);
                    var distPercent = dist / Math.max(commune.length, closestCommune.length);

                    if (dist <= 4 && distPercent <= 0.3) {
                        commune = closestCommune;
                    } else {
                        var prob = 0;
                        if (dist <= 3) prob += 1;
                        if (distPercent > 0.5) prob += 1;
                        if (closestCommune === similarCommune.bestMatch.target) {
                            prob += 2;

                            if (similarCommune.bestMatch.rating > 0.5) prob += 1;
                        }

                        if (prob >= 2) {
                            commune = closestCommune;
                        } else if (mistypedCommunesMapping.hasOwnProperty(commune)) {
                            commune = mistypedCommunesMapping[commune];
                        } else if (similarCommune.bestMatch.rating > 0.5) {
                            commune = similarCommune.bestMatch.target;
                        } else {
                            //console.log(provinceCode, '"' + commune + '"', '"' + closestCommune + '"', prob, dist, distPercent, '"' + similarCommune.bestMatch.target + '"', similarCommune.bestMatch.rating);
                            console.log(commune, provinceCommunes);
                        }
                    }
                }*/
            }
        }

        var match = provinceCommunesCfg.find(rec => rec.label === commune || rec.altLabel === commune);
        if (match) {
            return match.value;
        }

        return -1;
    },

    closestEntry: function (str, arr, checkUnvowel = true, checkComposed = false, treshould) {
        let result;

        let similars = [];

        let candidate;
        let similarity;
        let maxSimilarity = 0;
        let max_index = 0;

        let input = accents.remove(str);

        for (let i = 0; i < arr.length; i++) {
            candidate = accents.remove(arr[i]);

            if (checkComposed && candidate.includes('-')) {
                var parts = candidate.split('-').filter(p => p.length > 3);
                similarity = Math.max(...parts.map(p => lig2(input, p)), lig2(input, candidate));
            } else {
                similarity = lig2(input, candidate);
            }

            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                max_index = i;
                similars = [arr[i]];
            } else if (similarity === maxSimilarity) {
                similars.push(arr[i]);
            }
        }

        if (treshould > 0 && maxSimilarity < treshould) return null;

        if (similars.length === 1 || !checkUnvowel) {
            result = arr[max_index];
        } else {
            var unvowelStr = unvowel.parse(str);
            var unvowelCandidates = similars.map(candidate => unvowel.parse(candidate));
            var closestUnvowel = Helpers.closestEntry(unvowelStr, unvowelCandidates, false);

            result = similars[unvowelCandidates.indexOf(closestUnvowel)];
        }

        return result;
    },

    nameSig: function (str) {
        if (!str) return null;
        str = str.replace(/\d+/g, (match) => NumberToLetter(match));

        return namesig(str);
    }
};

module.exports = Helpers;
