import 'zone.js/dist/zone-node'

import { ngExpressEngine } from '@nguniversal/express-engine'
import * as express from 'express'
import { join } from 'path'

import { AppServerModule } from './src/main.server'
import { APP_BASE_HREF } from '@angular/common'
import { existsSync } from 'fs'

var cookieParser = require('cookie-parser')
// Import module map for lazy loading
// import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// 修复 `Event is not defined` 的错误 https://github.com/angular/universal/issues/844
global['Event'] = null
// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express()
  server.use(cookieParser())
  const distFolder = join(process.cwd(), 'dist/project13/browser')
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index'

  // * NOTE :: leave this as require() since this file is built Dynamically from webpack
  // const {
  //   AppServerModuleNgFactory,
  //   LAZY_MODULE_MAP,
  // } = require('./dist/project13/server/main');

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
      // 修改的
      // bootstrap: AppServerModuleNgFactory,
    })
  )

  server.set('view engine', 'html')
  server.set('views', distFolder)

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  )

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    console.log(req.url)
    console.log('req.headers.token:', req.headers['token'])
    console.log('req.headers.cookie:', req.cookies)
    res.cookie('jty', 6666)
    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        // { provide: 'TOKEN', useValue: req.cookies },
      ],
    })
  })

  return server
}

function run(): void {
  const port = process.env['PORT'] || 4100

  // Start up the Node server
  const server = app()
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire
const mainModule = __non_webpack_require__.main
const moduleFilename = (mainModule && mainModule.filename) || ''
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run()
}

export * from './src/main.server'
