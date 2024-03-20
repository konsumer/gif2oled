/* global gifFrames, ImageData, OffscreenCanvas */

import dither from './dither.js'
import cover from './canvas-cover.js'

const f = document.getElementById('file')
const m = document.getElementById('method')
const t = document.getElementById('threshold')
const d = document.getElementById('download')
const c = document.getElementById('canvas').getContext('2d')

let frames = []
let fileInfo

function download (filename, text, type = 'text/plain') {
  // Create an invisible A element
  const a = document.createElement('a')
  a.style.display = 'none'
  document.body.appendChild(a)

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = window.URL.createObjectURL(
    new Blob([text], { type })
  )

  // Use download attribute to set set desired file name
  a.setAttribute('download', filename)

  // Trigger the download by simulating click
  a.click()

  // Cleanup
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}

function byteToHex (byte) {
  // convert the possibly signed byte (-128 to 127) to an unsigned byte (0 to 255).
  // if you know, that you only deal with unsigned bytes (Uint8Array), you can omit this line
  const unsignedByte = byte & 0xff

  // If the number can be represented with only 4 bits (0-15),
  // the hexadecimal representation of this number is only one char (0-9, a-f).
  if (unsignedByte < 16) {
    return '0x0' + unsignedByte.toString(16)
  } else {
    return '0x' + unsignedByte.toString(16)
  }
}

function canvas2bytes (canvas, type = 'bw') {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const arr = []
  let buffer = []

  for (let x = canvas.width - 1; x >= 0; x--) {
    for (let y = 0; y < canvas.height; y++) {
      const index = (canvas.width * 4 * y) + x * 4
      if (type !== 'bwr') {
        buffer.push(imageData.data[index] > 0 && imageData.data[index + 1] > 0 && imageData.data[index + 2] > 0 ? 1 : 0)
      } else {
        buffer.push(imageData.data[index] > 0 && imageData.data[index + 1] === 0 && imageData.data[index + 2] === 0 ? 1 : 0)
      }

      if (buffer.length === 8) {
        arr.push(parseInt(buffer.join(''), 2))
        buffer = []
      }
    }
  }
  return arr
}

async function updateImages () {
  // I only handle 1 gif file
  fileInfo = f.files[0]

  const images = await gifFrames({
    url: URL.createObjectURL(fileInfo),
    frames: 'all',
    outputType:
    'canvas',
    cumulative: true
  })

  frames = []

  for (const image of images) {
    const gifFrame = image.getImage()

    // resize, covering
    // const o = document.createElement('canvas')
    const o = new OffscreenCanvas(128, 64)
    o.width = 128
    o.height = 64
    const octx = o.getContext('2d', { willReadFrequently: true })
    cover(gifFrame, 0, 0, 128, 64).render(octx)

    // dither
    const d = dither(octx.getImageData(0, 0, 128, 64), t.value, m.value)
    const id = new ImageData(128, 64)
    id.data.set(new Uint8ClampedArray(d.data))
    octx.putImageData(id, 0, 0)

    frames.push(octx)
  }

  if (frames.length) {
    d.style.display = 'block'
  }
}

let cf = 0
setInterval(() => {
  cf++
  if (frames.length) {
    c.drawImage(frames[cf % frames.length].canvas, 0, 0)
  }
}, 100)

f.addEventListener('change', updateImages)
m.addEventListener('change', updateImages)
t.addEventListener('change', updateImages)
d.addEventListener('click', () => {
  const varName = 'gif2oled_image_' + fileInfo.name.split('.').at(0)
  const bytes = frames.map(ctx => canvas2bytes(ctx.canvas))
  const code = `// generated by gif2oled at https://konsumer.js.org/gif2oled/
// see https://github.com/konsumer/gif2oled for instructions using this
// from image ${fileInfo.name}

static const unsigned char ${varName}[${frames.length}][${bytes[0].length}] = {
  ${bytes.map(b => '{' + b.map(byteToHex).join(',') + '}').join(',')}
};

`
  download(`${varName}.h`, code, 'text/x-c')
})
