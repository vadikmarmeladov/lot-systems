const port = process.env.PORT || 3000;
const host = '0.0.0.0'; // Important for Digital Ocean

fastify.listen({ port: Number(port), host }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

import path from 'path';
import fastifyStatic from '@fastify/static';

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../../client'),
  prefix: '/static/'
});