import { Card, IconButton, Stack, TextInput, Tooltip } from '@contentful/f36-components';
import { DeleteIcon } from '@contentful/f36-icons';
import { ChangeEvent } from 'react';

import { AnnotatedReference } from '../types';
import EntryPreview from './EntryPreview';

import styles from './ItemEditor.module.css';

interface ItemEditorProps {
  value: AnnotatedReference;
  onChange: (value: AnnotatedReference) => void;
  onDelete: () => void;
}

function ItemEditor({ value, onChange, onDelete }: ItemEditorProps) {

  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, text: event.target.value });
  }

  return (
    <Card className={styles.root}>
      <Stack>
        <TextInput value={value.text} onChange={handleTextChange} aria-label="Item text" placeholder="Item text" size="small" className={styles.textInput} />
        <EntryPreview entryId={value.referenceId} className={styles.entryPreview} />
        <Tooltip placement="top" content="Delete item">
          <IconButton icon={<DeleteIcon />} onClick={onDelete} variant="transparent" aria-label="Delete item" />
        </Tooltip>
      </Stack>
    </Card>
  );
}

export default ItemEditor;