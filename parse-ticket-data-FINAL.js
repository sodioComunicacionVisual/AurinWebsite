// VERSIÓN FINAL - Parse Ticket Data con soporte completo para archivos

const ticketDataRaw = $input.item.json.ticketData || $input.item.json.query || '';
let fileUrl = $input.item.json.fileUrl || null;

console.log('=== TICKET AGENT INPUT ===');
console.log('Raw ticketData:', ticketDataRaw);
console.log('FileUrl from n8n:', fileUrl);

let name, email, company, service, subject, description;

// INTENTO 1: Parsear como JSON si el agente lo envió en formato JSON
try {
  const parsed = JSON.parse(ticketDataRaw);
  console.log('✅ Parsed as JSON:', parsed);

  name = parsed.nombre_completo || parsed.name || 'No proporcionado';
  email = parsed.email || parsed.correo || 'No proporcionado';
  company = parsed.empresa || parsed.company || 'No especificado';
  service = parsed.servicio_especifico || parsed.service || 'No especificado';
  subject = parsed.asunto || parsed.subject || 'Consulta general';
  description = parsed.descripcion || parsed.description || ticketDataRaw;

  // ⭐ NUEVO: Extraer archivo_adjunto del JSON si existe
  const jsonFileUrl = parsed.archivo_adjunto || parsed.fileUrl || null;
  if (jsonFileUrl && jsonFileUrl !== 'null' && jsonFileUrl !== '') {
    fileUrl = jsonFileUrl;
    console.log('✅ FileUrl extraído del JSON:', fileUrl);
  }

} catch (jsonError) {
  // INTENTO 2: Si no es JSON, usar regex (formato texto plano)
  console.log('⚠️ Not JSON, trying regex...');

  const nameMatch = ticketDataRaw.match(/(?:nombre_completo|nombre?|name)[:\s]+([^,\n]+)/i);
  const emailMatch = ticketDataRaw.match(/(?:email|correo)[:\s]+([^\s,\n]+)/i);
  const companyMatch = ticketDataRaw.match(/(?:empresa|company)[:\s]+([^,\n]+)/i);
  const serviceMatch = ticketDataRaw.match(/(?:servicio_especifico|servicio|service)[:\s]+([^,\n]+)/i);
  const subjectMatch = ticketDataRaw.match(/(?:asunto|subject|razón)[:\s]+([^,\n]+)/i);
  const descMatch = ticketDataRaw.match(/(?:descripci[oó]n?|description)[:\s]+(.+)/is);
  const fileMatch = ticketDataRaw.match(/(?:archivo_adjunto|fileUrl|file)[:\s]+(https?:\/\/[^\s,\n]+)/i);

  name = nameMatch ? nameMatch[1].trim() : 'No proporcionado';
  email = emailMatch ? emailMatch[1].trim() : 'No proporcionado';
  company = companyMatch ? companyMatch[1].trim() : 'No especificado';
  service = serviceMatch ? serviceMatch[1].trim() : 'No especificado';
  subject = subjectMatch ? subjectMatch[1].trim() : 'Consulta general';
  description = descMatch ? descMatch[1].trim() : ticketDataRaw;

  // Extraer fileUrl del texto si existe
  if (fileMatch && !fileUrl) {
    fileUrl = fileMatch[1].trim();
    console.log('✅ FileUrl extraído del texto:', fileUrl);
  }
}

// Limpiar valores vacíos y null strings
if (!company || company === '' || company === 'null') company = 'No especificado';
if (!service || service === '' || service === 'null') service = 'No especificado';
if (!subject || subject === '' || subject === 'null') subject = 'Consulta general';
if (fileUrl === 'null' || fileUrl === '') fileUrl = null;

// Generar IDs
const ticketId = `AURIN-${Date.now()}`;
const createdAt = new Date().toISOString();

console.log('=== EXTRACTED DATA (FINAL) ===');
console.log('Name:', name);
console.log('Email:', email);
console.log('Company:', company);
console.log('Service:', service);
console.log('Subject:', subject);
console.log('Description:', description);
console.log('FileUrl:', fileUrl);
console.log('TicketId:', ticketId);

return {
  json: {
    name: name,
    email: email,
    company: company,
    service: service,
    subject: subject,
    description: description,
    ticketId: ticketId,
    createdAt: createdAt,
    fileUrl: fileUrl
  }
};
