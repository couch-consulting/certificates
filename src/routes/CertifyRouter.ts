'use strict';

import * as db from '../models/database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import * as fs from 'fs-extra';

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
   * GET a certificate of a given id
   */
  public getCertificate(req: Request, res: Response, next: NextFunction) {
    const uuid: string = req.params.taskid;
    let filepath: string = process.env.STORAGE_PATH || '/tmp/';
    filepath += uuid;
    console.log(filepath);
    fs.pathExists(filepath).then(() => {
      console.log('Found file');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.sendFile(filepath);
    }).catch((err) => {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.send({});
    });
  }


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/:taskid', this.getCertificate);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const certifyRoutes = new CertifyRouter();
certifyRoutes.init();

export default certifyRoutes.router;