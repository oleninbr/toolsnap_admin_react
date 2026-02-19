import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  required,
} from "react-admin";

export const ToolAssignmentCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="tool_id" reference="tools">
        <SelectInput optionText="serial_number" validate={[required()]} />
      </ReferenceInput>
      
      <ReferenceInput source="user_id" reference="users">
        <SelectInput optionText="full_name" validate={[required()]} />
      </ReferenceInput>
      
      <ReferenceInput source="taken_detected_tool_id" reference="detected-tools" label="Taken Detected Tool">
        <SelectInput optionText="id" validate={[required()]} />
      </ReferenceInput>
      
      <ReferenceInput source="returned_detected_tool_id" reference="detected-tools" label="Returned Detected Tool">
        <SelectInput optionText="id" />
      </ReferenceInput>
      
      <ReferenceInput source="taken_location_id" reference="locations" label="Taken Location">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      
      <ReferenceInput source="returned_location_id" reference="locations" label="Returned Location">
        <SelectInput optionText="title" />
      </ReferenceInput>
      
      <DateTimeInput source="taken_at" />
      <DateTimeInput source="returned_at" />
    </SimpleForm>
  </Create>
);
