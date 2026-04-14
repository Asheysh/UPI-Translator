// Hindi Number Parser — Complete dictionary, smart fuzzy matching, grammar evaluator

// ── Complete 1–99 Dictionary ──
// Every Hindi number from 1 to 99 with canonical romanized spelling
const UNITS: Record<string, number> = {
  // 1–10
  ek: 1, do: 2, teen: 3, chaar: 4, paanch: 5,
  chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
  // 11–19
  gyarah: 11, barah: 12, terah: 13, chaudah: 14, pandrah: 15,
  solah: 16, satrah: 17, atharah: 18, unnees: 19,
  // 20–29
  bees: 20, ikkees: 21, bais: 22, teis: 23, chaubees: 24,
  pachees: 25, chhabees: 26, sattais: 27, athais: 28, untees: 29,
  // 30–39
  tees: 30, ikattis: 31, battis: 32, taintis: 33, chauntis: 34,
  paitis: 35, chhattis: 36, saintees: 37, adhtis: 38, untalis: 39,
  // 40–49
  chalees: 40, iktalis: 41, bayalis: 42, tetalis: 43, chauntalis: 44,
  paintalis: 45, chiyalis: 46, saitalis: 47, adtalis: 48, unchaas: 49,
  // 50–59
  pachaas: 50, ikyaavan: 51, bawan: 52, tirpan: 53, chauvan: 54,
  pachpan: 55, chhappan: 56, sattavan: 57, athavan: 58, unsath: 59,
  // 60–69
  saath: 60, iksaath: 61, basaath: 62, tirsath: 63, chausath: 64,
  painsath: 65, chhiyaasath: 66, sadsath: 67, adsath: 68, unsattar: 69,
  // 70–79
  sattar: 70, ikhattar: 71, bahattar: 72, tihattar: 73, chauhattar: 74,
  pachhattar: 75, chhihattar: 76, sattattar: 77, athhattar: 78, unasi: 79,
  // 80–89
  assi: 80, ikyaasi: 81, bayaasi: 82, tiraasi: 83, chaurasi: 84,
  pachasi: 85, chhiyaasi: 86, sattasi: 87, athasi: 88, navasi: 89,
  // 90–99
  nabbe: 90, ikyanave: 91, bayanave: 92, tiranave: 93, chauranave: 94,
  pachanave: 95, chhiyanave: 96, sattanave: 97, athanave: 98, ninyanave: 99,

  // ── Alternate canonical spellings (common valid variations) ──
  // These are NOT misspellings — they are widely used correct romanizations
  panch: 5, paach: 5,
  chha: 6, cheh: 6,
  sat: 7,
  aat: 8, aatt: 8,
  noh: 9,
  unnis: 19, unnish: 19, unees: 19,
  bis: 20, bish: 20, beesh: 20,
  pacchees: 25,
  paitees: 35,
  chalees: 40, chaalis: 40,
  pachas: 50,
  sath: 60, saathh: 60,
  unahattar: 69,
  chhi_hattar: 76, chhihattar_: 76,
  unassi: 79,
  assee: 80,
  nave: 90, nabbe_: 90,
};

const MULTIPLIERS: Record<string, number> = {
  sau: 100, hazaar: 1000, hazar: 1000, lakh: 100000, crore: 10000000,
  karod: 10000000, arab: 1000000000,
};

const FRACTIONS: Record<string, number> = {
  aadha: 0.5, pauna: 0.75, sawa: 1.25, dedh: 1.5, dhai: 2.5,
  savaa: 1.25, adha: 0.5,
};

