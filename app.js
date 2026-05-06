const UART_SERVICE_UUID =
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e';

const UART_TX_CHARACTERISTIC_UUID =
  '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

let txCharacteristic = null;

document
  .getElementById('connectBtn')
  .addEventListener('click', connectMicrobit);

async function connectMicrobit() {

  try {

    const device =
      await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'BBC micro:bit' }
        ],
        optionalServices: [UART_SERVICE_UUID]
      });

    const server = await device.gatt.connect();

    const service =
      await server.getPrimaryService(
        UART_SERVICE_UUID
      );

    txCharacteristic =
      await service.getCharacteristic(
        UART_TX_CHARACTERISTIC_UUID
      );

    document.getElementById('status')
      .innerText = '✅ Conectado';

  } catch (error) {

    console.error(error);

    document.getElementById('status')
      .innerText = '❌ Error de conexión';
  }
}

async function sendCommand(command){

  if(!rxCharacteristic){

    alert('Conecta primero');
    return;
  }

  try{

    const encoder = new TextEncoder();

    const data =
    encoder.encode(command + '\n');

    await rxCharacteristic.writeValue(data);

    console.log(command);

  }

  catch(error){

    console.error(error);

  }

}
