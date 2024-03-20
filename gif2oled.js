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
  const varName = fileInfo.name.split('.').at(0)
  console.log(fileInfo)
  // for (const ctx of frames) {
  //   console.log(canvas2bytes(ctx.canvas))
  // }
})
