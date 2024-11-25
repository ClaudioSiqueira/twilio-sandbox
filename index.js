import { getOpenAiResponse } from './services/openAiService.js';
import { parseTwilioMessage, sendWhatsappMessage } from './services/twilioService.js';
import { sendOrderConfirmationEmail } from './services/orderService.js';

// Simulação de armazenamento do estado do usuário (use DynamoDB em produção)
let userState = {};

export const handler = async (event) => {
  console.log('Received event:', event);

  try {
    // Decodificar mensagem do Twilio
    const twilioMessage = parseTwilioMessage(event);
    const userPhone = twilioMessage.From;
    const userMessage = twilioMessage.Body.trim().toLowerCase();

    console.log(`Message from ${userPhone}:`, userMessage);

    // Inicializar estado do usuário, se necessário
    if (!userState[userPhone]) {
      userState[userPhone] = { step: 0, order: [] };
    }

    const userProgress = userState[userPhone];
    let responseMessage;

    // Obter código de ação do ChatGPT
    const actionCode = await parseOrderFromUserMessage(userMessage);

    // Etapas do fluxo com base no código de ação
    switch (actionCode) {
      case 1: // Pedido iniciado
        responseMessage = `Olá! Bem-vindo ao restaurante. Segue nosso cardápio:
          - Marmita de Frango: R$ 20,00
          - Marmita de Carne: R$ 25,00
          Por favor, diga o que deseja pedir.`;
        userProgress.step++;
        break;

      case 2: // Confirmar pedido
        const items = userProgress.order;
        const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        responseMessage = `Pedido confirmado! O total é R$ ${total.toFixed(2)}. Você receberá uma confirmação por e-mail.`;
        await sendOrderConfirmationEmail({name: 'Cliente', phone: userPhone, email: 'cliente@email.com'}, items);
        delete userState[userPhone];
        break;

      case 3: // Cancelar pedido
        responseMessage = 'Pedido cancelado. Se precisar de algo, é só chamar!';
        delete userState[userPhone];
        break;

      default: // Caso não entenda o pedido ou caso seja irrelevante
        responseMessage = 'Desculpe, não entendi seu pedido. Por favor, tente novamente.';
    }

    // Enviar mensagem de resposta pelo WhatsApp
    const fromWhatsapp = 'whatsapp:+14155238886';
    const toWhatsapp = userPhone;
    await sendWhatsappMessage(fromWhatsapp, toWhatsapp, responseMessage);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Processo concluído', status: 'success' }),
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao processar a requisição', details: error.message }),
    };
  }
};


// Função auxiliar para parsear pedidos do usuário
const parseOrderFromUserMessage = async (userMessage) => {
  const prompt = `
    Você é um assistente para um sistema de pedidos de marmitas. O cliente enviará uma mensagem informando os itens que deseja pedir, como "Quero 2 marmitas de frango e 1 marmita de carne".

    Sua tarefa é interpretar essa mensagem e retornar um código que indique o que o usuário deseja fazer.

    Retorne:
    - "1" se o usuário está fazendo um pedido (ou seja, mencionando marmitas ou comida).
    - "2" se o usuário está confirmando o pedido (resposta com "sim").
    - "3" se o usuário está cancelando o pedido (resposta com "não").
    - "0" se não for possível entender o pedido ou se for irrelevante.

    Exemplo de entrada:
    "Quero 3 marmitas de carne e uma de frango, por favor."
    Resposta: 1

    Entrada:
    ${userMessage}

    Responda apenas com o número correspondente à ação. Se não entender, responda com 0.
  `;

  try {
    const openAiResponse = await getOpenAiResponse(prompt);
    console.log('Raw response from OpenAI:', openAiResponse);

    // Tentar parsear a resposta como número
    const actionCode = parseInt(openAiResponse.trim());

    // Validar se é um código válido
    if ([0, 1, 2, 3].includes(actionCode)) {
      return actionCode;
    } else {
      console.warn('Response is not a valid action code:', openAiResponse);
      return 0;
    }
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return 0;
  }
};

// Função auxiliar para extrair quantidades
const extractQuantity = (message, itemName) => {
  const match = message.match(new RegExp(`(\\d+)\\s*${itemName}`, 'i'));
  return match ? parseInt(match[1]) : 1; // Padrão: 1 unidade, se não especificado
};
