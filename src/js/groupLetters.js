import {
  groupWordsWithNumberAsFirstElement,
  revealNumberElements,
  insertNumberElements,
  revealElements
} from "./groupNumbers";

import { groupWordsWithSpecialChar,insertSpecialElements,doubleColumn} from "./groupSpecialCharacters";

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const trimWhiteSpace = wordArray => wordArray.map(word => word.trim());

const sortAlphabetOrder = wordArray => wordArray.sort();


const getAlphabetSections = words => {
  if (words.length === 0) return [];

  return Object.values(
    pipe(
      trimWhiteSpace,
      sortAlphabetOrder,
      groupWordsByAlphabeticalOrder
    )(words)
  );
};

function groupWordsByAlphabeticalOrder(words) {
  return words.reduce((current, word) => {
    const firstLetter = word[0].toLocaleUpperCase();

    if (!current[firstLetter])
      current[firstLetter] = { letter: firstLetter, words: [word] };
    else current[firstLetter].words.push(word);
    return current;
  }, {});
}

export const getElementById = id => document.getElementById(id);

const groupedLetters = words => getAlphabetSections(words);

const getAllAvailableLetters = words => {
  const letterArray = [];

  for (let index = 0; index < groupedLetters(words).length; index++) {
    letterArray.push(Object.values(groupedLetters(words)[index])[0]);
  }

  return letterArray;
};

const constructListHtml = words => {
  let listString = [];

  for (let index = 0; index < getAlphabetSections(words).length; index++)
    listString.push(
      Object.values(getAlphabetSections(words)[index])[1].map(
        word => `<li>${word}</li>`
      )
    );

  return listString;
};

const removeUngroupedElements = words => {
  getAllAvailableLetters(words).forEach(letter => {
    getElementById(letter).classList.remove("hidden");
  });
};

export const arrayToString = (index, words) =>
  constructListHtml(words)
    [index].toString()
    .replace(new RegExp(",", "g"), "");


const insertElementsIntoAvailableGroups = words => {
  let i = 0;
  getAllAvailableLetters(words).forEach(
    letter =>
      getElementById(letter).lastElementChild.innerHTML = arrayToString(
        i++,
        words
      )
  );
};

const doubleColumnLetters = words => {
  getAllAvailableLetters(words.forEach(
    letter => 
    doubleColumn(letter)
  ))
}


// const doubleColumn = elementId => getElementById(elementId).classList.add("doubleColumn");


export const revealGroupedButtons = matchedLetters => {
  matchedLetters.forEach(letterMatch => {
    document.querySelector(`.${letterMatch}`).classList.remove("hidden");
  });
};

export function startGroupingProcess(words) {
  groupLetters(words);
  groupNumbers(words);
  groupSpecialChars(words);
}

function groupSpecialChars(words) {
  if (groupWordsWithSpecialChar(words).length > 0) {
    revealElements("#special", ".specialchar");
    insertSpecialElements(groupWordsWithSpecialChar(words));
  }
}

function groupLetters(words) {
  var lettersRegex = /^[a-zA-Z][a-zA-Z0-9\W ]+$/;

  const filterUnwantedCharacters = words.filter(matchedContent => lettersRegex.test(matchedContent));
  revealGroupedButtons(getAllAvailableLetters(filterUnwantedCharacters));
  removeUngroupedElements(filterUnwantedCharacters);
  insertElementsIntoAvailableGroups(filterUnwantedCharacters);
}

function groupNumbers(words) {
  revealNumberElements(filterNumbers(words));
  insertNumberElements(filterNumbers(words));
}

const filterNumbers = (words) => words.filter(matchedContent => !isNaN(matchedContent[0]));


