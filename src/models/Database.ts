'use strict';

import * as Cloudant from '@cloudant/cloudant';
import * as dbDebug from 'debug';
import { templateList, templateObject, templateUpload, templateData, extendedTemplateObject, extendedTemplateList, TemplateId } from './Interfaces';
import { resolve } from 'dns';
import * as uuid from 'uuid';

interface CloudantCredentials {
  username: string;
  password: string;
  host: string;
  port: number;
  url: string;
}

export default class Database {
  private credentials : CloudantCredentials;
  private client: any;
  private templates: any;
  private workItems: any;

  /**
   * Initialize the database connection
   */
  constructor() {
    // Database connections may be either provided by the vcap
    // environment variables inside of Cloud Foundry or
    // by a dedicated environment variable for local testing.
    if (process.env.VCAP_SERVICES) {
      const vcap: Object = JSON.parse(process.env.VCAP_SERVICES);
      this.credentials = vcap['cloudantNoSQLDB'][0].credentials;
    } else if (process.env.DATABASE) {
      this.credentials = JSON.parse(process.env.DATABASE);
    } else {
      console.error('No database credentials provided.');
      process.exit(1);
    }

    // Enable the promises plugin
    this.credentials['plugins'] = ['promises'];
    this.client = Cloudant(this.credentials);

    // Create templates and workItems databases, if they do not exist
    (this.client.db.create('templates') as any).then(() => {
      dbDebug('Created database templates');
    }).catch((err) => {
      dbDebug('Database templates already exists');
    });

    (this.client.db.create('workitems') as any).then(() => {
      dbDebug('Created database workitems');
    }).catch((err) => {
      dbDebug('Database workitems already exists');
    });

    this.templates = this.client.db.use('templates');
    this.workItems = this.client.db.use('workitems');
  }

  /**
   * Returns all templates.
   * @return Promise with the results from the database
   */
  public getAllTemplates(management: boolean = false): Promise<Object[] | null> {
    return new Promise((resolve, reject) => {
      this.templates.list({ include_docs:true }).then((data) => {
        const result = Array() as Object[];
        data['rows'].forEach((row: Object) => {
          // For requests not coming to the management endpoint
          // delete operational information
          if (!management) {
            delete row['doc']['_id'];
            delete row['doc']['_rev'];
            delete row['doc']['executions'];
          }
          result.push(row['doc']);
        });
        resolve(result);
      }).catch((err) => {
        reject(err);
      });

    });
  }

  /**
   * Deletes a template with a given ID
   * @param templateId the uuid of the template to delete
   * @return Promise returning http response codes
   */
  public deleteTemplate(templateId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // Cloudant needs the revision of the object to be worked on.
      this.templates.get(templateId).then((data) => {
        // Delete the template with the given id and revision
        this.templates.destroy(templateId, data._rev).then((data) => {
          resolve(200);
        }).catch((err) => {
          console.log(err);
          reject(500);
        });
      }).catch((err) => {
        console.log(err);
        reject(404);
      });
    });
  }

  /**
   * Updates the template with the given id.
   * @param templateId: UUID of the template to update
   * @param templateData: Dataset to replace the old data
   * @return Promise with a http response code
   */
  public updateTemplate(templateId: string, templateData: templateUpload): Promise<number> {
    return new Promise((resolve, reject) => {
      // For an update we need the latest revision of the object to be updated.
      // At the same time we can check whether the template actually exists
      this.templates.get(templateId).then((document) => {
        templateData['_id'] = templateId;
        templateData['_rev'] = document._rev;
        templateData['executions'] = document.executions;
        templateData['templateId'] = templateId;
        this.templates.insert(templateData).then((data) => {
          resolve(200);
        }).catch((err) => {
          // Something on the server side went wrong
          console.log(err);
          reject(500);
        });
      }).catch((err) => {
        // The template id doesn't exist
        reject(400);
      });
    });
  }

  /**
   * Creates the template with given data.
   * @param templateData: Dataset of the new template
   * @return Promise with the template id or htp response code
   */
  public uploadTemplate(templateData: templateUpload): Promise<TemplateId | number> {
    return new Promise((resolve, reject) => {
      // We have to generate an id first
      const templateId: TemplateId = new TemplateId();
      templateId.templateId = uuid.v4();
      templateData['templateId'] = templateId.templateId;
      templateData['_id'] = templateId.templateId;
      templateData['executions'] = 0;
      this.templates.insert(templateData).then((success) => {
        resolve(templateId);
      }).catch((err) => {
        console.log(err);
        reject(500);
      });
    });
  }

  /**
   * Check whether an entered template id exists
   * @param templateId the id of a template the user chose
   * @return Promise stating either the existence or absense
   * of the chosen template
   */
  public checkTemplateId(templateId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.templates.get(templateId).then((document) => {
        resolve(true);
      }).catch((err) => {
        console.log(err);
        reject(false);
      });
    });
  }


  /**
   * Add a work item to the work items database
   * @param input the data provided by the user
   * @return Promise with either the task id or th error
   */
  public addWorkItem(input: templateData): Promise<string | any> {
    const taskId: string = uuid.v4();
    const workItem: Object = input;
    workItem['_id'] = taskId;
    return new Promise((resolve, reject) => {
      this.workItems.insert(workItem).then((ret) => {
        resolve(<string> ret.id);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  /**
   * Returns the data of a specific work item
   * @param taskId the id of a task to be done
   * @return Promise with either the data for this task or an error
   */
  public getWorkItem(taskId: string): Promise<templateData | Error> {
    return new Promise((resolve, reject) => {
      this.workItems.get(taskId).then((doc: templateData) => {
        resolve(doc);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  /**
   * Returns the data of one specific template
   * @param templateId the id of the template to retrieve
   * @return Promise with either the data for this template or an error
   */
  public getTemplate(templateId: string): Promise<extendedTemplateObject | Error> {
    return new Promise((resolve, reject) => {
      this.templates.get(templateId).then((doc: extendedTemplateObject) => {
        resolve(doc);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  /**
   * Increases the number of executions in the db for a given template
   * @param templateObject The template object as it has been used. Executions will be updated automatically.
   */
  public increaseExecutions(templateObject: extendedTemplateObject): void {
    templateObject.executions += 1;
    this.templates.insert(templateObject).then(() => {
      // Do nothing
    }).catch((err) => {
      console.log(err);
    });
  }
}
