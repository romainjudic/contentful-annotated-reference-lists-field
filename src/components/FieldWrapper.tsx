import { ContentTypesProvider } from '../stores/ContentTypeStore';
import { EntriesProvider } from '../stores/EntryStore';
import { FieldProps } from '../types';
import Field from './Field';

function FieldWrapper(props: FieldProps) {
  const { cma }  = props;
  
  return (
    <ContentTypesProvider cma={cma}>
      <EntriesProvider cma={cma}>
        <Field {...props} />
      </EntriesProvider>
    </ContentTypesProvider>
  );
}

export default FieldWrapper;