// ── Comprehensive misspellings dictionary ──
// Maps known misspellings → canonical form
const MISSPELLINGS: Record<string, string> = {
  // Connectors
  aur: "_and_", or: "_and_", and: "_and_", ya: "_and_",

  // Additional common variations and typing mistakes
  // Phonetic and typing errors

  // Common typing mistakes and phonetic variations
  // Keyboard proximity errors
  "q": "ek", "w": "do", "e": "teen", "r": "chaar", "t": "paanch", "y": "saat", "u": "aath", "i": "nau", "o": "das",
  "p": "gyarah", "a": "barah", "s": "terah", "d": "chaudah", "f": "pandrah", "g": "solah", "h": "satrah", "j": "atharah", "k": "unnees",
  "l": "bees", "z": "tees", "x": "chalees", "c": "pachaas", "v": "saath", "b": "nabbe", "n": "sau", "m": "hazaar",

  // Double letter variations
  "ekk": "ek", "doo": "do", "teenn": "teen", "chaarr": "chaar", "paanchh": "paanch", "chhee": "chhe", "saatt": "saat", "aatth": "aath", "nauu": "nau", "dass": "das",
  "gyarahh": "gyarah", "barahh": "barah", "terahh": "terah", "chaudahh": "chaudah", "pandrahh": "pandrah", "solahh": "solah", "satrahh": "satrah", "atharahh": "atharah", "unneess": "unnees",
  "beess": "bees", "teess": "tees", "chaleess": "chalees", "pachaass": "pachaas", "saatth": "saath", "nabe": "nabbe", "sauu": "sau", "hazaarr": "hazaar",

  // Missing/extra letters
  "e": "ek", "k": "ek", "d": "do", "o": "do", "te": "teen", "en": "teen", "cha": "chaar", "ar": "chaar", "pan": "paanch", "ch": "paanch", "sa": "saat", "at": "saat", "aa": "aath", "th": "aath", "na": "nau", "u": "nau", "da": "das", "as": "das",
  "gya": "gyarah", "rah": "gyarah", "ba": "barah", "rah": "barah", "te": "terah", "rah": "terah", "chau": "chaudah", "dah": "chaudah", "pan": "pandrah", "drah": "pandrah", "so": "solah", "lah": "solah", "sa": "satrah", "trah": "satrah", "at": "atharah", "harah": "atharah", "un": "unnees", "nees": "unnees",
  "be": "bees", "es": "bees", "te": "tees", "es": "tees", "cha": "chalees", "lees": "chalees", "pac": "pachaas", "haas": "pachaas", "saa": "saath", "th": "saath", "na": "nabbe", "bbe": "nabbe", "sa": "sau", "u": "sau", "haz": "hazaar", "aar": "hazaar",

  // Phonetic confusions
  "shat": "saat", "shet": "chhe", "chet": "chhe", "shet": "chhe", "sath": "saath", "shath": "saath", "shaat": "saath", "sh": "chhe", "shh": "chhe",
  "bich": "bees", "bichh": "bees", "besh": "bees", "bish": "bees", "beesh": "bees", "bech": "bees",
  "tis": "tees", "tish": "tees", "tiss": "tees", "tees": "tees", "teesh": "tees",
  "chalis": "chalees", "challish": "chalees", "challis": "chalees", "chales": "chalees", "chaleesh": "chalees",
  "pachas": "pachaas", "pachash": "pachaas", "pachhass": "pachaas", "pachhas": "pachaas", "pachhaz": "pachaas",
  "sath": "saath", "saathh": "saath", "saath": "saath", "saaath": "saath",
  "nabbe": "nabbe", "nabbeh": "nabbe", "nabee": "nabbe", "nabeh": "nabbe",
  "so": "sau", "soo": "sau", "sao": "sau", "sow": "sau", "saw": "sau", "sauh": "sau",
  "hazar": "hazaar", "hazaar": "hazaar", "hazarr": "hazaar", "hazaarr": "hazaar", "hajar": "hazaar", "hajarr": "hazaar",

  // Regional variations and fast typing
  "ik": "ek", "ekk": "ek", "ec": "ek", "eek": "ek", "eck": "ek", "ak": "ek",
  "doh": "do", "doo": "do", "dou": "do", "dho": "do", "dhoo": "do",
  "tin": "teen", "tiinn": "teen", "tean": "teen", "teenn": "teen", "tenn": "teen",
  "char": "chaar", "charr": "chaar", "car": "chaar", "chhar": "chaar", "charr": "chaar",
  "panch": "paanch", "pach": "paanch", "paach": "paanch", "punch": "paanch", "paanchh": "paanch", "panchh": "paanch",
  "che": "chhe", "cheh": "chhe", "chha": "chhe", "cche": "chhe", "chay": "chhe", "chhey": "chhe",
  "sat": "saat", "saath_7": "saat", "saatt": "saat", "satt": "saat",
  "aat": "aath", "aatt": "aath", "ath": "aath", "aat_h": "aath", "aathh": "aath",
  "no": "nau", "noh": "nau", "nauh": "nau", "now": "nau", "nao": "nau",
  "duss": "das", "daas": "das", "dhas": "das", "dass": "das", "duss_": "das", "dasz": "das",
  "giyarah": "gyarah", "garah": "gyarah", "gyara": "gyarah", "giyara": "gyarah", "gyarahh": "gyarah",
  "barah": "barah", "baarah": "barah", "bara": "barah", "barha": "barah", "brha": "barah", "barahh": "barah",
  "tera": "terah", "teraa": "terah", "tairah": "terah", "terahh": "terah", "terrah": "terah",
  "chauda": "chaudah", "choda": "chaudah", "chouda": "chaudah", "chaudahh": "chaudah", "chodah": "chaudah",
  "pandra": "pandrah", "pandhra": "pandrah", "pandrahh": "pandrah", "pandara": "pandrah", "pdrah": "pandrah",
  "sola": "solah", "solaa": "solah", "sholah": "solah", "solahh": "solah", "sohla": "solah",
  "satra": "satrah", "satraa": "satrah", "satrahh": "satrah", "sathra": "satrah", "satara": "satrah",
  "athara": "atharah", "atharaa": "atharah", "athrah": "atharah", "atharahh": "atharah", "atthara": "atharah",
  "unnis": "unnees", "unis": "unnees", "unees": "unnees", "unnish": "unnees", "unish": "unnees", "unneesh": "unnees",
  "bis": "bees", "biss": "bees", "beesh": "bees", "bish": "bees", "biis": "bees", "beez": "bees",
  "ikkis": "ikkees", "ikis": "ikkees", "ikees": "ikkees", "ikkies": "ikkees", "ikees": "ikkees", "ikkeesh": "ikkees",
  "bais": "bais", "baais": "bais", "baes": "bais", "bais": "bais", "baish": "bais", "baeis": "bais",
  "teis": "teis", "teiss": "teis", "teees": "teis", "tees": "teis", "teish": "teis", "teiis": "teis",
  "chaubis": "chaubees", "chobees": "chaubees", "chobeas": "chaubees", "chaubes": "chaubees", "chaubeesh": "chaubees",
  "pachis": "pachees", "pacheas": "pachees", "paches": "pachees", "pachesh": "pachees", "pacchis": "pachees", "pachhis": "pachees", "pacheesh": "pachees",
  "chabis": "chhabees", "chhabis": "chhabees", "chabeas": "chhabees", "chabes": "chhabees", "chhabeesh": "chhabees",
  "satais": "sattais", "sattaes": "sattais", "sataes": "sattais", "sattaish": "sattais", "sattaiis": "sattais",
  "athaais": "athais", "athes": "athais", "athaes": "athais", "atheis": "athais", "athaish": "athais",
  "untis": "untees", "unteas": "untees", "unties": "untees", "untish": "untees", "unteesh": "untees",
  "tis": "tees", "tiis": "tees", "teesh": "tees", "tiss": "tees", "tiish": "tees",
  "ikatis": "ikattis", "ikattees": "ikattis", "ikatis": "ikattis", "iktis": "ikattis", "ikattish": "ikattis", "ekattis": "ikattis", "ekattish": "ikattis", "ektees": "ikattis", "ekattees": "ikattis", "ekattish": "ikattis",
  "batiss": "battis", "battees": "battis", "batis": "battis", "battish": "battis", "batteesh": "battis",
  "teintis": "taintis", "taintiss": "taintis", "taintis": "taintis", "taintees": "taintis", "taintish": "taintis",
  "chauntiss": "chauntis", "chautis": "chauntis", "chauntes": "chauntis", "chontis": "chauntis", "chauntish": "chauntis",
  "paitiss": "paitis", "paitees": "paitis", "paitas": "paitis", "paetis": "paitis", "paitish": "paitis",
  "chhatis": "chhattis", "chhatees": "chhattis", "chhatis": "chhattis", "chhattish": "chhattis", "chhatteesh": "chhattis",
  "saintis": "saintees", "saitees": "saintees", "saintes": "saintees", "saintis": "saintees", "sainteesh": "saintees",
  "adtis": "adhtis", "adhthis": "adhtis", "adhtes": "adhtis", "adtis": "adhtis", "adhtish": "adhtis",
  "untaalis": "untalis", "untlis": "untalis", "untales": "untalis", "untalish": "untalis", "untaalees": "untalis",
  "chalis": "chalees", "chaleas": "chalees", "chales": "chalees", "chalish": "chalees", "chaleesh": "chalees",
  "iktalees": "iktalis", "iktalis": "iktalis", "iktales": "iktalis", "iktalish": "iktalis", "iktaleesh": "iktalis",
  "bayaalis": "bayalis", "baylis": "bayalis", "bayales": "bayalis", "bayalish": "bayalis", "bayaalees": "bayalis",
  "tetaalis": "tetalis", "tetlis": "tetalis", "tetales": "tetalis", "tetalish": "tetalis", "tetaalees": "tetalis",
  "chauntalees": "chauntalis", "chautalis": "chauntalis", "chauntales": "chauntalis", "chontalis": "chauntalis", "chauntalish": "chauntalis",
  "paintalees": "paintalis", "paintlis": "paintalis", "paintales": "paintalis", "paentalis": "paintalis", "paintalish": "paintalis",
  "chiyalees": "chiyalis", "chiylis": "chiyalis", "chiyales": "chiyalis", "chiyalish": "chiyalis", "chiyaalees": "chiyalis",
  "saitaalis": "saitalis", "saitlis": "saitalis", "saitales": "saitalis", "saitalish": "saitalis", "saitaalees": "saitalis",
  "adtaalis": "adtalis", "adtalis": "adtalis", "adtales": "adtalis", "adtalish": "adtalis", "adtaalees": "adtalis",
  "unchas": "unchaas", "unchaas": "unchaas", "unchass": "unchaas", "unchaash": "unchaas", "unchass": "unchaas",
  "pachas": "pachaas", "pachaas": "pachaas", "pachaas": "pachaas", "pachaas": "pachaas", "pachass": "pachaas", "pachaz": "pachaas", "pahaas": "pachaas", "pachas_": "pachaas", "pachhas": "pachaas", "pachhass": "pachaas",
  "ikyavan": "ikyaavan", "ikyawan": "ikyaavan", "ikyavan": "ikyaavan", "ikyawan": "ikyaavan", "ikyaavann": "ikyaavan",
  "bawaann": "bawan", "bavan": "bawan", "bwan": "bawan", "bawaann": "bawan", "bavann": "bawan",
  "tirpaan": "tirpan", "tirpan": "tirpan", "tirpan": "tirpan", "tirpaan": "tirpan", "tirpann": "tirpan",
  "chovan": "chauvan", "chovaan": "chauvan", "chauvan": "chauvan", "chuvan": "chauvan", "chauvann": "chauvan",
  "pachpaan": "pachpan", "pachpan": "pachpan", "pachpan": "pachpan", "pachpaan": "pachpan", "pachpann": "pachpan",
  "chappan": "chhappan", "chhapan": "chhappan", "chapan": "chhappan", "chappan": "chhappan", "chhappann": "chhappan",
  "satavan": "sattavan", "sattawan": "sattavan", "satwan": "sattavan", "satavan": "sattavan", "sattavann": "sattavan",
  "athvan": "athavan", "athawan": "athavan", "athvan": "athavan", "athavan": "athavan", "athavann": "athavan",
  "unsaat": "unsath", "unsathh": "unsath", "unsat": "unsath", "unsath": "unsath", "unsaath": "unsath",
  "sath": "saath", "saathh": "saath", "sathh": "saath", "saat": "saath", "saath": "saath", "saathh": "saath", "saath": "saath",
  "iksath": "iksaath", "iksaat": "iksaath", "iksathh": "iksaath", "iksaath": "iksaath", "iksaathh": "iksaath",
  "basath": "basaath", "basaathh": "basaath", "basat": "basaath", "basaath": "basaath", "basaathh": "basaath",
  "tirsaat": "tirsath", "tirsathh": "tirsath", "tirsat": "tirsath", "tirsath": "tirsath", "tirsaath": "tirsath",
  "chosath": "chausath", "chausaat": "chausath", "chausathh": "chausath", "chusath": "chausath", "chausaath": "chausath",
  "paensath": "painsath", "painsaat": "painsath", "painsathh": "painsath", "pensath": "painsath", "painsaath": "painsath",
  "chhiyasath": "chhiyaasath", "chiyasath": "chhiyaasath", "chiyasat": "chhiyaasath", "chhiyaasath": "chhiyaasath", "chhiyasaath": "chhiyaasath",
  "sadsath": "sadsath", "sadsathh": "sadsath", "sadsat": "sadsath", "sadsath": "sadsath", "sadsathh": "sadsath",
  "adsath": "adsath", "adsathh": "adsath", "adsat": "adsath", "adsath": "adsath", "adsaath": "adsath",
  "unsatar": "unsattar", "unsattarr": "unsattar", "unsatar": "unsattar", "unsattar": "unsattar", "unsattarr": "unsattar", "unhattar": "unsattar",
  "satar": "sattar", "sattarr": "sattar", "satarr": "sattar", "sattar": "sattar", "sattarr": "sattar",
  "ikhatar": "ikhattar", "ikhattarr": "ikhattar", "ikhtar": "ikhattar", "ikhattar": "ikhattar", "ikhattarr": "ikhattar",
  "bahatar": "bahattar", "bahattarr": "bahattar", "bhattar": "bahattar", "bahattar": "bahattar", "bahattarr": "bahattar",
  "tihatar": "tihattar", "tihattarr": "tihattar", "tihatar": "tihattar", "tihattar": "tihattar", "tihattarr": "tihattar",
  "chauhatar": "chauhattar", "chohattar": "chauhattar", "chauhatar": "chauhattar", "chauhattar": "chauhattar", "chauhattarr": "chauhattar",
  "pachhatar": "pachhattar", "pachhattarr": "pachhattar", "pachhatar": "pachhattar", "pachhattar": "pachhattar", "pachhattarr": "pachhattar",
  "chhihatar": "chhihattar", "chhihattarr": "chhihattar", "chhihatar": "chhihattar", "chhihattar": "chhihattar", "chhihattarr": "chhihattar",
  "sattatar": "sattattar", "sattattarr": "sattattar", "sattatar": "sattattar", "sattattar": "sattattar", "sattattarr": "sattattar",
  "athhatar": "athhattar", "athhattarr": "athhattar", "athhatar": "athhattar", "athhattar": "athhattar", "athhattarr": "athhattar",
  "unaasi": "unasi", "unasi": "unasi", "unassi": "unasi", "unasi": "unasi", "unaasi": "unasi",
  "asi": "assi", "aasi": "assi", "asse": "assi", "assi": "assi", "assih": "assi",
  "ikyasi": "ikyaasi", "ikyaasi": "ikyaasi", "ikyassi": "ikyaasi", "ikyasi": "ikyaasi", "ikyaasi": "ikyaasi",
  "bayasi": "bayaasi", "bayaasi": "bayaasi", "bayassi": "bayaasi", "bayasi": "bayaasi", "bayaasi": "bayaasi",
  "tirasi": "tiraasi", "tiraasi": "tiraasi", "tirassi": "tiraasi", "tirasi": "tiraasi", "tiraasi": "tiraasi",
  "chorasi": "chaurasi", "chaurassi": "chaurasi", "chaurasi": "chaurasi", "chorasi": "chaurasi", "chaurasi": "chaurasi",
  "pachassi": "pachasi", "pachasi": "pachasi", "pachasi": "pachasi", "pachasi": "pachasi", "pachasih": "pachasi",
  "chhiyasi": "chhiyaasi", "chiyasi": "chhiyaasi", "chiyasi": "chhiyaasi", "chhiyaasi": "chhiyaasi", "chhiyasih": "chhiyaasi",
  "satasi": "sattasi", "sattassi": "sattasi", "satasi": "sattasi", "sattasi": "sattasi", "sattasih": "sattasi",
  "athassi": "athasi", "athasi": "athasi", "athasi": "athasi", "athasi": "athasi", "athasih": "athasi",
  "nawasi": "navasi", "navassi": "navasi", "navasi": "navasi", "nawasi": "navasi", "navasih": "navasi",
  "nabe": "nabbe", "nabbe": "nabbe", "nabbee": "nabbe", "nabe": "nabbe", "nabbeh": "nabbe",
  "ikyanve": "ikyanave", "ikyanave": "ikyanave", "ikyanwe": "ikyanave", "ikyanave": "ikyanave", "ikyanaveh": "ikyanave",
  "bayanve": "bayanave", "bayanave": "bayanave", "bayanwe": "bayanave", "bayanave": "bayanave", "bayanaveh": "bayanave",
  "tiranve": "tiranave", "tiranave": "tiranave", "tiranwe": "tiranave", "tiranave": "tiranave", "tiranaveh": "tiranave",
  "chauranve": "chauranave", "chauranave": "chauranave", "chauranwe": "chauranave", "chauranave": "chauranave", "chauranaveh": "chauranave",
  "pachanve": "pachanave", "pachanave": "pachanave", "pachanwe": "pachanave", "pachanave": "pachanave", "pachanaveh": "pachanave",
  "chhiyanve": "chhiyanave", "chiyanave": "chhiyanave", "chiyanwe": "chhiyanave", "chhiyanave": "chhiyanave", "chhiyanaveh": "chhiyanave",
  "sattanve": "sattanave", "sattanave": "sattanave", "sattanwe": "sattanave", "sattanave": "sattanave", "sattanaveh": "sattanave",
  "athanve": "athanave", "athanave": "athanave", "athanwe": "athanave", "athanave": "athanave", "athanaveh": "athanave",
  "ninyanve": "ninyanave", "ninyanave": "ninyanave", "ninyanwe": "ninyanave", "ninyanave": "ninyanave", "ninyanaveh": "ninyanave",
  "soo": "sau", "sao": "sau", "sauu": "sau", "sau": "sau", "sauh": "sau",

  // Multipliers (more)
  "hazarr": "hazaar", "hajar": "hazaar", "hajaar": "hazaar", "hazaaar": "hazaar", "hazar": "hazaar", "hjaar": "hazaar", "hazarr": "hazaar", "hazr": "hazaar",
  "lac": "lakh", "laakh": "lakh", "lak": "lakh", "lakk": "lakh", "lacs": "lakh", "lakhs": "lakh",
  "karod": "crore", "caror": "crore", "karor": "crore", "krod": "crore", "crore_": "crore", "crores": "crore", "carore": "crore",

  // Fractions (more)
  "dhed": "dedh", "dedha": "dedh", "dedhe": "dedh", "dhedh": "dedh", "dhedd": "dedh",
  "aadh": "aadha", "adha": "aadha", "aaadha": "aadha", "aaddha": "aadha",
  "savaa": "sawa", "sawaa": "sawa", "sava": "sawa",
  "dhaii": "dhai", "dhaai": "dhai", "dhaei": "dhai",

  // Old canonical mappings (keep for backward compatibility)
  "baarah": "barah", "baes": "bais", "iktees": "ikattis", "battees": "battis", "taintees": "taintis", "chauntees": "chauntis",
  "paintees": "paitis", "chhatees": "chhattis", "artees": "adhtis", "untaalees": "untalis",
  "chaalees": "chalees", "iktaalees": "iktalis", "bayaalees": "bayalis", "taintaalees": "tetalis", "chauvaalees": "chauntalis",
  "paintaalees": "paintalis", "chhiyaalees": "chiyalis", "saintaalees": "saitalis", "adtaalees": "adtalis",
  "baavan": "bawan", "sattaavan": "sattavan", "athaavan": "athavan",
  "iksath": "iksaath", "baasath": "basaath", "chaunsath": "chausath", "chhiyasath": "chhiyaasath", "unhattar": "unsattar",
  "pachattar": "pachhattar", "sathattar": "sattattar",
  "chauraasi": "chaurasi", "pachaasi": "pachasi", "sataasi": "sattasi", "athaasi": "athasi", "navaasi": "navasi",
  "ikyaanbe": "ikyanave", "baanbe": "bayanave", "tiraanbe": "tiranave", "chauraanbe": "chauranave",
  "pachaanbe": "pachanave", "chhiyaanbe": "chhiyanave", "sataanbe": "sattanave", "athanbe": "athanave", "ninaanbe": "ninyanave",
  // 2 - do
  dho: "do", du: "do", tho: "do",
  // 3 - teen
  tin: "teen", tean: "teen", tiin: "teen", tenn: "teen",
  // 4 - chaar
  char: "chaar", caar: "chaar", car: "chaar", chhar: "chaar",
  // 5 - paanch
  panch: "paanch", paach: "paanch", panchh: "paanch", paanc: "paanch",
  // 6 - chhe
  che: "chhe", chhey: "chhe", shey: "chhe", ch: "chhe",
  // 7 - saat
  sat: "saat", saath: "saat", saatth: "saat", sath: "saat",
  // 8 - aath
  ath: "aath", aat: "aath", aathh: "aath", at: "aath",
  // 9 - nau
  nav: "nau", nao: "nau", nou: "nau", naw: "nau",
  // 10 - das
  daas: "das", daz: "das",

  // 11 - gyarah
  gyaarah: "gyarah", gyara: "gyarah", gera: "gyarah", gyrah: "gyarah",
  // 12 - barah
  baarah: "barah", bara: "barah", barha: "barah", brha: "barah", // old canonical
  // 13 - terah
  tera: "terah", teerah: "terah", teraa: "terah",
  // 14 - chaudah
  chauda: "chaudah", choda: "chaudah", choudah: "chaudah", choda: "chaudah",
  // 15 - pandrah
  pandra: "pandrah", pandhra: "pandrah", pandraah: "pandrah", pdrah: "pandrah",
  // 16 - solah
  sola: "solah", solaa: "solah", sohla: "solah", solaah: "solah",
  // 17 - satrah
  satra: "satrah", satraah: "satrah", satrahh: "satrah", sathra: "satrah",
  // 18 - atharah
  athra: "atharah", athraah: "atharah", atharahh: "atharah", atthara: "atharah",
  // 19 - unnees
  unis: "unnees", unees: "unnees", unniss: "unnees", unnis: "unnees",

  // 20 - bees
  bis: "bees", beas: "bees", bies: "bees",
  // 21 - ikkees
  ikkis: "ikkees", ikees: "ikkees", ikkies: "ikkees", ikees: "ikkees",
  // 22 - bais
  baais: "bais", baes: "bais", bais: "bais", // old baees
  // 23 - teis
  tees: "teis", teiss: "teis", teees: "teis", tees: "teis",
  // 24 - chaubees
  chaubis: "chaubees", chobees: "chaubees", chobeas: "chaubees", chaubes: "chaubees",
  // 25 - pachees (confusion with pachaas)
  pachis: "pachees", pacheas: "pachees", paches: "pachees", pachees: "pachees", pacheess: "pachees", pachis: "pachees", pachesh: "pachees", pacchis: "pachees", pachhis: "pachees",
  // 26 - chhabees
  chabees: "chhabees", chhabis: "chhabees", chabeas: "chhabees", chabes: "chhabees",
  // 27 - sattais
  satais: "sattais", sattaes: "sattais", sataes: "sattais", sattais: "sattais",
  // 28 - athais
  athaais: "athais", athes: "athais", athaes: "athais", atheis: "athais",
  // 29 - untees
  untis: "untees", unteas: "untees", unties: "untees", untis: "untees",

  // 30 - tees
  tis: "tees", teees: "tees", tees: "tees", tis: "tees",
  // 31 - ikattis
  ikatis: "ikattis", ikattees: "ikattis", ikatis: "ikattis", iktis: "ikattis", ekkatis: "ikattis",
  // 32 - battis
  batiss: "battis", battees: "battis", batis: "battis", battis: "battis",
  // 33 - taintis
  teintis: "taintis", taintiss: "taintis", taintis: "taintis", taintees: "taintis",
  // 34 - chauntis
  chauntiss: "chauntis", chautis: "chauntis", chauntes: "chauntis", chontis: "chauntis",
  // 35 - paitis
  paitiss: "paitis", paitees: "paitis", paitas: "paitis", paetis: "paitis",
  // 36 - chhattis
  chhatis: "chhattis", chhatees: "chhattis", chhatis: "chhattis", chhattis: "chhattis",
  // 37 - saintees
  saintis: "saintees", saitees: "saintees", saintes: "saintees", saintis: "saintees",
  // 38 - adhtis
  adtis: "adhtis", adhthis: "adhtis", adhtes: "adhtis", adtis: "adhtis",
  // 39 - untalis
  untaalis: "untalis", untlis: "untalis", untales: "untalis", untalis: "untalis",

  // 40 - chalees
  chalis: "chalees", chaleas: "chalees", chales: "chalees", chalis: "chalees",
  // 41 - iktalis
  iktalees: "iktalis", iktalis: "iktalis", iktales: "iktalis", iktalis: "iktalis",
  // 42 - bayalis
  bayaalis: "bayalis", baylis: "bayalis", bayales: "bayalis", bayalis: "bayalis",
  // 43 - tetalis
  tetaalis: "tetalis", tetlis: "tetalis", tetales: "tetalis", tetalis: "tetalis",
  // 44 - chauntalis
  chauntalees: "chauntalis", chautalis: "chauntalis", chauntales: "chauntalis", chontalis: "chauntalis",
  // 45 - paintalis
  paintalees: "paintalis", paintlis: "paintalis", paintales: "paintalis", paentalis: "paintalis",
  // 46 - chiyalis
  chiyalees: "chiyalis", chiylis: "chiyalis", chiyales: "chiyalis", chiyalis: "chiyalis",
  // 47 - saitalis
  saitaalis: "saitalis", saitlis: "saitalis", saitales: "saitalis", saitalis: "saitalis",
  // 48 - adtalis
  adtaalis: "adtalis", adtalis: "adtalis", adtales: "adtalis", adtalis: "adtalis",
  // 49 - unchaas
  unchas: "unchaas", unchaas: "unchaas", unchass: "unchaas", unchas: "unchaas",

  // 50 - pachaas (confusion with pachees)
  pachas: "pachaas", pachaas: "pachaas", pachaas: "pachaas", pachaas: "pachaas", pachass: "pachaas", pachaz: "pachaas", pahaas: "pachaas", pachas_: "pachaas", pachhas: "pachaas", pachhass: "pachaas",
  // 51 - ikyaavan
  ikyavan: "ikyaavan", ikyawan: "ikyaavan", ikyavan: "ikyaavan", ikyawan: "ikyaavan",
  // 52 - bawan
  bawaan: "bawan", bavan: "bawan", bwan: "bawan", bawaan: "bawan",
  // 53 - tirpan
  tirpaan: "tirpan", tirpan: "tirpan", tirpan: "tirpan", tirpaan: "tirpan",
  // 54 - chauvan
  chovan: "chauvan", chovaan: "chauvan", chauvan: "chauvan", chuvan: "chauvan",
  // 55 - pachpan
  pachpaan: "pachpan", pachpan: "pachpan", pachpan: "pachpan", pachpaan: "pachpan",
  // 56 - chhappan
  chappan: "chhappan", chhapan: "chhappan", chapan: "chhappan", chappan: "chhappan",
  // 57 - sattavan
  satavan: "sattavan", sattawan: "sattavan", satwan: "sattavan", satavan: "sattavan",
  // 58 - athavan
  athvan: "athavan", athawan: "athavan", athvan: "athavan", athavan: "athavan",
  // 59 - unsath
  unsaat: "unsath", unsathh: "unsath", unsat: "unsath", unsath: "unsath",

  // 60 - saath
  sath: "saath", saathh: "saath", sathh: "saath", saat: "saath",
  // 61 - iksaath
  iksath: "iksaath", iksaat: "iksaath", iksathh: "iksaath", iksaath: "iksaath",
  // 62 - basaath
  basath: "basaath", basaathh: "basaath", basat: "basaath", basaath: "basaath",
  // 63 - tirsath
  tirsaat: "tirsath", tirsathh: "tirsath", tirsat: "tirsath", tirsath: "tirsath",
  // 64 - chausath
  chosath: "chausath", chausaat: "chausath", chausathh: "chausath", chusath: "chausath",
  // 65 - painsath
  paensath: "painsath", painsaat: "painsath", painsathh: "painsath", pensath: "painsath",
  // 66 - chhiyaasath
  chhiyasath: "chhiyaasath", chiyasath: "chhiyaasath", chiyasat: "chhiyaasath", chhiyaasath: "chhiyaasath",
  // 67 - sadsath
  sadsaat: "sadsath", sadsathh: "sadsath", sadsat: "sadsath", sadsath: "sadsath",
  // 68 - adsath
  adsaat: "adsath", adsathh: "adsath", adsat: "adsath", adsath: "adsath",
  // 69 - unsattar
  unsatar: "unsattar", unsattarr: "unsattar", unsatar: "unsattar", unsattar: "unsattar",

  // 70 - sattar
  satar: "sattar", sattarr: "sattar", satarr: "sattar", sattar: "sattar",
  // 71 - ikhattar
  ikhatar: "ikhattar", ikhattarr: "ikhattar", ikhtar: "ikhattar", ikhattar: "ikhattar",
  // 72 - bahattar
  bahatar: "bahattar", bahattarr: "bahattar", bhattar: "bahattar", bahattar: "bahattar",
  // 73 - tihattar
  tihatar: "tihattar", tihattarr: "tihattar", tihatar: "tihattar", tihattar: "tihattar",
  // 74 - chauhattar
  chauhatar: "chauhattar", chohattar: "chauhattar", chauhatar: "chauhattar", chauhattar: "chauhattar",
  // 75 - pachhattar
  pachhatar: "pachhattar", pachhattarr: "pachhattar", pachhatar: "pachhattar", pachhattar: "pachhattar",
  // 76 - chhihattar
  chhihatar: "chhihattar", chhihattarr: "chhihattar", chhihatar: "chhihattar", chhihattar: "chhihattar",
  // 77 - sattattar
  sattatar: "sattattar", sattattarr: "sattattar", sattatar: "sattattar", sattattar: "sattattar",
  // 78 - athhattar
  athhatar: "athhattar", athhattarr: "athhattar", athhatar: "athhattar", athhattar: "athhattar",
  // 79 - unasi
  unaasi: "unasi", unasi: "unasi", unassi: "unasi", unasi: "unasi",

  // 80 - assi
  asi: "assi", aasi: "assi", asse: "assi", assi: "assi",
  // 81 - ikyaasi
  ikyasi: "ikyaasi", ikyaasi: "ikyaasi", ikyassi: "ikyaasi", ikyasi: "ikyaasi",
  // 82 - bayaasi
  bayasi: "bayaasi", bayaasi: "bayaasi", bayassi: "bayaasi", bayasi: "bayaasi",
  // 83 - tiraasi
  tirasi: "tiraasi", tiraasi: "tiraasi", tirassi: "tiraasi", tirasi: "tiraasi",
  // 84 - chaurasi
  chorasi: "chaurasi", chaurassi: "chaurasi", chaurasi: "chaurasi", chorasi: "chaurasi",
  // 85 - pachasi
  pachassi: "pachasi", pachasi: "pachasi", pachasi: "pachasi", pachasi: "pachasi",
  // 86 - chhiyaasi
  chhiyasi: "chhiyaasi", chiyasi: "chhiyaasi", chiyasi: "chhiyaasi", chhiyaasi: "chhiyaasi",
  // 87 - sattasi
  satasi: "sattasi", sattassi: "sattasi", satasi: "sattasi", sattasi: "sattasi",
  // 88 - athasi
  athassi: "athasi", athasi: "athasi", athasi: "athasi", athasi: "athasi",
  // 89 - navasi
  nawasi: "navasi", navassi: "navasi", navasi: "navasi", nawasi: "navasi",

  // 90 - nabbe
  nabe: "nabbe", nabbe: "nabbe", nabbee: "nabbe", nabe: "nabbe",
  // 91 - ikyanave
  ikyanve: "ikyanave", ikyanave: "ikyanave", ikyanwe: "ikyanave", ikyanave: "ikyanave",
  // 92 - bayanave
  bayanve: "bayanave", bayanave: "bayanave", bayanwe: "bayanave", bayanave: "bayanave",
  // 93 - tiranave
  tiranve: "tiranave", tiranave: "tiranave", tiranwe: "tiranave", tiranave: "tiranave",
  // 94 - chauranave
  chauranve: "chauranave", chauranave: "chauranave", chauranwe: "chauranave", chauranave: "chauranave",
  // 95 - pachanave
  pachanve: "pachanave", pachanave: "pachanave", pachanwe: "pachanave", pachanave: "pachanave",
  // 96 - chhiyanave
  chhiyanve: "chhiyanave", chiyanave: "chhiyanave", chiyanwe: "chhiyanave", chhiyanave: "chhiyanave",
  // 97 - sattanave
  sattanve: "sattanave", sattanave: "sattanave", sattanwe: "sattanave", sattanave: "sattanave",
  // 98 - athanave
  athanve: "athanave", athanave: "athanave", athanwe: "athanave", athanave: "athanave",
  // 99 - ninyanave
  ninyanve: "ninyanave", ninyanave: "ninyanave", ninyanwe: "ninyanave", ninyanave: "ninyanave",

  // 100 - sau
  soo: "sau", sao: "sau", sauu: "sau", sau: "sau",

  // Multipliers
  hazar: "hazaar", hajar: "hazaar", hajaar: "hazaar", hazaaar: "hazaar",
  hzar: "hazaar", hjaar: "hazaar", hazarr: "hazaar", hazr: "hazaar",
  lac: "lakh", laakh: "lakh", lak: "lakh", lakk: "lakh", lacs: "lakh", lakhs: "lakh",
  karod: "crore", caror: "crore", karor: "crore", krod: "crore",
  crore_: "crore", crores: "crore", carore: "crore",

  // Fractions
  dhed: "dedh", dedha: "dedh", dedhe: "dedh", dhedh: "dedh",
  aadh: "aadha", adha: "aadha", aaadha: "aadha",
  savaa: "sawa", sawaa: "sawa",
  dhaii: "dhai", dhaai: "dhai",

  // Old canonical mappings
  baarah: "barah", baees: "bais", iktees: "ikattis", battees: "battis", taintees: "taintis", chauntees: "chauntis",
  paintees: "paitis", chhatees: "chhattis", artees: "adhtis", untaalees: "untalis",
  chaalees: "chalees", iktaalees: "iktalis", bayaalees: "bayalis", taintaalees: "tetalis", chauvaalees: "chauntalis",
  paintaalees: "paintalis", chhiyaalees: "chiyalis", saintaalees: "saitalis", adtaalees: "adtalis",
  baavan: "bawan", sattaavan: "sattavan", athaavan: "athavan",
  iksath: "iksaath", baasath: "basaath", chaunsath: "chausath", chhiyasath: "chhiyaasath", unhattar: "unsattar",
  pachattar: "pachhattar", sathattar: "sattattar",
  chauraasi: "chaurasi", pachaasi: "pachasi", sataasi: "sattasi", athaasi: "athasi", navaasi: "navasi",
  ikyaanbe: "ikyanave", baanbe: "bayanave", tiraanbe: "tiranave", chauraanbe: "chauranave",
  pachaanbe: "pachanave", chhiyaanbe: "chhiyanave", sataanbe: "sattanave", athaanbe: "athanave", ninaanbe: "ninyanave",
};

