/**
 * app.ts
 */
import * as domain from 'domain';
import * as express from 'express';
import { config } from './config';
import { Err } from './utils';

// <middleware>
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import * as hbs from 'express-handlebars';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
// </middleware>

// <router>
import { mainRoute } from './routes';
//</router>

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.init(); // 기본설정
    this.middleware(); // 미들웨어
    this.router(); // 라우팅
    this.exception(); // 예외처리
  }

  private init() {
    this.express.use(<express.RequestHandler>((req, res, next) => {
      const d = domain.create();
      d.add(req);
      d.add(res);
      d.on('error', next);
      d.run(next);
    }));

    this.express.engine('html', hbs({ extname: '.html' }));
    this.express.set('views', `${config.cwd}/views`);
    this.express.set('view engine', 'html');
    this.express.set('trust proxy', 1); // secure: true
  }

  private middleware() {
    this.express.use(morgan(':remote-addr - ":method :url HTTP/:http-version" ' +
      ':status :res[content-length] ":referrer" ":user-agent"'));
    this.express.use(compress({
      filter(req: express.Request, res: express.Response): boolean {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
      },
      level: 9
    }));
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
    this.express.use(methodOverride());
    this.express.use(cookieParser());
    this.express.use(session({
      secret: 'tEsTeD',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }
    }));
    this.express.use(express.static(`${config.cwd}/public`));
    this.express.use(helmet());

    // 테스트 환경일 때 csrf 예외
    if (this.express.get('env') !== 'test') {
      this.express.use(csrf());
      this.express.use(<express.RequestHandler>((req, res, next) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
      }));
    }
  }

  private router() {
    this.express.use('/', mainRoute);
  }

  private exception() {
    // catch 404 and forwarding to error handler
    this.express.use(<express.RequestHandler>((req, res, next) => {
      const err = new Err('NotFound', 404);
      next(err);
    }));

    // will print stacktrace
    this.express.use(<express.ErrorRequestHandler>((err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }

      if (err.name !== 'Error' || err.code) {
        err.status = 500;
      }

      if (err.status === 500) {
        console.error(err);
        const message = `${req.method}: ${req.originalUrl}\n` +
          `IP> ${req.ip}, Body> ${JSON.stringify(req.body)}\n` +
          `Headers> ${JSON.stringify(req.headers)}\n${err.stack}`;

        // logger.error(message);
        // mailer('uncaughtException', message);
        console.error(message);
      }

      res.status(err.status || 400).json({ message: err.message });
    }));
  }
}

export const app = new App().express;
