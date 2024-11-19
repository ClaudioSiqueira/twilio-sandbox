import { sendEmail } from './sesService.js';

export const sendOrderConfirmationEmail = async (buyer, items, userMessage, messageBody) => {
  try {
    let totalValue = 0;
    items.forEach(item => {
      totalValue += item.quantity * item.price;
    });

    let tableRows = '';
    items.forEach(item => {
      tableRows += `
        <tr>
          <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">R$ ${item.price.toFixed(2)}</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">R$ ${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `;
    });

    const emailBodyHtml = `
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f9f4;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #2e8b57;
        }
        p {
          font-size: 16px;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 600px;
          margin: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }
        th {
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          color: #4CAF50;
          margin-top: 20px;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #777;
          text-align: center;
        }
        .highlight {
          color: #ff6347; /* Cor vibrante para destacar informações importantes */
        }
      </style>

      <div class="email-container">
        <h1>Confirmação de Pedido de Marmita</h1>
        <p><strong>Nome do comprador:</strong> ${buyer.name}</p>
        <p><strong>Celular:</strong> ${buyer.phone}</p>
        <p><strong>Endereço de entrega:</strong> ${buyer.address}</p>

        <h2>Detalhes do Pedido</h2>
        <table>
          <thead>
            <tr>
              <th>Nome da Marmita</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Preço Total</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <h3 class="total">Total do Pedido: <span class="highlight">R$ ${totalValue.toFixed(2)}</span></h3>

        <p><strong>Obrigado por comprar conosco!</strong></p>

        <div class="footer">
          <p>Este é um e-mail automático, por favor, não responda.</p>
        </div>
      </div>
    `;

    const emailBodyText = `
      Confirmação de Pedido de Marmita

      Mensagem do usuário pelo whatsapp: ${userMessage}

      Resposta do chat: ${messageBody}

      Nome do comprador: ${buyer.name}
      Celular: ${buyer.phone}
      Endereço de entrega: ${buyer.address}

      Detalhes do Pedido:
      ${items.map(item => `${item.name} - Quantidade: ${item.quantity}, Preço Unitário: R$ ${item.price.toFixed(2)}, Preço Total: R$ ${(item.quantity * item.price).toFixed(2)}`).join('\n')}

      Total do Pedido: R$ ${totalValue.toFixed(2)}

      Obrigado por comprar conosco!
    `;

    await sendEmail('Confirmação do Pedido de Marmita', emailBodyText, emailBodyHtml);

    console.log('Email enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};
