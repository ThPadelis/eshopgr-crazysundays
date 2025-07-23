import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const mode = process.env.NODE_ENV || 'development';
const envFile = path.resolve(process.cwd(), `.env.${mode}`);

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  const defaultEnv = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(defaultEnv)) {
    dotenv.config({ path: defaultEnv });
  }
}

const env = {
  hf_token: process.env.APP_HUGGINGFACE_TOKEN,
  hf_name: process.env.APP_HUGGINGFACE_NAME,
  hf_url: process.env.APP_HUGGINGFACE_URL,
  telegram_bot_token: process.env.APP_TELEGRAM_BOT_TOKEN,
  telegram_chat_id: process.env.APP_TELEGRAM_CHAT_ID,
  mongo_uri: process.env.APP_MONGO_URI,
};

export default env;
