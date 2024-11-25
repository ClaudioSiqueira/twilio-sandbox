import axios from 'axios';

export const getOpenAiResponse = async (prompt) => {
  const openAiApiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Modelo a ser usado
        messages: [{ role: 'system', content: prompt }],
        max_tokens: 200,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`,
        },
      }
    );

    // Retorna o conteúdo da resposta do OpenAI
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    throw new Error('Failed to get response from OpenAI');
  }
};
