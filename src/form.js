import { getSubmitWebhookUrl, AI_UPDATE_CODEWORD, AI_UPDATABLE_FIELDS } from './config.js';

// --- DOM Element References ---
let formElement = null;
let attachmentInputElement = null;
let updatePromptElement = null;
let updateDetailsElement = null;
let acceptBtnElement = null;
let rejectBtnElement = null;
let submitBtnElement = null;

let proposedUpdateData = null; // Stores data from AI suggestion temporarily

/**
 * Finds and stores references to form elements.
 */
function initializeFormElements() {
    formElement = document.getElementById('n8n-idea-form');
    attachmentInputElement = document.getElementById('attachment');
    updatePromptElement = document.getElementById('ai-update-prompt');
    updateDetailsElement = document.getElementById('ai-update-details');
    acceptBtnElement = document.getElementById('accept-ai-update');
    rejectBtnElement = document.getElementById('reject-ai-update');
    submitBtnElement = formElement?.querySelector('button[type="submit"]'); // More robust selector

    if (!formElement || !attachmentInputElement || !updatePromptElement || !updateDetailsElement || !acceptBtnElement || !rejectBtnElement || !submitBtnElement) {
        console.error("One or more form elements could not be found. Check IDs in index.html.");
        return false;
    }
    return true;
}

/**
 * Displays the AI update prompt with the suggested data.
 * @param {object} updateData - The parsed JSON data from the AI.
 */
export function showUpdatePrompt(updateData) {
    if (!updatePromptElement || !updateDetailsElement || !updateData) return;

    console.log("Showing AI update prompt:", updateData);
    proposedUpdateData = updateData;
    updateDetailsElement.textContent = JSON.stringify(proposedUpdateData, null, 2); // Pretty print
    updatePromptElement.classList.remove('hidden'); // Show the prompt using Tailwind class
}

/**
 * Applies the proposed AI updates to the form fields.
 */
function acceptUpdates() {
    if (proposedUpdateData && formElement) {
        console.log("Applying AI updates:", proposedUpdateData);
        
        // Handle special field mappings before updating form
        const processedData = { ...proposedUpdateData };
        
        // If 'title' is provided but 'summary' is not, use title for summary
        if (processedData.title && !processedData.summary) {
            processedData.summary = processedData.title;
            console.log("Mapped 'title' to 'summary':", processedData.summary);
        }
        
        // Apply processed updates to form
        for (const fieldName in processedData) {
            const inputElement = formElement.elements[fieldName];
            if (inputElement) {
                // Handle different input types if necessary (expand as needed)
                if (inputElement.type === 'checkbox') {
                    inputElement.checked = Boolean(processedData[fieldName]);
                } else if (inputElement.type === 'radio') {
                    const radioToSelect = formElement.querySelector(`input[name="${fieldName}"][value="${processedData[fieldName]}"]`);
                    if (radioToSelect) radioToSelect.checked = true;
                } else if (inputElement.type === 'select-one') {
                    // For select elements, ensure the value exists in the options
                    const value = processedData[fieldName];
                    const optionExists = Array.from(inputElement.options).some(option => option.value === value);
                    if (optionExists) {
                        inputElement.value = value;
                    } else {
                        console.warn(`Value "${value}" not found in options for select field "${fieldName}"`);
                    }
                } else {
                    inputElement.value = processedData[fieldName];
                }
                
                // Trigger an 'input' event if other scripts rely on it
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (fieldName === 'title') {
                // Skip 'title' field warnings as we've already handled it
                continue;
            } else {
                console.warn(`Form field "${fieldName}" suggested by AI not found.`);
            }
        }
    }
    hideUpdatePrompt(); // Hide prompt after applying
}

/**
 * Hides the AI update prompt and clears temporary data.
 */
function hideUpdatePrompt() {
    if (updatePromptElement) {
        updatePromptElement.classList.add('hidden');
    }
    proposedUpdateData = null;
}

/**
 * Converts a File object to a Base64 encoded string.
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} - A promise resolving with the base64 string (without prefix).
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * Shows the loading spinner on the submit button
 */
function showSpinner() {
    if (!submitBtnElement) return;
    
    // Get the spinner element
    const spinnerElement = document.getElementById('submit-spinner');
    if (!spinnerElement) return;
    
    // Hide the button text and show the spinner
    const buttonTextElement = submitBtnElement.querySelector('span');
    if (buttonTextElement) buttonTextElement.textContent = 'Submitting...';
    
    spinnerElement.classList.remove('hidden');
    submitBtnElement.disabled = true;
}

/**
 * Hides the loading spinner on the submit button
 */
function hideSpinner() {
    if (!submitBtnElement) return;
    
    // Get the spinner element
    const spinnerElement = document.getElementById('submit-spinner');
    if (!spinnerElement) return;
    
    // Restore the button text and hide the spinner
    const buttonTextElement = submitBtnElement.querySelector('span');
    if (buttonTextElement) buttonTextElement.textContent = 'Submit';
    
    spinnerElement.classList.add('hidden');
    submitBtnElement.disabled = false;
}

/**
 * Handles the form submission process.
 * @param {Event} event - The form submit event.
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    showSpinner();

    const webhookUrl = getSubmitWebhookUrl();
    if (!webhookUrl) {
        alert('Error: Missing webhook ID in URL parameters. Add ?webhook=YOUR_WEBHOOK_ID to the URL.');
        hideSpinner();
        return;
    }

    // Collect form data
    const formData = new FormData(formElement);
    const data = {};
    for (const [key, value] of formData.entries()) {
        if (value !== '') { // Only include non-empty values
            data[key] = value;
        }
    }

    // Handle file attachment if present
    const file = formData.get('attachment');
    if (file && file.size > 0) {
        try {
            const base64String = await fileToBase64(file);
            data.attachment = {
                fileName: file.name,
                fileType: file.type,
                data: base64String
            };
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error processing file attachment.');
            hideSpinner();
            return;
        }
    } else {
        data.attachment = null;
    }

    // Send data to n8n webhook
    try {
        console.log("Submitting data:", JSON.stringify(data, null, 2));
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Form submitted successfully!');
            formElement.reset();
            hideUpdatePrompt(); // Hide prompt on success
        } else {
            const errorText = await response.text();
            console.error('n8n submission error:', response.status, response.statusText, errorText);
            alert(`Error submitting form: ${response.statusText || response.status}. Check console.`);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please try again.');
    } finally {
        hideSpinner();
    }
}

/**
 * Initializes all form-related event listeners.
 */
export function initializeForm() {
    if (!initializeFormElements()) {
        return; // Stop if elements weren't found
    }

    formElement.addEventListener('submit', handleFormSubmit);
    acceptBtnElement.addEventListener('click', acceptUpdates);
    rejectBtnElement.addEventListener('click', hideUpdatePrompt);

    console.log("Form module initialized.");
}