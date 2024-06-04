// <> <> GLOBAL VARIABLES <> <> //
var options = {
  options3: ['rock', 'paper', 'scissors'],
  options5: ['rock', 'paper', 'scissors', 'banana', 'bow-arrow'],
};
var settings = { showMenu: false, version: 'options3' };
var game = createGame();
var players = createDefaultPlayers();
// <> <> DOM VARIABLES <> <> //
//- buttons -//
var buttonsLayer = document.querySelector('#buttons-layer');
var buttonGroupB = document.querySelectorAll('.btn-grp-b');
var buttonGroupC = document.querySelectorAll('.btn-grp-c');
//- containers -//
var playerInfoAreas = document.querySelectorAll('.player-info');
var gameArea = document.querySelector('#game');
// <> <> EVENT LISTENERS <> <> //
//- load -//
window.addEventListener('load', prepareDOM);
//- click -//
buttonsLayer.addEventListener('click', handleButtonClick);
// <> <> FUNCTIONS <> <> //
//- prepare page functions -//
function prepareDOM() {
  createDefaultPlayers();
  addControllerButtonsDOM();
  updateplayerInfoDOM();
  addPlayerSelectionsDOM();
}
//- update DOM functions -//
function addControllerButtonsDOM() {
  buttonGroupB.forEach(function (buttonGroup, idx) {
    buttonGroupB[idx].innerHTML = '';
    buttonGroupC[idx].innerHTML = '';
    options[settings.version].forEach(function (option, optionIdx) {
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

function updateplayerInfoDOM() {
  playerInfoAreas.forEach(function (area, idx) {
    area.innerHTML = '';
    const player = players[`p${idx}`];

    const playerTitle = document.createElement('h2');
    playerTitle.innerText = player.name;

    const playerWins = document.createElement('h3');
    playerWins.innerHTML = `<u>Wins:</u><br>${player.wins}`;

    area.append(player.avatar, playerTitle, playerWins);
  });
}

function showHideMenu() {
  playerInfoAreas.forEach(function (area) {
    area.classList.toggle('hide');
  });
}

function addPlayerSelectionsDOM(selection0, selection1, animations) {
  game.emojisOnDOM.forEach(function (element) {
    gameArea.removeChild(element);
  });

  if (!selection0) selection0 = options[settings.version][0];
  if (!selection1) selection1 = options[settings.version][0];
  var p0Selection = createChoiceElement(selection0, 0, animations || ['ready']);
  var p1Selection = createChoiceElement(selection1, 1, animations || ['ready']);
  p0Selection.id += '-battle';
  p1Selection.id += '-battle';
  gameArea.appendChild(p0Selection);
  gameArea.appendChild(p1Selection);
  game.emojisOnDOM = [p0Selection, p1Selection];
}
//- create new element functions -//
function createChoiceElement(choice, player, animations) {
  const optionImage = document.createElement('img');
  optionImage.id = `${choice}-${player}`;
  optionImage.src = `assets/choices/${choice}.svg`;
  if (animations) optionImage.classList.add(...animations);
  if (player === 1) optionImage.classList.add('right-side');
  optionImage.alt = `${choice} emoji`;
  return optionImage;
}

function createAvatar(avatarType = 'default') {
  const avatar = document.createElement('img');
  // avatar.type = avatarType;
  avatar.classList.add('avatar');
  avatar.src = `assets/avatars/${avatarType}.svg`;
  avatar.alt = `${avatarType} avatar emoji`;
  return avatar;
}
//- click handler functions -//
function handleButtonClick(e) {
  e.preventDefault();
  console.log(e.target);
  let targetID;
  if (e.target.tagName === 'IMG' || e.target.tagName === 'BUTTON') {
    targetID = e.target.closest('button').id;
    handleUserChoiceClick(targetID);
  } else if (e.target.classList.contains('clickable')) {
    targetID = e.target.id;
    if (targetID.startsWith('d-')) {
      handleDPadClick(targetID);
    } else {
      handleGameStateClick(targetID);
    }
  }
}

function handleUserChoiceClick(id) {}

function handleDPadClick(id) {
  console.log('d-pad clicked.', id);
}

function handleGameStateClick(id) {
  if (id === 'menu') {
    settings.showMenu = !settings.showMenu;
    showHideMenu();
  } else if (id === 'mode') {
    if (settings.version === 'options3') {
      settings.version = 'options5';
    } else {
      settings.version = 'options3';
    }

    addControllerButtonsDOM();
  } else {
    game = createGame(game.version);
    players = createDefaultPlayers();
    if (settings.showMenu) {
      showHideMenu();
      settings.showMenu = false;
    }
    updateplayerInfoDOM();
    addPlayerSelectionsDOM();
  }
}
//- game logic functions -//
function createDefaultPlayers() {
  return {
    p0: createPlayer(),
    p1: createAIOpponent(),
  };
}

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

function createGame(version) {
  if (!version) version = { options3: true, options5: false };
  return {
    selected: {
      p0: null,
      p1: null,
    },
    emojisOnDOM: [],
    outcome: null,
  };
}
