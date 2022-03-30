import { useCallback, useReducer } from 'react';
import { EntryProps, PlainClientAPI } from 'contentful-management';
import constate from 'constate';

interface EntryMap {
  [id: string]: 'failed' | undefined | EntryProps;
}

type Action =
  | { type: 'set_entry', id: string, entry: EntryProps }
  | { type: 'set_entry_failed', id: string };


function reducer(state: EntryMap, action: Action): EntryMap {
  switch (action.type) {
    case 'set_entry':
      return {
        ...state,
        [action.id]: action.entry,
      };
    case 'set_entry_failed':
      return {
        ...state,
        [action.id]: 'failed',
      };
    default:
      return state;
  }
}

const initialState = {};


function useEntryStore(props: { cma: PlainClientAPI }) {
  const { cma } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadEntry = useCallback(async (id: string) => {
    try {
      const entry = await cma.entry.get({ entryId: id });
      dispatch({ type: 'set_entry', id, entry });
      return entry;
    } catch (error) {
      dispatch({ type: 'set_entry_failed', id });
    } 
  }, [cma]);

  const getOrLoadEntry = useCallback(async (id: string) => {
    if (id in state && state[id] !== 'failed') {
      return state[id] as EntryProps;
    }

    return loadEntry(id);
  }, [loadEntry, state]);

  return { getOrLoadEntry };
}


const [EntriesProvider, useEntries] = constate(useEntryStore);


export { EntriesProvider, useEntries };