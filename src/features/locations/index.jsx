import { Resource } from "react-admin";
import { LocationList } from "./LocationList";
import { LocationEdit } from "./LocationEdit";
import { LocationCreate } from "./LocationCreate";

export const LocationResource = () => (
  <Resource
    name="locations"
    list={LocationList}
    edit={LocationEdit}
    create={LocationCreate}
  />
);
