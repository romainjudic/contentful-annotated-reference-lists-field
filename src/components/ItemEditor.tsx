import { Card, DragHandle, IconButton, Stack, TextInput, Tooltip } from '@contentful/f36-components';
import { DeleteIcon } from '@contentful/f36-icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChangeEvent } from 'react';

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
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: value.key });

  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, text: event.target.value });
  }

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Card
      style={style}
      padding="none"
    >
      <div className={styles.cardContent}>
        <DragHandle label="Reorder this item" ref={setNodeRef} {...attributes} {...listeners} />
        <Stack flexGrow={1} paddingTop="spacing2Xs" paddingRight="none" paddingBottom="spacing2Xs" paddingLeft="spacingM">
          <div className={styles.textInput}>
            <TextInput value={value.text} onChange={handleTextChange} aria-label={textLabel} placeholder={textLabel} size="small" />
          </div>
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