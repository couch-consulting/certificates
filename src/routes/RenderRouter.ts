'use strict';

import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import * as nunjucks from 'nunjucks';
import * as phantom from 'phantom';

import Database from '../models/Database';
import { templateData, extendedTemplateObject } from '../models/Interfaces';

export class RenderRouter {
  router: Router;
  private database: Database;
  private instance;

  /**
   * Initialize the router
   */
  constructor() {
    this.database = new Database();
    this.router = Router();
    nunjucks.configure({ autoescape: true });
    phantom.create().then((phantom) => {
      this.instance = phantom;
    }).catch((err) => {
      console.log(err);
    });

    this.init();
  }

  /**
   * POST call to render a new certificate
   */
  public renderCertificate(req: Request, res: Response, next: NextFunction) {
    // In a refactoring someday in the future someone might want to look
    // into using async/await instead of promises to increase the readability
    let filepath: string = process.env.STORAGE_PATH || '/tmp/';
    filepath += req.params.taskId;

    // get the workItem of the task id and optain the certificate data for this work item
    this.database.getWorkItem(req.params.taskId).then((taskData: templateData) => {
      this.database.checkTemplateId(taskData.templateId).then(() => {
        this.database.getTemplate(taskData.templateId).then((templateData: extendedTemplateObject) => {
          // Render the replacements into a finished html
          const certificate: string = nunjucks.renderString(templateData.previewHTML, taskData);
          // Initialize a phantomjs page
          this.instance.createPage().then((page) => {
            // This is an weird function loading said content with the given url
            // aka. inject html from a string.
            page.setContent(certificate, '');
            page.property('paperSize', {
              format: 'A4',
              orientation: 'portrait',
              margin: '1cm',
            });
            // Finally create the pdf
            page.render(filepath, { format: 'pdf' }).then(() => {
              res.sendStatus(200);
            }).catch((err) => { // render
              console.log(err);
              res.statusMessage = 'Template rendering failed';
              res.sendStatus(500);
            });
          }).catch((err) => { // createPage
            console.log(err);
            res.statusMessage = 'Template rendering failed';
            res.sendStatus(500);
          });
          this.database.increaseExecutions(templateData);
        }).catch((err) => { // getTemplate
          res.sendStatus(500);
        });
      }).catch(() => { // checkTemplateId
        console.log('Template not found');
        res.statusMessage = 'This template doesn\'t exist any more';
        res.sendStatus(404);
      });
    }).catch((err: number) => { // getWorkItem
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

// Create the router and export its configured Express.Router
const renderRoute = new RenderRouter();
renderRoute.init();

export default renderRoute.router;
