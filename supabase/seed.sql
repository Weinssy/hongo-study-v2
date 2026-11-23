-- Hongo Study v2: seed katalog kartu (dihasilkan oleh scripts/generate-seed.ts)
-- Jalankan di Supabase SQL Editor SETELAH supabase/migrations/0001_init.sql.
-- Aman dijalankan berulang: setiap baris dijaga where not exists.
-- Isi: 46 hiragana + 46 katakana + 100 kosakata JLPT N5 = 192 kartu.

insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'あ', 'a', 'a', null, null, 'hiragana', 0
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'あ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'い', 'i', 'i', null, null, 'hiragana', 1
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'い' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'う', 'u', 'u', null, null, 'hiragana', 2
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'う' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'え', 'e', 'e', null, null, 'hiragana', 3
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'え' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'お', 'o', 'o', null, null, 'hiragana', 4
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'お' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'か', 'ka', 'ka', null, null, 'hiragana', 5
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'か' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'き', 'ki', 'ki', null, null, 'hiragana', 6
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'き' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'く', 'ku', 'ku', null, null, 'hiragana', 7
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'く' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'け', 'ke', 'ke', null, null, 'hiragana', 8
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'け' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'こ', 'ko', 'ko', null, null, 'hiragana', 9
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'こ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'さ', 'sa', 'sa', null, null, 'hiragana', 10
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'さ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'し', 'shi', 'shi', null, null, 'hiragana', 11
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'し' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'す', 'su', 'su', null, null, 'hiragana', 12
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'す' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'せ', 'se', 'se', null, null, 'hiragana', 13
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'せ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'そ', 'so', 'so', null, null, 'hiragana', 14
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'そ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'た', 'ta', 'ta', null, null, 'hiragana', 15
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'た' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ち', 'chi', 'chi', null, null, 'hiragana', 16
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ち' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'つ', 'tsu', 'tsu', null, null, 'hiragana', 17
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'つ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'て', 'te', 'te', null, null, 'hiragana', 18
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'て' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'と', 'to', 'to', null, null, 'hiragana', 19
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'と' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'な', 'na', 'na', null, null, 'hiragana', 20
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'な' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'に', 'ni', 'ni', null, null, 'hiragana', 21
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'に' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ぬ', 'nu', 'nu', null, null, 'hiragana', 22
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ぬ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ね', 'ne', 'ne', null, null, 'hiragana', 23
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ね' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'の', 'no', 'no', null, null, 'hiragana', 24
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'の' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'は', 'ha', 'ha', null, null, 'hiragana', 25
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'は' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ひ', 'hi', 'hi', null, null, 'hiragana', 26
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ひ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ふ', 'fu', 'fu', null, null, 'hiragana', 27
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ふ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'へ', 'he', 'he', null, null, 'hiragana', 28
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'へ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ほ', 'ho', 'ho', null, null, 'hiragana', 29
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ほ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ま', 'ma', 'ma', null, null, 'hiragana', 30
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ま' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'み', 'mi', 'mi', null, null, 'hiragana', 31
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'み' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'む', 'mu', 'mu', null, null, 'hiragana', 32
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'む' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'め', 'me', 'me', null, null, 'hiragana', 33
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'め' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'も', 'mo', 'mo', null, null, 'hiragana', 34
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'も' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'や', 'ya', 'ya', null, null, 'hiragana', 35
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'や' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ゆ', 'yu', 'yu', null, null, 'hiragana', 36
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ゆ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'よ', 'yo', 'yo', null, null, 'hiragana', 37
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'よ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ら', 'ra', 'ra', null, null, 'hiragana', 38
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ら' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'り', 'ri', 'ri', null, null, 'hiragana', 39
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'り' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'る', 'ru', 'ru', null, null, 'hiragana', 40
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'る' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'れ', 're', 're', null, null, 'hiragana', 41
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'れ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ろ', 'ro', 'ro', null, null, 'hiragana', 42
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ろ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'わ', 'wa', 'wa', null, null, 'hiragana', 43
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'わ' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'を', 'wo', 'wo', null, null, 'hiragana', 44
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'を' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ん', 'n', 'n', null, null, 'hiragana', 45
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ん' and c.script = 'hiragana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ア', 'a', 'a', null, null, 'katakana', 0
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ア' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'イ', 'i', 'i', null, null, 'katakana', 1
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'イ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ウ', 'u', 'u', null, null, 'katakana', 2
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ウ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'エ', 'e', 'e', null, null, 'katakana', 3
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'エ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'オ', 'o', 'o', null, null, 'katakana', 4
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'オ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'カ', 'ka', 'ka', null, null, 'katakana', 5
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'カ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'キ', 'ki', 'ki', null, null, 'katakana', 6
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'キ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ク', 'ku', 'ku', null, null, 'katakana', 7
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ク' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ケ', 'ke', 'ke', null, null, 'katakana', 8
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ケ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'コ', 'ko', 'ko', null, null, 'katakana', 9
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'コ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'サ', 'sa', 'sa', null, null, 'katakana', 10
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'サ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'シ', 'shi', 'shi', null, null, 'katakana', 11
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'シ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ス', 'su', 'su', null, null, 'katakana', 12
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ス' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'セ', 'se', 'se', null, null, 'katakana', 13
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'セ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ソ', 'so', 'so', null, null, 'katakana', 14
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ソ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'タ', 'ta', 'ta', null, null, 'katakana', 15
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'タ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'チ', 'chi', 'chi', null, null, 'katakana', 16
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'チ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ツ', 'tsu', 'tsu', null, null, 'katakana', 17
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ツ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'テ', 'te', 'te', null, null, 'katakana', 18
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'テ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ト', 'to', 'to', null, null, 'katakana', 19
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ト' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ナ', 'na', 'na', null, null, 'katakana', 20
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ナ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ニ', 'ni', 'ni', null, null, 'katakana', 21
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ニ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ヌ', 'nu', 'nu', null, null, 'katakana', 22
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ヌ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ネ', 'ne', 'ne', null, null, 'katakana', 23
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ネ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ノ', 'no', 'no', null, null, 'katakana', 24
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ノ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ハ', 'ha', 'ha', null, null, 'katakana', 25
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ハ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ヒ', 'hi', 'hi', null, null, 'katakana', 26
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ヒ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'フ', 'fu', 'fu', null, null, 'katakana', 27
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'フ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ヘ', 'he', 'he', null, null, 'katakana', 28
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ヘ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ホ', 'ho', 'ho', null, null, 'katakana', 29
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ホ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'マ', 'ma', 'ma', null, null, 'katakana', 30
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'マ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ミ', 'mi', 'mi', null, null, 'katakana', 31
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ミ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ム', 'mu', 'mu', null, null, 'katakana', 32
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ム' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'メ', 'me', 'me', null, null, 'katakana', 33
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'メ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'モ', 'mo', 'mo', null, null, 'katakana', 34
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'モ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ヤ', 'ya', 'ya', null, null, 'katakana', 35
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ヤ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ユ', 'yu', 'yu', null, null, 'katakana', 36
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ユ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ヨ', 'yo', 'yo', null, null, 'katakana', 37
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ヨ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ラ', 'ra', 'ra', null, null, 'katakana', 38
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ラ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'リ', 'ri', 'ri', null, null, 'katakana', 39
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'リ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ル', 'ru', 'ru', null, null, 'katakana', 40
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ル' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'レ', 're', 're', null, null, 'katakana', 41
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'レ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ロ', 'ro', 'ro', null, null, 'katakana', 42
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ロ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ワ', 'wa', 'wa', null, null, 'katakana', 43
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ワ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ヲ', 'wo', 'wo', null, null, 'katakana', 44
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ヲ' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'kana', 'ン', 'n', 'n', null, null, 'katakana', 45
where not exists (select 1 from public.cards c where c.type = 'kana' and c.front = 'ン' and c.script = 'katakana');
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '私', 'saya', 'watashi', '私は学生です。', 'Saya seorang pelajar.', null, 0
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '私' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'あなた', 'kamu; Anda', 'anata', 'あなたは学生ですか。', 'Apakah kamu pelajar?', null, 1
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'あなた' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '人', 'orang', 'hito', 'あの人は学生です。', 'Orang itu pelajar.', null, 2
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '人' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '学生', 'pelajar; mahasiswa', 'gakusei', '私は学生です。', 'Saya pelajar.', null, 3
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '学生' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '先生', 'guru', 'sensei', '私の先生です。', 'Itu guru saya.', null, 4
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '先生' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '学校', 'sekolah', 'gakkou', '学校は近いです。', 'Sekolahnya dekat.', null, 5
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '学校' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '大学', 'universitas', 'daigaku', '大学で勉強します。', 'Saya belajar di universitas.', null, 6
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '大学' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '家族', 'keluarga', 'kazoku', '家族は五人です。', 'Keluarga saya lima orang.', null, 7
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '家族' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '会社', 'perusahaan', 'kaisha', '父は会社員です。', 'Ayah saya karyawan perusahaan.', null, 8
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '会社' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '車', 'mobil', 'kuruma', '車で来ます。', 'Saya datang naik mobil.', null, 9
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '車' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '自転車', 'sepeda', 'jitensha', '自転車で学校へ行きます。', 'Saya pergi ke sekolah naik sepeda.', null, 10
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '自転車' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '電車', 'kereta listrik', 'densha', '電車で行きます。', 'Saya pergi naik kereta.', null, 11
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '電車' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '駅', 'stasiun', 'eki', '駅は近いです。', 'Stasiunnya dekat.', null, 12
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '駅' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '空港', 'bandara', 'kuukou', '空港へ行きます。', 'Saya pergi ke bandara.', null, 13
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '空港' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '病院', 'rumah sakit', 'byouin', '病院へ行きます。', 'Saya pergi ke rumah sakit.', null, 14
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '病院' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '銀行', 'bank', 'ginkou', '銀行は三時までです。', 'Bank buka sampai jam tiga.', null, 15
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '銀行' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '図書館', 'perpustakaan', 'toshokan', '図書館で勉強します。', 'Saya belajar di perpustakaan.', null, 16
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '図書館' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '公園', 'taman', 'kouen', '公園を散歩します。', 'Saya jalan-jalan di taman.', null, 17
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '公園' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '本', 'buku', 'hon', '本を読みます。', 'Saya membaca buku.', null, 18
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '本' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '新聞', 'koran', 'shinbun', '朝、新聞を読みます。', 'Pagi hari saya membaca koran.', null, 19
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '新聞' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '電話', 'telepon', 'denwa', '電話をかけます。', 'Saya menelepon.', null, 20
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '電話' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '時計', 'jam (arloji/dinding)', 'tokei', '時計を見ます。', 'Saya melihat jam.', null, 21
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '時計' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '鍵', 'kunci', 'kagi', '鍵をかけます。', 'Saya mengunci (pintu).', null, 22
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '鍵' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '部屋', 'kamar', 'heya', '部屋は広いです。', 'Kamarnya luas.', null, 23
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '部屋' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '家', 'rumah', 'ie', '家へ帰ります。', 'Saya pulang ke rumah.', null, 24
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '家' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '店', 'toko', 'mise', '店は近いです。', 'Tokonya dekat.', null, 25
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '店' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '犬', 'anjing', 'inu', '犬が好きです。', 'Saya suka anjing.', null, 26
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '犬' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '猫', 'kucing', 'neko', '猫は小さいです。', 'Kucingnya kecil.', null, 27
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '猫' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '鳥', 'burung', 'tori', '鳥が空を飛びます。', 'Burung terbang di langit.', null, 28
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '鳥' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '魚', 'ikan', 'sakana', '魚を食べます。', 'Saya makan ikan.', null, 29
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '魚' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '山', 'gunung', 'yama', '山に登ります。', 'Saya mendaki gunung.', null, 30
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '山' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '川', 'sungai', 'kawa', '川で泳ぎます。', 'Saya berenang di sungai.', null, 31
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '川' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '海', 'laut', 'umi', '海は広いです。', 'Laut itu luas.', null, 32
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '海' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '空', 'langit', 'sora', '空は青いです。', 'Langitnya biru.', null, 33
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '空' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '雨', 'hujan', 'ame', '雨が降っています。', 'Sedang turun hujan.', null, 34
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '雨' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '雪', 'salju', 'yuki', '雪が降ります。', 'Salju turun.', null, 35
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '雪' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '風', 'angin', 'kaze', '風が強いです。', 'Anginnya kencang.', null, 36
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '風' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '花', 'bunga', 'hana', '花がきれいです。', 'Bunganya cantik.', null, 37
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '花' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '木', 'pohon', 'ki', '木の下にいます。', 'Saya di bawah pohon.', null, 38
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '木' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '水', 'air', 'mizu', '水を飲みます。', 'Saya minum air.', null, 39
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '水' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'お茶', 'teh', 'ocha', 'お茶をください。', 'Tolong tehnya.', null, 40
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'お茶' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'ご飯', 'nasi; makanan', 'gohan', 'ご飯を食べます。', 'Saya makan nasi.', null, 41
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'ご飯' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'パン', 'roti', 'pan', 'パンが好きです。', 'Saya suka roti.', null, 42
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'パン' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '肉', 'daging', 'niku', '肉を買います。', 'Saya membeli daging.', null, 43
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '肉' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '牛乳', 'susu', 'gyuunyuu', '牛乳を飲みます。', 'Saya minum susu.', null, 44
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '牛乳' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '卵', 'telur', 'tamago', '卵を食べます。', 'Saya makan telur.', null, 45
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '卵' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '果物', 'buah-buahan', 'kudamono', '果物が好きです。', 'Saya suka buah.', null, 46
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '果物' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'りんご', 'apel', 'ringo', 'りんごは赤いです。', 'Apelnya merah.', null, 47
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'りんご' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'みかん', 'jeruk', 'mikan', 'みかんを食べます。', 'Saya makan jeruk.', null, 48
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'みかん' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'お金', 'uang', 'okane', 'お金がありません。', 'Saya tidak punya uang.', null, 49
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'お金' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '辞書', 'kamus', 'jisho', '辞書を使います。', 'Saya memakai kamus.', null, 50
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '辞書' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '映画', 'film', 'eiga', '映画を見ます。', 'Saya menonton film.', null, 51
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '映画' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '今日', 'hari ini', 'kyou', '今日は暑いです。', 'Hari ini panas.', null, 52
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '今日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '明日', 'besok', 'ashita', '明日来ます。', 'Saya datang besok.', null, 53
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '明日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '昨日', 'kemarin', 'kinou', '昨日は雨でした。', 'Kemarin hujan.', null, 54
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '昨日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '朝', 'pagi', 'asa', '朝ご飯を食べます。', 'Saya sarapan.', null, 55
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '朝' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '夜', 'malam', 'yoru', '夜は静かです。', 'Malam hari tenang.', null, 56
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '夜' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '今晩', 'malam ini', 'konban', '今晩、勉強します。', 'Malam ini saya belajar.', null, 57
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '今晩' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '午前', 'pagi (AM)', 'gozen', '午前九時に起きます。', 'Saya bangun jam 9 pagi.', null, 58
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '午前' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '午後', 'siang/sore (PM)', 'gogo', '午後三時に会います。', 'Kita bertemu jam 3 sore.', null, 59
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '午後' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '毎日', 'setiap hari', 'mainichi', '毎日勉強します。', 'Saya belajar setiap hari.', null, 60
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '毎日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '月曜日', 'Senin', 'getsuyoubi', '月曜日に学校へ行きます。', 'Hari Senin saya pergi ke sekolah.', null, 61
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '月曜日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '火曜日', 'Selasa', 'kayoubi', '火曜日は休みです。', 'Hari Selasa libur.', null, 62
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '火曜日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '水曜日', 'Rabu', 'suiyoubi', '水曜日に会います。', 'Kita bertemu hari Rabu.', null, 63
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '水曜日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '木曜日', 'Kamis', 'mokuyoubi', '木曜日はテストです。', 'Hari Kamis ada tes.', null, 64
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '木曜日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '金曜日', 'Jumat', 'kinyoubi', '金曜日に映画を見ます。', 'Hari Jumat saya menonton film.', null, 65
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '金曜日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '土曜日', 'Sabtu', 'doyoubi', '土曜日は休みます。', 'Hari Sabtu saya istirahat.', null, 66
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '土曜日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '日曜日', 'Minggu', 'nichiyoubi', '日曜日に公園へ行きます。', 'Hari Minggu saya pergi ke taman.', null, 67
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '日曜日' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '誰', 'siapa', 'dare', 'あの人は誰ですか。', 'Orang itu siapa?', null, 68
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '誰' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '何', 'apa', 'nani', 'これは何ですか。', 'Ini apa?', null, 69
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '何' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'ここ', 'di sini', 'koko', 'ここに座ります。', 'Saya duduk di sini.', null, 70
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'ここ' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'そこ', 'di situ', 'soko', 'そこに本があります。', 'Di situ ada buku.', null, 71
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'そこ' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'あそこ', 'di sana', 'asoko', 'あそこは駅です。', 'Di sana itu stasiun.', null, 72
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'あそこ' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '右', 'kanan', 'migi', '右を見ます。', 'Saya melihat ke kanan.', null, 73
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '右' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '左', 'kiri', 'hidari', '左に曲がります。', 'Saya belok kiri.', null, 74
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '左' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '上', 'atas', 'ue', '机の上に本があります。', 'Di atas meja ada buku.', null, 75
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '上' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '下', 'bawah', 'shita', '猫は椅子の下にいます。', 'Kucing ada di bawah kursi.', null, 76
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '下' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '前', 'depan', 'mae', '駅の前にいます。', 'Saya di depan stasiun.', null, 77
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '前' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '大きい', 'besar', 'ookii', 'この家は大きいです。', 'Rumah ini besar.', null, 78
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '大きい' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '小さい', 'kecil', 'chiisai', '部屋は小さいです。', 'Kamarnya kecil.', null, 79
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '小さい' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '新しい', 'baru', 'atarashii', '新しい車です。', 'Ini mobil baru.', null, 80
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '新しい' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '古い', 'lama; tua (benda)', 'furui', '古い本です。', 'Ini buku lama.', null, 81
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '古い' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '高い', 'mahal; tinggi', 'takai', 'この時計は高いです。', 'Jam ini mahal.', null, 82
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '高い' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '安い', 'murah', 'yasui', 'この傘は安いです。', 'Payung ini murah.', null, 83
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '安い' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '暑い', 'panas (cuaca)', 'atsui', '今日は暑いです。', 'Hari ini panas.', null, 84
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '暑い' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '寒い', 'dingin (cuaca)', 'samui', '今日は寒いです。', 'Hari ini dingin.', null, 85
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '寒い' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '忙しい', 'sibuk', 'isogashii', '今日は忙しいです。', 'Hari ini saya sibuk.', null, 86
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '忙しい' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '楽しい', 'menyenangkan', 'tanoshii', 'パーティーは楽しかったです。', 'Pestanya menyenangkan.', null, 87
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '楽しい' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', 'おいしい', 'enak', 'oishii', 'このケーキはおいしいです。', 'Kue ini enak.', null, 88
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = 'おいしい' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '近い', 'dekat', 'chikai', '駅は近いです。', 'Stasiunnya dekat.', null, 89
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '近い' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '遠い', 'jauh', 'tooi', '学校は遠いです。', 'Sekolahnya jauh.', null, 90
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '遠い' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '行く', 'pergi', 'iku', '学校へ行きます。', 'Saya pergi ke sekolah.', null, 91
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '行く' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '来る', 'datang', 'kuru', '友達が来ます。', 'Teman saya datang.', null, 92
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '来る' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '帰る', 'pulang', 'kaeru', '家へ帰ります。', 'Saya pulang ke rumah.', null, 93
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '帰る' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '食べる', 'makan', 'taberu', 'パンを食べます。', 'Saya makan roti.', null, 94
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '食べる' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '飲む', 'minum', 'nomu', '水を飲みます。', 'Saya minum air.', null, 95
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '飲む' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '見る', 'melihat', 'miru', 'テレビを見ます。', 'Saya menonton TV.', null, 96
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '見る' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '聞く', 'mendengar; bertanya', 'kiku', '音楽を聞きます。', 'Saya mendengarkan musik.', null, 97
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '聞く' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '話す', 'berbicara', 'hanasu', '日本語を話します。', 'Saya berbicara bahasa Jepang.', null, 98
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '話す' and c.script is null);
insert into public.cards (type, front, back, romaji, example, example_id, script, sort_order)
select 'vocab', '買う', 'membeli', 'kau', '本を買います。', 'Saya membeli buku.', null, 99
where not exists (select 1 from public.cards c where c.type = 'vocab' and c.front = '買う' and c.script is null);
