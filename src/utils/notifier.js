import axios from 'axios';
import env from './env.js';

export async function notifyTelegram(message, imageUrl) {
  if (!env.telegram_bot_token || !env.telegram_chat_id) {
    throw new Error('Telegram token or chat ID not set in environment variables');
  }
  const baseUrl = `https://api.telegram.org/bot${env.telegram_bot_token}`;
  try {
    if (imageUrl) {
      await axios.post(`${baseUrl}/sendPhoto`, {
        chat_id: env.telegram_chat_id,
        photo: imageUrl,
        caption: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    } else {
      await axios.post(`${baseUrl}/sendMessage`, {
        chat_id: env.telegram_chat_id,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
    }
  } catch (err) {
    // Optionally, log error
    console.error('Failed to send Telegram notification:', err.message);
  }
} 