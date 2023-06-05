export function isNumeric(input) {
  return !isNaN(parseFloat(input)) && isFinite(input);
}

export function getMomentUtcDate(year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
  let dateString = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds + '+0000';
  return moment(dateString, "YYYY-MM-DDTHH:mm:ss.SSSZ").utc();
}

export function thousandsCommaFormatNumber(number) {
  let parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function getFormattedDate(date) {
  return moment(date).format('DD MMM YYYY');
}

export function getFormattedDateDifferenceDuration(date1, date2) {
  let dateDifference = date1.diff(date2);
  let dateDifferenceDuration = moment.duration(dateDifference);
  
  let formattedDateDifferenceText = '';
  if (dateDifferenceDuration.years() > 0) {
    formattedDateDifferenceText += dateDifferenceDuration.years() + ' ';
    formattedDateDifferenceText += (dateDifferenceDuration.years() === 1) ? 'year' : 'years';
  }
  if (dateDifferenceDuration.months() > 0) {
    if (formattedDateDifferenceText) {
      formattedDateDifferenceText += ', ';
    }
    formattedDateDifferenceText += dateDifferenceDuration.months() + ' ';
    formattedDateDifferenceText += (dateDifferenceDuration.months() === 1) ? 'month' : 'months';
  }
  if (dateDifferenceDuration.days() > 0) {
    if (formattedDateDifferenceText) {
      formattedDateDifferenceText += ', ';
    }
    formattedDateDifferenceText += dateDifferenceDuration.days() + ' ';
    formattedDateDifferenceText += (dateDifferenceDuration.days() === 1) ? 'day' : 'days';
  }
  if (!formattedDateDifferenceText) {
    formattedDateDifferenceText = '0 days';
  }

  return formattedDateDifferenceText;
}

export function getMomentCurrentDateUTC() {
  return moment().utc();
}

export function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isRandomSuccess(successRate) {
  return generateRandomInteger(1, 100) <= successRate;
}

export function getRgbaValues(colorString) {
  let _hexToDec = function(value) {
    return parseInt(value, 16)
  };
  
  let _splitHex = function(hex) {
    let hexCharacters;
    if (hex.length === 4) {
      hexCharacters = (hex.replace('#', '')).split('');
      return {
        r: _hexToDec((hexCharacters[0] + hexCharacters[0])),
        g: _hexToDec((hexCharacters[1] + hexCharacters[1])),
        b: _hexToDec((hexCharacters[2] + hexCharacters[2])),
        a: 1.0
      };
    }
    else {
      return {
        r: _hexToDec(hex.slice(1, 3)),
        g: _hexToDec(hex.slice(3, 5)),
        b: _hexToDec(hex.slice(5)),
        a: 1.0
      };
    }
  };
  
  let _splitRgba = function(rgba) {
    let rgbaValues = (rgba.slice(rgba.indexOf('(') + 1, rgba.indexOf(')'))).split(',');
    let hasAlpha = false;
    rgbaValues = rgbaValues.map(function(value, index) {
      if (index !== 3) {
        return parseInt(value, 10);
      }
      else {
        hasAlpha = true;
        return parseFloat(value);
      }
    });
    
    return {
      r: rgbaValues[0],
      g: rgbaValues[1],
      b: rgbaValues[2],
      a: hasAlpha ? rgbaValues[3] : 1.0
    };
  };
  
  let colorStringType = colorString.slice(0,1);
  if (colorStringType === '#') {
    return _splitHex(colorString);
  }
  else if (colorStringType.toLowerCase() === 'r') {
    return _splitRgba(colorString);
  }
  else {
    console.error('getRgbaValues(\'' + colorString + '\') is not hex, RGB, or RGBA color string');
  }
}

export function calculateAverageColor(colors) {
  let colorRedSum = 0;
  let colorGreenSum = 0;
  let colorBlueSum = 0;
  let colorAlphaSum = 0;
  colors.forEach(function(colorString) {
    let colorObject = getRgbaValues(colorString);
    colorRedSum += colorObject.r;
    colorGreenSum += colorObject.g;
    colorBlueSum += colorObject.b;
    colorAlphaSum += colorObject.a;
  });
  colorRedSum /= colors.length;
  colorGreenSum /= colors.length;
  colorBlueSum /= colors.length;
  colorAlphaSum /= colors.length;
  return 'rgba(' + colorRedSum + ', ' + colorGreenSum + ', ' + colorBlueSum + ', ' + colorAlphaSum + ')';
}

export function stringReplaceAt(input, index, replacement) {
  return input.substring(0, index) + replacement + input.substring(index + replacement.length);
}

export function getWindowWidth() {
  return isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth;
}

export function getWindowHeight() {
  return isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
}

export function getSanitizedFilename(filename) {
  return filename.replace(/[^A-Za-z0-9-_ \[\]()]/g, '_');
}

export function generateUuid() {
  let S4 = function()
  {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}

export function getColorScale(colors, minimumRange, maximumRange) {
  return chroma.scale(colors).domain([minimumRange, maximumRange]);
}

export function formatHertzNumbers(inputNumber, decimalPrecision) {
  if (inputNumber === 0)
  {
    return '0 Hz';
  }
  let k = 1000;
  let dm = decimalPrecision <= 0 ? 0 : decimalPrecision || 0;
  let sizes = ['', 'KHz', 'MHz', 'GHz', 'THz', 'PHz', 'EHz', 'ZHz', 'YHz'];
  let i = Math.floor(Math.log(inputNumber) / Math.log(k));
  
  return parseFloat((inputNumber / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

String.prototype.toHHMMSS = function() {
  let secondsInput = parseInt(this, 10);
  let hours = Math.floor(secondsInput / 3600);
  let minutes = Math.floor(secondsInput % 3600 / 60);
  let seconds = Math.floor(secondsInput % 3600 % 60);
  
  let hourDisplay = hours;
  let minuteDisplay = (minutes < 10 ? '0' : '') + minutes;
  let secondDisplay = (seconds < 10 ? '0' : '') + seconds;
  
  return hourDisplay + ':' + minuteDisplay + ':' + secondDisplay;
}

String.prototype.toHHMMSSText = function() {
  let secondsInput = parseInt(this, 10);
  let hours = Math.floor(secondsInput / 3600);
  let minutes = Math.floor(secondsInput % 3600 / 60);
  let seconds = Math.floor(secondsInput % 3600 % 60);
  
  let hourDisplay = '';
  let minuteDisplay = '';
  let secondDisplay = '';
  if (hours > 0) {
    hourDisplay += hours + (hours === 1 ? ' hour' : ' hours');
  }
  if (minutes > 0) {
    if (hourDisplay) {
      minuteDisplay += ', ';
    }
    minuteDisplay += minutes + (minutes === 1 ? ' minute' : ' minutes');
  }
  if (seconds > 0) {
    if (hourDisplay || minuteDisplay) {
      secondDisplay += ', ';
    }
    secondDisplay += seconds + (seconds === 1 ? ' second' : ' seconds');
  }
  return hourDisplay + minuteDisplay + secondDisplay;
}

export function setupCanvas(canvasId, width, height, style) {
  let canvas = document.getElementById(canvasId);
  if (canvas) {
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.setAttribute('style', style);
  }
  return canvas;
}

export function clearCanvas(canvasId, color) {
  let canvas = document.getElementById(canvasId);
  if (canvas) {
    let canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = color;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  }
}

export function isUrlExists(url) {
  try {
    let http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
  }
  catch (exception) {
    return false;
  }
}

export function copyTextToClipboard(text) {
  let textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.textContent = text;
  document.body.appendChild(textArea);
  
  let range = document.createRange();
  range.selectNode(textArea);
  let selection = document.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  document.execCommand('copy');
  
  selection.removeAllRanges();
  document.body.removeChild(textArea);
}

export function getFilenameWithoutExtension(filename) {
  return filename.substr(0, filename.lastIndexOf('.')) || filename;
}

export function getImage(url, callback) {
  let image = new Image();
  image.onload = function() { callback(image); };
  image.onerror = function() { callback(null); };
  image.src = url;
}

export function createRadioButtonWithTextLabel(name, value, text) {
  let label = document.createElement('label');
  let radioButtonInput = document.createElement('input');

  radioButtonInput.type = 'radio';
  radioButtonInput.name = name;
  radioButtonInput.value = value;

  label.appendChild(radioButtonInput);
  label.appendChild(document.createTextNode(text));

  return label;
}

export function containsSubstring(string, substring) {
  return string.indexOf(substring) > -1;
}