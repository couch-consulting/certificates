'use strict';

import Database from '../models/Database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

export class TemplateRouter {
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
   * POST data for a new certificate
   */
  public createCertificate(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * GET all template information
   */
  public getTemplates(req: Request, res: Response, next: NextFunction) {
    this.database.getAllTemplates().then((data: Object) => {
      res.send(data);
    }).catch((err: null) => {
      res.sendStatus(500);
      res.end();
    });
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
