'use strict';

import * as Cloudant from '@cloudant/cloudant';
import * as dbDebug from 'debug';
import { templateList, templateObject, templateUpload, templateData, extendedTemplateObject, extendedTemplateList } from './Interfaces';
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
  credentials : CloudantCredentials;
  client: any;
  templates: any;
  workItems: any;

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
      console.log(err);
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
   * @return Promise of the success of the operation
   */
  public deleteTemplate(templateId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Cloudant needs the revision of the object to be worked on.
      this.templates.get(templateId).then((data) => {
        // Delete the template with the given id and revision
        this.templates.destroy(templateId, data.rev).then((data) => {
          dbDebug(data);
          resolve(true);
        }).catch((err) => {
          dbDebug(err);
          reject(false);
        });
      }).catch((err) => {
        dbDebug(err);
        reject(false);
      });
    });
  }

  /**
   * Updates the template with the given id.
   * @param templateId: UUID of the template to update
   * @param templateData: Dataset to replace the old data
   * @return Promise with a boolean stating success or failure.
   */
  public updateTemplate(templateId: string, templateData: templateUpload): Promise<boolean> {
    return new Promise((resolve, reject) => {
      templateData['_id'] = templateId;
      this.templates.insert(templateData).then((data) => {
        dbDebug(data);
        resolve(true);
      }).catch((err) => {
        dbDebug(err);
        reject(false);
      });
    });
  }

  /**
   * Creates the template with given data.
   * @param templateData: Dataset of the new template
   * @return Promise with a boolean stating success or failure.
   */
  public uploadTemplate(templateData: templateUpload): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // In the end an upload is nothing but an update.
      // We just have to generate an id first
      const templateId: string = uuid.v4();
      templateData['templateId'] = templateId;
      this.updateTemplate(templateId, templateData).then((success) => {
        resolve(true);
      }).catch((err) => {
        reject(false);
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
        resolve(false);
      });
    });
  }


  /**
   * Add a work item to the work items database
   * @param input the data provided by the user
   * @return Promise with either the task id or th error
   */
  public addWorkItem(input: templateData): Promise<string | null> {
    const taskId: string = uuid.v4();
    const workItem: Object = input;
    workItem['_id'] = taskId;
    return new Promise((resolve, reject) => {
      this.workItems.insert(workItem).then((ret) => {
        dbDebug(ret);
        resolve(taskId);
      }).catch((err) => {
        dbDebug(err);
        reject(err);
      });
    });
  }

}
