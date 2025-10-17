import Fastify from 'fastify';

const fastify = Fastify();

// Parse the PORT environment variable and default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Use 0.0.0.0 to ensure the server is accessible from outside the container
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});