// ── Levenshtein distance ──
function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

// ── Smarter fuzzy matching ──
// Max edit distance scales with word length:
//   len ≤ 3 → max 1, len 4-5 → max 1, len 6+ → max 2
// Ties broken by: same first letter > shorter dict word > alphabetical
function maxEditDist(wordLen: number): number {
  if (wordLen <= 5) return 1;
  return 2;
}

type TokenType = "number" | "multiplier" | "fraction" | "and" | "unknown";
interface Token {
  original: string;
  matched: string;
  type: TokenType;
  value: number;
  corrected: boolean;
}

// Precompute lookup table once
const ALL_WORDS: { word: string; type: TokenType; value: number }[] = [
  ...Object.entries(UNITS).map(([k, v]) => ({ word: k, type: "number" as TokenType, value: v })),
  ...Object.entries(MULTIPLIERS).map(([k, v]) => ({ word: k, type: "multiplier" as TokenType, value: v })),
  ...Object.entries(FRACTIONS).map(([k, v]) => ({ word: k, type: "fraction" as TokenType, value: v })),
];

function fuzzyMatch(word: string): Token | null {
  const lower = word.toLowerCase().replace(/[_\-]/g, "").trim();
  if (!lower) return null;

  // 1. Direct numeric
  const num = Number(lower);
  if (!isNaN(num) && lower !== "") {
    return { original: word, matched: lower, type: "number", value: num, corrected: false };
  }

  // 2. Exact misspelling lookup
  if (MISSPELLINGS[lower]) {
    const corrected = MISSPELLINGS[lower];
    if (corrected === "_and_") return { original: word, matched: "aur", type: "and", value: 0, corrected: true };
    if (UNITS[corrected]) return { original: word, matched: corrected, type: "number", value: UNITS[corrected], corrected: true };
    if (MULTIPLIERS[corrected]) return { original: word, matched: corrected, type: "multiplier", value: MULTIPLIERS[corrected], corrected: true };
    if (FRACTIONS[corrected]) return { original: word, matched: corrected, type: "fraction", value: FRACTIONS[corrected], corrected: true };
  }

  // 3. Direct dictionary lookup
  if (lower === "aur" || lower === "and" || lower === "or") {
    return { original: word, matched: "aur", type: "and", value: 0, corrected: false };
  }
  if (UNITS[lower]) return { original: word, matched: lower, type: "number", value: UNITS[lower], corrected: false };
  if (MULTIPLIERS[lower]) return { original: word, matched: lower, type: "multiplier", value: MULTIPLIERS[lower], corrected: false };
  if (FRACTIONS[lower]) return { original: word, matched: lower, type: "fraction", value: FRACTIONS[lower], corrected: false };

  // 4. Smart fuzzy match with scaled edit distance
  const maxDist = maxEditDist(lower.length);
  const candidates: { word: string; type: TokenType; value: number; dist: number; sameFirst: boolean }[] = [];

  for (const entry of ALL_WORDS) {
    // Quick length filter: if lengths differ by more than maxDist, skip
    if (Math.abs(lower.length - entry.word.length) > maxDist) continue;

    const dist = editDistance(lower, entry.word);
    if (dist <= maxDist && dist > 0) {
      candidates.push({
        ...entry,
        dist,
        sameFirst: lower[0] === entry.word[0],
      });
    }
  }

  if (candidates.length === 0) return null;

  // Sort: lowest dist → same first letter → shorter word
  candidates.sort((a, b) => {
    if (a.dist !== b.dist) return a.dist - b.dist;
    if (a.sameFirst !== b.sameFirst) return a.sameFirst ? -1 : 1;
    if (a.word.length !== b.word.length) return a.word.length - b.word.length;
    return a.word.localeCompare(b.word);
  });

  const best = candidates[0];
  return { original: word, matched: best.word, type: best.type, value: best.value, corrected: true };
}

