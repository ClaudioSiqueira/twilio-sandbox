import { sendWhatsappMessage } from './services/twilioService.js';
import { sendOrderConfirmationEmail } from './services/orderService.js';

export const handler = async (event) => {

  const userMessage = event.body; // A mensagem do usuário

  try {
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

    await sendOrderConfirmationEmail(buyer, items);

    const fromWhatsapp = 'whatsapp:+14155238886';
    const toWhatsapp = 'whatsapp:+5511940450348';
    const messageBody = 'Isso é um teste com variáveis de ambiente dentro da lambda';
    
    await sendWhatsappMessage(fromWhatsapp, toWhatsapp, messageBody);

    return {
      statusCode: 200,
      body: JSON.stringify({
        event
      }),
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Falha ao confirmar o pedido por email',
        details: error.message,
      }),
    };
  }
};
