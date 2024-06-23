import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import Fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyCookie from '@fastify/cookie'
import fastifyView from '@fastify/view'
import fastifyHelmet from '@fastify/helmet'
import { sequelize } from '#server/utils/db'
import logger from '#server/utils/log'
import {
  okReplyDecorator,
  throwReplyDecorator,
  gzipFile,
  jwt,
} from '#server/utils'
import { models, SessionWithUser } from '#server/models'
import config from '#server/config'

const CWD = process.cwd()

const fastify = Fastify({
  logger: config.env === 'development' ? logger : false,
})

const KNOWN_CLIENT_ROUTES = ['/', '/settings', '/sync', '/log']

// Plugins
fastify.register(fastifyCookie)
fastify.register(fastifyHelmet, {
  enableCSPNonces: true,
  contentSecurityPolicy: {
    useDefaults: config.env === 'production',
    directives: {
      'default-src': ["'self'"],
      'connect-src': ["'self'", 'http://127.0.0.1:*'],
      'font-src': ["'self'", 'https://rsms.me'],
      'form-action': ["'self'"],
      'frame-src': [
        'www.youtube-nocookie.com',
        'www.youtube.com',
        'youtube.com',
      ],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        'https://www.youtube.com/iframe_api',
        'https://www.youtube.com',
        'https://unpkg.com/tone',
      ],
      'style-src': ["'self'", 'https://rsms.me'],
      'img-src': ['*', 'data:'],
      ...(config.env === 'production'
        ? { 'upgrade-insecure-requests': [] }
        : {}),
    },
  },
})
fastify.register(fastifyStatic, {
  root: path.join(CWD, 'public'),
  decorateReply: true,
})
fastify.register(fastifyStatic, {
  root: path.join(CWD, 'dist/client/js'),
  prefix: '/js/',
  decorateReply: false,
})
fastify.register(fastifyStatic, {
  root: path.join(CWD, 'dist/client/css'),
  prefix: '/css/',
  decorateReply: false,
})
fastify.register(fastifyView, {
  engine: { ejs },
  root: path.join(CWD, 'templates'),
  includeViewExtension: true,
  defaultContext: {
    appName: config.appName,
    appHost: config.appHost,
    appDescription: config.appDescription,
    useHttpsRedirect: config.env === 'production',
  },
})

// gzip assets
if (config.env === 'production') {
  fastify.get(
    '/js/:file',
    async (req: FastifyRequest<{ Params: { file: string } }>, reply) => {
      const filePath = path.join(CWD, `dist/client/js/${req.params.file}.gz`)
      reply.type('text/javascript')
      reply.header('Content-Encoding', 'gzip')
      try {
        const file = fs.readFileSync(filePath)
        reply.send(file)
      } catch (err) {
        reply.status(404).send()
      }
    }
  )
  gzipFile(path.join(process.cwd(), 'dist/client/css/index.css'))
  fastify.get('/css/index.css', async (req, reply) => {
    const file = path.join(CWD, 'dist/client/css/index.css.gz')
    reply.type('text/css')
    reply.header('Content-Encoding', 'gzip')
    reply.send(fs.readFileSync(file))
    reply.sendFile('')
  })
}

// Database
fastify.addHook('onClose', () => sequelize.close())

// Routes
fastify.register(async (fastify: FastifyInstance) => {
  fastify.decorate('models', models)
  fastify.decorate('sequelize', sequelize)
  fastify.decorateReply('ok', okReplyDecorator)
  fastify.decorateReply('throw', throwReplyDecorator)

  fastify.register(async (fastify) => {
    fastify.decorateReply('user', null)
    fastify.addHook('onRequest', async (req: FastifyRequest, reply) => {
      const token = req.cookies[config.jwt.cookieKey]
      if (token) {
        const verifyReq = await jwt.verify(token)
        if (verifyReq.success) {
          const userId = verifyReq.data.id
          const session: SessionWithUser | null =
            await fastify.models.Session.findOne({
              where: { token },
              include: [
                {
                  model: fastify.models.User,
                  as: 'user',
                  where: { id: userId },
                },
              ],
            })
          if (session && session.user) {
            req.user = session.user
          }
        }
      }
    })

    // Public API
    fastify.register(require('./routes/auth'), { prefix: '/auth' })

    // User API
    fastify.register(async (fastify) => {
      fastify.addHook('onRequest', async (req, reply) => {
        if (!req.user) {
          reply.status(401)
          throw new Error('Access denied')
        }
      })
      fastify.register(require('./routes/api'), { prefix: '/api' })
    })

    // Admin API
    fastify.register(async (fastify) => {
      fastify.addHook('onRequest', async (req, reply) => {
        if (!req.user || !config.admins.includes(req.user.email)) {
          reply.status(401)
          throw new Error('Access denied')
        }
      })
      fastify.register(require('./routes/admin-api'), { prefix: '/admin-api' })
    })

    // Client app / index page
    fastify.register(async (fastify) => {
      KNOWN_CLIENT_ROUTES.forEach((route) => {
        fastify.get(route, async function (req, reply) {
          if (req.user) {
            return reply.view('generic-spa', {
              scriptName: 'app',
              scriptNonce: reply.cspNonce.script,
              styleNonce: reply.cspNonce.style,
            })
          }
          return reply.view('generic-spa', {
            scriptName: 'login',
            scriptNonce: reply.cspNonce.script,
            styleNonce: reply.cspNonce.style,
          })
        })
      })
    })

    // Admin app
    fastify.register(async (fastify) => {
      fastify.addHook('onRequest', async (req, reply) => {
        if (!req.user || !config.admins.includes(req.user.email)) {
          return reply.redirect('/')
        }
      })
      ;['/us', '/us/:userId'].forEach((route) => {
        fastify.get(route, async function (req, reply) {
          return reply.view('generic-spa', {
            scriptName: 'us',
            scriptNonce: reply.cspNonce.script,
            styleNonce: reply.cspNonce.style,
          })
        })
      })
      fastify.get('/ui', async (req, reply) => {
        return reply.view('generic-spa', {
          scriptName: 'ui-lib',
          scriptNonce: reply.cspNonce.script,
          styleNonce: reply.cspNonce.style,
        })
      })
    })
  })
})

// Handle errors
fastify.setErrorHandler((error, req, reply) => {
  const initialStatusCode = error.statusCode || reply.statusCode
  const statusCode = initialStatusCode >= 400 ? initialStatusCode : 500
  const defaultMessage = 'Internal error'
  let message: string = error.message || defaultMessage
  if (statusCode >= 500) {
    const errorObject = {
      reqId: req.id,
      req: {
        method: req.method,
        url: req.url,
      },
      stack: error.stack || null,
    }
    if (config.env === 'development') {
      console.error(error, `${message} @ ${req.id} ${req.method} ${req.url}`)
    } else {
      console.error(errorObject, message)
      message = defaultMessage
    }
  }
  return reply.status(statusCode).send({ statusCode, message })
})

fastify.setNotFoundHandler(async (req, res) => {
  if (req.headers.accept?.includes('text/html')) {
    return res.redirect('/')
  }
  res.code(404).send('Not found')
})

// Start server
fastify.listen({ port: config.port, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 App launched: ${config.appHost}`)
})
