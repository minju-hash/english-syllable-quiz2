const BATCH_SIZE = 10;
const STORAGE_KEY = "englishSyllableQuizHistoryV1";
const STORAGE_VERSION = 1;
const PRONUNCIATION_STORAGE_KEY = "englishSyllableQuizPronunciationV1";
const PRONUNCIATION_STORAGE_VERSION = 1;
const DICTIONARY_API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const GOOGLE_TTS_BASE = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=";

const conceptLessons = [
  {
    key: "silentE",
    order: 1,
    label: "추천 순서 1",
    title: "묵음 e",
    description: "소리 나지 않는 e",
    points: [
      "끝의 e는 보통 소리 나지 않아요.",
      "하지만 e가 보여도 항상 1음절은 아니에요.",
    ],
    examples: ["make", "name", "inside", "complete"],
  },
  {
    key: "consonantLe",
    order: 2,
    label: "추천 순서 2",
    title: "자음 + le",
    description: "끝의 -le 음절",
    points: [
      "-ble, -tle, -ple, -cle처럼 끝의 -le을 살펴보세요.",
      "table은 ta / ble, little은 lit / tle로 나뉘어요.",
    ],
    examples: ["table", "little", "circle", "bicycle"],
  },
  {
    key: "ed",
    order: 3,
    label: "추천 순서 3",
    title: "-ed",
    description: "음절이 늘어나는 경우",
    points: [
      "wanted, needed처럼 /id/로 들리면 음절이 하나 늘어요.",
      "jumped, baked처럼 끝소리만 바뀌면 음절 수는 그대로예요.",
    ],
    examples: ["jumped", "wanted", "painted", "created"],
  },
  {
    key: "es",
    order: 4,
    label: "추천 순서 4",
    title: "-es / -s",
    description: "추가 음절 구분",
    points: [
      "boxes, dishes처럼 /iz/가 들리면 음절이 하나 늘어요.",
      "cakes, books처럼 소리만 붙으면 음절 수는 그대로예요.",
    ],
    examples: ["cakes", "boxes", "wishes", "sentences"],
  },
  {
    key: "coreVocab",
    order: 5,
    label: "PDF 단어장",
    title: "필수 영단어 800",
    description: "PDF 단어장 기반 음절 퀴즈",
    points: [
      "업로드한 단어장에서 뽑은 단어로 단계별 문제를 만듭니다.",
      "새 문제를 받을 때 직전 세트 단어가 바로 반복되지 않도록 관리합니다.",
    ],
    examples: ["apple", "banana", "circle", "yesterday"],
  },
  {
    key: "all",
    order: 6,
    label: "종합 연습",
    title: "전체 규칙",
    description: "배운 규칙을 섞어서 연습",
    points: [
      "여러 규칙을 함께 보고 실제 읽기처럼 연습해 보세요.",
      "철자 길이보다 실제 발음의 박자를 먼저 생각해 보세요.",
    ],
    examples: ["make", "table", "wanted", "boxes"],
  },
];

const difficultyMeta = {
  1: {
    title: "1단계 기본",
    description: "규칙이 분명한 단어",
    badge: "1단계 기본",
  },
  2: {
    title: "2단계 비교",
    description: "헷갈리는 단어 포함",
    badge: "2단계 비교",
  },
  3: {
    title: "3단계 도전",
    description: "예외와 혼합 문제",
    badge: "3단계 도전",
  },
};

const embeddedPdfVocabulary =
  typeof pdfCoreVocabulary !== "undefined"
    ? pdfCoreVocabulary
    : Array.isArray(globalThis.pdfCoreVocabulary)
      ? globalThis.pdfCoreVocabulary
      : [];

