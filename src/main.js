/* eslint-disable no-undef */
// <> <> GLOBAL VARIABLES <> <> //
var options = {
  options3: ['rock', 'paper', 'scissors'],
  options5: ['rock', 'paper', 'scissors', 'spock', 'lizard'],
};
var settings = { showMenu: false, version: 'options3', onePlayer: true };
var winMessage = {
  rock: { scissors: 'Rock crushes Scissors', lizard: 'Rock crushes Lizard' },
  paper: { rock: 'Paper covers Rock', spock: 'Paper disproves Spock' },
  scissors: {
    paper: 'Scissors cut Paper',
    lizard: 'Scissors decapitate Lizard',
  },
  spock: { rock: 'Spock vaporizes Rock', scissors: 'Spock smashes Scissors' },
  lizard: { paper: 'Lizard eats Paper', spock: 'Lizard poisons Spock' },
};
var game = createGame();
var players = createDefaultPlayers();
var playerUpdates = {};
// <> <> DOM VARIABLES <> <> //
//- buttons -//
var buttonsLayer = document.querySelector('#buttons-layer');
var buttonGroupB = document.querySelectorAll('.btn-grp-b');
var buttonGroupC = document.querySelectorAll('.btn-grp-c');
var menuButton = document.querySelector('#menu');
var modeButton = document.querySelector('#mode');
var resetButton = document.querySelector('#reset');
//- containers -//
var device = document.querySelector('#console');
var playerInfoAreas = document.querySelectorAll('.player-info');
var gameArea = document.querySelector('#game');
var gameHeading = document.querySelector('#sky').querySelector('h3');
var gameInfo = document.querySelector('#sky').querySelector('p');
//- form elements -//
var avatarLists = document.querySelectorAll('.dropdown-content');
var featuredAvatars = {
  p0: document.querySelector('#avatar-featured-0'),
  p1: document.querySelector('#avatar-featured-1'),
};
var optionsMenu = document.querySelector('#menu-layer');
// <> <> EVENT LISTENERS <> <> //
//- load -//
window.addEventListener('load', prepareDOM);
//- click -//
buttonsLayer.addEventListener('click', handleButtonClick);
//- options menu -//
optionsMenu.addEventListener('click', handleOptionsClick);
// optionsMenu.addEventListener('change', handleOptionsChange);
// <> <> FUNCTIONS <> <> //
//- prepare page functions -//
function prepareDOM() {
  addAvatarOptionsToMenu();
  updateGameMessages();
  createDefaultPlayers();
  addControllerButtonsDOM();
  togglePlayerButtons(1);
  updatePlayerInfoDOM();
  addPlayerSelectionsDOM();
}

function addAvatarOptionsToMenu() {
  featuredAvatars.p0.innerText = 'Default';
  featuredAvatars.p1.innerText = 'Robot';
  avatarLists.forEach(function (element, idx) {
    avatars.forEach(function (avatar) {
      const avatarOption = document.createElement('div');
      avatarOption.classList.add('avatar-option');
      avatarOption.innerText = avatar;
      avatarOption.id = `new-avatar-p${idx}`;
      element.appendChild(avatarOption);
    });
  });
}
//- update DOM functions -//
function addControllerButtonsDOM() {
  buttonGroupB.forEach(function (buttonGroup, idx) {
    buttonGroupB[idx].innerHTML = '';
    buttonGroupC[idx].innerHTML = '';
    options[settings.version].forEach(function (option, optionIdx) {
      const buttonElement = document.createElement('button');
      buttonElement.id = `${option}-${idx}`;
      buttonElement.classList.add(`btn-${option}`);
      if (idx === 1) {
        buttonElement.classList.add('right-side');
      }
      const buttonOverlay = document.createElement('span');
      buttonOverlay.classList.add('button-overlay', `btn-${option}`);
      buttonElement.appendChild(buttonOverlay);
      const buttonImage = createChoiceElement(option, idx);
      buttonOverlay.appendChild(buttonImage);
      if (optionIdx < 3) {
        buttonGroup.appendChild(buttonElement);
      } else {
        buttonGroupC[idx].appendChild(buttonElement);
      }
    });
  });
}

