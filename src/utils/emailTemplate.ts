// src/utils/emailTemplate.ts

/**
 * Generates a beautiful HTML email template
 * @param from - Sender's name and email address
 * @param subject - Email subject
 * @param message - Email message content
 * @returns HTML string with beautiful email template
 */
export const generateEmailTemplate = (from: string, subject: string, message: string): string => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
      /* Reset styles */
      body, html {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f5f7fa;
      }
      
      /* Main container */
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      
      /* Header */
      .email-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 20px;
        text-align: center;
      }
      
      .email-header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
      }
      
      /* Content */
      .email-content {
        padding: 30px;
      }
      
      .email-content h2 {
        color: #667eea;
        margin-top: 0;
      }
      
      .email-content p {
        margin: 15px 0;
        font-size: 16px;
      }
      
      .sender-info {
        background-color: #f8f9fa;
        border-left: 4px solid #667eea;
        padding: 15px;
        margin: 20px 0;
        border-radius: 0 8px 8px 0;
      }
      
      .sender-info strong {
        color: #667eea;
      }
      
      /* Message body */
      .message-body {
        background-color: #ffffff;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      
      /* Footer */
      .email-footer {
        background-color: #f8f9fa;
        padding: 20px;
        text-align: center;
        border-top: 1px solid #e9ecef;
        font-size: 14px;
        color: #6c757d;
      }
      
      /* Button */
      .reply-button {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white !important;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 50px;
        font-weight: 600;
        margin: 20px 0;
        transition: transform 0.2s, box-shadow 0.2s;
        border: 2px solid #5a67d8;
      }
      
      .reply-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        background: linear-gradient(135deg, #5a67d8 0%, #6b44c0 100%);
      }
      
      /* Responsive */
      @media (max-width: 600px) {
        .email-container {
          margin: 10px;
        }
        
        .email-content {
          padding: 20px;
        }
        
        .email-header h1 {
          font-size: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>New Contact Message</h1>
      </div>
      
      <div class="email-content">
        <h2>${subject}</h2>
        
        <div class="sender-info">
          <p><strong>From:</strong> ${from}</p>
        </div>
        
        <div class="message-body">
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p><a href="mailto:${from.split('<')[1]?.split('>')[0] || from}" class="reply-button">Reply to Sender</a></p>
      </div>
      
      <div class="email-footer">
        <p>This message was sent from your website contact form.</p>
        <p>Please do not reply to this email directly.</p>
      </div>
    </div>
  </body>
  </html>`;
};