const questionPools = {
  coreVocab: Array.isArray(embeddedPdfVocabulary) ? embeddedPdfVocabulary : [],
  silentE: [
    { id: "silent-make", word: "make", syllables: 1, split: "make", introduced: 1 },
    { id: "silent-name", word: "name", syllables: 1, split: "name", introduced: 1 },
    { id: "silent-cake", word: "cake", syllables: 1, split: "cake", introduced: 1 },
    { id: "silent-bike", word: "bike", syllables: 1, split: "bike", introduced: 1 },
    { id: "silent-home", word: "home", syllables: 1, split: "home", introduced: 1 },
    { id: "silent-game", word: "game", syllables: 1, split: "game", introduced: 1 },
    { id: "silent-smile", word: "smile", syllables: 1, split: "smile", introduced: 1 },
    { id: "silent-note", word: "note", syllables: 1, split: "note", introduced: 1 },
    { id: "silent-cube", word: "cube", syllables: 1, split: "cube", introduced: 1 },
    { id: "silent-grape", word: "grape", syllables: 1, split: "grape", introduced: 1 },
    { id: "silent-inside", word: "inside", syllables: 2, split: "in / side", introduced: 2 },
    { id: "silent-beside", word: "beside", syllables: 2, split: "be / side", introduced: 2 },
    { id: "silent-sunshine", word: "sunshine", syllables: 2, split: "sun / shine", introduced: 2 },
    { id: "silent-cupcake", word: "cupcake", syllables: 2, split: "cup / cake", introduced: 2 },
    { id: "silent-homework", word: "homework", syllables: 2, split: "home / work", introduced: 2 },
    { id: "silent-mistake", word: "mistake", syllables: 2, split: "mis / take", introduced: 2 },
    { id: "silent-became", word: "became", syllables: 2, split: "be / came", introduced: 2 },
    { id: "silent-invite", word: "invite", syllables: 2, split: "in / vite", introduced: 2 },
    { id: "silent-complete", word: "complete", syllables: 2, split: "com / plete", introduced: 3 },
    { id: "silent-decide", word: "decide", syllables: 2, split: "de / cide", introduced: 3 },
    { id: "silent-erase", word: "erase", syllables: 2, split: "e / rase", introduced: 3 },
    { id: "silent-prepare", word: "prepare", syllables: 2, split: "pre / pare", introduced: 3 },
    { id: "silent-celebrate", word: "celebrate", syllables: 3, split: "cel / e / brate", introduced: 3 },
    { id: "silent-decorate", word: "decorate", syllables: 3, split: "dec / o / rate", introduced: 3 },
    { id: "silent-lemonade", word: "lemonade", syllables: 3, split: "lem / on / ade", introduced: 3 },
    { id: "silent-duplicate", word: "duplicate", syllables: 3, split: "du / pli / cate", introduced: 3 },
    { id: "silent-activate", word: "activate", syllables: 3, split: "ac / ti / vate", introduced: 3 },
    { id: "silent-generate", word: "generate", syllables: 3, split: "gen / er / ate", introduced: 3 },
  ],
  consonantLe: [
    { id: "cle-table", word: "table", syllables: 2, split: "ta / ble", introduced: 1 },
    { id: "cle-little", word: "little", syllables: 2, split: "lit / tle", introduced: 1 },
    { id: "cle-apple", word: "apple", syllables: 2, split: "ap / ple", introduced: 1 },
    { id: "cle-candle", word: "candle", syllables: 2, split: "can / dle", introduced: 1 },
    { id: "cle-purple", word: "purple", syllables: 2, split: "pur / ple", introduced: 1 },
    { id: "cle-gentle", word: "gentle", syllables: 2, split: "gen / tle", introduced: 1 },
    { id: "cle-simple", word: "simple", syllables: 2, split: "sim / ple", introduced: 1 },
    { id: "cle-maple", word: "maple", syllables: 2, split: "ma / ple", introduced: 1 },
    { id: "cle-ankle", word: "ankle", syllables: 2, split: "an / kle", introduced: 1 },
    { id: "cle-beetle", word: "beetle", syllables: 2, split: "bee / tle", introduced: 1 },
    { id: "cle-bottle", word: "bottle", syllables: 2, split: "bot / tle", introduced: 2 },
    { id: "cle-circle", word: "circle", syllables: 2, split: "cir / cle", introduced: 2 },
    { id: "cle-handle", word: "handle", syllables: 2, split: "han / dle", introduced: 2 },
    { id: "cle-people", word: "people", syllables: 2, split: "peo / ple", introduced: 2 },
    { id: "cle-uncle", word: "uncle", syllables: 2, split: "un / cle", introduced: 2 },
    { id: "cle-needle", word: "needle", syllables: 2, split: "nee / dle", introduced: 2 },
    { id: "cle-babble", word: "babble", syllables: 2, split: "bab / ble", introduced: 2 },
    { id: "cle-rumble", word: "rumble", syllables: 2, split: "rum / ble", introduced: 2 },
    { id: "cle-bicycle", word: "bicycle", syllables: 3, split: "bi / cy / cle", introduced: 2 },
    { id: "cle-article", word: "article", syllables: 3, split: "ar / ti / cle", introduced: 3 },
    { id: "cle-miracle", word: "miracle", syllables: 3, split: "mir / a / cle", introduced: 3 },
    { id: "cle-vehicle", word: "vehicle", syllables: 3, split: "ve / hi / cle", introduced: 3 },
    { id: "cle-obstacle", word: "obstacle", syllables: 3, split: "ob / sta / cle", introduced: 3 },
    { id: "cle-vegetable", word: "vegetable", syllables: 4, split: "veg / e / ta / ble", introduced: 3 },
    { id: "cle-motorcycle", word: "motorcycle", syllables: 4, split: "mo / tor / cy / cle", introduced: 3 },
  ],
  ed: [
    { id: "ed-jumped", word: "jumped", syllables: 1, split: "jumped", type: "merged", introduced: 1 },
    { id: "ed-helped", word: "helped", syllables: 1, split: "helped", type: "merged", introduced: 1 },
    { id: "ed-baked", word: "baked", syllables: 1, split: "baked", type: "merged", introduced: 1 },
    { id: "ed-looked", word: "looked", syllables: 1, split: "looked", type: "merged", introduced: 1 },
    { id: "ed-played", word: "played", syllables: 1, split: "played", type: "merged", introduced: 1 },
    { id: "ed-wanted", word: "wanted", syllables: 2, split: "want / ed", type: "extra", introduced: 1 },
    { id: "ed-needed", word: "needed", syllables: 2, split: "need / ed", type: "extra", introduced: 1 },
    { id: "ed-started", word: "started", syllables: 2, split: "start / ed", type: "extra", introduced: 1 },
    { id: "ed-painted", word: "painted", syllables: 2, split: "paint / ed", type: "extra", introduced: 1 },
    { id: "ed-pointed", word: "pointed", syllables: 2, split: "point / ed", type: "extra", introduced: 1 },
    { id: "ed-closed", word: "closed", syllables: 1, split: "closed", type: "merged", introduced: 2 },
    { id: "ed-pushed", word: "pushed", syllables: 1, split: "pushed", type: "merged", introduced: 2 },
    { id: "ed-folded", word: "folded", syllables: 2, split: "fold / ed", type: "extra", introduced: 2 },
    { id: "ed-shouted", word: "shouted", syllables: 2, split: "shout / ed", type: "extra", introduced: 2 },
    { id: "ed-opened", word: "opened", syllables: 2, split: "o / pened", type: "merged", introduced: 2 },
    { id: "ed-landed", word: "landed", syllables: 2, split: "land / ed", type: "extra", introduced: 2 },
    { id: "ed-melted", word: "melted", syllables: 2, split: "melt / ed", type: "extra", introduced: 2 },
    { id: "ed-visited", word: "visited", syllables: 3, split: "vis / it / ed", type: "extra", introduced: 2 },
    { id: "ed-included", word: "included", syllables: 3, split: "in / clud / ed", type: "merged", introduced: 2 },
    { id: "ed-decided", word: "decided", syllables: 3, split: "de / cid / ed", type: "extra", introduced: 3 },
    { id: "ed-created", word: "created", syllables: 3, split: "cre / at / ed", type: "extra", introduced: 3 },
    { id: "ed-invented", word: "invented", syllables: 3, split: "in / vent / ed", type: "extra", introduced: 3 },
    { id: "ed-collected", word: "collected", syllables: 3, split: "col / lect / ed", type: "extra", introduced: 3 },
    { id: "ed-recorded", word: "recorded", syllables: 3, split: "re / cord / ed", type: "extra", introduced: 3 },
    { id: "ed-graduated", word: "graduated", syllables: 4, split: "grad / u / at / ed", type: "extra", introduced: 3 },
  ],
  es: [
    { id: "es-cakes", word: "cakes", syllables: 1, split: "cakes", type: "merged", introduced: 1 },
    { id: "es-books", word: "books", syllables: 1, split: "books", type: "merged", introduced: 1 },
    { id: "es-bags", word: "bags", syllables: 1, split: "bags", type: "merged", introduced: 1 },
    { id: "es-hats", word: "hats", syllables: 1, split: "hats", type: "merged", introduced: 1 },
    { id: "es-boxes", word: "boxes", syllables: 2, split: "box / es", type: "extra", introduced: 1 },
    { id: "es-dishes", word: "dishes", syllables: 2, split: "dish / es", type: "extra", introduced: 1 },
    { id: "es-classes", word: "classes", syllables: 2, split: "class / es", type: "extra", introduced: 1 },
    { id: "es-buses", word: "buses", syllables: 2, split: "bus / es", type: "extra", introduced: 1 },
    { id: "es-rashes", word: "rashes", syllables: 2, split: "rash / es", type: "extra", introduced: 1 },
    { id: "es-foxes", word: "foxes", syllables: 2, split: "fox / es", type: "extra", introduced: 1 },
    { id: "es-roses", word: "roses", syllables: 2, split: "ro / ses", type: "extra", introduced: 2 },
    { id: "es-watches", word: "watches", syllables: 2, split: "watch / es", type: "extra", introduced: 2 },
    { id: "es-bridges", word: "bridges", syllables: 2, split: "bridg / es", type: "extra", introduced: 2 },
    { id: "es-wishes", word: "wishes", syllables: 2, split: "wish / es", type: "extra", introduced: 2 },
    { id: "es-glasses", word: "glasses", syllables: 2, split: "glass / es", type: "extra", introduced: 2 },
    { id: "es-pages", word: "pages", syllables: 2, split: "pa / ges", type: "extra", introduced: 2 },
    { id: "es-oranges", word: "oranges", syllables: 3, split: "or / ang / es", type: "extra", introduced: 2 },
    { id: "es-heroes", word: "heroes", syllables: 3, split: "he / roes", type: "extra", introduced: 2 },
    { id: "es-practices", word: "practices", syllables: 3, split: "prac / ti / ces", type: "extra", introduced: 3 },
    { id: "es-villages", word: "villages", syllables: 3, split: "vil / lag / es", type: "extra", introduced: 3 },
    { id: "es-packages", word: "packages", syllables: 3, split: "pack / ag / es", type: "extra", introduced: 3 },
    { id: "es-advantages", word: "advantages", syllables: 4, split: "ad / van / tag / es", type: "extra", introduced: 3 },
    { id: "es-challenges", word: "challenges", syllables: 3, split: "chal / leng / es", type: "extra", introduced: 3 },
    { id: "es-strategies", word: "strategies", syllables: 4, split: "strat / e / gies", type: "extra", introduced: 3 },
  ],
  general: [
    { id: "gen-family", word: "family", syllables: 3, split: "fam / i / ly", introduced: 1 },
    { id: "gen-banana", word: "banana", syllables: 3, split: "ba / na / na", introduced: 1 },
    { id: "gen-elephant", word: "elephant", syllables: 3, split: "el / e / phant", introduced: 1 },
    { id: "gen-tiger", word: "tiger", syllables: 2, split: "ti / ger", introduced: 1 },
    { id: "gen-animal", word: "animal", syllables: 3, split: "an / i / mal", introduced: 1 },
    { id: "gen-paper", word: "paper", syllables: 2, split: "pa / per", introduced: 1 },
    { id: "gen-melon", word: "melon", syllables: 2, split: "mel / on", introduced: 1 },
    { id: "gen-rabbit", word: "rabbit", syllables: 2, split: "rab / bit", introduced: 1 },
    { id: "gen-music", word: "music", syllables: 2, split: "mu / sic", introduced: 1 },
    { id: "gen-watermelon", word: "watermelon", syllables: 4, split: "wa / ter / mel / on", introduced: 1 },
    { id: "gen-radio", word: "radio", syllables: 3, split: "ra / di / o", introduced: 2 },
    { id: "gen-potato", word: "potato", syllables: 3, split: "po / ta / to", introduced: 2 },
    { id: "gen-holiday", word: "holiday", syllables: 3, split: "hol / i / day", introduced: 2 },
    { id: "gen-tomato", word: "tomato", syllables: 3, split: "to / ma / to", introduced: 2 },
    { id: "gen-computer", word: "computer", syllables: 3, split: "com / pu / ter", introduced: 2 },
    { id: "gen-yesterday", word: "yesterday", syllables: 3, split: "yes / ter / day", introduced: 2 },
    { id: "gen-together", word: "together", syllables: 3, split: "to / ge / ther", introduced: 2 },
    { id: "gen-chocolate", word: "chocolate", syllables: 3, split: "choc / o / late", introduced: 2 },
    { id: "gen-pottery", word: "pottery", syllables: 3, split: "pot / ter / y", introduced: 2 },
    { id: "gen-cinema", word: "cinema", syllables: 3, split: "cin / e / ma", introduced: 2 },
    { id: "gen-alligator", word: "alligator", syllables: 4, split: "al / li / ga / tor", introduced: 3 },
    { id: "gen-information", word: "information", syllables: 4, split: "in / for / ma / tion", introduced: 3 },
    { id: "gen-education", word: "education", syllables: 4, split: "ed / u / ca / tion", introduced: 3 },
    { id: "gen-calculator", word: "calculator", syllables: 4, split: "cal / cu / la / tor", introduced: 3 },
    { id: "gen-ceremony", word: "ceremony", syllables: 4, split: "cer / e / mo / ny", introduced: 3 },
    { id: "gen-technology", word: "technology", syllables: 4, split: "tech / nol / o / gy", introduced: 3 },
    { id: "gen-communication", word: "communication", syllables: 5, split: "com / mu / ni / ca / tion", introduced: 3 },
  ],
};

