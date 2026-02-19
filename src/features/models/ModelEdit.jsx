import {
  Edit,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ModelEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} fullWidth />
    </SimpleForm>
  </Edit>
);
