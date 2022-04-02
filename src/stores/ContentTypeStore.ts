import { useCallback, useReducer } from 'react';
import { ContentTypeProps } from 'contentful-management';
import constate from 'constate';

import { useApp } from '../contexts/appContext';

interface ContentTypeMap {
  [id: string]: 'failed' | undefined | ContentTypeProps;
}

type Action =
  | { type: 'set_content_type', id: string, contentType: ContentTypeProps }
  | { type: 'set_content_type_failed', id: string };


function reducer(state: ContentTypeMap, action: Action): ContentTypeMap {
  switch (action.type) {
    case 'set_content_type':
      return {
        ...state,
        [action.id]: action.contentType,
      };
    case 'set_content_type_failed':
      return {
        ...state,
        [action.id]: 'failed',
      };
    default:
      return state;
  }
}

const initialState = {};


function useContentTypeStore() {
  const { cma } = useApp();
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadContentType = useCallback(async (id: string) => {
    try {
      const contentType = await cma.contentType.get({ contentTypeId: id });
      dispatch({ type: 'set_content_type', id, contentType });
      return contentType;
    } catch (error) {
      dispatch({ type: 'set_content_type_failed', id });
    }
  }, [cma]);

  const getOrLoadContentType = useCallback(async (id: string) => {
    if (id in state && state[id] !== 'failed') {
      return state[id] as ContentTypeProps;
    }

    return loadContentType(id);
  }, [loadContentType, state]);

  return { getOrLoadContentType };
}


const [ContentTypesProvider, useContentTypes] = constate(useContentTypeStore);


export { ContentTypesProvider, useContentTypes };