import Database from '../models/Database';
import { Router, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { extendedTemplateList, TemplateId, extendedTemplateObject } from '../models/Interfaces';

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
    console.log(req.body);
    this.database.uploadTemplate(req.body).then((templateId: TemplateId) => {
      res.send(templateId);
    }).catch((err: number) => {
      res.sendStatus(err);
    });
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
    });
  }

  /**
   * PUT update the given template
   */
  public updateTemplate(req: Request, res: Response, next: NextFunction) {
    console.log(req.params.templateId);
    console.log(req.body);
    this.database.updateTemplate(req.params.templateId, req.body).then((success: number) => {
      res.sendStatus(success);
    }).catch((err: number) => {
      res.sendStatus(err);
    });
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
   * GET all data of a specific template
   */
  public getTemplate(req: Request, res: Response, next: NextFunction) {
    this.database.getTemplate(req.params.templateId).then((template: extendedTemplateObject) => {
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
    this.router.post('/', this.uploadTemplate.bind(this));
    this.router.get('/:templateId', this.getTemplate.bind(this));
    this.router.put('/:templateId', this.updateTemplate.bind(this));
    this.router.delete('/:templateId', this.deleteTemplate.bind(this));
  }

}

// Create the router and export its configured Express.Router
const managementRoutes = new ManagementRouter();
managementRoutes.init();

export default managementRoutes.router;
