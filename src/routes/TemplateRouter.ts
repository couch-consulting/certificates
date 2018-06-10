'use strict';

import Database from '../models/Database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { templateList, templateData, TaskId, extendedTemplateObject } from '../models/Interfaces';

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
      console.log('Successfully found template');
      this.database.addWorkItem(input).then((taskId: string) => {
        const response: TaskId = new TaskId();
        response.taskId = taskId;
        console.log(response);
        res.send(response);
      }).catch((err) => {
        console.log('Creation failed');
        res.statusMessage = err;
        res.sendStatus(400);
      });
    }).catch(() => {
      console.log('Couldn\'t find template id');
      res.statusMessage = 'Invalid template id';
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
   * Get the user visible data for one specific template
   */
  public getTemplate(req: Request, res: Response, next: NextFunction) {
    this.database.getTemplate(req.params.templateId).then((template: extendedTemplateObject) => {
      // Remove management information
      delete template._id;
      delete template._rev;
      delete template.executions;
      res.send(template);
    }).catch(() => {
      res.send(404);
    });
  }


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getTemplates.bind(this));
    this.router.get('/:templateId', this.getTemplate.bind(this));
    this.router.post('/', this.createCertificate.bind(this));
  }

}

// Create the router and export its configured Express.Router
export const templateRoutes = new TemplateRouter();
templateRoutes.init();

export default templateRoutes.router;
