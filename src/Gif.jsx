import { useWorkerParser, usePlayerState, usePlayback, Canvas } from "@react-gifs/tools"
import { useState, useEffect } from 'react'

import * as dithers from './dither.js' 

export default function Gif(props) {
  const { src, width, height, fit='cover', className } = props

  const [state, update] = usePlayerState()
  const [original, setOriginal] = useState()
  
  useEffect(() => {
    if (original){
      const newFrames = original.map(f => new ImageData(new Uint8ClampedArray(f.data), f.width, f.height))
      for (const frame of newFrames) {
        dithers[props.dither || 'none'](frame, props.step)
      }
      const newState = {...state, frames: newFrames}
      update(newState)
      if (props.onChange) {
        props.onChange(newState)
      }
    }
  }, [props.dither, props.step])
  
  useWorkerParser(src, (info) => {
    if (info?.frames?.length) {
      setOriginal(info.frames.map(f => new ImageData(new Uint8ClampedArray(f.data), f.width, f.height)))
      for (const frame of info.frames) {
        dithers[props.dither || 'none'](frame, props.step)
      }
      if (props.onChange) {
        props.onChange(info)
      }
    }
    update(info)
  })

  usePlayback(state, () => update(({ index }) => ({ index: index + 1 })))
  
  return <Canvas {...state} fit={fit} width={width} height={height} className={className}/>
}