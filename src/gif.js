import { parseGIF, decompressFrames } from 'gifuct-js'

import { GIFEncoder, quantize, applyPalette } from 'gifenc'

// get all frames in the original image as an array of canvas 
export function process(buffer) { 
  const frames = decompressFrames(parseGIF(buffer), true)

  const out = []
  if (frames?.length) {
    const { dims: {width, height}, delay } = frames[0]
    for (const frame of frames) {
      const otx = (new OffscreenCanvas(width, height)).getContext("2d")
      const imgData = otx.createImageData(width, height)

      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i+0] = frame.patch[i + 0]
        imgData.data[i+1] = frame.patch[i + 1]
        imgData.data[i+2] = frame.patch[i + 2]
        imgData.data[i+3] = frame.patch[i + 3]
      }

      otx.putImageData(imgData, 0, 0)
      out.push(otx)
    }
    return { width, height, delay, frames: out }
  }

  return {frames: []}
}

const downloadURL = (data, fileName) => {
  const a = document.createElement('a')
  a.href = data
  a.download = fileName
  document.body.appendChild(a)
  a.style.display = 'none'
  a.click()
  a.remove()
}

export function download(frames, filename='anim.gif', delay=500, repeat=0) {
  const gif = GIFEncoder()

  const palette = [
    [0, 0, 0],
    [255, 255, 255]
  ]

  for (const frame of frames) {
    const { data, width, height } = frame.getImageData(0, 0, frame.canvas.width, frame.canvas.height)
    gif.writeFrame(applyPalette(data, palette), width, height, { palette, delay })
  }

  gif.finish()
  const url = window.URL.createObjectURL(new Blob([gif.bytes()]))
  downloadURL(url, filename)
  window.URL.revokeObjectURL(url)
}