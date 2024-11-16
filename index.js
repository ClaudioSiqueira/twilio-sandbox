import twilio from 'twilio';

export const handler = async (event) => {
  try {
    // Credenciais Twilio obtidas de variáveis de ambiente
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    // Parâmetros da mensagem
    const from = 'whatsapp:+14155238886'; // Número Twilio habilitado para WhatsApp
    const to = 'whatsapp:+5511940450348'; // Número de destino no formato internacional
    const body = 'Isso é um teste com variaveis de ambiente dentro da lambda'; // Mensagem que será enviada

    // Envia a mensagem
    const message = await client.messages.create({
      from,
      to,
      body,
    });

    // Resposta de sucesso
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message sent successfully!',
        sid: message.sid,
      }),
    };
  } catch (error) {
    // Trata erros e retorna resposta
    console.error('Error sending message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send message',
        details: error.message,
      }),
    };
  }
};
