import { AppProvider } from '../contexts/appContext';
import { ContentTypesProvider } from '../stores/ContentTypeStore';
import { EntriesProvider } from '../stores/EntryStore';
import { FieldProps } from '../types';
import Field from './Field';

function FieldWrapper(props: FieldProps) {
  const { cma, sdk }  = props;
  
  return (
    <AppProvider cma={cma} sdk={sdk}>
      <ContentTypesProvider>
        <EntriesProvider>
          <Field {...props} />
        </EntriesProvider>
      </ContentTypesProvider>
    </AppProvider>
  );
}

export default FieldWrapper;
