import { Resource } from "react-admin";
import { PhotoSessionList } from "./PhotoSessionList";
import { PhotoSessionEdit } from "./PhotoSessionEdit";
import { PhotoSessionCreate } from "./PhotoSessionCreate";

export const PhotoSessionResource = () => (
  <Resource
    name="photo-sessions"
    list={PhotoSessionList}
    edit={PhotoSessionEdit}
    create={PhotoSessionCreate}
  />
);
