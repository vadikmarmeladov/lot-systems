import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
  ignoreTrailingSlash: true,
  exposeHeadRoutes: true
});

// Update route definitions to use routeOptions
fastify.route({
  method: 'POST',
  url: '/api/auth',
  handler: async (request, reply) => {
    // Your handler code
  }
});