const derivedSourcePools =
  globalThis.derivedQuestionPools && typeof globalThis.derivedQuestionPools === "object"
    ? globalThis.derivedQuestionPools
    : null;

const syllableOverrides = {
  around: 2,
  beautiful: 3,
  bicycle: 3,
  business: 2,
  camera: 3,
  chocolate: 3,
  different: 3,
  every: 2,
  example: 3,
  family: 3,
  favorite: 3,
  fire: 1,
  hour: 1,
  interesting: 4,
  several: 3,
  temperature: 4,
  vegetable: 4,
};

const fallbackLexicon = {
  a: { phonetic: "/uh/, /ay/", meaning: "\uD558\uB098\uC758, \uC5B4\uB5A4" },
  an: { phonetic: "/an/", meaning: "\uD558\uB098\uC758, \uC5B4\uB5A4" },
  apple: { phonetic: "/AP-uhl/", meaning: "\uC0AC\uACFC" },
  apples: { phonetic: "/AP-uhlz/", meaning: "\uC0AC\uACFC\uB4E4" },
  asked: { phonetic: "/ASKT/", meaning: "\uBB3B\uC5C8\uB2E4, \uBD80\uD0C1\uD588\uB2E4" },
  bags: { phonetic: "/BAGZ/", meaning: "\uAC00\uBC29\uB4E4" },
  balls: { phonetic: "/BAWLZ/", meaning: "\uACF5\uB4E4" },
  bananas: { phonetic: "/buh-NAN-uhz/", meaning: "\uBC14\uB098\uB098\uB4E4" },
  books: { phonetic: "/BUKS/", meaning: "\uCC45\uB4E4" },
  bottle: { phonetic: "/BAH-tl/", meaning: "\uBCD1" },
  boxes: { phonetic: "/BAHK-siz/", meaning: "\uC0C1\uC790\uB4E4" },
  buses: { phonetic: "/BUS-iz/", meaning: "\uBC84\uC2A4\uB4E4" },
  cakes: { phonetic: "/KAYKS/", meaning: "\uCF00\uC774\uD06C\uB4E4" },
  called: { phonetic: "/KAWLD/", meaning: "\uBD88\uB800\uB2E4, \uC804\uD654\uD588\uB2E4" },
  caps: { phonetic: "/KAPS/", meaning: "\uBAA8\uC790\uB4E4" },
  cats: { phonetic: "/KATS/", meaning: "\uACE0\uC591\uC774\uB4E4" },
  changed: { phonetic: "/CHAYNJD/", meaning: "\uBCC0\uD588\uB2E4, \uBCC0\uD654\uC2DC\uCF30\uB2E4" },
  chopstick: { phonetic: "/CHOP-stik/", meaning: "\uC816\uAC00\uB77D" },
  classes: { phonetic: "/KLAS-iz/", meaning: "\uD559\uAE09\uB4E4, \uC218\uC5C5\uB4E4" },
  clocks: { phonetic: "/KLOKS/", meaning: "\uC2DC\uACC4\uB4E4" },
  closed: { phonetic: "/KLOHZD/", meaning: "\uB2EB\uC558\uB2E4, \uB2EB\uD614\uB2E4" },
  coats: { phonetic: "/KOHTS/", meaning: "\uC678\uD22C\uB4E4" },
  crayon: { phonetic: "/KRAY-on/", meaning: "\uD06C\uB808\uC6A9" },
  cups: { phonetic: "/KUPS/", meaning: "\uCEF5\uB4E4" },
  danced: { phonetic: "/DANST/", meaning: "\uCDA4\uCD04\uB2E4" },
  dishes: { phonetic: "/DISH-iz/", meaning: "\uC811\uC2DC\uB4E4, \uC694\uB9AC\uB4E4" },
  dogs: { phonetic: "/DOGZ/", meaning: "\uAC1C\uB4E4" },
  dresses: { phonetic: "/DRES-iz/", meaning: "\uB4DC\uB808\uC2A4\uB4E4, \uC637\uB4E4" },
  ducks: { phonetic: "/DUKS/", meaning: "\uC624\uB9AC\uB4E4" },
  eggs: { phonetic: "/EGZ/", meaning: "\uB2EC\uAC40\uB4E4" },
  excellent: { phonetic: "/EK-suh-lent/", meaning: "\uD6CC\uB96D\uD55C, \uB6F0\uC5B4\uB09C" },
  excused: { phonetic: "/ik-SKYOODZD/", meaning: "\uC6A9\uC11C\uD588\uB2E4" },
  exercised: { phonetic: "/EK-ser-syzd/", meaning: "\uC6B4\uB3D9\uD588\uB2E4, \uC5F0\uC2B5\uD588\uB2E4" },
  fixed: { phonetic: "/FIKST/", meaning: "\uACE0\uCCE4\uB2E4, \uACE0\uC815\uD588\uB2E4" },
  games: { phonetic: "/GAYMZ/", meaning: "\uAC8C\uC784\uB4E4, \uACBD\uAE30\uB4E4" },
  glasses: { phonetic: "/GLAS-iz/", meaning: "\uC548\uACBD, \uC720\uB9AC\uC794\uB4E4" },
  god: { phonetic: "/GOD/", meaning: "\uC2E0" },
  grapes: { phonetic: "/GRAYPS/", meaning: "\uD3EC\uB3C4\uB4E4" },
  hats: { phonetic: "/HATS/", meaning: "\uBAA8\uC790\uB4E4" },
  hiking: { phonetic: "/HY-king/", meaning: "\uD558\uC774\uD0B9" },
  hoped: { phonetic: "/HOHPT/", meaning: "\uD76C\uB9DD\uD588\uB2E4" },
  liked: { phonetic: "/LYKT/", meaning: "\uC88B\uC544\uD588\uB2E4" },
  lived: { phonetic: "/LIVD/", meaning: "\uC0B4\uC558\uB2E4" },
  loved: { phonetic: "/LUVD/", meaning: "\uC0AC\uB791\uD588\uB2E4" },
  maps: { phonetic: "/MAPS/", meaning: "\uC9C0\uB3C4\uB4E4" },
  may: { phonetic: "/MAY/", meaning: "~\uD574\uB3C4 \uB418\uB2E4, 5\uC6D4" },
  moved: { phonetic: "/MOOVD/", meaning: "\uC6C0\uC9C1\uC600\uB2E4, \uC774\uC0AC\uD588\uB2E4" },
  needed: { phonetic: "/NEE-did/", meaning: "\uD544\uC694\uB85C \uD588\uB2E4" },
  okay: { phonetic: "/oh-KAY/", meaning: "\uC88B\uC544, \uAD1C\uCC2E\uC544" },
  opened: { phonetic: "/OH-puhnd/", meaning: "\uC5F4\uC5C8\uB2E4" },
  pages: { phonetic: "/PAY-jiz/", meaning: "\uD398\uC774\uC9C0\uB4E4" },
  placed: { phonetic: "/PLAYST/", meaning: "\uB193\uC558\uB2E4, \uBC30\uCE58\uD588\uB2E4" },
  potatoes: { phonetic: "/puh-TAY-tohz/", meaning: "\uAC10\uC790\uB4E4" },
  practiced: { phonetic: "/PRAK-tist/", meaning: "\uC5F0\uC2B5\uD588\uB2E4, \uC2E4\uD589\uD588\uB2E4" },
  smiled: { phonetic: "/SMYLD/", meaning: "\uBBF8\uC18C \uC9C0\uC5C8\uB2E4" },
  sports: { phonetic: "/SPORTS/", meaning: "\uC2A4\uD3EC\uCE20" },
  tomatoes: { phonetic: "/tuh-MAY-tohz/", meaning: "\uD1A0\uB9C8\uD1A0\uB4E4" },
  used: { phonetic: "/YOOZD/", meaning: "\uC0AC\uC6A9\uD588\uB2E4, \uC37C\uB2E4" },
  visited: { phonetic: "/VIZ-i-tid/", meaning: "\uBC29\uBB38\uD588\uB2E4" },
  waited: { phonetic: "/WAY-tid/", meaning: "\uAE30\uB2E4\uB838\uB2E4" },
  walked: { phonetic: "/WAWKT/", meaning: "\uAC78\uC5C8\uB2E4" },
  watches: { phonetic: "/WOTCH-iz/", meaning: "\uC2DC\uACC4\uB4E4" },
  worked: { phonetic: "/WERKT/", meaning: "\uC77C\uD588\uB2E4, \uC791\uB3D9\uD588\uB2E4" },
};

