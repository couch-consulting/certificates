'use strict';

// Definition of the datatypes as specified in swagger.yml

/**
 * An array of templateObjects
 */
export interface templateList extends Array<templateObject> {
}

/**
 * A single template as it is stored in the database
 */
export interface templateObject {
  _id: string;
  _rev: string;
  templateId: string;
  name: string;
  description: string;
  inputFields: string[];
  previewHTML: string;
  previewImage: string;
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

