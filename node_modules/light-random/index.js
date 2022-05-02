'use strict';

/**
 * @author Thiago Brezinski
 *
 * light-random <https://github.com/thiagobrez/light-random>
 */
const
  SORT_FACTOR = 0.5,
  DEFAULT_LENGTH = 8,
  ASCII_DIGIT_START = 48,
  ASCII_DIGIT_END = 57,
  ASCII_UPPERCASE_START = 65,
  ASCII_UPPERCASE_END = 90,
  FAKE_ASCII_LOWERCASE_START = 1,
  FAKE_ASCII_LOWERCASE_END = 26,
  ASCII_LOWERCASE_START = 97;

/**
 * Generates a cryptographically weak alphanumerical random string based on the desired length.
 *
 * @param {number} length: generated string length
 * @returns {String}: random string
 */
function lightRandom(length = DEFAULT_LENGTH) {
  return getChars(length, []);
}

/**
 * Generates a random number based on user current time and iterates over pairs checking if the combination
 * matches digits, uppercase or lowercase letters in the ASCII table. When matched, pushes the char to a return
 * array, checking if the array length is the desired user-parametrized length or the method must be called again
 * recursively to reach the desired length.
 *
 * @param {number} length: desired length
 * @param {string[]} chars: array of matched chars
 * @returns {String}: random string
 */
function getChars(length, chars) {
  let shuffledRandom = String(new Date().getTime() * (Math.floor(Math.random() * 10) || 1))
    .split('')
    .sort(() => SORT_FACTOR - Math.random())
    .join('');
  for (let i = 0; i < shuffledRandom.length - 1; i++) {
    if (chars.length === length) break;
    const charCode = Number(shuffledRandom[i] + shuffledRandom[i + 1]);
    if ((charCode >= ASCII_UPPERCASE_START && charCode <= ASCII_UPPERCASE_END) ||
      (charCode >= ASCII_DIGIT_START && charCode <= ASCII_DIGIT_END)) {
      chars.push(String.fromCharCode(charCode));
    } else if (charCode >= FAKE_ASCII_LOWERCASE_START && charCode <= FAKE_ASCII_LOWERCASE_END) {
      chars.push(String.fromCharCode(charCode + ASCII_LOWERCASE_START - 1));
    }
  }
  return chars.length === length ?
    chars.join('') :
    getChars(length, chars);
}

module.exports = lightRandom;
module.exports.lightRandom = lightRandom;