function togglePlayerButtons(player) {
  var buttonsB = buttonGroupB[player].querySelectorAll('button');
  var buttonsC = buttonGroupC[player].querySelectorAll('button');
  [...buttonsB, ...buttonsC].forEach(function (button) {
    button.classList.toggle('disable');
  });
}

function toggleOtherButtons() {
  menuButton.classList.toggle('disable');
  modeButton.classList.toggle('disable');
  resetButton.classList.toggle('disable');
}

function updatePlayerInfoDOM() {
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
  game.emojisOnDOM.forEach(function (emoji) {
    emoji.classList.toggle('fade-out');
  });
  optionsMenu.classList.toggle('hide');
}

function addPlayerSelectionsDOM(selection0, selection1, animations) {
  gameArea.innerHTML = '';
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

async function updateGameMessages(heading = 'Choose Your Weapon.', info = '') {
  gameHeading.classList.add('fade-out');
  gameInfo.classList.add('fade-out');
  await pauseForCSSTransition(0.5);
  gameHeading.innerText = heading;
  gameInfo.innerText = info;
  gameHeading.classList.remove('fade-out');
  gameInfo.classList.remove('fade-out');
  return await pauseForCSSTransition(0.5);
}

async function runBattleAnimations() {
  game.emojisOnDOM.forEach(function (emoji) {
    emoji.classList.remove('ready');
    emoji.classList.add('pre-battle');
  });
  await pauseForCSSTransition(1.5);
  game.emojisOnDOM.forEach(function (emoji) {
    emoji.classList.remove('pre-battle');
    emoji.classList.add('fade-out');
  });
  await pauseForCSSTransition(0.4);
  await addPlayerSelectionsDOM(game.selected.p0, game.selected.p1, ['attack']);
  await runResultsAnimations();
}

async function runResultsAnimations() {
  if (game.winner) {
    await updateGameMessages(
      `${players[game.winner].name} wins!`,
      game.message
    );
    updatePlayerInfoDOM();
    const winner = Number(game.winner.slice(-1));
    playerInfoAreas.forEach(function (area, idx) {
      let avatar = area.querySelector('img');
      if (idx === winner) {
        avatar.classList.add('victory');
      } else {
        avatar.classList.add('defeat');
      }
    });
    await pauseForCSSTransition(3);
    playerInfoAreas.forEach(function (area) {
      const avatar = area.querySelector('img');
      avatar.classList.remove('victory', 'defeat');
    });
  } else {
    await updateGameMessages(game.message);
    await pauseForCSSTransition(1.5);
  }
  await updateGameMessages();

  togglePlayerButtons(0);
  if (!settings.onePlayer) togglePlayerButtons(1);
  toggleOtherButtons();

  game = createGame();
  addPlayerSelectionsDOM();
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
  let targetID;
  if (e.target.tagName === 'IMG' || e.target.tagName === 'BUTTON') {
    targetID = e.target.closest('button').id;
    handleUserChoiceClick(targetID);
  } else if (
    e.target.classList.contains('clickable') ||
    e.target.classList.contains('button-overlay')
  ) {
    targetID = e.target.closest('div').id;
    if (targetID.startsWith('d-')) {
      handleDPadClick(targetID);
    } else {
      handleGameStateClick(targetID);
    }
  }
}

async function handleUserChoiceClick(id) {
  if (game.message || settings.showMenu) return;

  const player = Number(id.slice(-1));

  if (player === 1 && settings.onePlayer) return;
  if (game.selected[`p${player}`]) return;

  togglePlayerButtons(player);
  toggleOtherButtons();

  const choice = id.slice(0, id.length - 2);
  game.selected[`p${player}`] = choice;

  if (assessGameCompletion()) {
    determineOutcome(game.selected.p0, game.selected.p1);
    await updateGameMessages('Get Ready...');
    await runBattleAnimations();
  }
}

function handleDPadClick(id) {
  console.log('d-pad clicked.', id);
}

async function handleGameStateClick(id) {
  if (id === 'menu') {
    settings.showMenu = !settings.showMenu;
    showHideMenu();
  } else if (id === 'mode') {
    if (settings.version === 'options3') {
      settings.version = 'options5';
    } else {
      settings.version = 'options3';
    }
    device.classList.add('flip');
    await pauseForCSSTransition(0.5);
    addControllerButtonsDOM();
    if (settings.onePlayer) togglePlayerButtons(1);
    await pauseForCSSTransition(0.5);
    device.classList.remove('flip');
  } else {
    game = createGame(game.version);
    players = createDefaultPlayers();
    gameArea.innerHTML = '';
    if (settings.showMenu) {
      showHideMenu();
      settings.showMenu = false;
    }
    updatePlayerInfoDOM();
    addPlayerSelectionsDOM();
  }
}
//- options menu handler functions -//
function handleOptionsClick(e) {
  e.preventDefault();
  const id = e.target.id;
  console.log(id);
  if (id) {
    if (id.startsWith('name') || id.startsWith('avatar-featured')) return;
    if (id.startsWith('new-avatar')) {
      const player = id.slice(-2);
      if (!playerUpdates[player]) playerUpdates[player] = {};
      playerUpdates[player].avatar = createAvatar(e.target.innerText);
      featuredAvatars[player].innerText = e.target.innerText;
    } else if (id.startsWith('players-count')) {
      return;
    } else {
      if (id === 'update-options') {
        if (optionsMenu['name-0'].value) {
          playerUpdates.p0.name = optionsMenu['name-0'].value.slice(0, 20);
        }
        if (optionsMenu['name-1'].value) {
          playerUpdates.p1.name = optionsMenu['name-1'].value.slice(0, 20);
        }
        if (Object.keys(playerUpdates).length) {
          updatePlayers(playerUpdates);
        }
      }
      settings.showMenu = !settings.showMenu;
      showHideMenu();
    }
  }
}
//- game logic functions -//
function createDefaultPlayers() {
  return {
    p0: createPlayer(),
    p1: createPlayer('RPS-A-Bot', createAvatar('robot')),
  };
}

function createPlayer(name = 'Hero', avatar = createAvatar(), wins = 0) {
  return {
    name,
    avatar,
    wins,
  };
}

function updatePlayers(updates) {
  if (updates.p0) players.p0 = { ...players.p0, ...updates.p0 };
  if (updates.p1) players.p1 = { ...players.p1, ...updates.p1 };
  players.p0.wins = 0;
  players.p1.wins = 0;
  updatePlayerInfoDOM();
}

function createGame() {
  let emojisOnDOM = [];
  if (game) emojisOnDOM = game.emojisOnDOM;
  return {
    selected: {
      p0: null,
      p1: null,
    },
    emojisOnDOM,
    winner: null,
    message: null,
  };
}

function assessGameCompletion() {
  if (game.selected.p0) {
    if (game.selected.p1) {
      return true;
    }

    if (settings.onePlayer) {
      game.selected.p1 = getRandomChoice();
      return true;
    }
  }

  return false;
}

function getRandomChoice() {
  const choices = options[settings.version];
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineOutcome(choice0, choice1) {
  if (game.selected.p0 === game.selected.p1) {
    game.message = "It's a Draw!";
  } else {
    game.message = winMessage[choice0][choice1];
    if (game.message) {
      game.winner = 'p0';
    } else {
      game.message = winMessage[choice1][choice0];
      game.winner = 'p1';
    }
    players[game.winner].wins += 1;
  }
}

//- other functions -//
function pauseForCSSTransition(miliseconds) {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, miliseconds * 1000)
  );
}
