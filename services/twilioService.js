import twilio from 'twilio';
import querystring from 'querystring';

// Função para enviar mensagens via WhatsApp usando Twilio
export const sendWhatsappMessage = async (from, to, body) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      from,
      to,
      body,
    });

    console.log('WhatsApp message sent successfully!');
    return;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error('Failed to send WhatsApp message');
  }
};

// Função para decodificar mensagens recebidas do Twilio
export const parseTwilioMessage = (event) => {
  try {
    const twilioBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf-8')
      : event.body;

    return querystring.parse(twilioBody);
  } catch (error) {
    console.error('Error parsing Twilio message:', error);
    throw new Error('Failed to parse Twilio message');
  }
};
