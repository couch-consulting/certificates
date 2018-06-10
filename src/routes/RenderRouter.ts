'use strict';

import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import * as nunjucks from 'nunjucks';
import * as htmlPdf from 'html-pdf';
import * as phantom from 'phantom';
import * as fs from 'fs-extra';

import Database from '../models/Database';
import { templateData, extendedTemplateObject } from '../models/Interfaces';

export class RenderRouter {
  router: Router;
  private database: Database;
  private instance;
  private page;


  /**
   * Initialize the router
   */
  constructor() {
    this.database = new Database();
    this.router = Router();
    nunjucks.configure({ autoescape: true });
    phantom.create().then((phantom) => {
      this.instance = phantom;
      this.instance.createPage().then((page) => {
        this.page = page;
      });
    });

    this.init();
  }

  /**
   * POST call to render a new certificate
   */
  public async renderCertificate(req: Request, res: Response, next: NextFunction) {
    let filepath: string = process.env.STORAGE_PATH || '/tmp/';
    filepath += req.params.taskId;
    this.database.getWorkItem(req.params.taskId).then((taskData: templateData) => {
      this.database.checkTemplateId(taskData.templateId).then(() => {
        this.database.getTemplate(taskData.templateId).then((templateData: extendedTemplateObject) => {
          const certificate: string = nunjucks.renderString(templateData.previewHTML, taskData);
          console.log(certificate);
          const testhtml: string = fs.readFileSync('./bcard.html', 'utf8');

          // Unfortunately only callbacks are supported. gnah.
          htmlPdf.create(testhtml).toFile(filepath, (err, result) => {
            if (err) {
              console.log(err);
              res.statusMessage = 'An error occurred while generating the certificate';
              res.sendStatus(500);
            }
            console.log(result);
            res.sendStatus(200);
          });
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
