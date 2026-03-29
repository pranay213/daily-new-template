/**
 * Daily HTML Template Generator Script
 * 
 * This script is intended to be run by GitHub Actions daily.
 * It calls the Ollama Cloud API (or any LLM API you prefer) to generate
 * a raw HTML/CSS template, saves it to `public/templates/`, and updates
 * the `src/data/templates.js` registry so it appears on the dashboard.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace these with your actual Ollama endpoints and models
const OLLAMA_URL = process.env.OLLAMA_API_URL || 'https://ollama.com/api/chat';
const OLLAMA_KEY = process.env.OLLAMA_API_KEY || ''; // If required by your cloud setup

async function generateTemplate() {
  console.log('Starting daily template generation...');
  
  // 1. Define the prompt for Ollama
  const prompt = `
    You are an expert web designer. Create a stunning, single-file HTML/CSS template.
    Use modern design principles, clean code, and responsive design.
    The CSS should use CSS variables for colors so it can be themed.
    
    Variables to support:
    --primary
    --bg-main
    --bg-surface
    --text-primary
    --text-secondary
    --border
    
    Output ONLY raw valid HTML code. Do not include markdown blocks like \`\`\`html.
  `;

  try {
    // 2. Call the Ollama API
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OLLAMA_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-oss:120b',
        messages: [
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama API Error: ${response.status} ${errText}`);
    }
    
    const data = await response.json();
    let htmlContent = data.message.content;

    // Clean up potential markdown formatting from the response
    if (htmlContent.includes('```html')) {
      htmlContent = htmlContent.split('```html')[1].split('```')[0].trim();
    } else if (htmlContent.includes('```')) {
      htmlContent = htmlContent.split('```')[1].split('```')[0].trim();
    }

    // 3. Save to public/templates/
    const dateStr = new Date().toISOString().split('T')[0];
    const templateId = `ai-template-${Date.now()}`;
    const filename = `${templateId}.html`;
    const filepath = path.join(__dirname, '..', 'public', 'templates', filename);
    
    fs.writeFileSync(filepath, htmlContent, 'utf-8');
    console.log(`✅ Saved new template to ${filepath}`);

    // 4. Update the src/data/templates.js file to include the new template
    const metadataPath = path.join(__dirname, '..', 'src', 'data', 'templates.js');
    let metadataContent = fs.readFileSync(metadataPath, 'utf-8');
    
    const newEntry = `  {
    id: '${templateId}',
    title: 'AI Generated Template (${dateStr})',
    description: 'A brand new layout generated automatically by Ollama AI.',
    dateAdded: '${dateStr}',
    fileUrl: '/templates/${filename}',
    category: 'Generated',
    thumbnail: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=800'
  }`;

    // Insert the new entry into the array (find the opening bracket and insert after)
    metadataContent = metadataContent.replace(
      'export const templates = [',
      `export const templates = [\n${newEntry},`
    );

    fs.writeFileSync(metadataPath, metadataContent, 'utf-8');
    console.log('✅ Updated templates.js with new entry');
    console.log('Generation complete!');

  } catch (error) {
    console.error('Failed to generate template:', error);
    process.exit(1);
  }
}

generateTemplate();
