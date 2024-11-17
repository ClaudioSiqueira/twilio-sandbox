import { sendWhatsappMessage } from './services/twilioService.js';
import { sendOrderConfirmationEmail } from './services/orderService.js'; // Importando a função de envio de email do pedido

export const handler = async (event) => {
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

    // Enviar confirmação de pedido via email
    await sendOrderConfirmationEmail(buyer, items);

    // Exemplo de enviar mensagem via WhatsApp
    //const fromWhatsapp = 'whatsapp:+14155238886';
    //const toWhatsapp = 'whatsapp:+5511940450348';
    //const messageBody = 'Isso é um teste com variáveis de ambiente dentro da lambda';
    //const sid = await sendWhatsappMessage(fromWhatsapp, toWhatsapp, messageBody);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pedido confirmado por email com sucesso!'
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
