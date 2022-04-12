"use strict";

const config = require('../utils/config');
const latinize = require('latinize');
const moment = require('moment');

const regionsCodesMapping = {
    "0": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
    ],
    "1": [
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16
    ],
    "2": [
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25
    ],
    "3": [
        26,
        27,
        28,
        29,
        30,
        31,
        32
    ],
    "4": [
        33,
        34,
        35,
        36,
        37
    ],
    "5": [
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46
    ],
    "6": [
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54
    ],
    "7": [
        55,
        56,
        57,
        58,
        59
    ],
    "8": [
        60,
        61,
        62,
        63,
        64,
        65
    ],
    "9": [
        66,
        67,
        68,
        69
    ],
    "10": [
        70,
        71,
        72,
        73
    ],
    "11": [
        74,
        75
    ]
}

const urls = {
    Benslimane: '1YTOpLVniaylvFSYlsBNsokjQuhQIzihdoudUepbYUrs',
    'Khémisset': '1nKeEsn4Q3uScex8jyaj7M33pHKKS_her35NJg4iXHMk',
    Settat: '1p7y3PAYyd7_diNky3-57KS_gqvACG3iHoS7O5p0Yh8w',
    Essaouira: '1mrwLfZoNbaoK8HFF8av-8_dr4ZKWqIIGTCRaKjnsya4',
    Rehamna: '1I6sGg93jxhAsWnvJVTnZTdMWwXx9mCldcH-jXZa_ZCI',
    Rabat: '1JgjZhixxcvsQtKUPaoJd9Bxt_LnJ-xA1YTKAeDkWZ0E',
    'Fquih Ben Salah': '1uEw3C4KnHH8yrK9KXnjALjyb1An0nyMRtoTzWEfRPmk',
    'Al Haouz': '1zkhflVju_290ZQ-m4wVrWXb2RtvACibArew0zI15w-A',
    Zagora: '1hDkmHALuDz5Z7QUdyNERzKvKU7Ponkj23hDcMZNse84',
    Berrechid: '1aeKGsNkMIixH2r47qfJQjGNfbEe4CxkWOqzN9oS3y5k',
    Nouaceur: '1SjMxIywj59DNoQFhVVH17vn9dryoGOZXiHrAxdCCEfI',
    'Médiouna': '148lVGHtq-3FVSNmN0HvektPzs_OSP2IoplF0klLGZFA',
    Tinghir: '1UIgS1QxtwTA2UFy5mn-6s_RTs30F0-Mrq6j5IbpiPXw',
    Marrakech: '1cbiaO88UTGHaxDekqDtEc6TOm1SKjuESasvW7EjEX8Q',
    'El Jadida': '1vxWZQWjrYP4Yhz7NgIqCZVL4ngyKrNrNQDjj5-w91yw',
    Taounate: '1e2S8xuW_3vAvO8YowMMqH0tzHGUauA7kzVN9PLEv-80',
    'Moulay Yacoub': '16pFjI04T9qbMvu6GOZ-VHswpgjXEjUki18i6_wC0LKY',
    'El Hajeb': '1-PT1_5PnB_K0B8pOkEZ-yFGmCieBrWTkVoEOH57GkLo',
    'Fès': '1gLo1-ExP0D8kHyDp5FV9R8PDBA2t5PD58l7r8Vhytkk',
    Midelt: '1_nVazkFOOk-bIZTk-oBBbM5y12MbXK8mrq8OKLrVv9U',
    Ouarzazate: '1Fdm4JuSu6f3txh_KXnE-g51WhA9QlCZDVKh6SjewkXQ',
    Safi: '12QSQhN3p1NxSc8KGWKTBUHW0ATZpRljXiB7uBjVHCWU',
    Chichaoua: '1VuoYsuLir-mdsVcn1kcKJ9DCDi-zfLS_2khep38ziO8',
    'Laâyoune': '1IJw27n7NnucgIvBlTV7u0bIv5MDE3ZmLSlxe9N8Sm1o',
    'Oued Ed-Dahab': '16AZAECOHY4cgiBJa0zQO0f6bVo76PMqCRbH_kjqQbrw',
    'Meknès': '1S5CbYOhNZU9WLsKGZMBXiW7-wqHjGEyKzQj2q7qbeCc',
    'Sidi Kacem': '1qyNttvED-YlU0Mg_ZQsGys8jgm8MbDwvbBQ20m1s2Fk',
    Guelmim: '1Yi5nS26kUpTRsUkFvQCu7c2J9tLAw482Eb5YjKXPzUI',
    Taza: '17Tbg_LgCyU_GaWbzaFtHdPp_cCP1yrGNesEbrHiIQ84',
    Tata: '16V9PDmCVDBvFmCnHosrd4HRCCC84GK1ib-_J1Pspoto',
    'Al Hoceima': '1cmwnUK5YMtW905nl6FShyOJ3er8j74DEmrt-8lRdUpw',
    'M\'diq-Fnideq': '1pqLRyqjTBW9DVswRXchETx6cKs0YKjWoAEkGX_lBMI4',
    Larache: '1SiiNaW6J_gshf5uMEfl8FeHHAMmKlgyfzG95wgjHGOc',
    'Sidi Slimane': '1ke2JI0JivLFOpcJfbw9xWAzruame8-6U-UuYyt0VK7Y',
    'Tétouan': '1hFu8-QJS_lMvfzElQyHmuEBfReUpn-844L5OWrNrSmA',
    'Skhirate-Témara': '1vg1WE-_deKBGuVyNuRN28mP6OG7XyWox33EeVktu0Ro',
    Tiznit: '1lZzbyqMCwv1OpRHq4F9ECiQnoCRX5oSjviDZx-Inehw',
    'Assa-Zag': '1jHETqYxDXNOgb2W718ceo7Felgr4D5b4MePMNfdMp0g',
    Ifrane: '1jFyT1tBgO9cYuwA6WCCaoE0KVejE65k-1MH8Bn4Omwk',
    Nador: '1pj_SdcFCdxiyO_EvwEnFGQQayt5Qp5DAojlgr2Aez3g',
    'Chtouka-Aït Baha': '1lfTG4tRFckGWlGL4CUEZDvHlcCDbaSgtO9CMUEulRkY',
    'Tanger-Assilah': '1VwLb1uBNWthJzyNmOVfQOobM1aXukHVc3uLthcbfcKY',
    'Aousserd': '1rPIVx0vNOk3XMrvNsgBx5-amEMU5IzwtpW2UhKdlPc0',
    Sefrou: '12l1BRVKRfoJJcWtVkTKx9rcuHKBSHI9DqBwZmqRHYnM',
    'Fahs-Anjra': '1tUy7o_8gOeM3KwwnFEotqMvU1kGKOgmtnriSEwmA9fc',
    Boulemane: '1KrBXGhoDu4Rc-Aa12Xqo3BX23Bx1qHjJpVxzkPMMMRs',
    Chefchaouen: '14DBelqEqEy-sgp70DnTXSUQ68WxHAqjeCUX4ENwFBwM',
    Berkan: '1Glv2ELkaScVG1a-HQ7xUIDpcnd_jR7FJ-ALAcOS9BH4',
    'Sidi Bennour': '1Zq_LpZsHfbjfrQDgO7iuK86VjMn46NTsTwmw-dhLBgU',
    Mohammadia: '1uLHF99GQmo68T5RHlLaW4CR12H1IW_EcGhPNBH3UXYg',
    Driouch: '1-LiCVpvRmqBITxib-ZjDeQ9NjPlBTh2eTxb2-K7yrVw',
    'Agadir Ida-Ou-Tanane': '1eJF4SDV7hGvCLHoXIU8qmR6S3pb6omAJpI4ifjYQqJ8',
    'Inezgane-Aït Melloul': '1O5OuNgan5TW8U9kUN-RvJvleknN4YT58bEPXaHCkDek',
    Jerada: '1SQ84muPtgKhgJrDijkj0PmqcEicCTNOrv9TPE4imdX8',
    'Oujda-Angad': '1SjiPlnK24wwWhEIbPDREM6rcvUQrhBBBq9CDbTZwzBU',
    Youssoufia: '1PSab8vWx_qYSwxjyi0yCrUpc9JBlp7gV--JyvtBAMhA',
    'Khouribga': '16PzjoGHoBghaJzMRTrNHpl5hEfQ64tOd_uDu0ao4z3w',
    Figuig: '1vwiXwDSnwv9c83CTOJU_rPNUsOg456ocC05SRs8GZ7s',
    Errachidia: '12e0TNk-GGLS3AKZJIl4qwr-s5Fs4aCQzNEk1cqL9RYY',
    'Béni Mellal': '1cPRJ0UKVCA1n6BdMHOI6KeKQ4S5GmwL09zE2OsEx0PY',
    'Kelâa des Sraghna': '1F-lUxlB06Cku0lqabFEqBDaPD87zuuDNAwwgt72Jvzo',
    Guercif: '1i8U_kLh7alKhjBuaflSCYORuUkTO_1_Sj2zO22JW_D0',
    'Tan-Tan': '1GsHpLHH0ZYM2wxiwww3o_qMPBQMNdUUsKsGSh8h-a6Y',
    Taroudannt: '1_s5hCP7JUXr-NCdPDzzu_vIEg7gNbIDr4_qz4QWjIUQ',
    Taourirt: '1NkIqJdObsq2z647IKEAxwtJyI5XaffZttkjjXhdHyis',
    Ouazzane: '1raMczRPdNkSdiAPu8jnKFdjchWecV99P0cLr6n2JGuo',
    'Sidi Ifni': '1bZ--WQ78VKAKz4YQ4QIYXYZamqziQNx3EIzStiHWs5U',
    'Khénifra': '1Pe6DMn53Rt2_v15gkhhcCzXrpVbpZGZta2S4EiovtXY',
    'Salé': '1d-DtUTLWss4DL2Oi9ug2lEnar6CUZj6RvoZagoKkMc0',
    Tarfaya: '17CBfBmtmEBUx70QzL2v7veTnrCS4KQNVoTe24j_ITXQ',
    'Kénitra': '1r4tEecw2_O5RqkM3iAgB-u-RAivoCuYhDxlJ89OHOrA',
    Boujdour: '1YS0-Tw8LFMZaAniXFn5xiR1clLf_yS1goF5ZMB9CH88',
    Azilal: '1hE2sN_5K0hJa0U7xrJKKmjeGCtuyr8PIPZ5hxXDCrbw',
    'Es-Semara': '1e71BwFDc7OM7TttwNtgRanTgO2YZeCh23a0S2thbq9w'
}

