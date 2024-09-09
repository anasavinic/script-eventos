const fastify = require('fastify')({ logger: true });
const { scrapeData } = require('./server/services/scraping_sympla'); 

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

fastify.get('/', async (request, reply) => {
  try {
    const events = await scrapeData();
    return reply.send(events);
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port, host });
    console.log(`Server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
