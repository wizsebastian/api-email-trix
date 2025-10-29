# API Email TRIX

API serverless para envío de emails con autenticación y templates HTML profesionales.

## 🚀 Características

- **Autenticación**: X-API-Key header authentication
- **Templates HTML**: Emails profesionales para contacto y demo GTS
- **Endpoints**:
  - `/send-email` - Formularios de contacto con template
  - `/request-demo` - Solicitudes de demo del GTS
  - `/health` - Health check

## 🔧 Setup Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm run dev
```

## 📧 Variables de Entorno

```env
RESEND_API_KEY=re_tu_api_key_aqui
X_API_KEY=gxtr_2024_secure_api_key_auth_mail_server_v1
PORT=3000
```

## 🧪 Testing

1. **Importar colección Postman**: `postman_collection.json`
2. **Variables configuradas**:
   - `base_url`: http://localhost:3000 (default)
   - `base_url_prod`: URL de producción de Vercel
   - `api_key`: Clave de autenticación

3. **Para usar producción**: Cambiar `{{base_url}}` por `{{base_url_prod}}` en Postman

## 📋 Endpoints

### POST /send-email
Envía emails con template HTML para `email_type: "contact"`

**Headers:**
```
x-api-key: gxtr_2024_secure_api_key_auth_mail_server_v1
Content-Type: application/json
```

**Body:**
```json
{
  "email_type": "contact",
  "name": "Juan Pérez",
  "phone": "+1234567890",
  "email": "juan@example.com",
  "message": "Mensaje de contacto",
  "whatsapp_check": true,
  "meta": {"source": "website"}
}
```

### POST /request-demo
Solicita demo del GTS con template específico

**Body:**
```json
{
  "name": "Carlos Mendoza",
  "phone": "+5491123456789",
  "email": "carlos@company.com",
  "company": "Mi Empresa",
  "message": "Necesito demo del GTS",
  "whatsapp_check": true,
  "meta": {"industry": "logistics"}
}
```

## 🌐 Deployment

**URL de Producción**: `https://api-email-trix-jvl2such1-infogmtechdogmailcoms-projects.vercel.app`

**⚠️ Importante**: Para usar la API en producción, deshabilitar "Deployment Protection" en:
1. https://vercel.com/dashboard
2. Proyecto `api-email-trix` 
3. Settings → Security → Deployment Protection → OFF

## 📁 Estructura

```
├── index.js                 # Servidor Express principal
├── email-template/          # Templates HTML
│   ├── thank-you-email.html # Template contacto (azul)
│   └── demo-request-email.html # Template demo GTS (verde)
├── postman_collection.json  # Colección Postman
├── vercel.json              # Configuración Vercel
└── .env                     # Variables de entorno
```

## 🎨 Templates

- **Contacto**: Diseño azul, mensaje de agradecimiento
- **Demo GTS**: Diseño verde, información del tracking system

Los templates se cargan automáticamente según el `email_type` o endpoint usado.