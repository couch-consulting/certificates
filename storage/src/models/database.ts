'use strict';

// export { getTaskData };

import * as Nano from 'nano';
const databaseURL : string = process.env.DATABASE || 'http://localhost:5984';
const nano = Nano(databaseURL);
const req = nano.auth('anton', 'hynkel');

/*
const db = nano.db.use('certificates').then((result) => {
    console.log('Connected to database');
    }).catch((err) => {
      console.log('database does not exist... creating it');
      nano.db.create('certificates');
    });


function getTaskData(taskId: string) {
  db.get(taskId, { revs_info: true }).then((result) => {
    return result;
  }).catch((err) => {
    return err;
  });
}

*/
