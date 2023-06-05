import * as minesweeperUtilities from '../util/minesweeperUtilities.js';

import {DEFAULT_TILE_IMAGE_DIRECTORY, TileState, DifficultySettings, Ids} from './main.js';

function preventNonNumericalResponse(event) {
  // Між 0 і 9
  if (event.which < 48 || event.which > 57) {
    event.preventDefault();
  }
}

export function setupMouseEventListeners() {
  document.body.onmousedown = function(event) {
    if (event.button === 1) {
      return false;
    }
  }
}

export function setupKeyboardEventListeners() {
  window.onbeforeunload = function(event) {
    event.preventDefault();
  };

  document.getElementById(Ids.setupScreen.widthTextbox).addEventListener('keypress', preventNonNumericalResponse, false);
  document.getElementById(Ids.setupScreen.heightTextbox).addEventListener('keypress', preventNonNumericalResponse, false);
  document.getElementById(Ids.setupScreen.mineCountTextbox).addEventListener('keypress', preventNonNumericalResponse, false);
}

export function setupUIEventListeners(mineField) {
  // Початкова складність
  document.getElementById(Ids.setupScreen.beginnerRadio).checked = true;
  switchDifficulty(DifficultySettings.beginner);

  document.getElementById(Ids.setupScreen.beginnerRadio).addEventListener('change',
    function() {
      switchDifficulty(DifficultySettings.beginner);
    });
  
  document.getElementById(Ids.setupScreen.intermediateRadio).addEventListener('change',
    function() {
      switchDifficulty(DifficultySettings.intermediate);
    });
  
  document.getElementById(Ids.setupScreen.expertRadio).addEventListener('change',
    function() {
      switchDifficulty(DifficultySettings.expert);
    });
  
  document.getElementById(Ids.setupScreen.customRadio).addEventListener('change',
    function() {
      switchDifficulty(null);
    });
  
  document.getElementById(Ids.setupScreen.startButton).addEventListener('click',
    function() {
      let width = document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber;
      let height = document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber;
      let mineCount = document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber;
      
      // Перевіряє, що значення mineCount знаходиться в діапазоні ширини/висоти ігрового поля
      let maximumMineCount = width * height - 9;
      if (mineCount > maximumMineCount) {
        alert('Дуже велика кількість мін. Їх повинно бути менше або рівно ' + maximumMineCount);
        return;
      }

      let difficultySelected = document.querySelector('input[name="difficulty"]:checked').value;

      document.getElementById(Ids.gameScreen.statusBar.infoLabel).innerHTML = `${difficultySelected}: ${width} ↔, ${height} ↕, ${mineCount} <img src="${DEFAULT_TILE_IMAGE_DIRECTORY}/${TileState.MINE}.png" width="20" height="20">`;

      document.getElementById(Ids.gameScreen.statusBar.timerLabel).innerHTML = "0";

      document.getElementById(Ids.setupScreen.id).hidden = true;
      document.getElementById(Ids.gameScreen.id).hidden = false;
      
      minesweeperUtilities.setMineField(mineField, width, height, mineCount);
      minesweeperUtilities.resetAndDrawMineField(mineField);
    });
  
  document.getElementById(Ids.gameScreen.statusBar.resetButton).addEventListener('click',
    function() {
      let width = document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber;
      let height = document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber;
      let mineCount = document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber;
      
      document.getElementById(Ids.gameScreen.statusBar.timerLabel).innerHTML = "0";
      
      minesweeperUtilities.setMineField(mineField, width, height, mineCount);
      minesweeperUtilities.resetAndDrawMineField(mineField);
    });
}

/**
 * Update the Setup Screen UI elements based on the difficulty.
 * 
 * @param difficultySetting DifficultySettings enum
 */
function switchDifficulty(difficultySetting) {
    if (JSON.stringify(difficultySetting) === JSON.stringify(DifficultySettings.beginner)
        || JSON.stringify(difficultySetting) === JSON.stringify(DifficultySettings.intermediate)
        || JSON.stringify(difficultySetting) === JSON.stringify(DifficultySettings.expert)) 
    {
        document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber = difficultySetting.width;
        document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber = difficultySetting.height;
        document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber = difficultySetting.mineCount;
        document.getElementById(Ids.setupScreen.widthTextbox).disabled = true;
        document.getElementById(Ids.setupScreen.heightTextbox).disabled = true;
        document.getElementById(Ids.setupScreen.mineCountTextbox).disabled = true;
    }
    else
    {
        document.getElementById(Ids.setupScreen.widthTextbox).disabled = false;
        document.getElementById(Ids.setupScreen.heightTextbox).disabled = false;
        document.getElementById(Ids.setupScreen.mineCountTextbox).disabled = false;
    }
}