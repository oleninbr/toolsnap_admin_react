import {
  Create,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ToolStatusCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} fullWidth />
    </SimpleForm>
  </Create>
);
