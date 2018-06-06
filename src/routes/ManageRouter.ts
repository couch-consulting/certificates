import Database from '../models/Database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { extendedTemplateList } from '../models/Interfaces';

export class ManagementRouter {
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
   * POST upload a new template
   */
  public uploadTemplate(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * GET operational data of all templates
   */
  public getTemplates(req: Request, res: Response, next: NextFunction) {
    console.log('getTemplates');
    // Get Management view of all templates
    this.database.getAllTemplates(true).then((data: extendedTemplateList) => {
      res.send(data);
    }).catch((err: null) => {
      res.sendStatus(500);
      res.end();
    });
  }

  /**
   * PUT update the given template
   */
  public updateTemplate(req: Request, res: Response, next: NextFunction) {
  }

  /**
   * DELETE a template with a given id
   */
  public deleteTemplate(req: Request, res: Response, next: NextFunction) {
    this.database.deleteTemplate(req.params.templateId).then((data: boolean) => {
      res.sendStatus(200);
    }).catch((err: boolean) => {
      res.sendStatus(404);
    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getTemplates.bind(this));
    this.router.post('/', this.uploadTemplate.bind(this));
    this.router.put('/:templateId', this.updateTemplate.bind(this));
    this.router.delete('/:templateId', this.deleteTemplate.bind(this));
  }

}

// Create the HeroRouter, and export its configured Express.Router
const managementRoutes = new ManagementRouter();
managementRoutes.init();

export default managementRoutes.router;
