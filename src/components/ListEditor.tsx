import { ChangeEvent } from 'react';
import { Button, Card, Stack, TextInput } from '@contentful/f36-components';
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons';
import { Entry } from 'contentful-management';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../contexts/appContext';

import { AnnotatedReference, AnnotatedReferenceList } from '../types';
import ItemEditor from './ItemEditor';

interface ListEditorProps {
  value: AnnotatedReferenceList;
  onChange: (value: AnnotatedReferenceList) => void;
  onDelete: () => void;
}

function ListEditor({ value, onChange, onDelete }: ListEditorProps) {
  const { sdk } = useApp();
  const { title, items } = value;

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({...value, title: event.target.value });
  }

  async function addItem() {
    const options = {};
    try {
      const selectedEntries = await sdk.dialogs.selectMultipleEntries<Entry>(options);
      if (!selectedEntries) {
        return;
      }
      onChange({
        ...value,
        items: [
          ...value.items,
          ...selectedEntries.map(entry => ({
            key: uuidv4(),
            text: '',
            referenceId: entry.sys.id,
          })),
        ],
      });
    } catch (error) {
      // Do nothing
    }
  }

  function handleItemChange(updatedItem: AnnotatedReference) {
    onChange({
      ...value,
      items: value.items.map(i => i.key === updatedItem.key ? updatedItem : i),
    });
  }

  function deletItem(deletedItem: AnnotatedReference) {
    onChange({
      ...value,
      items: items.filter(i => i.key !== deletedItem.key),
    })
  }

  async function handleDeleteSelf() {
    const result = await sdk.dialogs.openConfirm({
      title: 'Delete the list',
      message: 'Do you rellay want to delete this list? This operation can not be reversed.',
      intent: 'negative',
    });
    if (result) {
      onDelete();
    }
  }

  return (
    <>
      <Card>
        <Stack flexDirection="column" alignItems="flex-start">
          <TextInput value={title} onChange={handleTitleChange} aria-label="List name" placeholder="List name" />
          {items.map(item => (
            <ItemEditor
              key={item.key}
              value={item}
              onChange={handleItemChange}
              onDelete={() => deletItem(item)}
            />
          ))}
          <Stack justifyContent="flex-start">
            <Button onClick={addItem} startIcon={<PlusIcon />}>Add items</Button>
            <Button
              onClick={handleDeleteSelf}
              startIcon={<DeleteIcon />}
              variant="negative"
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

export default ListEditor;
