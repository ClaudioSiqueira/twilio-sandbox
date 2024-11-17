import { sendWhatsappMessage } from './services/twilioService.js';
import { sendEmail } from './services/sesService.js';

export const handler = async (event) => {
  try {
    const fromWhatsapp = 'whatsapp:+14155238886'; 
    const toWhatsapp = 'whatsapp:+5511940450348'; 
    const messageBody = 'Isso é um teste com variáveis de ambiente dentro da lambda';

    // Enviar a mensagem via WhatsApp
    //const sid = await sendWhatsappMessage(fromWhatsapp, toWhatsapp, messageBody);

    // Enviar um email de confirmação via SES
    const subject = 'Notificação de Mensagem Enviada';
    const bodyText = `A mensagem foi enviada com sucesso para o WhatsApp. SID da mensagem: sid`;
    const bodyHtml = `<h1>A mensagem foi enviada com sucesso!</h1><p>SID da mensagem: sid</p>`;

    await sendEmail(subject, bodyText, bodyHtml);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message sent via WhatsApp and email successfully!'
      }),
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send message',
        details: error.message,
      }),
    };
  }
};
