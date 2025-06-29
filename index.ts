import { ViscaCamera, ViscaCommand } from 'visca-over-ip'
import express, { Router } from 'express'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
let camera: ViscaCamera

let camera_connected = false;
app.get('/:pose', async (req, res) => {
  const pose = Number.parseInt(req.params.pose)
  console.log("requesting pose ", pose)
  if (!pose) res.send(404)

  const command = ViscaCommand.cameraPresetRecall(pose)

  const result = await cameraCommand(camera, command)

  res.send(result)
})

app.get('/save/:position', async (req, res) => {
  const pose = Number.parseInt(req.params.position)
  if (!pose) res.send(404)

  const command = ViscaCommand.cameraPresetSet(pose)

  const result = await cameraCommand(camera, command)

  res.send(result)
})

app.get('/home', async (req, res) => {
  const command = ViscaCommand.cameraPanTiltHome()
  const result = await cameraCommand(camera, command)
  res.send(result)
})

app.get('/', (req, res) => {
  res.send("hello world")
})

app.listen(8888, () => {
  console.log("server online")

  camera = new ViscaCamera('192.168.8.100', 1259);
  camera.on('connected', () => {
    console.log('Camera connected')
    camera_connected = true
    //const command = ViscaCommand.cameraZoomDirect(3000)
    //const command = ViscaCommand.cameraPanTilt(7, 7,)
    //camera.sendCommand(command)
    //setTimeout(() => {
    //  const zoom = ViscaCommand.cameraZoomStop()
    //  camera.sendCommand(zoom)
    //}, 2000)
  })

  camera.on('error', (err) => {
    console.log("error ", err)
  })

  camera.on('closed', (event) => {
    console.log("closed? ", event)
  })
})

const cameraCommand = async (camera: ViscaCamera, command: ViscaCommand) => {
  if (!camera_connected) {
    return { type: "error", data: { message: "camera not connected" } }
  }
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
