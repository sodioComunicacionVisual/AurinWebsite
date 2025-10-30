// Script de prueba para verificar conexión con n8n webhook
// Ejecutar con: node test-n8n-webhook.js

const WEBHOOK_URL = 'https://aurinmx-n8nwithpostgres-041180-213-210-13-193.traefik.me/webhook/chatbot';

async function testWebhook() {
  console.log('🧪 Probando conexión con n8n webhook...\n');
  console.log('URL:', WEBHOOK_URL);
  console.log('---\n');

  // Test 1: Mensaje simple
  console.log('📝 Test 1: Mensaje simple');
  try {
    const response1 = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: "Hola, ¿qué servicios ofrece Aurin?",
        sessionId: "test-" + Date.now(),
        metadata: {}
      })
    });

    const data1 = await response1.json();
    console.log('✅ Respuesta recibida:');
    console.log('Status:', response1.status);
    console.log('Success:', data1.success);
    console.log('Output:', data1.output?.substring(0, 100) + '...');
    console.log('SessionId:', data1.sessionId);
    console.log('---\n');
  } catch (error) {
    console.error('❌ Error en Test 1:', error.message);
    console.log('---\n');
  }

  // Test 2: Mensaje con fileUrl
  console.log('📎 Test 2: Mensaje con archivo adjunto');
  try {
    const response2 = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: "Necesito ayuda con este documento",
        sessionId: "test-file-" + Date.now(),
        fileUrl: "https://blob.vercel-storage.com/example-file.pdf",
        metadata: {}
      })
    });

    const data2 = await response2.json();
    console.log('✅ Respuesta recibida:');
    console.log('Status:', response2.status);
    console.log('Success:', data2.success);
    console.log('Output:', data2.output?.substring(0, 100) + '...');
    console.log('---\n');
  } catch (error) {
    console.error('❌ Error en Test 2:', error.message);
    console.log('---\n');
  }

  // Test 3: Consulta de calendario
  console.log('📅 Test 3: Consulta de disponibilidad de calendario');
  try {
    const response3 = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: "¿Cuándo tienen disponibilidad para una reunión?",
        sessionId: "test-calendar-" + Date.now(),
        metadata: {}
      })
    });

    const data3 = await response3.json();
    console.log('✅ Respuesta recibida:');
    console.log('Status:', response3.status);
    console.log('Success:', data3.success);
    console.log('Output:', data3.output?.substring(0, 150) + '...');
    console.log('Metadata:', data3.metadata);
    console.log('---\n');
  } catch (error) {
    console.error('❌ Error en Test 3:', error.message);
    console.log('---\n');
  }

  console.log('✨ Pruebas completadas');
}

testWebhook();