const mappingPPRegions = {
    'Oujda-Angad': 'L’Oriental',
    'Nador': 'L’Oriental',
    'Driouch': 'L’Oriental',
    'Jerada': 'L’Oriental',
    'Berkan': 'L’Oriental',
    'Taourirt': 'L’Oriental',
    'Guercif': 'L’Oriental',
    'Figuig': 'L’Oriental',
    'Marrakech': 'Marrakech-Safi',
    'Chichaoua': 'Marrakech-Safi',
    'Al Haouz': 'Marrakech-Safi',
    'Kelâa des Sraghna': 'Marrakech-Safi',
    'Essaouira': 'Marrakech-Safi',
    'Rehamna': 'Marrakech-Safi',
    'Safi': 'Marrakech-Safi',
    'Youssoufia': 'Marrakech-Safi',
    'Errachidia': 'Drâa-Tafilalet',
    'Ouarzazate': 'Drâa-Tafilalet',
    'Midelt': 'Drâa-Tafilalet',
    'Tinghir': 'Drâa-Tafilalet',
    'Zagora': 'Drâa-Tafilalet',
    'Fès': 'Fès-Meknès',
    'Meknès': 'Fès-Meknès',
    'El Hajeb': 'Fès-Meknès',
    'Ifrane': 'Fès-Meknès',
    'Moulay Yacoub': 'Fès-Meknès',
    'Sefrou': 'Fès-Meknès',
    'Boulemane': 'Fès-Meknès',
    'Taounate': 'Fès-Meknès',
    'Taza': 'Fès-Meknès',
    'Guelmim': 'Guelmim-oued Noun',
    'Assa-Zag': 'Guelmim-oued Noun',
    'Tan-Tan': 'Guelmim-oued Noun',
    'Sidi Ifni': 'Guelmim-oued Noun',
    'Tanger-Assilah': 'Tanger-Tétouan-Al Hoceima',
    "M'diq-Fnideq": 'Tanger-Tétouan-Al Hoceima',
    'Tétouan': 'Tanger-Tétouan-Al Hoceima',
    'Fahs-Anjra': 'Tanger-Tétouan-Al Hoceima',
    'Larache': 'Tanger-Tétouan-Al Hoceima',
    'Al Hoceima': 'Tanger-Tétouan-Al Hoceima',
    'Chefchaouen': 'Tanger-Tétouan-Al Hoceima',
    'Ouazzane': 'Tanger-Tétouan-Al Hoceima',
    'Agadir Ida-Ou-Tanane': 'Souss-Massa',
    'Inezgane-Aït Melloul': 'Souss-Massa',
    'Chtouka-Aït Baha': 'Souss-Massa',
    'Taroudannt': 'Souss-Massa',
    'Tiznit': 'Souss-Massa',
    'Tata': 'Souss-Massa',
    'Casablanca': 'Casablanca-Settat',
    'Mohammadia': 'Casablanca-Settat',
    'El Jadida': 'Casablanca-Settat',
    'Nouaceur': 'Casablanca-Settat',
    'Médiouna': 'Casablanca-Settat',
    'Benslimane': 'Casablanca-Settat',
    'Berrechid': 'Casablanca-Settat',
    'Settat': 'Casablanca-Settat',
    'Sidi Bennour': 'Casablanca-Settat',
    'Oued Ed-Dahab': 'Dakhla-Oued Eddahab',
    'Aousserd': 'Dakhla-Oued Eddahab',
    'Béni Mellal': 'Beni Mellal-Khénifra',
    'Azilal': 'Beni Mellal-Khénifra',
    'Fquih Ben Salah': 'Beni Mellal-Khénifra',
    'Khénifra': 'Beni Mellal-Khénifra',
    'Khouribga': 'Beni Mellal-Khénifra',
    'Rabat': 'Rabat-Salé-Kénitra',
    'Salé': 'Rabat-Salé-Kénitra',
    'Skhirate-Témara': 'Rabat-Salé-Kénitra',
    'Kénitra': 'Rabat-Salé-Kénitra',
    'Khémisset': 'Rabat-Salé-Kénitra',
    'Sidi Kacem': 'Rabat-Salé-Kénitra',
    'Sidi Slimane': 'Rabat-Salé-Kénitra',
    'Laâyoune': 'Laâyoune-Sakia Al Hamra',
    'Boujdour': 'Laâyoune-Sakia Al Hamra',
    'Tarfaya': 'Laâyoune-Sakia Al Hamra',
    'Es-Semara': 'Laâyoune-Sakia Al Hamra'
}

