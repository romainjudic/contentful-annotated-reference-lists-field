import { Card, DragHandle, IconButton, Stack, TextInput, Tooltip } from '@contentful/f36-components';
import { DeleteIcon } from '@contentful/f36-icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChangeEvent } from 'react';
import clsx from 'clsx';

import { AnnotatedReference } from '../types';
import { useApp } from '../contexts/appContext';
import EntryPreview from './EntryPreview';

import styles from './ItemEditor.module.css';

interface ItemEditorProps {
  value: AnnotatedReference;
  onChange: (value: AnnotatedReference) => void;
  onDelete: () => void;
}

function ItemEditor({ value, onChange, onDelete }: ItemEditorProps) {
  const { textLabel } = useApp();
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: value.key });

  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    console.log('hello');
    onChange({ ...value, text: event.target.value });
  }

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Card
      className={clsx(styles.root, { [styles.dragging]: isDragging })}
      style={style}
    >
      <div className={styles.cardContent}>
        <DragHandle label="Reorder this item" ref={setNodeRef} {...attributes} {...listeners} />
        <Stack className={styles.contentRoot}>
          <TextInput value={value.text} onChange={handleTextChange} aria-label={textLabel} placeholder={textLabel} size="small" className={styles.textInput} />
          <EntryPreview entryId={value.referenceId} className={styles.entryPreview} />
          <Tooltip placement="top" content="Delete item">
            <IconButton icon={<DeleteIcon />} onClick={onDelete} variant="transparent" aria-label="Delete item" />
          </Tooltip>
        </Stack>
      </div>
    </Card>
  );
}

export default ItemEditor;