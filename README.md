# e-shop Notifier

A lightweight Node.js tool to scrape [e-shop.gr Crazy Sundays](https://www.e-shop.gr/crazysundays), store item data, track price history, and notify you of new or discounted items. Designed for home server deployment and minimal resource usage.

## Features
- Scrapes e-shop Crazy Sundays offers weekly (every Sunday at 1am)
- Stores items in a local JSON database (`db.json`)
- Tracks price history for recurring items
- Scheduler runs automatically in production (via cron)
- Docker and docker-compose support for easy deployment
- Clean, modular codebase (scraper, db, scheduler, etc.)
- Handles Greek text and product codes (SKU)
- Easily extensible for notifications (Telegram, WhatsApp, etc.)

## Project Structure
```
src/
  config/       # Configuration files
  db/           # Database logic
  notifier/     # Notification logic (to be implemented)
  scraper/      # Scraping logic
  scheduler/    # Scheduling logic
  utils/        # Utility functions
  index.js      # Main entry point
```

## Setup
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment variables:**
   - Create a `.env` file in the project root (see below for examples).
   - `NODE_ENV=production` enables the scheduler (cron job). In development, the script runs once and exits.
3. **Run the app:**
   ```sh
   npm start
   ```

## Docker Usage
1. **Build and run with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   - The app will run in production mode by default and schedule itself to run every Sunday at 1am.
   - Data and code are mounted from your local directory for persistence and easy updates.

## Environment Variables
Example `.env`:
```
NODE_ENV=production
# Add notification service credentials here if needed
```

## Development vs Production
- **Development:** (`NODE_ENV` not set to `production`)
  - The script runs once and exits (for easy testing).
- **Production:** (`NODE_ENV=production`)
  - The scheduler runs the main task every Sunday at 1am.

## Price History Tracking
- Each item is uniquely identified by its product code (SKU).
- If an item reappears, its price history is updated (with timestamp).
- Example item in `db.json`:
  ```json
  {
    "title": "ΟΘΟΝΗ TESLA 27MC645BF 27'' LED FULL HD IPS 100HZ BLACK BKS.0244867",
    "url": "https://www.e-shop.gr/othoni-tesla-27mc645bf-27-led-full-hd-ips-100hz-black",
    "price": "579.00",
    "image": "https://www.e-shop.gr/images/....jpg",
    "productCode": "BKS.0244867",
    "created_at": "2024-06-23T01:00:00.000Z",
    "priceHistory": [
      { "price": "579.00", "date": "2024-06-23T01:00:00.000Z" },
      { "price": "499.00", "date": "2024-06-30T01:00:00.000Z" }
    ]
  }
  ```

## Customization & Extensibility
- **Notifications:**
  - Add your preferred notification logic in `src/notifier/` (e.g., Telegram, WhatsApp, email).
- **Scraper:**
  - Update selectors in `src/scraper/index.js` if the e-shop page layout changes.
- **Scheduler:**
  - Adjust the cron schedule in `src/scheduler/index.js` if you want a different frequency.

## Troubleshooting
- **Greek text issues:**
  - The scraper uses `iconv-lite` to decode Greek text correctly. If you see encoding issues, check the HTML source and encoding.
- **Database errors:**
  - If you change the data model, you may need to clean or migrate your `db.json`.
- **Scheduler not running:**
  - Ensure `NODE_ENV=production` is set in your environment or Docker Compose file.

## Linting & Formatting
- Lint: `npm run lint`
- Format: `npm run format`

---

Feel free to extend or modify as needed for your use case. PRs and suggestions welcome!
