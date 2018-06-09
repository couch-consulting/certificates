import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import CertifyRouter from './routes/CertifyRouter';
import TemplateRouter from './routes/TemplateRouter';
import ManageRouter from './routes/ManageRouter';
import RenderRouter from './routes/RenderRouter';

// Creates and configures an ExpressJS web server.
class App {
  // ref to Express instance
  public express: express.Application;
  private corsOptions:cors.CorsOptions;

  // Run configuration methods on the Express instance.
  constructor() {
    this.corsOptions = {
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
      credentials: true,
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
      origin: '*',
      preflightContinue: false,
    };
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    const router = express.Router();
        // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!',
      });
    });

    this.express.use(cors(this.corsOptions));
    this.express.use('/', router);
    this.express.use('/certify', CertifyRouter);
    this.express.use('/templates', TemplateRouter);
    this.express.use('/management', ManageRouter);
    this.express.use('/generateTemplate', RenderRouter);
    this.express.options('*', cors(this.corsOptions));
  }

}

export default new App().express;
