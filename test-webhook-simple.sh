#!/bin/bash

echo "🧪 Probando webhook de n8n..."
echo ""

curl -k -X POST \
  https://aurinmx-n8nwithpostgres-041180-213-210-13-193.traefik.me/webhook/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, ¿qué servicios ofrece Aurin?",
    "sessionId": "test-'$(date +%s)'",
    "metadata": {}
  }'

echo ""
echo ""
echo "✅ Si ves un JSON con 'success: true', el webhook funciona correctamente"
echo "❌ Si ves '404 page not found', el workflow NO está activo en n8n"
