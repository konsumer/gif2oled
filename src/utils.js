import * as conversionFunctions from './conversion_functions.js'

/**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
*/
export function drawImageFit(ctx, img, x, y, w, h, offsetX, offsetY) {

  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r,   // new prop. width
    nh = ih * r,   // new prop. height
    cx, cy, cw, ch, ar = 1;

  // decide which gap to fill    
  if (nw < w) ar = w / nw;                             
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

export function download(content, mimeType, filename){
  const a = document.createElement('a')
  const blob = new Blob([content], {type: mimeType})
  const url = URL.createObjectURL(blob)
  a.setAttribute('href', url)
  a.setAttribute('download', filename) 
  a.click()
}


// convert canvas to 1bit pixels, as bytes
export function frameToByteString(frame, type='horizontal1bit') {
  const ctx = frame.getContext("2d")
  const imgData = ctx.getImageData(0, 0, frame.width, frame.height).data

  const settings = {
    screenWidth: frame.width,
    screenHeight: frame.height,
    scaleToFit: true,
    preserveRatio: true,
    centerHorizontally: false,
    centerVertically: false,
    flipHorizontally: false,
    flipVertically: false,
    backgroundColor: 'white',
    scale: 1,
    drawMode: 'horizontal',
    removeZeroesCommas: false,
    ditheringThreshold: 128,
    ditheringMode: 0,
    outputFormat: 'plain',
    invertColors: false,
    rotation: 0,
  };

  return conversionFunctions[type](imgData, frame.width, settings)
}