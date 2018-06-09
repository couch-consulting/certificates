'use strict';

import Database from '../models/Database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { templateList, templateData, TaskId } from '../models/Interfaces';

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
    const input: templateData = req.body;
    this.database.checkTemplateId(input.templateId).then(() => {
      this.database.addWorkItem(input).then((taskId: string) => {
        const response: TaskId = new TaskId();
        response.taskId = taskId;
        res.send(response);
      }).catch(() => {
        res.sendStatus(400);
      });
    }).catch(() => {
      res.sendStatus(404);
    });
  }

  /**
   * GET all template information
   */
  public getTemplates(req: Request, res: Response, next: NextFunction) {
    this.database.getAllTemplates().then((data: templateList) => {
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
