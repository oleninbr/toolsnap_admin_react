import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  required,
  email,
} from "react-admin";

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="full_name" validate={[required()]} fullWidth />
      <TextInput source="email" validate={[required(), email()]} fullWidth />
      <BooleanInput source="confirmed_email" />
      
      <ReferenceInput source="role_id" reference="roles">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      
      <BooleanInput source="is_active" />
      <PasswordInput source="password_hash" validate={[required()]} fullWidth />
    </SimpleForm>
  </Create>
);
