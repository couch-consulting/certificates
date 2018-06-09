'use strict';

import Database from '../models/Database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import * as nunjucks from 'nunjucks';
import { templateData, extendedTemplateObject } from '../models/Interfaces';

export class RenderRouter {
  router: Router;
  private database: Database;


  /**
   * Initialize the router
   */
  constructor() {
    this.database = new Database();
    this.router = Router();
    nunjucks.configure({ autoescape: true });
    this.init();
  }

  /**
   * POST call to render a new certificate
   */
  public renderCertificate(req: Request, res: Response, next: NextFunction) {
    this.database.getWorkItem(req.params.taskId).then((taskData: templateData) => {
      console.log('Got work item');
      console.log(taskData);
      this.database.checkTemplateId(taskData.templateId).then(() => {
        this.database.getTemplate(taskData.templateId).then((templateData: extendedTemplateObject) => {
          console.log('Got template data');
          console.log(templateData);
          const certificate: string = nunjucks.renderString(templateData.previewHTML, taskData);
          console.log(certificate);
          res.sendStatus(200);
        }).catch((err) => {
          res.sendStatus(500);
        });
      }).catch(() => {
        console.log('Template not found');
        res.statusMessage = 'This template doesn\'t exist any more';
        res.sendStatus(404);
      });
    }).catch((err: number) => {
      res.statusMessage = 'Task ID not found';
      res.sendStatus(404);
    });

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