// ── Grammar evaluator ──
// Handles: crore > lakh > hazaar > sau precedence
// "ek lakh bees hazaar teen sau pachaas" → 1,20,350
function evaluate(tokens: Token[]): number {
  const meaningful = tokens.filter(t => t.type !== "and");
  if (meaningful.length === 0) return 0;

  let total = 0;
  let current = 0;
  let hasFraction = false;
  let fractionValue = 0;

  for (let i = 0; i < meaningful.length; i++) {
    const token = meaningful[i];

    if (token.type === "fraction") {
      hasFraction = true;
      fractionValue = token.value;
      // If next is multiplier, apply fraction to it
      if (i + 1 < meaningful.length && meaningful[i + 1].type === "multiplier") {
        const mult = meaningful[i + 1].value;
        current += fractionValue * mult;
        i++;
        hasFraction = false;
      }
    } else if (token.type === "number") {
      current += token.value;
    } else if (token.type === "multiplier") {
      if (current === 0) current = 1;
      if (token.value >= 100000) {
        total += current * token.value;
        current = 0;
      } else {
        current = current * token.value;
      }
    }
  }

  if (hasFraction && current === 0 && total === 0) {
    return fractionValue;
  }

  total += current;
  return total;
}

// ── Public API ──

export interface ParseResult {
  amount: number;
  formatted: string;
  corrected: boolean;
  corrections: string[];
  valid: boolean;
  tokens: Token[];
}

