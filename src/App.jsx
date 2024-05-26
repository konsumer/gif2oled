import { useState, useEffect, useRef } from 'react'

import * as gif from './gif.js'
import { drawImageFit, frameToByteString, download } from './utils.js'
import dither from './dither.js'

export default function app() {
  const r = useRef()
  const [algorithm, setAlgorithm] = useState('none')
  const [image, setImage] = useState(new URL('siouxsie.gif', self.location.href ).toString())
  const [filename, setFilename] = useState('siouxsie.gif')
  const [width, setWidth] = useState(128)
  const [height, setHeight] = useState(64)
  const [threshold, setThreshold] = useState(100)
  const [imgOrig, setOrig] = useState()
  const [imgProcessed, setProcessed] = useState()

  // update the original
  useEffect(() => {
    if (image) {
      fetch(image)
        .then(r => r.arrayBuffer())
        .then(gif.process)
        .then(setOrig)
        .then(() => {
          URL.revokeObjectURL(image)
        })
    }
  }, [image])

  // set an interval that will display the current settings, process all the frames (once) on setting-change
  useEffect(() => {
    let int
    
    if (imgOrig?.frames?.length) {
      let f = 0
      const processedFrames = imgOrig.frames.map(frame => {
        const o =  (new OffscreenCanvas(width, height)).getContext("2d", {willReadFrequently: true})
        drawImageFit(o, frame.canvas)
        o.putImageData(dither(o.getImageData(0, 0, width, height), threshold, algorithm), 0, 0)
        return o
      })

      setProcessed(processedFrames)

      const ctx = r.current.getContext("2d")

      int = setInterval(() => {
        f = (f + 1) % imgOrig.frames.length
        ctx.drawImage(processedFrames[f].canvas, 0, 0)
      }, imgOrig.delay)
    }

    return () => int && clearInterval(int)
  }, [imgOrig, width, height, threshold, algorithm])

  const handleFileChange = e => {
    setFilename(e.target.files[0].name)
    setImage(URL.createObjectURL(e.target.files[0]))
  }

  const generateC = () => {
    const shortname = filename.split('.')[0]
    const code = `
// generated on ${(new Date()).toISOString()} at ${document.location.toString()} 
// ${filename} - size:${width}x${height} dither:${algorithm}/${threshold} delay:${imgOrig.delay}ms

// the frames[frameNumber]
static const unsigned int image_${shortname}_size = ${imgProcessed.length};
static const unsigned char image_${shortname}[image_${shortname}_size][${(width*height)/8}] = {
${imgProcessed.map(frame => `  { ${frameToByteString(frame)} }`).join(',\n')}
};
`
    download(code, 'text/x-c', `image_${shortname}.h`)
  }

  const generateArduino = () => {
    const shortname = filename.split('.')[0]
    const code = `
// generated on ${(new Date()).toISOString()} at ${document.location.toString()} 
// ${filename} - size:${width}x${height} dither:${algorithm}/${threshold} delay:${imgOrig.delay}ms

// the frames[frameNumber]
const unsigned int image_${shortname}_size = ${imgProcessed.length};
const unsigned char image_${shortname}[image_${shortname}_size][${(width*height)/8}] PROGMEM = {
${imgProcessed.map(frame => `  { ${frameToByteString(frame)} }`).join(',\n')}
};
`   
    download(code, 'text/x-c', `image_${shortname}.h`)
  }
  
  const generatePython = () => {
    const shortname = filename.split('.')[0]
    const code = `
# generated on ${(new Date()).toISOString()} at ${document.location.toString()} 
# ${filename} - size:${width}x${height} dither:${algorithm}/${threshold} delay:${imgOrig.delay}ms

# the frames[frameNumber]
image_${shortname}_size = ${imgProcessed.length}
image_${shortname} = [
${imgProcessed.map(frame => `  bytearray(${frameToByteString(frame)})`).join(',\n')}
]
`   
    download(code, 'text/x-script.python', `image_${shortname}.py`)
  }

  const generateGif = () => {
    const shortname = filename.split('.')[0]
    gif.download(imgProcessed, `${shortname}.gif`, imgOrig.delay)
  }

  return (
    <div className="h-screen flex flex-col">
      <header className='p-4 h-16 flex'>
        <h1 className='text-4xl text-accent grow'>gif2oled</h1>
      </header>
      <main className="p-4 grow overflow-y-auto">
        <p className='mb-8'>Use this tool to convert a gif into an animated program for a 1-color LCD/OLED. No files are uploaded to any server, and conversion happens in your browser.</p>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Choose the file to convert</span>
          </div>
          <input onChange={handleFileChange} type="file" className="file-input file-input-bordered file-input-primary w-full" />
        </label>

        <h3 className='mt-4 text-lg'>Output Size</h3>

        <div className="flex gap-2">
          <label className="form-control grow">
            <div className="label">
              <span className="label-text">Width</span>
            </div>
            <input value={width} onChange={e => setWidth(e.target.value)} type="number" className="input input-bordered" />
          </label>

          <label className="form-control grow">
            <div className="label">
              <span className="label-text">Height</span>
            </div>
            <input value={height} onChange={e => setHeight(e.target.value)} type="number" className="input input-bordered" />
          </label>
        </div>

        <h3 className='mt-4 text-lg'>Dithering</h3>

        <div className="flex gap-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Algorithm</span>
            </div>
            <select value={algorithm} onChange={e => setAlgorithm(e.target.value)} className="select select-bordered w-full">
              <option value='binary'>Binary</option>
              <option value='atkinson'>Atkinson</option>
              <option value='bayer'>Bayer</option>
              <option value='floydsteinberg'>Floyd Steinberg</option>
            </select>
          </label>

          <label className="form-control grow">
            <div className="label">
              <span className="label-text">Threshold</span>
            </div>
            <input min={1} value={threshold} onChange={e => setThreshold(e.target.value)} type="number" className="input input-bordered" />
          </label>
        </div>

        <h3 className='mt-4 text-lg'>Output</h3>

        <div className="flex flex-row gap-2 mt-4 justify-center">
          <button onClick={generateC} className="btn btn-secondary">C</button>
          <button onClick={generateArduino} className="btn btn-secondary">Arduino</button>
          <button onClick={generatePython} className="btn btn-secondary">Python</button>
          <button onClick={generateGif} className="btn btn-secondary">Gif</button>
        </div>

        <canvas ref={r} width={width} height={height} className='w-full mt-4'></canvas>

      </main>

      <footer className='p-5 text-center bg-neutral text-neutral-content'>
        <p>
          Contribute on{' '}
          <a className='underline' target='_new' href='https://github.com/konsumer/gif2oled'>
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}