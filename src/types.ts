import { FieldExtensionSDK } from '@contentful/app-sdk';
import { PlainClientAPI } from 'contentful-management';

export interface FieldProps {
  sdk: FieldExtensionSDK;
  cma: PlainClientAPI;
}

export interface AnnotatedReference {
  key: string;
  text: string;
  referenceId: string;
}

export interface AnnotatedReferenceList {
  key: string;
  title: string;
  items: AnnotatedReference[];
}
