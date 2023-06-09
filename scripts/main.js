
import * as minesweeperEventHandler from './minesweeperEventHandler.js';


export const DEFAULT_TILE_IMAGE_DIRECTORY = 'images';

// The value is also the tile filename
export const TileState =
{
  'COVERED': 'covered',
  'FLAGGED': 'flagged',
  'MINE': 'mine',
  'HIT_MINE': 'hitmine',
  'WRONG_MINE': 'wrongmine',
  'BLANK': 'blank',
  'NUMBER1': 'number1',
  'NUMBER2': 'number2',
  'NUMBER3': 'number3',
  'NUMBER4': 'number4',
  'NUMBER5': 'number5',
  'NUMBER6': 'number6',
  'NUMBER7': 'number7',
  'NUMBER8': 'number8'
};

export const Direction =
{
  'TOP': 'top',
  'TOP_RIGHT': 'topright',
  'RIGHT': 'right',
  'BOTTOM_RIGHT': 'bottomright',
  'BOTTOM': 'bottom',
  'BOTTOM_LEFT': 'bottomleft',
  'LEFT': 'left',
  'TOP_LEFT': 'topleft',
  'CENTER': 'center'
};

export const DifficultySettings =
{
  beginner:
  {
    width: 8,
    height: 8,
    mineCount: 10
  },
  intermediate:
  {
    width: 16,
    height: 16,
    mineCount: 40
  },
  expert:
  {
    width: 30,
    height: 16,
    mineCount: 99
  }
};

export const Ids =
{
  setupScreen:
  {
    id: 'setupScreenId',
    widthTextbox: 'widthTextboxId',
    heightTextbox: 'heightTextboxId',
    mineCountTextbox: 'mineCountTextboxId',
    beginnerRadio: 'beginnerRadioId',
    intermediateRadio: 'intermediateRadioId',
    expertRadio: 'expertRadioId',
    customRadio: 'customRadioId',
    startButton: 'startButtonId'
  },
  gameScreen:
  {
    id: 'gameScreenId',
    statusBar:
    {
      resetButton: 'resetButtonId',
      infoLabel: 'infoLabelId',
      minesRemainingLabel: 'minesRemainingLabelId',
      timerLabel: 'timerLabelId'
    },
    mineField: 'mineFieldId'
  }
};

let mineField =
{
  width: 1,
  height: 1,
  mineCount: 1,
  firstClick: false,
  gameOver: false,
  startTime: null,
  grid: []
};

setup(mineField);

function setup(mineField)
{
  // Setup the event listeners
  minesweeperEventHandler.setupMouseEventListeners();
  
  minesweeperEventHandler.setupKeyboardEventListeners();
  
  minesweeperEventHandler.setupUIEventListeners(mineField);

  // Setup to update the timer
  let interval = setInterval(function()
  {
    if (mineField.startTime != null && !mineField.gameOver)
    {
      let timeDifferenceInSeconds = (new Date() - mineField.startTime) / 1000;
      document.getElementById(Ids.gameScreen.statusBar.timerLabel).innerHTML = timeDifferenceInSeconds.toFixed(2);
    }
  }, 1000);
}