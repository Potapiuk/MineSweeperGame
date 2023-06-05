import * as utilities from './utilities.js';

import {DEFAULT_TILE_IMAGE_DIRECTORY, TileState, Direction, Ids} from '../scripts/main.js';

export function getTileCoordinate(x, y, direction = null) {
  let modifiedX = x;
  let modifiedY = y;
  
  if (direction === Direction.TOP) {
    modifiedY = y - 1;
  }
  else if (direction === Direction.TOP_RIGHT) {
    modifiedY = y - 1;
    modifiedX = x + 1;
  }
  else if (direction === Direction.RIGHT) {
    modifiedX = x + 1;
  }
  else if (direction === Direction.BOTTOM_RIGHT) {
    modifiedY = y + 1;
    modifiedX = x + 1;
  }
  else if (direction === Direction.BOTTOM) {
    modifiedY = y + 1;
  }
  else if (direction === Direction.BOTTOM_LEFT) {
    modifiedY = y + 1;
    modifiedX = x - 1;
  }
  else if (direction === Direction.LEFT) {
    modifiedX = x - 1;
  }
  else if (direction === Direction.TOP_LEFT) {
    modifiedY = y - 1;
    modifiedX = x - 1;
  }
  return {x: modifiedX, y: modifiedY};
}

export function isValidTileCoordinate(width, height, x, y, direction = null) {
  let modifiedCoordinate = getTileCoordinate(x, y, direction);

  let modifiedX = modifiedCoordinate.x;
  let modifiedY = modifiedCoordinate.y;

  return modifiedY >= 0 && modifiedY < height
    && modifiedX >= 0 && modifiedX < width;
}

export function createDefaultTileImage(mineField, x, y, tileWidthPixels, tileHeightPixels) {
  let tileImage = new Image(tileWidthPixels, tileHeightPixels);

  tileImage.addEventListener('mouseup',
    function(event) {
      if (event.button === 0) {
        uncoverArea(mineField, x, y);
        uncoverTile(mineField, x, y);
      }
      if (event.button === 1) {
        uncoverArea(mineField, x, y);
      }

      redrawMineField(mineField);
    }, false);
  
  tileImage.addEventListener('contextmenu',
    function(event) {
      // Забороняє показ контекстного меню
      event.preventDefault();

      toggleFlagTile(mineField, x, y);

      if (!mineField.gameOver) {
        updateStatusBarRemainingMines(mineField);
      }

      redrawMineField(mineField);
    }, false);
  
  // Забороняє перетягування зображень
  tileImage.addEventListener('dragstart',
    function(event) {
      event.preventDefault();
    }, false);
  
  tileImage.src = DEFAULT_TILE_IMAGE_DIRECTORY + '/' + TileState.COVERED + '.png';

  return tileImage;
}

export function setMineField(mineField, width, height, mineCount) {
  mineField.width = width;
  mineField.height = height;
  mineField.mineCount = mineCount;
}

export function isGridCleared(mineField) {
  for (let y = 0; y < mineField.height; y++) {
    for (let x = 0; x < mineField.width; x++) {
      if (mineField.grid[y][x].state === TileState.COVERED && !mineField.grid[y][x].isMine) {
        return false;
      }
    }
  }
  return true;
}

export function getFlaggedCount(mineField) {
  let flaggedCount = 0;
  for (let y = 0; y < mineField.height; y++) {
    for (let x = 0; x < mineField.width; x++) {
      if (mineField.grid[y][x].state === TileState.FLAGGED) {
        ++flaggedCount;
      }
    }
  }
  return flaggedCount;
}

export function computeNumberOfMinesAround(mineField, x, y) {
  let mineCount = 0;
  for (const enumDirectionProperty in Direction) {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty])) {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);
      if (mineField.grid[tileCoordinate.y][tileCoordinate.x].isMine) {
        ++mineCount;
      }
    }
  }
  return mineCount;
}

export function computeNumberOfFlagsAround(mineField, x, y) {
  let flagCount = 0;
  for (const enumDirectionProperty in Direction) {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty])) {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);
      if (mineField.grid[tileCoordinate.y][tileCoordinate.x].state === TileState.FLAGGED) {
        ++flagCount;
      }
    }
  }
  return flagCount;
}