const emails = {
    "Tanger-Assilah": "Wdas.tanger@gmail.com",
    "M'diq-Fnideq": "",
    "Al Hoceima": "dasalhoceima@gmail.com",
    "Chefchaouen": "mrinimd@gmail.com",
    "Fahs-Anjra": "Tassammite.mohammed@gmail.com",
    "Larache": "Taimi.outhman@gmail.com",
    "Ouazzane": "",
    "Tétouan": "brirhetm@gmail.com",
    "Oujda-Angad": "Hafida.mi@hotmail.fr",
    "Berkan": "Mohammed.mimouni@hotmail.com",
    "Driouch": "Abdellaari@gmail.com",
    "Figuig": "dassgprfiguig@yahoo.fr",
    "Guercif": "dasguercif@gmail.com",
    "Jerada": "Jalal.tagmouti@gmail.com",
    "Nador": "mohamedwariachi@yahoo.fr",
    "Taourirt": "AKHTIB@taourirt.interieur.gov.ma",
    "Fès": "ramibahae@yahoo.fr",
    "Meknès": "dasmeknes@gmail.com",
    "Boulemane": "dascomboulemane@gmail.com",
    "El Hajeb": "daselhajeb@yahoo.fr",
    "Ifrane": "",
    "Moulay Yacoub": "dasmyyacoub@gmail.com",
    "Sefrou": "",
    "Taounate": "aminaoufal@gmail.com",
    "Taza": "Abdelkrim.mouhoute@gmail.com",
    "Rabat": "mbellakbircharfi@rabat.interieur.gov.ma",
    "Salé": "",
    "Skhirate-Témara": "rguignaoual@hotmail.com/ addi.afnane@gmail.com",
    "Kénitra": "ebtissamwilaya@gmail.com",
    "Khémisset": "Dassfrc05@gmail.com",
    "Sidi Kacem": "",
    "Sidi Slimane": "Das.sidislimane@gmail.com",
    "Benslimane": "hassandas@gmail.com",
    "Berrechid": "das.berrechid@gmail.com",
    "El Jadida": "m.houboub@gmail.com",
    "Nouaceur": "Das.prnouaceur@gmail.com",
    "Settat": "dasettat@gmail.com",
    "Sidi Bennour": "Indh.sidibennour@gmail.com",
    "Azilal": "azilaldas@gmail.com",
    "Béni Mellal": "Jaberabderrahman@yahoo.fr",
    "Fquih Ben Salah": "larbi.bouabidi@gmail.com",
    "Khénifra": "Ziani_das@yahoo.fr",
    "Khouribga": "daskhouribga@gmail.com",
    "Marrakech": "Anouar.dbira@gmail.com",
    "Al Haouz": "dashaouz@gmail.com",
    "Chichaoua": "Loudinisa1966@gmail.com",
    "Kelâa des Sraghna": "m002siraj@yahoo.fr",
    "Essaouira": "khairiprovince@gmail.com",
    "Rehamna": "dasrhamna@gmail.com",
    "Safi": "mi.dassafi@gmail.com",
    "Youssoufia": "dasprovinceyoussoufia@gmail.com",
    "Errachidia": "tzeggwagh@gmail.com",
    "Midelt": "dasmidelt@gmail.com",
    "Ouarzazate": "dasouarzazate@gmail.com",
    "Tinghir": "indhtinghir@gmail.com",
    "Zagora": "hassanbtb@gmail.com",
    "Agadir Ida-Ou-Tanane": "benkiranesaloua@gmail.com",
    "Inezgane-Aït Melloul": "draissislimane@gmail.com",
    "Chtouka-Aït Baha": "Das.chtouka@gmail.com",
    "Taroudannt": "dastaroudannt@taroudann.interieur.gov.ma",
    "Tata": "Mkhaldi6@gmail.com",
    "Tiznit": "dastiznit@gmail.com",
    "Guelmim": "M.joumani@gmail.com",
    "Assa-Zag": "",
    "Sidi Ifni": "dassidiifni@gmail.com",
    "Tan-Tan": "dastantan@yahoo.fr",
    "Laâyoune": "dailadaila1972@gmail.com",
    "Boujdour": "boujdourprovince@yahoo.fr",
    "Es-Semara": "",
    "Tarfaya": "Talbi.hasanna@gmail.com",
    "Oued Ed-Dahab": "DAS@ouededdahab.interieur.gov.ma",
    "Aousserd": "dasprovinceaousserd@gmail.com"
}

