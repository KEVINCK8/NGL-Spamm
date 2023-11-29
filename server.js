const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const browser = await puppeteer.launch({ headless: "new" });

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));

});

app.get('/inviato.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inviato.html'));
});

app.post('/avviaAutomazione', async (req, res) => {
  const { link, numeroCicli, messaggio_html } = req.body;


  if (isNaN( numeroCicli) || numeroCicli <= 0 || numeroCicli > 99) {
    res.status(400).send('Il numero di cicli non è valido. Deve essere compreso tra 1 e 99.');
    return;
  }

  const delayBetweenInteractions = 3500;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();



    for (let i = 0; i < numeroCicli; i++) {
      await page.goto(link, {
        waitUntil: 'domcontentloaded',
        timeout: 0,
        args: ['--incognito']
      });

      await new Promise(resolve => setTimeout(resolve, delayBetweenInteractions));

      await page.waitForSelector('textarea[name="question"]');
      const messaggio = messaggio_html;
      await page.type('textarea[name="question"]', messaggio);

      await new Promise(resolve => setTimeout(resolve, delayBetweenInteractions));

      await page.waitForSelector('.submit');
      await page.click('.submit');
    }

    await browser.close();
    res.status(200).send('Automazione completata con successo');
  } catch (error) {
    console.error('Si è verificato un errore:', error);
    res.status(500).send('Errore nell\'esecuzione dell\'automazione');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
