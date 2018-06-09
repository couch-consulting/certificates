'use strict';

import Database from '../models/Database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { templateData } from '../models/Interfaces';

export class RenderRouter {
  router: Router;
  private database: Database;


  /**
   * Initialize the router
   */
  constructor() {
    this.database = new Database();
    this.router = Router();
    this.init();
  }

  /**
   * POST call to render a new certificate
   */
  public renderCertificate(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/:taskId', this.renderCertificate.bind(this));
  }

}

// Create the HeroRouter, and export its configured Express.Router
const renderRoute = new RenderRouter();
renderRoute.init();

export default renderRoute.router;
