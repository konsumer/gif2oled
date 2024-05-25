import { useState, useEffect } from 'react'
import Gif from './Gif.jsx'

export default function app() {
  const [algorithm, setAlgorithm] = useState('none')
  const [image, setImage] = useState(new URL('example.gif', self.location.href ).toString())
  const [width, setWidth] = useState(128)
  const [height, setHeight] = useState(64)
  const [step, setStep] = useState(2)
  const [imagedata, setImagedata] = useState()

  const handleFileChange = e => {
    setImage(URL.createObjectURL(e.target.files[0]))
  }

  const handleDownloadClick = () => {
    for (const frame  of imagedata.frames) {
      const bytes = new Uint8Array(frame.data.length / 8)
      for (let i=0;i<frame.data.length;i+=8) {
        bytes[i/8] = frame.data.slice(i, i+8).reduce(
            (a, bit, i, arr) => a + (bit > 0 ? Math.pow(2, arr.length - i - 1) : 0),
            0
        )
      }
    }
  }

  return (
    <div className="p-4">
      <p>Use this tool to convert a gif into an animated C program for a 1-color OLED.</p>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Choose the file to convert</span>
        </div>
        <input onChange={handleFileChange} type="file" className="file-input file-input-bordered file-input-primary w-full" />
      </label>

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

      <div className="flex gap-2">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Choose the dithering algorithm</span>
          </div>
          <select value={algorithm} onChange={e => setAlgorithm(e.target.value)} className="select select-bordered w-full">
            <option value='none'>None</option>
            <option value='ordered'>Ordered</option>
            <option value='diffusion'>Diffusion</option>
            <option value='atkinson'>Atkinson</option>
          </select>
        </label>

        <label className="form-control grow">
          <div className="label">
            <span className="label-text">Step</span>
          </div>
          <input min={1} max={10} value={step} onChange={e => setStep(e.target.value)} type="number" className="input input-bordered" />
        </label>
      </div>

      <Gif onChange={setImagedata} className='mt-4 w-full' step={step} width={width} height={height} src={image} dither={algorithm}></Gif>
    
      <div className="flex gap-2 mt-4">
        <button className="btn btn-secondary" onClick={handleDownloadClick}>Download</button>
      </div>
    </div>
  )
}