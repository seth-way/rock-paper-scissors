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
    lizard: 'Scissors decapitates Lizard',
  },
  spock: { rock: 'Spock vaporizes Rock', scissors: 'Spock smashes Scissors' },
  lizard: { paper: 'Lizard eats Paper', spock: 'Lizard poisons Spock' },
};
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
var gameHeading = document.querySelector('#sky').querySelector('h3');
var gameInfo = document.querySelector('#sky').querySelector('p');
console.log(gameHeading);
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
  game.emojisOnDOM.forEach(function (emoji) {
    emoji.classList.toggle('fade-out');
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

async function updateGameMessages(heading = '', info = '') {
  gameHeading.classList.add('fade-out');
  gameInfo.classList.add('fade-out');
  await pauseForCSSTransition(1);
  gameHeading.innerText = heading;
  gameInfo.innerText = info;
  gameHeading.classList.remove('fade-out');
  gameInfo.classList.remove('fade-out');
  return await pauseForCSSTransition(1);
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
  } else if (e.target.classList.contains('clickable')) {
    targetID = e.target.id;
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

  const choice = id.slice(0, id.length - 2);
  game.selected[`p${player}`] = choice;

  if (assessGameCompletion()) {
    determineOutcome(game.selected.p0, game.selected.p1);
    game.emojisOnDOM.forEach(function (emoji) {
      emoji.classList.remove('ready');
    });

    await updateGameMessages('Get Ready...');
    if (!game.winner) {
      await updateGameMessages(game.message);
    } else {
      await updateGameMessages(
        `${players[game.winner].name} wins!`,
        game.message
      );
      updateplayerInfoDOM();
    }
  }
}

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
    gameArea.innerHTML = '';
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

function createGame(version) {
  if (!version) version = { options3: true, options5: false };
  return {
    selected: {
      p0: null,
      p1: null,
    },
    emojisOnDOM: [],
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
