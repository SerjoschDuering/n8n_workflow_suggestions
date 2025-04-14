/**
 * URL of your n8n webhook endpoint that receives the final form submission.
 * Gets the webhook ID from URL parameter 'webhook'
 */
export function getSubmitWebhookUrl() {
    const params = new URLSearchParams(window.location.search);
    const webhookId = params.get('webhook');
    if (!webhookId) {
        console.error('No webhook ID provided in URL parameters');
        return null;
    }
    return `https://flow.on.rehub.software/webhook-test/${webhookId}`;
}

/**
 * The exact prefix the AI uses in the chat to signal a form update suggestion.
 */
export const AI_UPDATE_CODEWORD = 'Update_form:';

/**
 * The full embed URL for the n8n chat widget.
 * Gets the chat ID from URL parameter 'chat'
 */
export function getChatEmbedUrl() {
    // Handle both direct access and redirected URLs
    const url = window.location.href;
    const searchParams = url.includes('?') ? url.split('?')[1] : '';
    const params = new URLSearchParams(searchParams);
    
    const chatId = params.get('chat');
    if (!chatId) {
        console.error('No chat ID provided in URL parameters');
        return null;
    }
    return `https://flow.on.rehub.software/webhook/${chatId}/chat`;
}

/**
 * Field names the AI assistant is allowed to suggest updates for.
 * Add or remove field names based on your requirements.
 */
export const AI_UPDATABLE_FIELDS = [
    'parent_process',
    'summary',
    'title', // For backward compatibility with AI responses
    'user', // We'll allow the AI to update this
    'description',
    'process_frequency',
    'current_time_investment',
    'people_affected',
    'savings_potential',
    'risks',
    'benefits',
    // New fields from AI responses
    'department_team',
    'technical_tags',
    'business_process_tags',
    'implementation_complexity',
    'estimated_development_time',
    'example_workflow'
];