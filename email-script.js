// Google Apps Script for handling form submissions and email confirmations
const SHEET_NAME = 'Registrations';
const EMAIL_SUBJECT = 'സമസ്ത കേരള ജംഇയ്യതുള്‍ ഉലമാ - 100-ാം വാർഷിക സമ്മേളന രജിസ്ട്രേഷൻ സ്ഥിരീകരണം';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Handle different actions
    if (data.action === 'sendEmailConfirmation') {
      return handleEmailConfirmation(data);
    }
    
    // Default action: save to spreadsheet
    return saveToSpreadsheet(data);
    
  } catch (error) {
    console.error('Error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSpreadsheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  
  // Set headers if this is the first row
  if (sheet.getLastRow() === 0) {
    const headers = [
  'Timestamp', 'Name', 'Age', 'Address', 'Phone', 'Email',
  'WhatsApp', 'Consent'
  ];
    sheet.appendRow(headers);
  }
  
  // Prepare row data
const row = [
  new Date().toISOString(),
  data.name,
  data.age,
  data.address,
  data.phone,
  data.email,
  data.whatsapp,
  data.consent ? 'Yes' : 'No'
];

  
  // Append the data
  sheet.appendRow(row);
  
  // Send email confirmation
  if (data.email) {
    sendConfirmationEmail(data);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Registration successful!'
  })).setMimeType(ContentService.MimeType.JSON);
}

function sendConfirmationEmail(data) {
  try {
    const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">സമസ്ത കേരള ജംഇയ്യതുള്‍ ഉലമാ</h2>
      <h3 style="color: #3498db;">100-ാം വാർഷിക സമ്മേളന രജിസ്ട്രേഷൻ സ്ഥിരീകരണം</h3>
      
      <p>പ്രിയമുള്ള ${data.name},</p>
      
      <p>100-ാം വാർഷിക സമ്മേളനത്തിനുള്ള നിങ്ങളുടെ രജിസ്ട്രേഷൻ വിജയകരമായി സ്വീകരിച്ചിരിക്കുന്നു.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #2c3e50;">നിങ്ങളുടെ രജിസ്ട്രേഷൻ വിശദാംശങ്ങൾ:</h4>
        <p><strong>പേര്:</strong> ${data.name}</p>
        <p><strong>വയസ്:</strong> ${data.age}</p>
        <p><strong>മേൽവിലാസം:</strong> ${data.address}</p>
        <p><strong>ഫോൺ നമ്പർ:</strong> ${data.phone}</p>
        <p><strong>വാട്ട്സാപ്പ് നമ്പർ:</strong> ${data.whatsapp || data.phone}</p>
        <p><strong>ഇമെയിൽ:</strong> ${data.email}</p>
      </div>
      
      <p>സമ്മേളനത്തിന്‍റെ കൂടുതൽ വിശദാംശങ്ങൾക്കായി ഞങ്ങളുടെ വെബ്സൈറ്റ് സന്ദർശിക്കുക.</p>
      
      <p>നന്ദി,<br>സമസ്ത കേരള ജംഇയ്യതുള്‍ ഉലമാ</p>
      
      <div style="margin-top: 30px; font-size: 12px; color: #7f8c8d;">
        <p>ഈ ഇമെയിൽ സ്വയം സൃഷ്ടിച്ചതാണ്. ദയവായി ഇതിന് മറുപടി നൽകരുത്.</p>
      </div>
    </div>
    `;
    
    MailApp.sendEmail({
      to: data.email,
      subject: EMAIL_SUBJECT,
      htmlBody: emailBody,
      name: 'സമസ്ത കേരള ജംഇയ്യതുള്‍ ഉലമാ'
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

function handleEmailConfirmation(data) {
  try {
    const success = sendConfirmationEmail(data);
    return ContentService.createTextOutput(JSON.stringify({
      status: success ? 'success' : 'error',
      message: success ? 'Email sent successfully' : 'Failed to send email'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error in handleEmailConfirmation:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

