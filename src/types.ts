import { FieldExtensionSDK } from '@contentful/app-sdk';
import { PlainClientAPI } from 'contentful-management';

export interface FieldProps {
  sdk: FieldExtensionSDK;
  cma: PlainClientAPI;
}
