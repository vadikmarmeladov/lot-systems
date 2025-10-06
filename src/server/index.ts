import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 4400;
const host = process.env.HOST || '0.0.0.0';

const server = fastify({
  logger: true
});

// Serve static files from client build
server.register(fastifyStatic, {
  root: path.join(__dirname, '../../dist/client'),
  prefix: '/'
});

// Handle all routes by serving index.html
server.setNotFoundHandler((request, reply) => {
  reply.sendFile('index.html');
});

const start = async () => {
  try {
    await server.listen({ port: Number(port), host });
    console.log(`Server listening at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();