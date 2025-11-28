// public/audio-processor.js
/**
 * @file Procesador de AudioWorklet para manejar datos de audio en un hilo separado.
 * Esto evita bloquear el hilo principal de la interfaz de usuario durante el procesamiento de audio.
 */

class AudioProcessor extends AudioWorkletProcessor {
  // El método process() es llamado por el motor de audio cada vez que hay un nuevo
  // bloque de datos de audio para procesar.
  process(inputs, outputs, parameters) {
    // Obtenemos el primer (y único) input, y su primer canal de datos.
    const input = inputs[0];
    const channelData = input[0];

    // Si tenemos datos de canal, los enviamos de vuelta al hilo principal.
    // Usamos `postMessage` en `this.port` para comunicarnos.
    // Para una mayor eficiencia, se podría transferir la propiedad del buffer
    // en lugar de clonarlo: this.port.postMessage(channelData, [channelData.buffer]);
    if (channelData) {
      this.port.postMessage(channelData);
    }

    // Devuelve `true` para mantener vivo el procesador.
    // Si devolvieras `false`, se destruiría después de esta llamada.
    return true;
  }
}

// Registra el procesador con un nombre para que podamos crearlo desde el hilo principal.
registerProcessor('audio-processor', AudioProcessor);
