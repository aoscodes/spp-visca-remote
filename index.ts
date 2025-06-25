import { ViscaCamera, ViscaCommand } from 'visca-over-ip'

var camera = new ViscaCamera('192.168.1.100', 1259);
var command = ViscaCommand.cameraPresetRecall(1)

command.on('ack', (data) => {
  console.log('Command acknowledged:', data)
})

command.on('error', (err) => {
  console.log('Command error: ', err)
})

command.on('complete', (data) => {
  console.log('Command complete: ', data)
})

camera.on('connected', () => {
  console.log('Camera connected')
  camera.sendCommand(command)
})

camera.on('error', (err) => {
  console.log("error? ", err)
})

camera.on('closed', (event) => {
  console.log("closed? ", event)
})