function normalizeWordKey(word) {
  return typeof word === "string" ? word.toLowerCase().replace(/[^a-z]/g, "") : "";
}

function clampLevel(value, fallback = 1) {
  return Number.isInteger(value) && value >= 1 && value <= 3 ? value : fallback;
}

function sanitizeMeaning(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.includes(" ")) {
    return "";
  }

  const weirdChars = trimmed.match(/[^\x20-\x7E가-힣0-9,./()~+\-:;·'"!? ]/g) || [];
  if (weirdChars.length > 0) {
    return "";
  }

  const cleaned = trimmed.replace(/\?\s*\?+\s*$/g, "").replace(/\s{2,}/g, " ").trim();
  return /[가-힣A-Za-z]/.test(cleaned) ? cleaned : "";
}

function sanitizePhonetic(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed || trimmed.includes(" ")) {
    return "";
  }

  return /[A-Za-zɑɒæəɜɛɪʊʌɔðθʃʒŋˈˌ.\-\/]/.test(trimmed) ? trimmed : "";
}

function getFallbackLexiconEntry(word) {
  return fallbackLexicon[normalizeWordKey(word)] || null;
}

function countWordSyllables(rawWord) {
  const word = normalizeWordKey(rawWord);
  if (!word) {
    return 0;
  }

  if (syllableOverrides[word]) {
    return syllableOverrides[word];
  }

  let working = word;
  let extraSyllables = 0;

  if (/[bcdfghjklmnpqrstvwxyz]les$/.test(working)) {
    working = working.slice(0, -3);
    extraSyllables += 1;
  } else if (/[bcdfghjklmnpqrstvwxyz]le$/.test(working)) {
    working = working.slice(0, -2);
    extraSyllables += 1;
  }

  if (/(ches|shes|xes|zes|ses|ges|ces)$/.test(working)) {
    working = working.replace(/es$/, "");
    extraSyllables += 1;
  } else if (/es$/.test(working)) {
    // silent-e singular + s (cakes, games, grapes) should stay the same syllable count.
    working = working.slice(0, -1);
  } else if (/(?:[td])ed$/.test(working)) {
    working = working.slice(0, -2);
    extraSyllables += 1;
  } else if (/ed$/.test(working)) {
    working = working.slice(0, -2);
  }

  if (working.length > 2 && /[^aeiouy]e$/.test(working)) {
    working = working.slice(0, -1);
  }

  working = working.replace(/^y/, "");

  const vowelGroups = working.match(/[aeiouy]{1,2}/g) || [];
  return Math.max(1, vowelGroups.length + extraSyllables);
}

function hasExtraEdSyllable(word) {
  return /(?:[td])ed$/i.test(word);
}

function hasExtraEsSyllable(word) {
  return /(ches|shes|xes|zes|ses|ges|ces)$/i.test(word);
}

function hasConsonantLeEnding(word) {
  return /[bcdfghjklmnpqrstvwxyz]le$/i.test(word);
}

function isPlaceholderSplit(split) {
  if (typeof split !== "string") {
    return true;
  }

  const trimmed = split.trim();
  return !trimmed || trimmed === "approx." || trimmed.includes("?") || /^\d+\s*음절$/.test(trimmed);
}

function makeFallbackSplit(word, category, syllables, type) {
  if (!word) {
    return `${syllables}음절`;
  }

  if (category === "consonantLe" && hasConsonantLeEnding(word) && syllables === 2) {
    return `${word.slice(0, -3)} / ${word.slice(-3)}`;
  }

  if (category === "ed") {
    return type === "extra" ? `${word.slice(0, -2)} / ed` : word;
  }

  if (category === "es") {
    return type === "extra" ? `${word.replace(/es$/i, "")} / es` : word;
  }

  if (category === "silentE" && syllables === 1) {
    return word;
  }

  return `${syllables}음절`;
}

function createMeaningLookup() {
  const lookup = new Map();

  if (!derivedSourcePools || typeof derivedSourcePools !== "object") {
    return lookup;
  }

  Object.values(derivedSourcePools).forEach((entries) => {
    if (!Array.isArray(entries)) {
      return;
    }

    entries.forEach((entry) => {
      const wordKey = normalizeWordKey(entry?.word);
      const meaning = sanitizeMeaning(entry?.meaning);

      if (wordKey && meaning && !lookup.has(wordKey)) {
        lookup.set(wordKey, meaning);
      }
    });
  });

  return lookup;
}

function createRuleAuthorityLookup() {
  const lookup = {};

  ["silentE", "consonantLe", "ed", "es", "general"].forEach((category) => {
    lookup[category] = new Map();

    (questionPools[category] || []).forEach((entry) => {
      const wordKey = normalizeWordKey(entry.word);
      if (wordKey) {
        lookup[category].set(wordKey, entry);
      }
    });
  });

  return lookup;
}

