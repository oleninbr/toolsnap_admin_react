import { Resource } from "react-admin";
import { PhotoTypeList } from "./PhotoTypeList";
import { PhotoTypeEdit } from "./PhotoTypeEdit";
import { PhotoTypeCreate } from "./PhotoTypeCreate";

export const PhotoTypeResource = () => (
  <Resource
    name="photo-types"
    list={PhotoTypeList}
    edit={PhotoTypeEdit}
    create={PhotoTypeCreate}
  />
);
