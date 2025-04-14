import { createChat } from '@n8n/chat';
import { getChatEmbedUrl, AI_UPDATE_CODEWORD } from './config.js';
import { showUpdatePrompt } from './form.js'; // Import function to trigger prompt display

let chatInstance = null;
let processedMessageContents = new Set(); // Track processed message contents

/**
 * Extracts JSON from a string that might have additional text before/after the JSON
 * @param {string} str - String containing JSON
 * @returns {Object|null} - Parsed JSON object or null if parsing failed
 */
function extractAndParseJSON(str) {
    console.log('Attempting to extract JSON from:', str);
    
    // Try to find JSON-like structure between { and }
    const matches = str.match(/{(.|\n)*}/g);
    
    if (matches && matches.length > 0) {
        console.log('Found potential JSON match:', matches[0]);
        try {
            return JSON.parse(matches[0]);
        } catch (e) {
            console.error('First JSON parsing attempt failed:', e);
        }
    }
    
    // Fallback: Try more aggressively to extract JSON
    try {
        // Find the first opening brace
        const startIdx = str.indexOf('{');
        if (startIdx === -1) {
            console.error('No opening brace found in string');
            return null;
        }
        
        // Find the last closing brace
        const endIdx = str.lastIndexOf('}');
        if (endIdx === -1) {
            console.error('No closing brace found in string');
            return null;
        }
        
        const jsonStr = str.substring(startIdx, endIdx + 1);
        console.log('Extracted potential JSON string:', jsonStr);
        
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Failed to extract and parse JSON:', e);
        return null;
    }
}

/**
 * Check for new or updated messages in the chat DOM
 */
function checkForNewMessages() {
    // Look for message elements in the chat
    const messageElements = document.querySelectorAll('#n8n-chat-container .chat-message');
    
    console.log(`Checking for messages. Found ${messageElements.length} messages`);
    
    // Process all messages every time, since content can change
    messageElements.forEach((messageEl, index) => {
        const messageText = messageEl.textContent || '';
        const contentSignature = messageText.trim();
        
        // Skip processing empty messages or "..." placeholders
        if (contentSignature === "" || contentSignature === "...") {
            // console.log(`Skipping empty/loading message #${index+1}`);
            return;
        }
        
        // Skip if we've already processed this exact content
        if (processedMessageContents.has(contentSignature)) {
            // console.log(`Message #${index+1} already processed, skipping`);
            return;
        }
        
        // Log that we found a new message content
        console.log(`Processing message #${index+1}:`, 
                   messageText.length > 50 ? messageText.substring(0, 50) + '...' : messageText);
        
        // Mark this content as processed
        processedMessageContents.add(contentSignature);
        
        // Check if the message contains our update codeword
        if (messageText.includes(AI_UPDATE_CODEWORD)) {
            console.log("AI Update Codeword detected in chat message!");
            
            // Get the substring after the codeword
            const startIdx = messageText.indexOf(AI_UPDATE_CODEWORD) + AI_UPDATE_CODEWORD.length;
            const jsonPlusExtra = messageText.substring(startIdx).trim();
            
            console.log('Text after codeword:', 
                       jsonPlusExtra.length > 100 ? jsonPlusExtra.substring(0, 100) + '...' : jsonPlusExtra);
            
            // Try to extract and parse JSON
            const updateData = extractAndParseJSON(jsonPlusExtra);
            
            if (updateData) {
                console.log('Successfully parsed update data:', updateData);
                showUpdatePrompt(updateData);
            } else {
                console.error('Failed to parse update data from message');
            }
        }
    });
}

/**
 * Initializes the n8n chat widget using the @n8n/chat package.
 */
export async function initializeChat() {
    const chatContainer = document.getElementById('n8n-chat-container');

    if (!chatContainer) {
        console.error("Chat container element (#n8n-chat-container) not found.");
        return;
    }

    const chatEmbedUrl = getChatEmbedUrl();
    // Basic validation of config value
    if (!chatEmbedUrl) {
        console.error('Chat embed URL could not be generated - missing chat ID in URL parameters');
        chatContainer.innerHTML = '<div class="p-4 text-center text-red-600">Chat Error: Missing chat ID in URL parameters. Add ?chat=YOUR_CHAT_ID to the URL.</div>';
        return;
    }

    console.log(`Initializing chat from URL: ${chatEmbedUrl}`);
    console.log(`Looking for update codeword: "${AI_UPDATE_CODEWORD}"`);

    try {
        // Create and mount the chat widget
        chatInstance = await createChat({
            webhookUrl: chatEmbedUrl,
            target: '#n8n-chat-container',
            mode: 'fullscreen',
            // Set custom welcome messages
            initialMessages: [
                "Hello! 👋 Welcome to our n8n Automation Ideas Hub!",
                "I'm here to help with n8n automation ideas! You can ask about n8n capabilities, explore existing workflows, refine your automation concepts together, or simply share a quick idea. I can even help fill out the form for you - just describe your automation idea and I'll take care of the details. What would you like to do today?"
            ]
        });

        console.log("Chat initialized successfully");
        
        // Set up a polling interval to check for new messages
        setInterval(checkForNewMessages, 1000); // Check every second
        
    } catch (error) {
        console.error("Failed to initialize or mount n8n chat:", error);
        chatContainer.innerHTML = `<div class="p-4 text-center text-red-600">Chat Initialization Failed: ${error.message}. Check console and config.</div>`;
    }
}