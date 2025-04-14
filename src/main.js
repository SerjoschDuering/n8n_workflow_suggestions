// Import the main CSS file (Vite will handle including it)
import './style.css';
// Import the n8n chat CSS
import '@n8n/chat/style.css';

// Import modules
import { initializeForm } from './form.js';
import { initializeChat } from './chat.js';

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded.");
    initializeForm();
    initializeChat();
});