import {
  Create,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const LocationTypeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} fullWidth />
    </SimpleForm>
  </Create>
);
