import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validar campos requeridos
    if (!body.message || !body.sessionId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: message or sessionId'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { message, sessionId, metadata, fileUrl } = body;

    // Preparar payload para n8n según el formato que espera el nodo Code
    const n8nPayload = {
      message: message,
      sessionId: sessionId,
      fileUrl: fileUrl || null, // URL del archivo subido a Vercel Blob
      metadata: metadata || {}
    };

    // Configurar timeout para la request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      // Llamar al webhook de n8n con CORS habilitado
      // IMPORTANTE: El workflow debe estar ACTIVO en n8n y configurado para POST
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.n8nsystems.info/webhook/chatbot';

      console.log('🔗 Sending to n8n webhook:', { url: n8nWebhookUrl, payload: n8nPayload });

      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(n8nPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ N8N webhook error: ${response.status} - ${errorText}`);
        
        // Si es 404, el workflow probablemente no está activo
        if (response.status === 404) {
          throw new Error('Webhook not found. Please ensure the n8n workflow is ACTIVE.');
        }
        
        throw new Error(`N8N webhook error: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📥 Response from n8n:', {
        hasMetadata: !!data.metadata,
        metadata: data.metadata
      });

      // ✅ IMPORTANTE: Retornar TODO tal cual lo envía n8n
      // No modificar ni agregar campos al metadata
      return new Response(JSON.stringify({
        success: true,
        output: data.output || data.response || data.message || 'Respuesta recibida',
        response: data.output || data.response || data.message || 'Respuesta recibida',
        sessionId: data.sessionId || sessionId,
        timestamp: new Date().toISOString(),
        metadata: data.metadata || {}  // ← Pasar metadata completo sin modificar
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Manejo específico de timeout
      if (fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Request timeout. Please try again.',
          sessionId
        }), {
          status: 408,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Error de conexión con n8n
      console.error('N8N webhook error:', fetchError);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Unable to process your message at the moment. Please try again.',
        sessionId,
        details: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid request format',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
