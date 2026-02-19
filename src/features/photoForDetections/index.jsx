import { Resource } from "react-admin";
import { PhotoForDetectionList } from "./PhotoForDetectionList";
import { PhotoForDetectionEdit } from "./PhotoForDetectionEdit";
import { PhotoForDetectionCreate } from "./PhotoForDetectionCreate";

export const PhotoForDetectionResource = () => (
  <Resource
    name="photos-for-detection"
    list={PhotoForDetectionList}
    edit={PhotoForDetectionEdit}
    create={PhotoForDetectionCreate}
  />
);
