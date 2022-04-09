import { ChangeEvent, ReactNode, useMemo } from 'react';
import { Button, Card, Stack, TextInput } from '@contentful/f36-components';
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons';
import { DndContext, DragEndEvent, PointerSensor, useDndContext, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Entry } from 'contentful-management';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

import { useApp } from '../contexts/appContext';
import { AnnotatedReference, AnnotatedReferenceList } from '../types';
import ItemEditor from './ItemEditor';

import styles from './ListEditor.module.css';

interface ListEditorProps {
  value: AnnotatedReferenceList;
  onChange: (value: AnnotatedReferenceList) => void;
  onDelete: () => void;
}

function ItemsWrapper({ children }: { children: ReactNode }) {
  const { active } = useDndContext();
  return (
    <Stack flexDirection="column" className={clsx(styles.items, { [styles.itemsActiveDragging]: active })}>
      {children}
    </Stack>
  );
}

function ListEditor({ value, onChange, onDelete }: ListEditorProps) {
  const { sdk, contentTypes } = useApp();
  const { title, items } = value;
  const sensors = useSensors(
    useSensor(PointerSensor),
    // TODO: keyboard sensor?
  );

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({...value, title: event.target.value });
  }

  async function addItem() {
    const options: Parameters<typeof sdk.dialogs.selectMultipleEntries>[0] = {};
    if (contentTypes) {
      options.contentTypes = contentTypes;
    }
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

  function handleDragItemEnd(event: DragEndEvent) {
    const { active, over }  = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.key === active.id);
      const newIndex = items.findIndex(item => item.key === over.id);
      onChange({
        ...value,
        items: arrayMove(items, oldIndex, newIndex),
      });
    }
  }

  const sortableItems = useMemo(() => items.map(item => ({ ...items, id: item.key })), [items])

  return (
    <>
      <Card>
        <Stack flexDirection="column" alignItems="flex-start">
          <TextInput value={title} onChange={handleTitleChange} aria-label="List name" placeholder="List name" />
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragItemEnd}
          >
            <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
              <ItemsWrapper>
                {items.map(item => (
                  <ItemEditor
                    key={item.key}
                    value={item}
                    onChange={handleItemChange}
                    onDelete={() => deletItem(item)}
                  />
                ))}
              </ItemsWrapper>
            </SortableContext>
          </DndContext>
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
