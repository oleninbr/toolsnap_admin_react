import {
  Edit,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ToolStatusEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} fullWidth />
    </SimpleForm>
  </Edit>
);