const fpMapping = {
    "Agadir Ida-Ou-Tanane": "FMPS",
    "Al Haouz": "FMPS",
    "Al Hoceima": "FMPS",
    "Aousserd": "FMPS",
    "Assa-Zag": "FMPS",
    "Azilal": "FMPS",
    "Béni Mellal": "FMPS",
    "Benslimane": "FMPS",
    "Berkan": "FZ",
    "Berrechid": "FMPS",
    "Boujdour": "FMPS",
    "Boulemane": "FMPS",
    "Chefchaouen": "FZ",
    "Chichaoua": "FZ",
    "Chtouka-Aït Baha": "FZ",
    "Driouch": "FMPS",
    "El Hajeb": "FMPS",
    "El Jadida": "FMPS",
    "Errachidia": "FMPS",
    "Essaouira": "FMPS",
    "Fahs-Anjra": "FMPS",
    "Fès": "FMPS",
    "Figuig": "FMPS",
    "Fquih Ben Salah": "FZ",
    "Guelmim": "FMPS",
    "Guercif": "FMPS",
    "Ifrane": "FMPS",
    "Inezgane-Aït Melloul": "FMPS",
    "Jerada": "FMPS",
    "Kelâa des Sraghna": "FZ",
    "Kénitra": "FMPS",
    "Khémisset": "FMPS",
    "Khénifra": "FMPS",
    "Khouribga": "FZ",
    "Laâyoune": "FMPS",
    "Larache": "FZ",
    "Marrakech": "FMPS",
    "M'diq-Fnideq": "FMPS",
    "Médiouna": "FMPS",
    "Meknès": "FMPS",
    "Midelt": "FMPS",
    "Mohammadia": "FZ",
    "Moulay Yacoub": "FMPS",
    "Nador": "FMPS",
    "Nouaceur": "FMPS",
    "Ouarzazate": "FMPS",
    "Ouazzane": "FMPS",
    "Oued Ed-Dahab": "FMPS",
    "Oujda-Angad": "FMPS",
    "Rehamna": "FMPS",
    "Safi": "FMPS",
    "Salé": "FZ",
    "Sefrou": "FMPS",
    "Settat": "FZ",
    "Sidi Bennour": "FMPS",
    "Sidi ifni": "FMPS",
    "Sidi Kacem": "FZ",
    "Sidi Slimane": "FMPS",
    "Skhirate-Témara": "FMPS",
    "Tanger-Assilah": "FMPS",
    "Tan-Tan": "FMPS",
    "Taounate": "FMPS",
    "Taourirt": "FMPS",
    "Tarfaya": "FMPS",
    "Taroudannt": "FZ",
    "Tata": "FZ",
    "Taza": "FMPS",
    "Tétouan": "FMPS",
    "Tinghir": "FMPS",
    "Tiznit": "FZ",
    "Youssoufia": "FMPS",
    "Zagora": "FMPS"
}

