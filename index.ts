import { ViscaCamera, ViscaCommand } from 'visca-over-ip'

var camera = new ViscaCamera('10.99.1.100', 1259);

var command = ViscaCommand.cameraPanTiltHome()
command.on('ack', () => {
  console.log('Command acknowledged')
})

camera.on('connected', () => {
  console.log('Camera connected')

  camera.sendCommand(command)
})
