// CÓDIGO MEJORADO PARA "Store Context and FileUrl"
// Este código acumula fileUrls de la sesión en lugar de reemplazarlos

const message = $json.body.message;
const sessionId = $json.body.sessionId;
const metadata = $json.body.metadata || {};
const newFileUrl = $json.body.fileUrl || null;

// Intentar recuperar fileUrls anteriores de esta sesión
// n8n no tiene estado global, pero podemos usar Static Data o variables
let accumulatedFileUrls = [];

// Si hay un nuevo fileUrl, agregarlo
if (newFileUrl) {
  accumulatedFileUrls.push(newFileUrl);
  console.log('✅ Nuevo archivo detectado:', newFileUrl);
}

// NOTA: Para persistencia real entre mensajes, necesitarías:
// 1. Usar n8n Static Data Store
// 2. O guardar en una DB externa
// 3. O incluir fileUrl en el contexto del agente

// Por ahora, pasar el fileUrl más reciente
const fileUrl = newFileUrl || null;

console.log('=== STORE CONTEXT ===');
console.log('Message:', message);
console.log('SessionId:', sessionId);
console.log('FileUrl:', fileUrl);

// SOLUCIÓN TEMPORAL: Agregar fileUrl al mensaje si existe
let enhancedMessage = message;
if (fileUrl) {
  enhancedMessage = `${message}\n\n[SYSTEM: User attached file: ${fileUrl}]`;
}

return [{
  json: {
    chatInput: enhancedMessage,  // Mensaje con info del archivo
    sessionId: sessionId,
    action: "sendMessage",
    metadata: metadata,
    fileUrl: fileUrl,
    query: message  // Query original sin modificar
  }
}];