export function updateStatusBarRemainingMines(mineField) {
  let minesRemaining = mineField.mineCount - getFlaggedCount(mineField);
  minesRemaining = minesRemaining.toString().padStart(2, '0');

  document.getElementById(Ids.gameScreen.statusBar.minesRemainingLabel).innerHTML = `${minesRemaining} <img src="${DEFAULT_TILE_IMAGE_DIRECTORY}/${TileState.FLAGGED}.png" width="20" height="20">`;
}

export function resetAndDrawMineField(mineField) {
  resetMineField(mineField);

  updateStatusBarRemainingMines(mineField);

  drawMineField(mineField);
}

function resetMineField(mineField) {
  mineField.firstClick = false;
  mineField.gameOver = false;
  mineField.startTime = null;
  mineField.grid = [];

  for (let y = 0; y < mineField.height; y++) {
    mineField.grid.push([]);
    for (let x = 0; x < mineField.width; x++) {
      let tile = {
        state: TileState.COVERED,
        isMine: false,
        x: x,
        y: y,
        image: createDefaultTileImage(mineField, x, y, 40, 40)
      };
      mineField.grid[y].push(tile);
    }
  }
}

function drawMineField(mineField) {
  let mineFieldDiv = document.getElementById(Ids.gameScreen.mineField);
  mineFieldDiv.innerHTML = '';

  for (let y = 0; y < mineField.height; y++) {
    let newDivRow = document.createElement('div');
    newDivRow.classList.add('flexBoxRow');
    for (let x = 0; x < mineField.width; x++) {
      mineField.grid[y][x].image.src = DEFAULT_TILE_IMAGE_DIRECTORY + '/' + mineField.grid[y][x].state + '.png';

      // Створює новий div для комірки
      let newDiv = document.createElement('div');
      newDiv.appendChild(mineField.grid[y][x].image);

      newDiv.style.padding = '0px';
      newDiv.style.margin = '0px';
      newDiv.style.height = 40 + 'px';

      newDivRow.appendChild(newDiv);
    }
    mineFieldDiv.appendChild(newDivRow);
  }
}

export function redrawMineField(mineField) {
  let mineFieldDiv = document.getElementById(Ids.gameScreen.mineField);
  for (let y = 0; y < mineField.height; y++) {
    let divRow = mineFieldDiv.childNodes[y];
    for (let x = 0; x < mineField.width; x++) {
      divRow.childNodes[x].firstChild.src = DEFAULT_TILE_IMAGE_DIRECTORY + '/' + mineField.grid[y][x].state + '.png';
    }
  }
}

export function fillMines(mineField, x, y) {
  let availableTilesToSetMine = [];
  for (let loopY = 0; loopY < mineField.height; loopY++) {
    for (let loopX = 0; loopX < mineField.width; loopX++) {
      availableTilesToSetMine.push(loopX + ',' + loopY);
    }
  }

  for (const enumDirectionProperty in Direction) {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty])) {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);
      let value = tileCoordinate.x + ',' + tileCoordinate.y;
      let index = availableTilesToSetMine.indexOf(value);
      if (index >= 0) {
        availableTilesToSetMine.splice(index, 1);
      }
    }
  }

  // Рандомно розставляє міни по полю
  for (let i = 0; i < mineField.mineCount; i++) {
    if (availableTilesToSetMine <= 0) {
      console.error('Неможливо заповнити поле мінами, якщо availableTilesToSetMine менше або дорівнює 0. Переконайтеся, що mineCount знаходиться в діапазоні ширини/висоти ігрового поля.');
      break;
    }

    let randomNumber = utilities.generateRandomInteger(0, availableTilesToSetMine.length - 1);
    let tileToSetMineCoordinate = availableTilesToSetMine.splice(randomNumber, 1)[0];

    tileToSetMineCoordinate = {
      x: tileToSetMineCoordinate.split(',')[0],
      y: tileToSetMineCoordinate.split(',')[1],
    }
    mineField.grid[tileToSetMineCoordinate.y][tileToSetMineCoordinate.x].isMine = true;
  }
}

