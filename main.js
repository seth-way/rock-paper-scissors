// <> <> GLOBAL VARIABLES <> <> //
var options3 = ['rock', 'paper', 'scissors'];
var options5 = ['rock', 'paper', 'scissors', 'banana', 'bow-arrow'];
var game = createGame();
var players = {
  p0: createPlayer(),
  p1: createAIOpponent(),
};
// <> <> DOM VARIABLES <> <> //
//- buttons -//
var buttonsLayer = document.querySelector('#buttons-layer');
var buttonGroupB = document.querySelectorAll('.btn-grp-b');
var buttonGroupC = document.querySelectorAll('.btn-grp-c');
// <> <> EVENT LISTENERS <> <> //
//- load -//
window.addEventListener('load', prepareDOM);
// <> <> FUNCTIONS <> <> //
//- prepare page functions -//
function prepareDOM() {
  addControllerButtonsToDOM();
}

function addControllerButtonsToDOM() {
  buttonGroupB.forEach(function (buttonGroup, idx) {
    buttonGroupB[idx].innerHTML = '';
    buttonGroupC[idx].innerHTML = '';
    game.options.forEach(function (option, optionIdx) {
      const buttonElement = document.createElement('button');
      buttonElement.id = `${option}-${idx}`;
      if (idx === 1) buttonElement.classList.add('right-side');
      const buttonImage = createChoiceElement(option, idx);
      buttonElement.appendChild(buttonImage);
      if (optionIdx < 3) {
        buttonGroup.appendChild(buttonElement);
      } else {
        buttonGroupC[idx].appendChild(buttonElement);
      }
    });
  });
}
//- create new element functions -//
function createChoiceElement(choice, player) {
  const optionImage = document.createElement('img');
  optionImage.src = `assets/choices/${choice}.svg`;
  if (player === 1) optionImage.classList.add('right-side');
  optionImage.dsc = `${choice} emoji`;
  return optionImage;
}

function createAvatar(avatarType = 'default') {
  const avatar = document.createElement('img');
  avatar.type = avatarType;
  avatar.classList.add('avatar');
  avatar.src = `assets/avatar-emojis/${avatarType}.svg`;
  avatar.alt = `${avatarType} avatar emoji`;
  return avatar;
}
//- game logic functions -//
function createPlayer(name = 'Hero', avatar = createAvatar(), wins = 0) {
  return {
    name,
    avatar,
    wins,
  };
}

function createAIOpponent() {
  return {
    name: 'RPS-A-Bot',
    avatar: createAvatar('robot'),
    wins: 0,
    ai: true,
  };
}

function createGame(options = options3) {
  return {
    choices: {
      p0: null,
      p1: null,
    },
    outcome: null,
    options,
  };
}
