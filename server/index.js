const fastify = require('fastify')()
const path = require('path')
const fastifyStatic = require('@fastify/static')

// Serve static files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../client'),
  prefix: '/'
})

// Handle all routes
fastify.get('/*', (request, reply) => {
  reply.sendFile('index.html')
})

// Start server
fastify.listen({ port: 4400, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('Server listening at http://localhost:4400')
})