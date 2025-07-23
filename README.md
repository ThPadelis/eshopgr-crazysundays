# e-shop Notifier

A lightweight Node.js tool to scrape [e-shop.gr Crazy Sundays](https://www.e-shop.gr/crazysundays), store item data, track price history, and notify you of new or discounted items via Telegram. Designed for home server deployment and minimal resource usage.

## Features
- Scrapes e-shop Crazy Sundays offers
- Stores items and price history in MongoDB
- Notifies you via Telegram for new items and price changes
- Docker and docker-compose support for easy deployment
- Handles Greek text and product codes (SKU)
- Easily extensible for other notification services

## Project Structure
```
src/
  config/       # Logger and configuration
  db/           # Mongoose models and MongoDB connection
  scraper/      # Scraping logic
  utils/        # Utility functions (env, notifier)
  index.js      # Main entry point
```

## Setup

### 1. Install dependencies
```sh
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root with the following:
```
NODE_ENV=production
APP_MONGO_URI=mongodb://localhost:27017/eshop
APP_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
APP_TELEGRAM_CHAT_ID=your_telegram_chat_id
```
- Replace `your_telegram_bot_token` and `your_telegram_chat_id` with your actual Telegram bot credentials.
- If using Docker Compose, the default Mongo URI is `mongodb://mongo:27017/eshop`.

### 3. Start MongoDB
- **Locally:**
  ```sh
  docker run -d --name mongo -p 27017:27017 -v mongo-data:/data/db mongo
  ```
- **With Docker Compose:**
  ```sh
  docker-compose up -d mongo
  ```

### 4. Run the app
- **Locally:**
  ```sh
  npm start
  ```
- **With Docker Compose:**
  ```sh
  docker-compose up --build eshop-notifier
  ```

> **Note:** The app runs once per execution and then exits. To automate periodic runs, use your own scheduling system (e.g., systemd timers, external cron, or a task scheduler of your choice).

## Environment Variables
| Variable                | Description                        |
|-------------------------|------------------------------------|
| NODE_ENV                | Set to `production` for prod mode  |
| APP_MONGO_URI           | MongoDB connection string           |
| APP_TELEGRAM_BOT_TOKEN  | Telegram bot token                  |
| APP_TELEGRAM_CHAT_ID    | Telegram chat ID                    |

## Notifications
- The app sends a Telegram message for each new item and each price update, including the product image, price, and a link.

## Data Model (MongoDB)
Each item document includes:
- `title`, `url`, `price`, `image`, `productCode`, `created_at`, `category` (optional), and `priceHistory` (array of `{price, date}`)

## Development & Customization
- **Notifications:**
  - Edit `src/utils/notifier.js` to add more notification channels.
- **Scraper:**
  - Update selectors in `src/scraper/index.js` if the e-shop page layout changes.
- **Database:**
  - The schema is defined in `src/db/item.model.js`.

## Troubleshooting
- **MongoDB connection errors:**
  - Ensure MongoDB is running and the URI is correct.
- **Telegram errors:**
  - Double-check your bot token and chat ID.

## Linting & Formatting
- Lint: `npm run lint`
- Format: `npm run format`

---

Feel free to extend or modify as needed for your use case. PRs and suggestions welcome!
