# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Express.js email API service using Resend for email delivery. The API handles contact form submissions with authentication via API key and supports multiple email types with structured payloads.

## Project Structure

- `index.js`: Main Express server with email endpoint and authentication
- `package.json`: Project dependencies and scripts
- `.env`: Environment variables (not committed)
- `vercel.json`: Vercel deployment configuration
- `.gitignore`: Git ignore patterns

## Architecture

- **Framework**: Express.js with Node.js
- **Email Service**: Resend API integration
- **Authentication**: X-API-Key header authentication
- **Deployment**: Vercel serverless functions
- **CORS**: Enabled for cross-origin requests

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Deploy to Vercel
vercel
```

## API Endpoints

### POST /send-email
Sends an email with the provided payload. Requires X-API-Key authentication.

**Headers:**
- `x-api-key`: Authentication key (required)
- `Content-Type: application/json`

**Payload:**
```json
{
  "email_type": "contact|support|sales",
  "name": "string (required)",
  "phone": "string (optional)",
  "email": "string (required)",
  "message": "string (required)",
  "whatsapp_check": "boolean",
  "meta": "object (optional)"
}
```

### GET /health
Health check endpoint that returns server status.

## Environment Variables

Required environment variables:
- `RESEND_API_KEY`: API key from Resend service
- `X_API_KEY`: Custom API key for endpoint authentication
- `PORT`: Server port (defaults to 3000)

## Authentication

All POST endpoints require authentication via the `x-api-key` header. The API key is generated and stored in the `X_API_KEY` environment variable.

## Email Processing

The service processes different email types and formats the content accordingly. It includes metadata if provided and creates structured HTML emails with all contact information.

## Error Handling

- 401: Invalid or missing API key
- 400: Missing required fields
- 500: Email sending errors
- 404: Endpoint not found