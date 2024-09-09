const puppeteer = require('puppeteer');

async function scrapeData() {
  try {
    // Inicia o navegador
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.sympla.com.br/eventos?s=scrum', { waitUntil: 'networkidle2' });

    const events = await page.evaluate(() => {
      const eventCards = document.querySelectorAll('[class*="EventCardstyle__EventInfo"]');
      const eventData = [];

      eventCards.forEach(card => {
        // Data do evento
        const dateElement = card.querySelector('[class*="EventDate"] div div');
        // Título do evento
        const titleElement = card.querySelector('[class*="EventTitle"]');
        // Local do evento
        const locationElement = card.querySelector('[class*="EventLocation"]');

        const date = dateElement ? dateElement.textContent.trim() : '';
        const title = titleElement ? titleElement.textContent.trim() : '';
        const location = locationElement ? locationElement.textContent.trim() : '';

        eventData.push({ date, title, location });
      });

      return eventData;
    });
    
    console.log(events);

    await browser.close();

    return events; 
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error; 
  }
}

module.exports = { scrapeData };
