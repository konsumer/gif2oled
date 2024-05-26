import { parseGIF, decompressFrames } from 'gifuct-js'

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
      out.push(otx.canvas)
    }
    return { width, height, delay, frames: out }
  }

  return {frames: []}
}