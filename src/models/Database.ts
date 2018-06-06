'use strict';

import * as Cloudant from '@cloudant/cloudant';
import { templateList, templateObject, templateUpload, templateData } from './Interfaces';
import { resolve } from 'dns';

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
    (this.client.db.create('templates') as any).then(() => {
      console.log('Created database');
    }).catch((err) => {
      console.log('Database already exists');
    });
    this.templates = this.client.db.use('templates');
  }

  /**
   * Returns all templates.
   * @return Promise with the results from the database
   */
  public getAllTemplates(): Promise<Object[] | null> {
    return new Promise((resolve, reject) => {
      this.templates.list({ include_docs:true }).then((data) => {
        const result = Array() as Object[];
        data['rows'].forEach((row: Object) => {
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
      this.templates.get(templateId).then((data) => {
        this.templates.destroy(templateId, data.rev).then((data) => {
          console.log(data);
          resolve(true);
        }).catch((err) => {
          console.log(err);
          reject(false);
        });
      }).catch((err) => {
        console.log(err);
        reject(false);
      });
    });
  }

}
