import { sendWhatsappMessage } from './services/twilioService.js';
import { sendOrderConfirmationEmail } from './services/orderService.js';
import axios from "axios";
import querystring from 'querystring'; // Para decodificar o corpo do Twilio

export const handler = async (event) => {
  console.log('Received event:', event);

  let twilioMessage;
  try {
    // Decodificando o corpo do Twilio de 'application/x-www-form-urlencoded' para um objeto
    // Verificando se o corpo está codificado em base64
    const twilioBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf-8')
      : event.body;

    // Decodificando o corpo usando querystring
    const decodedBody = querystring.parse(twilioBody);
    console.log('Decoded Twilio Message:', decodedBody);

    // A partir do objeto decodificado, podemos acessar a mensagem
    twilioMessage = decodedBody;
  } catch (parseError) {
    console.error('Error parsing Twilio message:', parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Falha ao processar a mensagem do Twilio',
        details: parseError.message,
      }),
    };
  }

  const userMessage = twilioMessage.Body;
  console.log('User message from Twilio:', userMessage);

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: userMessage },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    console.log('OpenAI Response:', response.data);

    if (response.data.choices && response.data.choices[0]) {
      const messageBody = response.data.choices[0].message.content;
      console.log('Message from OpenAI:', messageBody);

      // Dados fictícios para o pedido
      const buyer = {
        name: 'João Silva',
        phone: '(11) 99999-9999',
        address: 'Rua Fictícia, 123, São Paulo, SP',
        email: 'joao.silva@email.com',
      };

      const items = [
        { name: 'Marmita de Frango', quantity: 2, price: 20.0 },
        { name: 'Marmita de Carne', quantity: 1, price: 25.0 },
      ];

      // Enviando confirmação de pedido por email
      console.log('Sending email...');
      await sendOrderConfirmationEmail(buyer, items, userMessage, messageBody);

      // Enviando mensagem pelo WhatsApp
      const fromWhatsapp = 'whatsapp:+14155238886';
      const toWhatsapp = 'whatsapp:+5511940450348';
      console.log('Sending WhatsApp message...');
      await sendWhatsappMessage(fromWhatsapp, toWhatsapp, messageBody);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Pedido processado com sucesso',
          status: 'success',
        }),
      };
    } else {
      throw new Error('Resposta inesperada da OpenAI');
    }
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Falha ao processar a requisição',
        details: error.message,
      }),
    };
  }
};
