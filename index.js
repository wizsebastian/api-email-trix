require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Helper function to load HTML templates
const loadEmailTemplate = (templateName, variables = {}) => {
  try {
    const templatePath = path.join(__dirname, 'email-template', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace variables in template (simple string replacement)
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, variables[key]);
    });
    
    return template;
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    return null;
  }
};

// Middleware de autenticación por API Key
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.X_API_KEY) {
    return res.status(401).json({ 
      success: false, 
      error: 'API Key inválida o faltante' 
    });
  }
  
  next();
};

// Endpoint principal para envío de emails
app.post('/send-email', authenticateApiKey, async (req, res) => {
  try {
    const { 
      email_type, 
      name, 
      phone, 
      email, 
      message, 
      whatsapp_check, 
      meta 
    } = req.body;

    // Validación de campos requeridos
    if (!email || !name || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campos requeridos: email, name, message' 
      });
    }

    // Construir el HTML del email basado en el tipo
    let emailSubject = `Nuevo contacto - ${email_type || 'General'}`;
    let emailBody;
    
    // Use HTML template for contact emails
    if (email_type === 'contact') {
      emailBody = loadEmailTemplate('thank-you-email', {
        name: name,
        email: email,
        phone: phone || 'No proporcionado',
        message: message
      });
    }
    
    // Fallback to simple HTML if template fails or for other types
    if (!emailBody) {
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Tipo de email:</strong> ${email_type || 'No especificado'}</p>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp_check ? 'Sí' : 'No'}</p>
          <hr>
          <h3>Mensaje:</h3>
          <p>${message}</p>
          ${meta ? `<hr><p><strong>Metadata:</strong> ${JSON.stringify(meta)}</p>` : ''}
        </div>
      `;
    }

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Cambiar por tu dominio verificado
      to: email,
      subject: emailSubject,
      html: emailBody,
    });

    res.json({ 
      success: true, 
      data,
      payload: {
        email_type,
        name,
        phone,
        email,
        whatsapp_check,
        meta
      }
    });

  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Endpoint para solicitud de demo GTS
app.post('/request-demo', authenticateApiKey, async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      company,
      message, 
      whatsapp_check, 
      meta 
    } = req.body;

    // Validación de campos requeridos para demo
    if (!email || !name || !company) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campos requeridos: email, name, company' 
      });
    }

    // Cargar template de demo
    let emailBody = loadEmailTemplate('demo-request-email', {
      name: name,
      email: email,
      phone: phone || 'No proporcionado',
      company: company,
      message: message || 'Solicitud de demo del GTS'
    });
    
    // Fallback si el template falla
    if (!emailBody) {
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🚀 Solicitud de Demo GTS</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Empresa:</strong> ${company}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp_check ? 'Sí' : 'No'}</p>
          <hr>
          <h3>Mensaje:</h3>
          <p>${message || 'Solicitud de demo del Geo Tracking System'}</p>
          <hr>
          <p><strong>🎯 Próximo paso:</strong> Un agente se contactará contigo dentro de las próximas 24 horas para coordinar tu demo personalizada del GTS.</p>
          ${meta ? `<hr><p><strong>Metadata:</strong> ${JSON.stringify(meta)}</p>` : ''}
        </div>
      `;
    }

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Cambiar por tu dominio verificado
      to: email,
      subject: `Demo GTS Solicitada - ${company}`,
      html: emailBody,
    });

    res.json({ 
      success: true, 
      data,
      payload: {
        name,
        phone,
        email,
        company,
        whatsapp_check,
        meta
      },
      message: 'Solicitud de demo procesada. Un agente se contactará contigo pronto.'
    });

  } catch (error) {
    console.error('Error procesando solicitud de demo:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint no encontrado' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📧 API Key requerida: ${process.env.X_API_KEY ? 'Configurada' : 'NO CONFIGURADA'}`);
  console.log(`📨 Resend API: ${process.env.RESEND_API_KEY ? 'Configurada' : 'NO CONFIGURADA'}`);
});