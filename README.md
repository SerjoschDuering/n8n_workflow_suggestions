# n8n Form Assistant

A form interface with an integrated n8n chat widget that helps users fill out forms and submit data to n8n webhooks.

## Features

- Form with file upload support
- Integrated n8n chat widget
- AI-assisted form filling
- Markdown support in text fields
- File attachments (converted to Base64)
- Tailwind CSS styling

## Usage

The application requires two URL parameters to function:

- `chat`: Your n8n Chat Trigger node ID (e.g., `18679f0d-a4f8-433d-bba9-ab71cfde4aa6`)
- `webhook`: Your n8n webhook ID for form submissions (e.g., `submit_n8n_idea`)

Example URL:
```
https://your-domain.com/form?chat=18679f0d-a4f8-433d-bba9-ab71cfde4aa6&webhook=submit_n8n_idea
```

## Development

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/rehub_n8n_idea.git
   cd rehub_n8n_idea/n8n-form-chat
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your n8n endpoints:
   - Open `src/config.js`
   - Set your webhook URL and chat embed URL

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`

### Building for Production

To build the project for production:

```
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. Simply push to the main branch, and the site will be deployed automatically.

If you want to deploy manually:

1. Build the project:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider.

## Configuration

The main configuration file is `src/config.js` where you can set:

- `N8N_SUBMIT_WEBHOOK_URL`: Your n8n webhook for form submissions
- `N8N_CHAT_EMBED_URL`: Your n8n chat webhook URL
- `AI_UPDATE_CODEWORD`: The keyword that triggers form updates from chat

The following files contain important configuration:

- `src/config.js`: Contains URL configuration and AI-updatable fields
- `src/form.js`: Form handling and submission logic
- `src/chat.js`: Chat widget integration

## Form Fields

The form includes the following fields:

- Parent Process
- Summary (required)
- User/Submitter
- Description (supports markdown)
- Process Frequency
- Current Time Investment
- Number of People Affected
- Savings Potential
- Risks
- Benefits
- File Attachment

Hidden fields (populated by AI):
- Department/Team
- Technical Tags
- Business Process Tags
- Implementation Complexity
- Estimated Development Time
- Example Workflow

## AI Integration

The chat widget can suggest form updates using a special format:

```json
Update_form: {
    "summary": "Suggested summary",
    "description": "Suggested description",
    // ... other fields
}
```

Users can accept or reject these suggestions.

## Security Notes

- File attachments are converted to Base64 before submission
- Form data is sent via HTTPS to n8n webhooks
- No data is stored in the browser
- URL parameters are required for security (prevents unauthorized submissions)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

[MIT](LICENSE) 