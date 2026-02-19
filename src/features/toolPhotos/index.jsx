import { Resource } from "react-admin";
import { ToolPhotoList } from "./ToolPhotoList";
import { ToolPhotoEdit } from "./ToolPhotoEdit";
import { ToolPhotoCreate } from "./ToolPhotoCreate";

export const ToolPhotoResource = () => (
  <Resource
    name="tool-photos"
    list={ToolPhotoList}
    edit={ToolPhotoEdit}
    create={ToolPhotoCreate}
  />
);
