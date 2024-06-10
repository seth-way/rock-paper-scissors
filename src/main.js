/* eslint-disable no-undef */
// <> <> GLOBAL VARIABLES <> <> //
var options = {
  options3: ['rock', 'paper', 'scissors'],
  options5: ['rock', 'paper', 'scissors', 'spock', 'lizard'],
};
var settings = { showMenu: false, version: 'options3', isOnePlayerMode: true };
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
var gameUpdates = {};
var playerUpdates = { p0: {}, p1: {} };
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
var playerCountModes = document.querySelectorAll('.players-count');
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
  toggleButtonsDisabled(1);
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

function toggleButtonsDisabled(player) {
  if (player !== undefined) {
    var buttonsB = buttonGroupB[player].querySelectorAll('button');
    var buttonsC = buttonGroupC[player].querySelectorAll('button');
    [...buttonsB, ...buttonsC].forEach(function (button) {
      button.classList.toggle('disable');
    });
  } else {
    menuButton.classList.toggle('disable');
    modeButton.classList.toggle('disable');
    resetButton.classList.toggle('disable');
  }
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

function updatePlayerCountModeDOM(isOnePlayerMode) {
  function isSelected(isOnePlayer, index) {
    if (isOnePlayer && index === 0) return true;
    if (!isOnePlayer && index === 1) return true;
    return false;
  }
  playerCountModes.forEach(function (element, idx) {
    if (isSelected(isOnePlayerMode, idx)) {
      element.classList.add('selected');
    } else {
      element.classList.remove('selected');
    }
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

  toggleButtonsDisabled(0);
  if (!settings.isOnePlayerMode) toggleButtonsDisabled(1);
  toggleButtonsDisabled();

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

  if (player === 1 && settings.isOnePlayerMode) return;
  if (game.selected[`p${player}`]) return;

  toggleButtonsDisabled(player);
  if (!menuButton.classList.contains('disable')) toggleButtonsDisabled();

  const choice = id.slice(0, id.length - 2);
  game.selected[`p${player}`] = choice;
  game = assessGameCompletion(game, settings);

  if (game.isCompleted) {
    game = determineOutcome(game);
    if (game.winner) players[game.winner].wins += 1;
    await updateGameMessages('Get Ready...');
    await runBattleAnimations();
  }
}

function handleDPadClick(id) {
  let reaction = 'wiggle';
  if (id.endsWith('up')) reaction = 'victory';
  if (id.endsWith('down')) reaction = 'defeat';

  playerInfoAreas.forEach(function (area) {
    const avatar = area.querySelector('img');
    avatar.classList.add(reaction);
    setTimeout(function () {
      avatar.classList.remove(reaction);
    }, 3000);
  });
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
    if (settings.isOnePlayerMode) toggleButtonsDisabled(1);
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
  if (id) {
    if (id.startsWith('name') || id.startsWith('avatar-featured')) return;
    if (id.startsWith('new-avatar')) {
      const player = id.slice(-2);
      playerUpdates[player].avatar = createAvatar(e.target.innerText);
      featuredAvatars[player].innerText = e.target.innerText;
    } else if (id.startsWith('players-count')) {
      const isOnePlayerMode = id.slice(-1) === '1';
      gameUpdates.isOnePlayerMode = isOnePlayerMode;
      updatePlayerCountModeDOM(isOnePlayerMode);
    } else {
      if (id === 'update-options') {
        if (optionsMenu['name-0'].value) {
          playerUpdates.p0.name = optionsMenu['name-0'].value.slice(0, 20);
        }
        if (optionsMenu['name-1'].value) {
          playerUpdates.p1.name = optionsMenu['name-1'].value.slice(0, 20);
        }
        if (
          Object.keys(playerUpdates.p0).length ||
          Object.keys(playerUpdates.p1).length
        ) {
          players = updatePlayers(playerUpdates, players);
          playerUpdates = { p0: {}, p1: {} };
          updatePlayerInfoDOM();
        }
        if (typeof gameUpdates.isOnePlayerMode === 'boolean') {
          if (gameUpdates.isOnePlayerMode !== settings.isOnePlayerMode) {
            toggleButtonsDisabled(1);
          }
          settings.isOnePlayerMode = gameUpdates.isOnePlayerMode;
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

function updatePlayers(updates, previous) {
  var updatedPlayers = { ...previous };
  if (updates.p0) updatedPlayers.p0 = { ...updatedPlayers.p0, ...updates.p0 };
  if (updates.p1) updatedPlayers.p1 = { ...updatedPlayers.p1, ...updates.p1 };
  updatedPlayers.p0.wins = 0;
  updatedPlayers.p1.wins = 0;
  return updatedPlayers;
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
    isCompleted: false,
    winner: null,
    message: null,
  };
}

function assessGameCompletion(gameState, gameSettings) {
  const results = { ...gameState };

  if (results.selected.p0) {
    if (results.selected.p1) {
      results.isCompleted = true;
    }

    if (gameSettings.isOnePlayerMode) {
      results.selected.p1 = getRandomChoice();
      results.isCompleted = true;
    }
  }

  return results;
}

function getRandomChoice() {
  const choices = options[settings.version];
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineOutcome(gameState) {
  const results = { ...gameState };
  const choice0 = results.selected.p0;
  const choice1 = results.selected.p1;
  if (gameState.selected.p0 === gameState.selected.p1) {
    results.message = "It's a Draw!";
  } else {
    results.message = winMessage[choice0][choice1];
    if (results.message) {
      results.winner = 'p0';
    } else {
      results.message = winMessage[choice1][choice0];
      results.winner = 'p1';
    }
  }

  return results;
}

//- other functions -//
function pauseForCSSTransition(miliseconds) {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, miliseconds * 1000)
  );
}
