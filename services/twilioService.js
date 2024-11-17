import twilio from 'twilio';

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

    console.log('WhatsApp message sent successfully!', message.sid);
    return message.sid; // Retorna o SID para o handler usar
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error('Failed to send WhatsApp message');
  }
};
