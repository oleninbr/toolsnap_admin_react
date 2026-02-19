import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  required,
  useFormContext,
} from "react-admin";
import { MapPicker } from "./MapPicker";

const LocationEditForm = () => {
  const { watch, setValue } = useFormContext();
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const handleCoordinateSelect = (coords) => {
    setValue("latitude", coords.latitude);
    setValue("longitude", coords.longitude);
  };

  return (
    <>
      <TextInput source="name" validate={[required()]} fullWidth />
      
      <ReferenceInput source="location_type_id" reference="location-types">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      
      <TextInput source="address" fullWidth />
      
      <MapPicker
        latitude={latitude}
        longitude={longitude}
        onCoordinateSelect={handleCoordinateSelect}
      />
      
      {/* Hidden fields to store coordinates */}
      <NumberInput source="latitude" validate={[required()]} style={{ display: "none" }} />
      <NumberInput source="longitude" validate={[required()]} style={{ display: "none" }} />
      
      <BooleanInput source="is_active" />
      <DateTimeInput source="created_at" disabled />
    </>
  );
};

export const LocationEdit = () => (
  <Edit>
    <SimpleForm>
      <LocationEditForm />
    </SimpleForm>
  </Edit>
);
