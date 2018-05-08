'use strict';

import * as db from '../models/database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

export class ManagementRouter {
  router: Router;

  /**
   * Initialize the router
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * POST upload a new template
   */
  public uploadTemplate(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * GET operational data of all templates
   */
  public getTemplates(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * PUT update the given template
   */
  public updateTemplate(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * DELETE a template
   */
  public deleteTemplate(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getTemplates);
    this.router.post('/', this.uploadTemplate);
    this.router.put('/:templateId', this.updateTemplate);
    this.router.delete('/:templateId', this.deleteTemplate);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const managementRoutes = new ManagementRouter();
managementRoutes.init();

export default managementRoutes.router;
