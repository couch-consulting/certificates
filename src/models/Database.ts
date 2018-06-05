'use strict';

// export { getTaskData };

import * as Cloudant from '@cloudant/cloudant';
import { resolve } from 'dns';

export default class Database {
  credentials : Object;
  client: any;
  templates: any;

  /**
   * Initialize the database connection
   */
  constructor(credentials: Object) {
    this.credentials = credentials;

    // Use promises
    this.credentials['plugins'] = ['promises'];
    this.client = Cloudant(this.credentials);
    (this.client.db.create('templates') as any).then(() => {
      console.log('Created database');
    }).catch((err) => {
      console.log('Database already exists');
    });
    this.templates = this.client.db.use('templates');
  }

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
