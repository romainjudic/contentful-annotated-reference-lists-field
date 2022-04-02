import { useEffect, useReducer } from 'react';
import { SkeletonBodyText, SkeletonContainer, Text, ValidationMessage } from '@contentful/f36-components';
import { entityHelpers } from '@contentful/field-editor-shared';

import { useApp } from '../contexts/appContext';
import { useContentTypes } from '../stores/ContentTypeStore';
import { useEntries } from '../stores/EntryStore';

interface EntryPreviewProps {
  entryId: string;
  className?: string;
}

interface State {
  error: null | string;
  title: null | string;
}

type Action =
  | { type: 'set_title', title: string }
  | { type: 'set_error', error: string };


function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'set_title':
      return {
        ...state,
        title: action.title,
        error: null,
      };
    case 'set_error':
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

const initialState = {
  title: null,
  error: null,
};


function EntryPreview({ entryId, className = '' }: EntryPreviewProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { sdk } = useApp();
  const { getOrLoadEntry } = useEntries();
  const { getOrLoadContentType } = useContentTypes();

  useEffect(() => {
    async function worker() {
      const entry = await getOrLoadEntry(entryId);
      if (!entry) {
        dispatch({ type: 'set_error', error: 'entry_not_found' });
        return;
      }

      const contentType = await getOrLoadContentType(entry.sys.contentType.sys.id);
      if (!contentType) {
        dispatch({ type: 'set_error', error: 'content_type_not_found' });
        return;
      }

      const title = entityHelpers.getEntryTitle({
        entry,
        contentType,
        localeCode: sdk.field.locale,
        defaultLocaleCode: sdk.locales.default,
        defaultTitle: '',
      });
      if (!title) {
        dispatch({ type: 'set_error', error: 'display_field_not_found' });
        return;
      }

      dispatch({ type: 'set_title', title });
    }

    worker();
  }, [entryId, getOrLoadEntry, getOrLoadContentType, sdk]);

  if (!state.error && !state.title) {
    return (
      <SkeletonContainer svgHeight={20} className={className}>
        <SkeletonBodyText numberOfLines={1} />
      </SkeletonContainer>
    );
  }

  if (state.error) {
    return <ValidationMessage className={className}>Error... Delete this row and add it again.</ValidationMessage>
  }

  return <Text className={className}>{state.title}</Text>;
}

export default EntryPreview;