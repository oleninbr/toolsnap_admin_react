import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  required,
} from "react-admin";

export const DetectedToolCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="photo_session_id" reference="photo-sessions" label="Photo Session">
        <SelectInput optionText="id" validate={[required()]} />
      </ReferenceInput>
      
      <ReferenceInput source="tool_type_id" reference="tool-types">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      
      <ReferenceInput source="brand_id" reference="brands">
        <SelectInput optionText="title" />
      </ReferenceInput>
      
      <ReferenceInput source="model_id" reference="models">
        <SelectInput optionText="title" />
      </ReferenceInput>
      
      <TextInput source="serial_number" />
      <NumberInput source="confidence" validate={[required()]} />
      <BooleanInput source="red_flagged" />
    </SimpleForm>
  </Create>
);
