import { ViscaCamera, ViscaCommand } from 'visca-over-ip'
import express, { Router } from 'express'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
let camera: ViscaCamera

const router = Router()

router.get('/:pose', async (req, res) => {
  const pose = Number.parseInt(req.params.pose)
  if (!pose) res.send(404)

  const command = ViscaCommand.cameraPresetRecall(pose)

  const result = await cameraCommand(camera, command)

  res.send(result)
})

app.listen(8888, () => {
  camera = new ViscaCamera('192.168.1.100', 1259);
  camera.on('connected', () => {
    console.log('Camera connected')
  })

  camera.on('error', (err) => {
    console.log("error ", err)
  })

  camera.on('closed', (event) => {
    console.log("closed? ", event)
  })
})

const cameraCommand = async (camera: ViscaCamera, command: ViscaCommand) => {
  command.on('ack', (data) => {
    console.log('Command acknowledged:', data)
    return { type: "ack", data: data }
  })

  command.on('error', (err) => {
    console.log('Command error: ', err)
    return { type: "error", data: err }
  })

  command.on('complete', (data) => {
    console.log('Command complete: ', data)
    return { type: "complete", data: data }
  })

  camera.sendCommand(command)
}
