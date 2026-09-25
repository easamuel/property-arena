import * as crypto from 'crypto';

const randomBytes = crypto.randomBytes;

function processString(
  buffer,
  initialString: string,
  chars: string,
  requiredLength: number,
  maxByte,
) {
  let string = initialString;
  for (let i = 0; i < buffer.length && string.length < requiredLength; i++) {
    const randomByte = buffer.readUInt8(i);
    if (randomByte < maxByte) {
      string += chars.charAt(randomByte % chars.length);
    }
  }
  return string;
}

const getCharacters = function (type: string): string {
  let chars: string;

  const numbers = '0123456789';
  const charsLower = 'abcdefghijklmnopqrstuvwxyz';
  const charsUpper = charsLower.toUpperCase();
  const hexChars = 'abcdef';
  const binaryChars = '01';
  const octalChars = '01234567';

  if (type === 'alphanumeric') {
    chars = numbers + charsLower + charsUpper;
  } else if (type === 'numeric') {
    chars = numbers;
  } else if (type === 'alphabetic') {
    chars = charsLower + charsUpper;
  } else if (type === 'hex') {
    chars = numbers + hexChars;
  } else if (type === 'binary') {
    chars = binaryChars;
  } else if (type === 'octal') {
    chars = octalChars;
  } else {
    chars = type;
  }

  return chars;
};

const setcapitalization = function (
  inputString: string,
  capitalization: string,
) {
  let chars = inputString;
  if (capitalization === 'uppercase') {
    chars = chars.toUpperCase();
  } else if (capitalization === 'lowercase') {
    chars = chars.toLowerCase();
  }
  return chars;
};

export function stringGenerator(options: {
  length: number;
  outputOption: 'numeric' | 'alphanumeric';
  capitalization: 'uppercase' | 'lowercase';
}) {
  let string = getCharacters(options.outputOption);
  string = setcapitalization(string, options.capitalization);
  let outputString = '';
  const charsLen = string.length;
  const length = options.length;
  const maxByte = 256 - (256 % charsLen);

  while (outputString.length < length) {
    const stringBuffer = randomBytes(Math.ceil((length * 256) / maxByte));
    outputString = processString(
      stringBuffer,
      outputString,
      string,
      length,
      maxByte,
    );
  }
  return outputString;
}