function normalizeEntry(category, entry, meaningLookup, authorityLookup) {
  if (!entry || typeof entry.word !== "string") {
    return null;
  }

  const word = entry.word.trim();
  const wordKey = normalizeWordKey(word);
  if (!wordKey) {
    return null;
  }

  const authority = authorityLookup[category]?.get(wordKey) || null;
  const fallbackEntry = getFallbackLexiconEntry(word);
  const countedSyllables = countWordSyllables(word);
  const syllables = authority?.syllables || countedSyllables || entry.syllables || 1;
  const type =
    category === "ed"
      ? authority?.type || (hasExtraEdSyllable(word) ? "extra" : "merged")
      : category === "es"
        ? authority?.type || (hasExtraEsSyllable(word) ? "extra" : "merged")
        : entry.type;
  let split = authority?.split || (!isPlaceholderSplit(entry.split) ? entry.split.trim() : makeFallbackSplit(word, category, syllables, type));

  if (category === "ed" && type === "merged" && /\/\s*ed$/i.test(split)) {
    split = word;
  }

  if (category === "es" && type === "merged" && /\/\s*es$/i.test(split)) {
    split = word;
  }

  const meaning = sanitizeMeaning(entry.meaning) || meaningLookup.get(wordKey) || fallbackEntry?.meaning || "";
  const phonetic = sanitizePhonetic(entry.phonetic) || fallbackEntry?.phonetic || "";

  return {
    ...entry,
    word,
    syllables,
    split,
    type,
    introduced: clampLevel(entry.introduced, clampLevel(authority?.introduced, Math.min(3, Math.max(1, syllables)))),
    meaning,
    phonetic,
  };
}

function uniqueEntries(entries) {
  const seen = new Set();

  return entries.filter((entry) => {
    if (!entry) {
      return false;
    }

    const id = typeof entry.id === "string" && entry.id.trim() ? entry.id : `${entry.word}-${entry.introduced}`;
    if (seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}

function buildActiveQuestionPools() {
  if (!derivedSourcePools) {
    return questionPools;
  }

  const meaningLookup = createMeaningLookup();
  const authorityLookup = createRuleAuthorityLookup();
  const nextPools = {};
  const categories = new Set([
    ...Object.keys(questionPools),
    ...Object.keys(derivedSourcePools),
  ]);

  categories.forEach((category) => {
    const sourceEntries =
      Array.isArray(derivedSourcePools[category]) && derivedSourcePools[category].length
        ? derivedSourcePools[category]
        : questionPools[category] || [];

    nextPools[category] = uniqueEntries(
      sourceEntries
        .map((entry) => normalizeEntry(category, entry, meaningLookup, authorityLookup))
        .filter(Boolean),
    );
  });

  return nextPools;
}

const activeQuestionPools = buildActiveQuestionPools();

const hintMap = {
  coreVocab: [
    "단어를 천천히 읽으며 모음 소리 덩어리를 찾아 보세요.",
    "길이가 조금 길어도 발음 박자를 먼저 생각해 보세요.",
    "예외가 있을 때는 철자보다 실제로 들리는 박자를 떠올려 보세요.",
  ],
  silentE: [
    "끝의 e가 실제로 소리 나는지 먼저 떠올려 보세요.",
    "묵음 e가 보여도 앞쪽 박자를 먼저 세어 보세요.",
    "묵음 e가 있다고 해서 항상 1음절은 아니에요.",
  ],
  consonantLe: [
    "마지막 le 앞에 자음이 있는지 확인해 보세요.",
    "끝의 -le이 따로 한 박자를 만드는지 생각해 보세요.",
    "긴 단어에서도 끝의 -le이 마지막 음절을 만드는지 보세요.",
  ],
  ed: [
    "-ed가 따로 한 음절처럼 들리는지 확인해 보세요.",
    "-ed가 /t/, /d/, /id/ 중 어떤 소리인지 떠올려 보세요.",
    "철자보다 실제 발음에서 박자가 늘어나는지 먼저 판단해 보세요.",
  ],
  es: [
    "-s 또는 -es가 새 음절을 만드는지 생각해 보세요.",
    "-es가 /iz/처럼 분명하게 들리는지 떠올려 보세요.",
    "복수형이어도 음절이 그대로인 단어와 늘어나는 단어를 비교해 보세요.",
  ],
  general: [
    "단어를 천천히 박자처럼 읽어 보세요.",
    "모음 소리 덩어리가 몇 개인지 떠올려 보세요.",
    "철자 길이보다 실제 발음 박자를 기준으로 판단해 보세요.",
  ],
};

const ruleMap = {
  coreVocab: "필수 영단어 800",
  silentE: "묵음 e",
  consonantLe: "자음 + le",
  ed: "-ed",
  es: "-es / -s",
  general: "기본 음절",
  all: "전체 규칙",
};

const mixedBlueprints = {
  1: ["silentE", "silentE", "consonantLe", "consonantLe", "ed", "ed", "es", "es", "general", "general"],
  2: ["silentE", "consonantLe", "ed", "ed", "es", "es", "general", "general", "silentE", "consonantLe"],
  3: ["silentE", "consonantLe", "ed", "ed", "es", "es", "general", "general", "general", "general"],
};

const state = {
  page: "lesson",
  round: 1,
  difficulty: 1,
  focusRule: "all",
  questions: [],
  score: 0,
  answeredCount: 0,
  wrongAnswers: [],
  history: loadHistory(),
  pronunciationCache: loadPronunciationCache(),
};

const pronunciationRequests = new Map();

const lessonPage = document.getElementById("lessonPage");
const quizPage = document.getElementById("quizPage");
const conceptGrid = document.getElementById("conceptGrid");
const showAllRulesBtn = document.getElementById("showAllRulesBtn");
const backToTopicsBtn = document.getElementById("backToTopicsBtn");
const difficultyButtons = [...document.querySelectorAll(".difficulty-btn")];
const difficultyTitle = document.getElementById("difficultyTitle");
const difficultyDescription = document.getElementById("difficultyDescription");
const focusTitle = document.getElementById("focusTitle");
const focusDescription = document.getElementById("focusDescription");
const focusLevelText = document.getElementById("focusLevelText");
const scoreText = document.getElementById("scoreText");
const progressText = document.getElementById("progressText");
const roundText = document.getElementById("roundText");
const progressBar = document.getElementById("progressBar");
const questionList = document.getElementById("questionList");
const newSetBtn = document.getElementById("newSetBtn");
const resultTemplate = document.getElementById("resultTemplate");
const quizCard = document.querySelector(".quiz-card");

function createEmptyHistory() {
  return {
    version: STORAGE_VERSION,
    modes: {},
  };
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyHistory();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return createEmptyHistory();
    }

    if (parsed.version !== STORAGE_VERSION || !parsed.modes || typeof parsed.modes !== "object") {
      return createEmptyHistory();
    }

    return {
      version: STORAGE_VERSION,
      modes: parsed.modes,
    };
  } catch (error) {
    return createEmptyHistory();
  }
}

function createEmptyPronunciationCache() {
  return {
    version: PRONUNCIATION_STORAGE_VERSION,
    words: {},
  };
}

function loadPronunciationCache() {
  try {
    const raw = localStorage.getItem(PRONUNCIATION_STORAGE_KEY);
    if (!raw) {
      return createEmptyPronunciationCache();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return createEmptyPronunciationCache();
    }

    if (
      parsed.version !== PRONUNCIATION_STORAGE_VERSION ||
      !parsed.words ||
      typeof parsed.words !== "object"
    ) {
      return createEmptyPronunciationCache();
    }

    return {
      version: PRONUNCIATION_STORAGE_VERSION,
      words: parsed.words,
    };
  } catch (error) {
    return createEmptyPronunciationCache();
  }
}

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
  } catch (error) {
    // localStorage瑜??ъ슜?????녿뒗 ?섍꼍?먯꽌???꾩옱 ?몄뀡? 怨꾩냽 吏꾪뻾?⑸땲??
  }
}

function savePronunciationCache() {
  try {
    localStorage.setItem(PRONUNCIATION_STORAGE_KEY, JSON.stringify(state.pronunciationCache));
  } catch (error) {
    // 諛쒖쓬 罹먯떆 ??μ씠 ?ㅽ뙣?대룄 ?꾩옱 湲곕뒫? 怨꾩냽 吏꾪뻾?⑸땲??
  }
}

function shuffle(items) {
  const list = [...items];

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }

  return list;
}

