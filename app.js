const UART_SERVICE_UUID =
'6e400001-b5a3-f393-e0a9-e50e24dcca9e';

const UART_RX_CHARACTERISTIC_UUID =
'6e400002-b5a3-f393-e0a9-e50e24dcca9e';

let rxCharacteristic = null;

document
.getElementById('connectBtn')
.addEventListener('click', connectMicrobit);

async function connectMicrobit() {

  try {

    const device =
    await navigator.bluetooth.requestDevice({

      filters: [{
        services: [UART_SERVICE_UUID]
      }]

    });

    console.log("Dispositivo encontrado");

    const server =
    await device.gatt.connect();

    console.log("GATT conectado");

    const service =
    await server.getPrimaryService(
      UART_SERVICE_UUID
    );

    console.log("Servicio UART OK");

    rxCharacteristic =
    await service.getCharacteristic(
      UART_RX_CHARACTERISTIC_UUID
    );

    console.log("Característica RX OK");

    document.getElementById('status')
    .innerText = '✅ Conectado';

  }

  catch(error) {

    console.error(error);

    document.getElementById('status')
    .innerText =
    '❌ Error de conexión';

  }

}

async function sendCommand(command) {

  if (!rxCharacteristic) {

    alert('Primero conecta la micro:bit');
    return;
  }

  try {

    const encoder =
    new TextEncoder();

    const data =
    encoder.encode(command + '\n');

    await rxCharacteristic
    .writeValueWithoutResponse(data);

    console.log(
      'Enviado:',
      command
    );

  }

  catch(error){

    console.error(error);

  }

}
