import {
  Edit,
  SimpleForm,
  TextInput,
  PasswordInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  required,
  email,
} from "react-admin";

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="full_name" validate={[required()]} fullWidth />
      <TextInput source="email" validate={[required(), email()]} fullWidth />
      <BooleanInput source="confirmed_email" />
      
      <ReferenceInput source="role_id" reference="roles">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      
      <BooleanInput source="is_active" />
      <PasswordInput source="password_hash" validate={[required()]} fullWidth />
      <DateTimeInput source="created_at" disabled />
    </SimpleForm>
  </Edit>
);