function uniqueById(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (!item || !item.id || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getPronunciationKey(word) {
  return String(word || "").trim().toLowerCase();
}

function getPronunciationLookupCandidates(word) {
  const source = String(word || "").trim();
  const normalized = source
    .toLowerCase()
    .replaceAll("’", "'")
    .replaceAll(".", " ")
    .replaceAll("/", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();

  const collapsed = normalized.replace(/[^a-z\s']/g, "").trim();
  const noSpaces = collapsed.replace(/\s+/g, "");
  const firstToken = collapsed.split(" ")[0] || "";
  const candidates = [source.toLowerCase(), collapsed, noSpaces, firstToken]
    .map((item) => item.replace(/[^a-z']/g, "").trim())
    .filter(Boolean);

  return [...new Set(candidates)];
}

function getPronunciationRecord(word) {
  const key = getPronunciationKey(word);
  return state.pronunciationCache.words[key] || null;
}

function setPronunciationRecord(word, record) {
  const key = getPronunciationKey(word);
  state.pronunciationCache.words[key] = record;
  savePronunciationCache();
}

function pickPhoneticData(entries) {
  if (!Array.isArray(entries)) {
    return null;
  }

  for (const entry of entries) {
    const phonetic =
      entry?.phonetic ||
      entry?.phonetics?.find((item) => typeof item?.text === "string" && item.text.trim())?.text ||
      "";
    const audio =
      entry?.phonetics?.find((item) => typeof item?.audio === "string" && item.audio.trim())?.audio || "";
    const meaning =
      entry?.meanings?.find((item) => Array.isArray(item?.definitions) && item.definitions.length > 0)?.definitions?.[0]
        ?.definition || "";

    if (phonetic || audio || meaning) {
      return {
        phonetic: phonetic || "발음기호 없음",
        audio: audio.startsWith("//") ? `https:${audio}` : audio,
        meaning,
      };
    }
  }

  return null;
}

async function fetchPronunciationData(word) {
  const key = getPronunciationKey(word);
  const existing = getPronunciationRecord(word);
  const fallbackEntry = getFallbackLexiconEntry(word);

  if (existing?.status === "ready" || existing?.status === "unavailable") {
    return existing;
  }

  if (pronunciationRequests.has(key)) {
    return pronunciationRequests.get(key);
  }

  const request = (async () => {
    setPronunciationRecord(word, {
      status: "loading",
      phonetic: fallbackEntry?.phonetic || "발음기호 불러오는 중...",
      audio: "",
      meaning: fallbackEntry?.meaning || "",
    });

    const candidates = getPronunciationLookupCandidates(word);

    for (const candidate of candidates) {
      try {
        const response = await fetch(`${DICTIONARY_API_BASE}${encodeURIComponent(candidate)}`);
        if (!response.ok) {
          continue;
        }

        const json = await response.json();
        const picked = pickPhoneticData(json);

        if (picked) {
          const readyRecord = {
            status: "ready",
            phonetic: sanitizePhonetic(picked.phonetic) || fallbackEntry?.phonetic || "발음기호 없음",
            audio: picked.audio,
            meaning: sanitizeMeaning(picked.meaning) || fallbackEntry?.meaning || "",
          };

          setPronunciationRecord(word, readyRecord);
          if (state.page === "quiz") {
            renderQuestionList();
          }
          return readyRecord;
        }
      } catch (error) {
        // 다음 후보를 계속 시도합니다.
      }
    }

    const unavailableRecord = {
      status: "unavailable",
      phonetic: fallbackEntry?.phonetic || "발음기호 없음",
      audio: "",
      meaning: fallbackEntry?.meaning || "",
    };
    setPronunciationRecord(word, unavailableRecord);
    if (state.page === "quiz") {
      renderQuestionList();
    }
    return unavailableRecord;
  })();

  pronunciationRequests.set(key, request);

  try {
    return await request;
  } finally {
    pronunciationRequests.delete(key);
  }
}

function ensurePronunciationsForQuestions(questions) {
  questions.forEach((question) => {
    const record = getPronunciationRecord(question.word);
    if (!record || record.status === "loading") {
      fetchPronunciationData(question.word);
    }
  });
}

function getPreferredEnglishVoice() {
  if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function") {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!Array.isArray(voices) || voices.length === 0) {
    return null;
  }

  return (
    voices.find((voice) => /^en[-_]/i.test(voice.lang) && /google|microsoft|samantha|zira|aria/i.test(voice.name)) ||
    voices.find((voice) => /^en[-_]/i.test(voice.lang)) ||
    null
  );
}

function speakWithBrowser(word) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  const preferredVoice = getPreferredEnglishVoice();
  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang || "en-US";
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

function buildGoogleTtsUrl(word) {
  const normalized = String(word || "").trim();
  return normalized ? `${GOOGLE_TTS_BASE}${encodeURIComponent(normalized)}` : "";
}

function playAudioFromUrls(urls, fallbackWord = "") {
  const queue = urls.filter(Boolean);

  if (queue.length === 0) {
    if (fallbackWord) {
      speakWithBrowser(fallbackWord);
    }
    return false;
  }

  const [currentUrl, ...restUrls] = queue;
  const audio = new Audio(currentUrl);
  audio.play().catch(() => {
    if (restUrls.length > 0) {
      playAudioFromUrls(restUrls, fallbackWord);
      return;
    }

    if (fallbackWord) {
      speakWithBrowser(fallbackWord);
    }
  });

  return true;
}

async function playPronunciation(word) {
  const record = getPronunciationRecord(word);
  const googleTtsUrl = buildGoogleTtsUrl(word);

  if (record?.status === "ready") {
    playAudioFromUrls([googleTtsUrl, record.audio], word);
    return;
  }

  if (record?.status === "unavailable") {
    playAudioFromUrls([googleTtsUrl], word);
    return;
  }

  const fetched = await fetchPronunciationData(word);
  playAudioFromUrls([googleTtsUrl, fetched?.audio], word);
}

function isValidEntry(entry) {
  return Boolean(
    entry &&
      typeof entry.id === "string" &&
      entry.id.trim() &&
      typeof entry.word === "string" &&
      entry.word.trim() &&
      Number.isFinite(entry.syllables) &&
      entry.syllables > 0 &&
      typeof entry.split === "string" &&
      entry.split.trim(),
  );
}

function getRuleKeyForPool(rule) {
  return rule === "all" ? "general" : rule;
}

function getLesson(rule) {
  return conceptLessons.find((item) => item.key === rule) || conceptLessons[conceptLessons.length - 1];
}

function clearResults() {
  const resultCard = document.querySelector(".result-card");
  if (resultCard) {
    resultCard.remove();
  }

  quizCard.hidden = false;
}

function setPage(page) {
  state.page = page;
  lessonPage.classList.toggle("is-hidden", page !== "lesson");
  quizPage.classList.toggle("is-hidden", page !== "quiz");
  window.scrollTo(0, 0);
}

function getPoolForLevel(category, level) {
  return (activeQuestionPools[category] || []).filter((item) => item.introduced === level);
}

function buildQuestion(entry, category, level) {
  let explanation = `${entry.word}는 ${entry.split}처럼 생각하며 ${entry.syllables}음절로 연습하는 문제예요.`;

  if (category === "coreVocab") {
    explanation = `PDF 단어장 기반 단어예요. 단어의 길이와 모음 소리를 기준으로 ${entry.syllables}음절로 연습해요.`;
  }

  if (category === "silentE" && entry.syllables === 1) {
    explanation = `끝의 e는 소리 나지 않아 ${entry.word}는 1음절이에요.`;
  }

  if (category === "consonantLe") {
    explanation = `${entry.word}는 끝의 자음 + le가 따로 음절을 만들어 ${entry.split}처럼 나뉘어요.`;
  }

  if (category === "ed") {
    explanation =
      entry.type === "extra"
        ? `${entry.word}는 -ed가 /id/처럼 들려 ${entry.split}처럼 음절이 하나 더 생겨요.`
        : `${entry.word}는 -ed가 끝소리만 바꾸고 새 음절은 만들지 않아요.`;
  }

  if (category === "es") {
    explanation =
      entry.type === "extra"
        ? `${entry.word}는 -es가 /iz/처럼 들려 ${entry.split}처럼 음절이 하나 더 생겨요.`
        : `${entry.word}는 -s가 붙어도 새 음절이 생기지 않아요.`;
  }

  return {
    ...entry,
    category,
    rule: ruleMap[category],
    hint: hintMap[category][Math.max(0, level - 1)] || hintMap.general[0],
    explanation,
    answered: false,
    selected: null,
  };
}

function getModeKey(ruleKey, level) {
  return `${ruleKey === "all" ? "mixed" : ruleKey}::level${level}`;
}

function getModeHistory(modeKey, validIds) {
  const emptyMode = {
    usedWordIds: [],
    lastSetWordIds: [],
  };

  const stored = state.history.modes[modeKey];
  const nextMode =
    stored && typeof stored === "object"
      ? {
          usedWordIds: Array.isArray(stored.usedWordIds) ? stored.usedWordIds : [],
          lastSetWordIds: Array.isArray(stored.lastSetWordIds) ? stored.lastSetWordIds : [],
        }
      : emptyMode;

  const validIdSet = new Set(validIds);
  const dedupe = (ids) => [...new Set(ids.filter((id) => typeof id === "string" && validIdSet.has(id)))];

  const normalized = {
    usedWordIds: dedupe(nextMode.usedWordIds),
    lastSetWordIds: dedupe(nextMode.lastSetWordIds),
  };

  state.history.modes[modeKey] = normalized;
  return normalized;
}

function updateModeHistory(modeKey, pickedIds) {
  const current = state.history.modes[modeKey] || { usedWordIds: [], lastSetWordIds: [] };
  const nextUsed = [...new Set([...current.usedWordIds, ...pickedIds])];

  state.history.modes[modeKey] = {
    usedWordIds: nextUsed,
    lastSetWordIds: [...pickedIds],
  };

  saveHistory();
}

function getCategoryCandidates(category, level) {
  return uniqueById(getPoolForLevel(category, level).filter(isValidEntry));
}

function buildPrioritizedBuckets(candidates, usedSet, lastSet, selectedSet) {
  const available = candidates.filter((item) => !selectedSet.has(item.id));
  const fresh = shuffle(available.filter((item) => !usedSet.has(item.id)));
  const usedNotLast = shuffle(available.filter((item) => usedSet.has(item.id) && !lastSet.has(item.id)));
  const fromLastSet = shuffle(available.filter((item) => lastSet.has(item.id)));

  return [fresh, usedNotLast, fromLastSet];
}

function pickFromBuckets(buckets, count) {
  const selected = [];
  const selectedIds = new Set();

  for (const bucket of buckets) {
    for (const item of bucket) {
      if (selected.length >= count) {
        return selected;
      }

      if (selectedIds.has(item.id)) {
        continue;
      }

      selected.push(item);
      selectedIds.add(item.id);
    }
  }

  return selected;
}

function pickOneForCategory(categoryCandidates, usedSet, lastSet, selectedSet) {
  const buckets = buildPrioritizedBuckets(categoryCandidates, usedSet, lastSet, selectedSet);
  const picked = pickFromBuckets(buckets, 1);
  return picked[0] || null;
}

function generateTopicQuestionSet(topicKey, level, requestedCount) {
  const category = getRuleKeyForPool(topicKey);
  const candidates = getCategoryCandidates(category, level);
  const totalAvailable = candidates.length;

  if (totalAvailable === 0) {
    return [];
  }

  const actualCount = Math.min(requestedCount, totalAvailable);
  const modeKey = getModeKey(topicKey, level);
  const modeHistory = getModeHistory(modeKey, candidates.map((item) => item.id));
  let usedSet = new Set(modeHistory.usedWordIds);
  const lastSet = new Set(modeHistory.lastSetWordIds);

  if (candidates.every((item) => usedSet.has(item.id))) {
    usedSet = new Set();
  }

  const picked = pickFromBuckets(buildPrioritizedBuckets(candidates, usedSet, lastSet, new Set()), actualCount);
  updateModeHistory(
    modeKey,
    picked.map((item) => item.id),
  );

  return picked.map((item) => buildQuestion(item, category, level));
}

function resolveCategoryFromId(item) {
  if (item.id.startsWith("gen-")) {
    return "general";
  }

  if (item.id.startsWith("cle-")) {
    return "consonantLe";
  }

  return item.id.split("-")[0];
}

function generateMixedQuestionSet(level, requestedCount) {
  const blueprint = shuffle(mixedBlueprints[level] || mixedBlueprints[1]);
  const categoryMap = {};
  const unionCandidates = [];

  [...new Set(blueprint)].forEach((category) => {
    categoryMap[category] = getCategoryCandidates(category, level);
    unionCandidates.push(...categoryMap[category]);
  });

  const uniqueUnion = uniqueById(unionCandidates);
  if (uniqueUnion.length === 0) {
    return [];
  }

  const actualCount = Math.min(requestedCount, uniqueUnion.length);
  const modeKey = getModeKey("all", level);
  const modeHistory = getModeHistory(modeKey, uniqueUnion.map((item) => item.id));
  let usedSet = new Set(modeHistory.usedWordIds);
  const lastSet = new Set(modeHistory.lastSetWordIds);

  if (uniqueUnion.every((item) => usedSet.has(item.id))) {
    usedSet = new Set();
  }

  const selected = [];
  const selectedIds = new Set();

  for (const category of blueprint) {
    if (selected.length >= actualCount) {
      break;
    }

    const picked = pickOneForCategory(categoryMap[category] || [], usedSet, lastSet, selectedIds);
    if (!picked) {
      continue;
    }

    selected.push(buildQuestion(picked, category, level));
    selectedIds.add(picked.id);
  }

  if (selected.length < actualCount) {
    const remainder = pickFromBuckets(
      buildPrioritizedBuckets(uniqueUnion, usedSet, lastSet, selectedIds),
      actualCount - selected.length,
    );

    remainder.forEach((item) => {
      selected.push(buildQuestion(item, resolveCategoryFromId(item), level));
      selectedIds.add(item.id);
    });
  }

  updateModeHistory(
    modeKey,
    selected.map((item) => item.id),
  );

  return selected;
}

function createQuestionSet(level) {
  if (state.focusRule === "all") {
    return generateMixedQuestionSet(level, BATCH_SIZE);
  }

  return generateTopicQuestionSet(state.focusRule, level, BATCH_SIZE);
}

function getTotalQuestions() {
  return state.questions.length;
}

function updateDifficultyUI() {
  const info = difficultyMeta[state.difficulty];
  difficultyTitle.textContent = info.title;
  difficultyDescription.textContent = info.description;

  difficultyButtons.forEach((button) => {
    const isActive = Number(button.dataset.level) === state.difficulty;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateQuizSummary() {
  const total = getTotalQuestions();
  scoreText.textContent = `${state.score}`;
  progressText.textContent = `${state.answeredCount} / ${total}`;
  roundText.textContent = `${state.round}`;
  progressBar.style.width = total > 0 ? `${(state.answeredCount / total) * 100}%` : "0%";
}

function renderConceptCards() {
  conceptGrid.innerHTML = "";

  conceptLessons
    .filter((lesson) => lesson.key !== "all")
    .forEach((lesson) => {
      const examples = lesson.examples.map((item) => `<span>${item}</span>`).join("");
      const points = lesson.points.map((item) => `<li>${item}</li>`).join("");
      const levels = [1, 2, 3]
        .map((level) => {
          const isActive = lesson.key === state.focusRule && state.difficulty === level;
          return `
            <button
              class="concept-level-btn${isActive ? " active" : ""}"
              type="button"
              data-rule="${lesson.key}"
              data-level="${level}"
              aria-pressed="${isActive}"
            >
              ${level}단계
            </button>
          `;
        })
        .join("");

      const card = document.createElement("article");
      card.className = `concept-card${lesson.key === state.focusRule ? " active" : ""}`;
      card.dataset.rule = lesson.key;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${lesson.title} 주제로 학습하기`);
      card.innerHTML = `
        <div class="concept-head">
          <div>
            <p class="concept-order">${lesson.label}</p>
          </div>
          <span class="concept-step">${lesson.order}</span>
        </div>
        <h3>${lesson.title}</h3>
        <p class="concept-description">${lesson.description}</p>
        <ul class="concept-points">${points}</ul>
        <div class="concept-examples">${examples}</div>
        <div class="concept-levels">${levels}</div>
        <button class="concept-btn" type="button" data-rule="${lesson.key}">이 주제 시작</button>
      `;

      conceptGrid.appendChild(card);
    });

  conceptGrid.querySelectorAll(".concept-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      const interactive = event.target.closest(".concept-level-btn, .concept-btn");
      if (interactive) {
        return;
      }

      setFocusRule(card.dataset.rule);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setFocusRule(card.dataset.rule);
      }
    });
  });

  conceptGrid.querySelectorAll(".concept-level-btn").forEach((button) => {
    button.addEventListener("click", () => {
      setTopicAndDifficulty(button.dataset.rule, Number(button.dataset.level));
    });
  });

  conceptGrid.querySelectorAll(".concept-btn").forEach((button) => {
    button.addEventListener("click", () => {
      setFocusRule(button.dataset.rule);
    });
  });
}

function updateFocusUI() {
  const lesson = getLesson(state.focusRule);
  const difficultyInfo = difficultyMeta[state.difficulty];

  focusTitle.textContent = lesson.title;
  focusDescription.textContent = lesson.description;
  focusLevelText.textContent = difficultyInfo.badge;
  renderConceptCards();
}

function renderEmptyQuestions() {
  questionList.innerHTML = `
    <article class="question-card">
      <div class="question-card-header">
        <span class="question-number">안내</span>
      </div>
      <p class="question-prompt">현재 선택한 조건에 사용할 수 있는 문제 데이터가 없습니다.</p>
      <p class="question-explanation">다른 규칙이나 난이도를 선택해 주세요.</p>
    </article>
  `;
}

function renderQuestionList() {
  questionList.innerHTML = "";

  if (state.questions.length === 0) {
    renderEmptyQuestions();
    return;
  }

  state.questions.forEach((question, index) => {
    const card = document.createElement("article");
    const isCorrect = question.answered && question.selected === question.syllables;
    const splitLabel = question.category === "coreVocab" ? "음절 정보" : "음절 구분";
    const pronunciation = getPronunciationRecord(question.word);
    const phoneticText = pronunciation?.phonetic || question.phonetic || (question.split ? `읽기 힌트: ${question.split}` : "발음기호 준비 중...");
    const meaningText = question.meaning || pronunciation?.meaning || "";
    const phoneticLine = meaningText ? `${phoneticText} · ${meaningText}` : phoneticText;

    card.className = `question-card${question.answered ? " answered" : ""}${question.answered && isCorrect ? " correct" : ""}${question.answered && !isCorrect ? " wrong" : ""}`;

    const choices = [1, 2, 3, 4]
      .map((choice) => {
        let classes = "choice-btn";

        if (question.answered) {
          if (choice === question.syllables) {
            classes += " correct";
          } else if (choice === question.selected) {
            classes += " wrong";
          } else {
            classes += " dimmed";
          }
        }

        return `
          <button
            class="${classes}"
            type="button"
            data-index="${index}"
            data-choice="${choice}"
            ${question.answered ? "disabled" : ""}
          >
            ${choice}음절
          </button>
        `;
      })
      .join("");

    const feedback = question.answered
      ? `
        <div class="question-feedback-block" aria-live="polite">
          <p class="question-feedback ${isCorrect ? "correct" : "wrong"}">
            ${isCorrect ? "정답이에요." : `오답이에요. 정답은 ${question.syllables}음절이에요.`}
          </p>
          <p class="question-explanation">${splitLabel}: ${question.split}</p>
          <p class="question-explanation">${question.explanation}</p>
        </div>
      `
      : "";

    card.innerHTML = `
      <div class="question-card-header">
        <span class="question-number">문제 ${index + 1} / ${state.questions.length}</span>
        <span class="rule-badge">${question.rule}</span>
      </div>
      <p class="question-prompt">이 단어는 몇 음절일까요?</p>
      <div class="word-row">
        <h3 class="word-text">${question.word}</h3>
        <button
          class="pronunciation-btn"
          type="button"
          data-word="${escapeHtml(question.word)}"
          aria-label="${escapeHtml(question.word)} 발음 듣기"
          title="발음 듣기"
        >
          🔊
        </button>
      </div>
      <p class="phonetic-text">${escapeHtml(phoneticLine)}</p>
      <p class="question-hint">힌트: ${question.hint}</p>
      <div class="choice-grid">${choices}</div>
      ${feedback}
    `;

    questionList.appendChild(card);
  });

  questionList.querySelectorAll(".choice-btn").forEach((button) => {
    button.addEventListener("click", () => {
      answerQuestion(Number(button.dataset.index), Number(button.dataset.choice));
    });
  });

  questionList.querySelectorAll(".pronunciation-btn").forEach((button) => {
    button.addEventListener("click", () => {
      playPronunciation(button.dataset.word || "");
    });
  });

  ensurePronunciationsForQuestions(state.questions);
}

function renderQuizPage() {
  updateDifficultyUI();
  updateFocusUI();
  updateQuizSummary();
  renderQuestionList();
}

function showResultsIfFinished() {
  const total = getTotalQuestions();
  if (total === 0 || state.answeredCount !== total) {
    return;
  }

  quizCard.hidden = true;
  const fragment = resultTemplate.content.cloneNode(true);
  const resultTitle = fragment.getElementById("resultTitle");
  const resultSummary = fragment.getElementById("resultSummary");
  const retryWrongBtn = fragment.getElementById("retryWrongBtn");
  const restartBtn = fragment.getElementById("restartBtn");

  resultTitle.textContent = "세트를 모두 풀었어요";
  resultSummary.textContent =
    state.wrongAnswers.length > 0
    ? `이번 점수는 ${state.score} / ${total}이고, 틀린 문제 ${state.wrongAnswers.length}개를 다시 풀거나 새 문제를 받을 수 있어요.`
      : `이번 점수는 ${state.score} / ${total}이고, 모두 맞혔어요. 새 문제로 이어서 연습해 보세요.`;

  if (state.wrongAnswers.length === 0) {
    retryWrongBtn.remove();
  } else {
    retryWrongBtn.addEventListener("click", startRetryMode);
  }

  restartBtn.addEventListener("click", startNextRound);
  document.querySelector(".app-shell").appendChild(fragment);
}

function answerQuestion(index, choice) {
  const question = state.questions[index];
  if (!question || question.answered) {
    return;
  }

  question.answered = true;
  question.selected = choice;
  state.answeredCount += 1;

  if (choice === question.syllables) {
    state.score += 1;
  } else {
    state.wrongAnswers.push({ ...question });
  }

  updateQuizSummary();
  renderQuestionList();
  showResultsIfFinished();
}

function startRound() {
  clearResults();
  state.questions = createQuestionSet(state.difficulty);
  state.score = 0;
  state.answeredCount = 0;
  state.wrongAnswers = [];
  setPage("quiz");
  renderQuizPage();
}

function startNextRound() {
  state.round += 1;
  startRound();
}

function startRetryMode() {
  clearResults();
  state.questions = state.wrongAnswers.slice(0, BATCH_SIZE).map((item) => ({
    ...item,
    answered: false,
    selected: null,
  }));
  state.score = 0;
  state.answeredCount = 0;
  state.wrongAnswers = [];
  setPage("quiz");
  renderQuizPage();
}

function setDifficulty(level) {
  if (level === state.difficulty) {
    return;
  }

  state.difficulty = level;
  state.round = 1;
  startRound();
}

function setFocusRule(rule) {
  state.focusRule = rule;
  state.round = 1;
  startRound();
}

function setTopicAndDifficulty(rule, level) {
  state.focusRule = rule;
  state.difficulty = level;
  state.round = 1;
  startRound();
}

function goToLessonPage() {
  clearResults();
  setPage("lesson");
  renderConceptCards();
}

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDifficulty(Number(button.dataset.level));
  });
});

showAllRulesBtn.addEventListener("click", () => {
  setTopicAndDifficulty("all", state.difficulty);
});

backToTopicsBtn.addEventListener("click", goToLessonPage);
newSetBtn.addEventListener("click", startNextRound);

renderConceptCards();
setPage("lesson");

