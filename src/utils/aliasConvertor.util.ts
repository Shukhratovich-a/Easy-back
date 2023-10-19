import { cyrillicToLatin } from './cyrillicToLatin.util';

const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890-';
const ignoreWords = ['and', 'i'];

export const aliasConvertor = (text: string, id: number) => {
  let alias = cyrillicToLatin(text.toLowerCase());

  alias = alias
    .split(' ')
    .filter((word) => !ignoreWords.includes(word))
    .splice(0, 3)
    .join('-')
    .split('')
    .filter((char) => alphabet.includes(char))
    .join('');

  return alias + `-${10000 + id}`;
};