export function formatIndian(num: number): string {
  if (num === 0) return "₹0";
  const isDecimal = num % 1 !== 0;
  const intPart = Math.floor(num);
  const str = intPart.toString();

  let formatted: string;
  if (str.length <= 3) {
    formatted = str;
  } else {
    const last3 = str.slice(-3);
    let rest = str.slice(0, -3);
    const groups: string[] = [];
    while (rest.length > 2) {
      groups.unshift(rest.slice(-2));
      rest = rest.slice(0, -2);
    }
    if (rest) groups.unshift(rest);
    formatted = groups.join(",") + "," + last3;
  }

  if (isDecimal) {
    const decimal = (num % 1).toFixed(2).slice(2);
    return `₹${formatted}.${decimal}`;
  }
  return `₹${formatted}`;
}

export function parseHindiNumber(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { amount: 0, formatted: "---", corrected: false, corrections: [], valid: false, tokens: [] };
  }

  // Pure numeric (with optional commas)
  const pureNum = Number(trimmed.replace(/,/g, ""));
  if (!isNaN(pureNum) && trimmed.replace(/,/g, "") !== "") {
    return {
      amount: pureNum,
      formatted: formatIndian(pureNum),
      corrected: false,
      corrections: [],
      valid: true,
      tokens: [],
    };
  }

  // Tokenize
  const words = trimmed.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const tokens: Token[] = [];
  const corrections: string[] = [];

  for (const word of words) {
    // Pure number embedded in text
    const num = Number(word);
    if (!isNaN(num) && word !== "") {
      tokens.push({ original: word, matched: word, type: "number", value: num, corrected: false });
      continue;
    }

    const token = fuzzyMatch(word);
    if (token) {
      tokens.push(token);
      if (token.corrected) {
        corrections.push(`"${word}" → "${token.matched}"`);
      }
    }
    // Unknown words are silently skipped (e.g., "rupees", "rupay")
  }

  if (tokens.filter(t => t.type !== "and").length === 0) {
    return { amount: 0, formatted: "---", corrected: false, corrections, valid: false, tokens };
  }

  const amount = evaluate(tokens);
  return {
    amount,
    formatted: formatIndian(amount),
    corrected: corrections.length > 0,
    corrections,
    valid: amount > 0,
    tokens,
  };
}
