'use strict';

import * as db from '../models/Database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

export class TemplateRouter {
  router: Router;

  /**
   * Initialize the router
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * POST data for a new certificate
   */
  public createCertificate(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * GET all template information
   */
  public getTemplates(req: Request, res: Response, next: NextFunction) {
  }


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getTemplates.bind(this));
    this.router.post('/', this.createCertificate.bind(this));
  }

}

// Create the HeroRouter, and export its configured Express.Router
const templateRoutes = new TemplateRouter();
templateRoutes.init();

export default templateRoutes.router;
