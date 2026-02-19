import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  required,
  useFormContext,
} from "react-admin";
import { MapPicker } from "./MapPicker";

const MapPickerWrapper = () => {
  const { watch, setValue } = useFormContext();
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const handleCoordinateSelect = (coords) => {
    setValue("latitude", coords.latitude);
    setValue("longitude", coords.longitude);
  };

  return (
    <MapPicker
      latitude={latitude}
      longitude={longitude}
      onCoordinateSelect={handleCoordinateSelect}
    />
  );
};

export const LocationCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} fullWidth />
      
      <ReferenceInput source="locationTypeId" reference="location-types">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      
      <TextInput source="address" fullWidth />
      
      <MapPickerWrapper />
      
      <NumberInput source="latitude" validate={[required()]} style={{ display: "none" }} />
      <NumberInput source="longitude" validate={[required()]} style={{ display: "none" }} />
      
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Create>
);
