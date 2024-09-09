const puppeteer = require('puppeteer');

async function scrapeData() {
  try {
    // Inicia o navegador
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // URL da página que retorna o JSON
    const url = 'https://ticket-api.zigpay.com.br/events?by_name=forrozin&within_past_year=false&active_or_expired=false&page=1&per_page=100';
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log("entrei")

    // Extraindo o JSON da página
    const data = await page.evaluate(() => {
      const preElement = document.querySelector('pre');
      return preElement ? JSON.parse(preElement.innerText) : null;
    });
    console.log(data)

    if (!data) {
      throw new Error('No data found');
    }

    // Extraindo as informações necessárias do JSON e filtrando os eventos
    const events = data.data
    .filter(event => !event.is_closed)
      .map(event => ({
        name: event.name,
        start_date: event.start_date,
        event_location: event.event_location.formatted_address,
      }));

    // Exibindo as informações extraídas
    console.log(events);

    await browser.close();

    return events;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
}

module.exports = { scrapeData };
