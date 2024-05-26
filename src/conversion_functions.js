function bitswap(b, settings) {
  if (settings.bitswap) {
    // eslint-disable-next-line no-bitwise, no-mixed-operators, no-param-reassign
    b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
    // eslint-disable-next-line no-bitwise, no-mixed-operators, no-param-reassign
    b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
    // eslint-disable-next-line no-bitwise, no-mixed-operators, no-param-reassign
    b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
  }
  return b;
}

export function horizontal1bit(data, canvasWidth, settings) {
  let stringFromBytes = '';
  let outputIndex = 0;
  let byteIndex = 7;
  let number = 0;

  // format is RGBA, so move 4 steps per pixel
  for (let index = 0; index < data.length; index += 4) {
    // Get the average of the RGB (we ignore A)
    const avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
    if (avg > settings.ditheringThreshold) {
      number += 2 ** byteIndex;
    }
    byteIndex--;

    // if this was the last pixel of a row or the last pixel of the
    // image, fill up the rest of our byte with zeros so it always contains 8 bits
    if ((index !== 0 && (((index / 4) + 1) % (canvasWidth)) === 0) || (index === data.length - 4)) {
      // for(var i=byteIndex;i>-1;i--){
      // number += Math.pow(2, i);
      // }
      byteIndex = -1;
    }

    // When we have the complete 8 bits, combine them into a hex value
    if (byteIndex < 0) {
      let byteSet = bitswap(number, settings).toString(16);
      if (byteSet.length === 1) { byteSet = `0${byteSet}`; }
      if (!settings.removeZeroesCommas) {
        stringFromBytes += `0x${byteSet}, `;
      } else {
        stringFromBytes += byteSet;
      }
      outputIndex++;
      if (outputIndex >= 16) {
        if (!settings.removeZeroesCommas) {
          stringFromBytes += '\n';
        }
        outputIndex = 0;
      }
      number = 0;
      byteIndex = 7;
    }
  }
  return stringFromBytes;
}

// Output the image as a string for vertically drawing displays
// eslint-disable-next-line no-unused-vars
export function vertical1bit(data, canvasWidth, settings) {
  let stringFromBytes = '';
  let outputIndex = 0;
  for (let p = 0; p < Math.ceil(settings.screenHeight / 8); p++) {
    for (let x = 0; x < settings.screenWidth; x++) {
      let byteIndex = 7;
      let number = 0;

      for (let y = 7; y >= 0; y--) {
        const index = ((p * 8) + y) * (settings.screenWidth * 4) + x * 4;
        const avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
        if (avg > settings.ditheringThreshold) {
          number += 2 ** byteIndex;
        }
        byteIndex--;
      }
      let byteSet = bitswap(number, settings).toString(16);
      if (byteSet.length === 1) { byteSet = `0${byteSet}`; }
      if (!settings.removeZeroesCommas) {
        stringFromBytes += `0x${byteSet.toString(16)}, `;
      } else {
        stringFromBytes += byteSet.toString(16);
      }
      outputIndex++;
      if (outputIndex >= 16) {
        stringFromBytes += '\n';
        outputIndex = 0;
      }
    }
  }
  return stringFromBytes;
}

// Output the image as a string for 565 displays (horizontally)
// eslint-disable-next-line no-unused-vars
export function horizontal565(data, canvasWidth, settings) {
  let stringFromBytes = '';
  let outputIndex = 0;

  // format is RGBA, so move 4 steps per pixel
  for (let index = 0; index < data.length; index += 4) {
    // Get the RGB values
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    // calculate the 565 color value
    // eslint-disable-next-line no-bitwise
    const rgb = ((r & 0b11111000) << 8) | ((g & 0b11111100) << 3) | ((b & 0b11111000) >> 3);
    // Split up the color value in two bytes
    // const firstByte = (rgb >> 8) & 0xff;
    // const secondByte = rgb & 0xff;

    let byteSet = bitswap(rgb, settings).toString(16);
    while (byteSet.length < 4) { byteSet = `0${byteSet}`; }
    if (!settings.removeZeroesCommas) {
      stringFromBytes += `0x${byteSet}, `;
    } else {
      stringFromBytes += byteSet;
    }
    // add newlines every 16 bytes
    outputIndex++;
    if (outputIndex >= 16) {
      stringFromBytes += '\n';
      outputIndex = 0;
    }
  }
  return stringFromBytes;
}

// Output the image as a string for rgb888 displays (horizontally)
export function horizontal888(data, canvasWidth, settings) {
  let stringFromBytes = '';
  let outputIndex = 0;

  // format is RGBA, so move 4 steps per pixel
  for (let index = 0; index < data.length; index += 4) {
    // Get the RGB values
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    // calculate the 565 color value
    // eslint-disable-next-line no-bitwise
    const rgb = (r << 16) | (g << 8) | (b);
    // Split up the color value in two bytes
    // const firstByte = (rgb >> 8) & 0xff;
    // const secondByte = rgb & 0xff;

    let byteSet = bitswap(rgb, settings).toString(16);
    while (byteSet.length < 8) { byteSet = `0${byteSet}`; }
    if (!settings.removeZeroesCommas) {
      stringFromBytes += `0x${byteSet}, `;
    } else {
      stringFromBytes += byteSet;
    }

    // add newlines every 16 bytes
    outputIndex++;
    if (outputIndex >= canvasWidth) {
      stringFromBytes += '\n';
      outputIndex = 0;
    }
  }
  return stringFromBytes;
}

// Output the alpha mask as a string for horizontally drawing displays
export function horizontalAlpha(data, canvasWidth, settings) {
  let stringFromBytes = '';
  let outputIndex = 0;
  let byteIndex = 7;
  let number = 0;

  // format is RGBA, so move 4 steps per pixel
  for (let index = 0; index < data.length; index += 4) {
    // Get alpha part of the image data
    const alpha = data[index + 3];
    if (alpha > settings.ditheringThreshold) {
      number += 2 ** byteIndex;
    }
    byteIndex--;

    // if this was the last pixel of a row or the last pixel of the
    // image, fill up the rest of our byte with zeros so it always contains 8 bits
    if ((index !== 0 && (((index / 4) + 1) % (canvasWidth)) === 0) || (index === data.length - 4)) {
      byteIndex = -1;
    }

    // When we have the complete 8 bits, combine them into a hex value
    if (byteIndex < 0) {
      let byteSet = bitswap(number, settings).toString(16);
      if (byteSet.length === 1) { byteSet = `0${byteSet}`; }
      if (!settings.removeZeroesCommas) {
        stringFromBytes += `0x${byteSet}, `;
      } else {
        stringFromBytes += byteSet;
      }
      outputIndex++;
      if (outputIndex >= 16) {
        stringFromBytes += '\n';
        outputIndex = 0;
      }
      number = 0;
      byteIndex = 7;
    }
  }
  return stringFromBytes;
}
