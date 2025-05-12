# Gemini AI Datasource Plugin for Godspeed Framework

A Godspeed datasource plugin that integrates Google's Gemini AI capabilities into Godspeed applications, enabling developers to leverage powerful generative AI features through a simple, configurable interface.

---

## What This Plugin Does

This plugin allows Godspeed applications to:

- Connect to Google's Gemini API service
- Generate text content using various Gemini models
- Support both standard and streaming response formats
- Configure model parameters through YAML configuration
- Easily integrate AI capabilities into Godspeed workflows

---

## Installation

### Prerequisites

- Node.js (v18 or higher)
- A Godspeed project
- A Google Gemini API key

### Adding the Plugin to Your Project

Install the plugin in your Godspeed project
godspeed plugin add @godspeedsystems/plugins-my-datasource-as-datasource

Or for local development
npm link @godspeedsystems/plugins-my-datasource-as-datasource

text

---

## Configuration

### 1. Create a loader file in your Godspeed project:

// src/datasources/types/gemini.ts
import { DataSource } from '@godspeedsystems/plugins-my-datasource-as-datasource';
export default DataSource;

text

### 2. Create a configuration file:

src/datasources/gemini.yaml
type: gemini
api_key: "${GEMINI_API_KEY}" # Environment variable reference
models:
default:
name: "gemini-2.0-flash"
options:
temperature: 0.7
topK: 16
topP: 0.9
maxOutputTokens: 800
chat:
name: "gemini-2.5-pro-preview-05-06" # Or any other available model
options:
temperature: 0.9
topK: 10
topP: 0.8

text

### 3. Add your API key to the environment:

.env file
GEMINI_API_KEY=your_gemini_api_key_here

text

---

## Usage

### Basic Text Generation

Create a workflow file:

src/functions/generate_text.yaml
summary: Generate text using Gemini API
tasks:

id: generate-content
fn: datasource.gemini.execute
args:
operation: generateContent
model: default
prompt: <% inputs.body.prompt %>

text

Create an event to trigger the workflow:

src/events/gemini_event.yaml
http.post./gemini/generate:
summary: Generate content using Gemini API
description: Uses Gemini to generate content based on prompt
fn: generate_text
body:
content:
application/json:
schema:
type: object
properties:
prompt:
type: string
responses:
content:
application/json:
schema:
type: object

text

### Streaming Response

src/functions/stream_text.yaml
summary: Stream text generation using Gemini API
tasks:

id: stream-content
fn: datasource.gemini.execute
args:
operation: streamGenerateContent
model: default
prompt: <% inputs.body.prompt %>

text

---

## Running the Project

**Start your Godspeed project:**
godspeed serve

text

**Access the API documentation:**
http://localhost:3000/api-docs

text

**Test the API:**
curl -X POST http://localhost:3000/gemini/generate
-H "Content-Type: application/json"
-d '{"prompt":"Tell me about artificial intelligence"}'

text

---

## Available Operations

- `generateContent`: Generate text content (standard response)
- `streamGenerateContent`: Generate text content with streaming response

---

## Supported Models

This plugin supports all available Gemini models, including:

- `gemini-2.0-flash` (general purpose)
- `gemini-2.0-flash-lite` (cost-effective)
- `gemini-2.5-pro-preview` (advanced reasoning)
- `gemini-2.5-flash-preview` (cost-effective)

---

## Notes and Limitations

- **API Key Activation:** Newly created Gemini API keys may take 15-60 minutes to become active
- **Rate Limits:** Be aware of Google's rate limits for the Gemini API
- **Model Availability:** Some models may be in preview and have limited availability
- **Error Handling:** The plugin includes basic error handling for common API issues
- **Environment Variables:** Ensure your API key is properly set in the environment

---

## License

ISC

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
