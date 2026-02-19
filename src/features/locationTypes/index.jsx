import { Resource } from "react-admin";
import { LocationTypeList } from "./LocationTypeList";
import { LocationTypeEdit } from "./LocationTypeEdit";
import { LocationTypeCreate } from "./LocationTypeCreate";

export const LocationTypeResource = () => (
  <Resource
    name="location-types"
    list={LocationTypeList}
    edit={LocationTypeEdit}
    create={LocationTypeCreate}
  />
);
