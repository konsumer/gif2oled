// Atkinson thanks to https://github.com/ticky/canvas-dither/blob/master/canvas-image-worker.js
// Flickr's Atkinson was easy to understand but melted with some fps https://github.com/flickr/FlickrDithr/blob/master/dither.js
// Bayer parsed from http://en.wikipedia.org/wiki/Ordered_dithering

// var bayerMap = [
//   [  1,  9,  3, 11 ],
//   [ 13,  5, 15,  7 ],
//   [  4, 12,  2, 10 ],
//   [ 16,  8, 14,  6 ]
// ];

const bayerThresholdMap = [
  [15, 135, 45, 165],
  [195, 75, 225, 105],
  [60, 180, 30, 150],
  [240, 120, 210, 90]
]

const lumR = []
const lumG = []
const lumB = []
for (let i = 0; i < 256; i++) {
  lumR[i] = i * 0.299
  lumG[i] = i * 0.587
  lumB[i] = i * 0.114
}

export default function monochrome (imageData, threshold, type, invert=false) {
  const imageDataLength = imageData.data.length

  // Greyscale luminance (sets r pixels to luminance of rgb)
  for (let i = 0; i <= imageDataLength; i += 4) {
    imageData.data[i] = Math.floor(lumR[imageData.data[i]] + lumG[imageData.data[i + 1]] + lumB[imageData.data[i + 2]])
  }

  const w = imageData.width
  let newPixel, err

  for (let currentPixel = 0; currentPixel <= imageDataLength; currentPixel += 4) {
    if (type === 'atkinson') {
      // Bill Atkinson's dithering algorithm
      newPixel = imageData.data[currentPixel] < 129 ? 0 : 255
      err = Math.floor((imageData.data[currentPixel] - newPixel) / 8)
      imageData.data[currentPixel] = newPixel

      imageData.data[currentPixel + 4] += err
      imageData.data[currentPixel + 8] += err
      imageData.data[currentPixel + 4 * w - 4] += err
      imageData.data[currentPixel + 4 * w] += err
      imageData.data[currentPixel + 4 * w + 4] += err
      imageData.data[currentPixel + 8 * w] += err
    } else if (type === 'bayer') {
      // 4x4 Bayer ordered dithering algorithm
      const x = currentPixel / 4 % w
      const y = Math.floor(currentPixel / 4 / w)
      const map = Math.floor((imageData.data[currentPixel] + bayerThresholdMap[x % 4][y % 4]) / 2)
      imageData.data[currentPixel] = (map < threshold) ? 0 : 255
    } else if (type === 'floydsteinberg') {
      // Floyd–Steinberg dithering algorithm
      newPixel = imageData.data[currentPixel] < 129 ? 0 : 255
      err = Math.floor((imageData.data[currentPixel] - newPixel) / 16)
      imageData.data[currentPixel] = newPixel

      imageData.data[currentPixel + 4] += err * 7
      imageData.data[currentPixel + 4 * w - 4] += err * 3
      imageData.data[currentPixel + 4 * w] += err * 5
      imageData.data[currentPixel + 4 * w + 4] += err * 1
    } else {
      // No dithering
      imageData.data[currentPixel] = imageData.data[currentPixel] < threshold ? 0 : 255
    }

    if (invert) {
      imageData.data[currentPixel] = imageData.data[currentPixel] ? 0 : 255
    }

    // Set g and b pixels equal to r
    imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel]
  }

  return imageData
}