var Helpers = {
    urls,
    mappingPPRegions,
    provinces: Object.keys(mappingPPRegions),
    regions: [...new Set(Object.values(mappingPPRegions))],
    emails,
    fpMapping,
    fondations: [...new Set(Object.values(fpMapping))],
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
                        return { [attr]: { $like: '%' + value + '%' } };
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
                        case 'like': cond = { $like: value }; break;
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
        return typeof (str) === 'string' ? str.toLowerCase().split(' ').map(function (word) {
            return word ? word.replace(word[0], word[0].toUpperCase()) : ''
        }).join(' ') : ''
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

        if (val.include('&')) {
            val = val.split('&')[1].trim();
        }

        if (val.include('et')) {
            val = val.split('et')[1].trim();
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

            var locationFilter = { property: '', value: '' }

            params['filter'] = params['filter'] || []

            if (userRole === 2) {
                locationFilter.property = 'province_code'
                locationFilter.operator = 'in'
                locationFilter.value = regionsCodesMapping[userRegion];
            } else if (userRole === 3) {
                locationFilter.property = 'province_code'
                locationFilter.value = userProvince
            } else if (userRole === 4) {
                locationFilter.property = 'fondation_partenaire'
                locationFilter.value = userFP
            }

            if (locationFilter.value == null) {
                return false;
            }

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
            const recFP = typeof (rec.get) === 'function' ? rec.get('fondation_partenaire') : rec.fondation_partenaire;

            const userProvince = user.get('province_code');
            const userRegion = user.get('region_code');
            const userRegionProvinces = regionsCodesMapping[userRegion];
            const userFP = user.get('fondation');

            return (userRole === 2 && userRegionProvinces.includes(recProvince)) ||
                (userRole === 3 && userProvince === recProvince) ||
                (userRole === 4 && userFP === recFP);
        }

        return true;
    }
};

module.exports = Helpers;
