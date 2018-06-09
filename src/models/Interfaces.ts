'use strict';

// Definition of the datatypes as specified in swagger.yml

/**
 * An array of templateObjects
 */
export interface templateList extends Array<templateObject> {
}

/**
 * An array of extendedTemplateObjects
 */
export interface extendedTemplateList extends Array<extendedTemplateObject> {
}

/**
 * A single template as it returned to the user
 */
export interface templateObject extends templateUpload {
  templateId: string;
}


/**
 * A single template as it is stored in the database
 */
export interface extendedTemplateObject extends templateObject {
  _id: string;
  _rev: string;
  executions: number;
}

/**
 * A template when it is newly uploaded to the server
 */
export interface templateUpload {
  name: string;
  description: string;
  inputFields: string[];
  previewHTML: string;
  previewImage: string;
}

/**
 * The data a user provides to generate a new template
 */
export interface templateData {
  templateId: string;
  certifier: string;
  certificant: string;
  laudatio: string;
  certificationDate: Date;
  certificationPlace: string;
}

/**
 * A task id of a template generation process
 */
export class TaskId {
  taskId: string;
}
