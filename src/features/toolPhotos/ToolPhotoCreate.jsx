import React, { useState } from 'react';
import { Create, SimpleForm, ReferenceInput, SelectInput, useNotify, useRedirect, required } from 'react-admin';
import { Box } from '@mui/material';
import { FileInput } from '../../components/FileInput';

export const ToolPhotoCreate = () => {
  const [file, setFile] = useState(null);
  const notify = useNotify();
  const redirect = useRedirect();

  const transform = (data) => {
    if (!file) {
      notify('Please select a file', { type: 'warning' });
      throw new Error('File is required');
    }

    const formData = new FormData();
    formData.append('ToolId', data.tool_id);
    formData.append('PhotoTypeId', data.photo_type_id);
    formData.append('File', file);
    
    return formData;
  };

  const onSuccess = () => {
    notify('Tool photo created successfully', { type: 'success' });
    redirect('list', 'tool-photos');
  };

  return (
    <Create transform={transform} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <ReferenceInput source="tool_id" reference="tools" label="Tool">
          <SelectInput optionText="serial_number" validate={[required()]} fullWidth />
        </ReferenceInput>

        <ReferenceInput source="photo_type_id" reference="photo-types" label="Photo Type">
          <SelectInput optionText="title" validate={[required()]} fullWidth />
        </ReferenceInput>

        <Box sx={{ width: '100%', mt: 2 }}>
          <FileInput
            value={file}
            onChange={setFile}
            accept="image/*"
            label="Photo File *"
          />
        </Box>
      </SimpleForm>
    </Create>
  );
};
