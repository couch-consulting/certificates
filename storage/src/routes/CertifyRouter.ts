'use strict';

import * as db from '../models/database';
import { Router, Request, Response, NextFunction } from 'express';

export class CertifyRouter {
  router: Router;

  /**
   * Initialize the router
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Heroes.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    res.send('Hi');
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const certifyRoutes = new CertifyRouter();
certifyRoutes.init();

export default certifyRoutes.router;