export function uncoverTile(mineField, x, y) {
  if (!mineField.firstClick) {
    fillMines(mineField, x, y);
    mineField.firstClick = true;
    mineField.startTime = new Date();
  }

  if (mineField.gameOver) {
    return;
  }

  if (mineField.grid[y][x].state != TileState.COVERED) {
    return;
  }

  if (mineField.grid[y][x].isMine && mineField.grid[y][x].state != TileState.FLAGGED) {
    gameOver(mineField);
    mineField.grid[y][x].state = TileState.HIT_MINE;
    return;
  }

  let numberOfMinesAround = computeNumberOfMinesAround(mineField, x, y);
  if (numberOfMinesAround === 0) {
    mineField.grid[y][x].state = TileState.BLANK;
    uncoverArea(mineField, x, y);
  }
  else if (numberOfMinesAround === 1) {
    mineField.grid[y][x].state = TileState.NUMBER1;
  }
  else if (numberOfMinesAround === 2) {
    mineField.grid[y][x].state = TileState.NUMBER2;
  }
  else if (numberOfMinesAround === 3) {
    mineField.grid[y][x].state = TileState.NUMBER3;
  }
  else if (numberOfMinesAround === 4) {
    mineField.grid[y][x].state = TileState.NUMBER4;
  }
  else if (numberOfMinesAround === 5) {
    mineField.grid[y][x].state = TileState.NUMBER5;
  }
  else if (numberOfMinesAround === 6) {
    mineField.grid[y][x].state = TileState.NUMBER6;
  }
  else if (numberOfMinesAround === 7) {
    mineField.grid[y][x].state = TileState.NUMBER7;
  }
  else if (numberOfMinesAround === 8) {
    mineField.grid[y][x].state = TileState.NUMBER8;
  }

  if (isGridCleared(mineField) && !mineField.gameOver) {
    console.log('Поле очищено. Ви перемогли!.');
    gameOver(mineField);
  }
}

export function uncoverArea(mineField, x, y) {
  if (mineField.grid[y][x].state === TileState.COVERED
    || mineField.grid[y][x].state === TileState.FLAGGED) {
        return;
  }

  let numberOfFlagsAround = computeNumberOfFlagsAround(mineField, x, y);
  
  for (const enumDirectionProperty in Direction) {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty])) {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);

      if (numberOfFlagsAround === computeNumberOfMinesAround(mineField, x, y)) {
        uncoverTile(mineField, tileCoordinate.x, tileCoordinate.y);
      }
    }
  }
}

export function toggleFlagTile(mineField, x, y) {
  if (mineField.gameOver) {
    return;
  }

  if (!mineField.firstClick) {
    return;
  }

  if (mineField.grid[y][x].state === TileState.FLAGGED) {
    mineField.grid[y][x].state = TileState.COVERED;
  }
  else if (mineField.grid[y][x].state === TileState.COVERED) {
    mineField.grid[y][x].state = TileState.FLAGGED;
  }
}

export function gameOver(mineField) {
  // Поновлює таймер
  let timeDifferenceInSeconds = (new Date() - mineField.startTime) / 1000;
  document.getElementById(Ids.gameScreen.statusBar.timerLabel).innerHTML = timeDifferenceInSeconds.toFixed();

  mineField.gameOver = true;

  // Показує результати
  let isGridClearedTemp = isGridCleared(mineField);
  for (let y = 0; y < mineField.height; y++) {
    for (let x = 0; x < mineField.width; x++) {
      if (mineField.grid[y][x].state === TileState.FLAGGED && !mineField.grid[y][x].isMine) {
        mineField.grid[y][x].state = TileState.WRONG_MINE;
      }
      else if (mineField.grid[y][x].isMine) {
        if (isGridClearedTemp) {
          mineField.grid[y][x].state = TileState.FLAGGED;
        }
        else {
          mineField.grid[y][x].state = TileState.MINE;
        }
      }
    }
  }
}