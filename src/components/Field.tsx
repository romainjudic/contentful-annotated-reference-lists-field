import { Button, Stack } from '@contentful/f36-components';
import { PlusIcon } from '@contentful/f36-icons';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { AnnotatedReferenceList, FieldProps } from '../types';
import ListEditor from './ListEditor';


const Field = (props: FieldProps) => {
  const { sdk } = props;
  const [lists, setLists] = useState<AnnotatedReferenceList[]>(() => {
    return sdk.field.getValue() || [];
  });

  useEffect(() => {
    sdk.window.startAutoResizer();
    return () => {
      sdk.window.stopAutoResizer();
    };
  });

  // Update contentful field value whenever the internal value changes
  useEffect(() => {
    sdk.field.setValue(lists);
  }, [sdk.field, lists]);

  function addList() {
    const emptyList: AnnotatedReferenceList = {
      key: uuidv4(),
      title: '',
      items: [],
    };
    setLists((prevLists) => ([...prevLists, emptyList]));
  }

  function handleListChange(updatedList: AnnotatedReferenceList) {
    setLists(prevLists => prevLists.map(l => l.key === updatedList.key ? updatedList : l));
  }

  function deleteList(deletedList: AnnotatedReferenceList) {
    setLists(prevLists => prevLists.filter(l => l.key !== deletedList.key));
  }

  return (
    <Stack flexDirection="column">
      {lists.map(list => (
        <ListEditor
          key={list.key}
          value={list}
          onChange={handleListChange}
          onDelete={() => deleteList(list)}
        />
      ))}
      <Button onClick={addList} startIcon={<PlusIcon />}>Add a list</Button>
    </Stack>
  );
};

export default Field;
