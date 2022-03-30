import { PlainClientAPI } from 'contentful-management';
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { ContentTypesProvider } from '../stores/ContentTypeStore';

interface FieldProps {
  sdk: FieldExtensionSDK;
  cma: PlainClientAPI;
}

const Field = (props: FieldProps) => {
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return (
    <ContentTypesProvider cma={props.cma}>
      <Paragraph>Hello Entry Field Component</Paragraph>
    </ContentTypesProvider>
  );
};

export default Field;
