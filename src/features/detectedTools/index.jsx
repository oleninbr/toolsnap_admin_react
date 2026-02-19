import { Resource } from "react-admin";
import { DetectedToolList } from "./DetectedToolList";
import { DetectedToolEdit } from "./DetectedToolEdit";
import { DetectedToolCreate } from "./DetectedToolCreate";

export const DetectedToolResource = () => (
  <Resource
    name="detected-tools"
    list={DetectedToolList}
    edit={DetectedToolEdit}
    create={DetectedToolCreate}
  />
);
