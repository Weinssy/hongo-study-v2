// Dataset kana dasar (gojuuon) — 46 hiragana + 46 katakana.
// Karakter kana adalah fakta dasar bahasa (domain publik); romaji memakai
// sistem Hepburn. Tanpa dakuten/youon — itu tambahan Fase berikutnya.
// Lihat DATA.md untuk catatan sumber & lisensi.

export interface KanaEntry {
  char: string;
  romaji: string;
}

const ROWS: ReadonlyArray<readonly [string, string, string]> = [
  // [hiragana, katakana, romaji] — urutan gojuuon standar
  ["あ", "ア", "a"], ["い", "イ", "i"], ["う", "ウ", "u"], ["え", "エ", "e"], ["お", "オ", "o"],
  ["か", "カ", "ka"], ["き", "キ", "ki"], ["く", "ク", "ku"], ["け", "ケ", "ke"], ["こ", "コ", "ko"],
  ["さ", "サ", "sa"], ["し", "シ", "shi"], ["す", "ス", "su"], ["せ", "セ", "se"], ["そ", "ソ", "so"],
  ["た", "タ", "ta"], ["ち", "チ", "chi"], ["つ", "ツ", "tsu"], ["て", "テ", "te"], ["と", "ト", "to"],
  ["な", "ナ", "na"], ["に", "ニ", "ni"], ["ぬ", "ヌ", "nu"], ["ね", "ネ", "ne"], ["の", "ノ", "no"],
  ["は", "ハ", "ha"], ["ひ", "ヒ", "hi"], ["ふ", "フ", "fu"], ["へ", "ヘ", "he"], ["ほ", "ホ", "ho"],
  ["ま", "マ", "ma"], ["み", "ミ", "mi"], ["む", "ム", "mu"], ["め", "メ", "me"], ["も", "モ", "mo"],
  ["や", "ヤ", "ya"], ["ゆ", "ユ", "yu"], ["よ", "ヨ", "yo"],
  ["ら", "ラ", "ra"], ["り", "リ", "ri"], ["る", "ル", "ru"], ["れ", "レ", "re"], ["ろ", "ロ", "ro"],
  ["わ", "ワ", "wa"], ["を", "ヲ", "wo"], ["ん", "ン", "n"],
];

export const HIRAGANA: KanaEntry[] = ROWS.map(([char, , romaji]) => ({ char, romaji }));
export const KATAKANA: KanaEntry[] = ROWS.map(([, char, romaji]) => ({ char, romaji }));
