import {
  Edit,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const PhotoTypeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} fullWidth />
    </SimpleForm>
  </Edit>
);
