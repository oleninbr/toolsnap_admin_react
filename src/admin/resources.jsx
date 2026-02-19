import { Resource } from "react-admin";

// tools
import { ToolList } from "../features/tools/ToolList";
import { ToolEdit } from "../features/tools/ToolEdit";
import { ToolCreate } from "../features/tools/ToolCreate";

// action-types
import { ActionTypeList } from "../features/action-types/ActionTypeList";
import { ActionTypeEdit } from "../features/action-types/ActionTypeEdit";
import { ActionTypeCreate } from "../features/action-types/ActionTypeCreate";

// location-types
import { LocationTypeList } from "../features/locationTypes/LocationTypeList";
import { LocationTypeEdit } from "../features/locationTypes/LocationTypeEdit";
import { LocationTypeCreate } from "../features/locationTypes/LocationTypeCreate";

// roles
import { RoleList } from "../features/roles/RoleList";
import { RoleEdit } from "../features/roles/RoleEdit";
import { RoleCreate } from "../features/roles/RoleCreate";

// photo-types
import { PhotoTypeList } from "../features/photoTypes/PhotoTypeList";
import { PhotoTypeEdit } from "../features/photoTypes/PhotoTypeEdit";
import { PhotoTypeCreate } from "../features/photoTypes/PhotoTypeCreate";

// tool-statuses
import { ToolStatusList } from "../features/toolStatuses/ToolStatusList";
import { ToolStatusEdit } from "../features/toolStatuses/ToolStatusEdit";
import { ToolStatusCreate } from "../features/toolStatuses/ToolStatusCreate";

// models
import { ModelList } from "../features/models/ModelList";
import { ModelEdit } from "../features/models/ModelEdit";
import { ModelCreate } from "../features/models/ModelCreate";

// brands
import { BrandList } from "../features/brands/BrandList";
import { BrandEdit } from "../features/brands/BrandEdit";
import { BrandCreate } from "../features/brands/BrandCreate";

// tool-types
import { ToolTypeList } from "../features/toolTypes/ToolTypeList";
import { ToolTypeEdit } from "../features/toolTypes/ToolTypeEdit";
import { ToolTypeCreate } from "../features/toolTypes/ToolTypeCreate";

// photo-sessions
import { PhotoSessionList } from "../features/photoSessions/PhotoSessionList";
import { PhotoSessionEdit } from "../features/photoSessions/PhotoSessionEdit";
import { PhotoSessionCreate } from "../features/photoSessions/PhotoSessionCreate";

// photos-for-detection
import { PhotoForDetectionList } from "../features/photoForDetections/PhotoForDetectionList";
import { PhotoForDetectionEdit } from "../features/photoForDetections/PhotoForDetectionEdit";
import { PhotoForDetectionCreate } from "../features/photoForDetections/PhotoForDetectionCreate";

// users
import { UserList } from "../features/users/UserList";
import { UserEdit } from "../features/users/UserEdit";
import { UserCreate } from "../features/users/UserCreate";

// tool-photos
import { ToolPhotoList } from "../features/toolPhotos/ToolPhotoList";
import { ToolPhotoEdit } from "../features/toolPhotos/ToolPhotoEdit";
import { ToolPhotoCreate } from "../features/toolPhotos/ToolPhotoCreate";

// tool-assignments
import { ToolAssignmentList } from "../features/toolAssignments/ToolAssignmentList";
import { ToolAssignmentEdit } from "../features/toolAssignments/ToolAssignmentEdit";
import { ToolAssignmentCreate } from "../features/toolAssignments/ToolAssignmentCreate";

// detected-tools
import { DetectedToolList } from "../features/detectedTools/DetectedToolList";
import { DetectedToolEdit } from "../features/detectedTools/DetectedToolEdit";
import { DetectedToolCreate } from "../features/detectedTools/DetectedToolCreate";

export const AdminResources = () => (
  <>
    <Resource
      name="tools"
      list={ToolList}
      edit={ToolEdit}
      create={ToolCreate}
    />

    <Resource
      name="action-types"
      list={ActionTypeList}
      edit={ActionTypeEdit}
      create={ActionTypeCreate}
    />

    <Resource
      name="location-types"
      list={LocationTypeList}
      edit={LocationTypeEdit}
      create={LocationTypeCreate}
    />

    <Resource
      name="roles"
      list={RoleList}
      edit={RoleEdit}
      create={RoleCreate}
    />

    <Resource
      name="photo-types"
      list={PhotoTypeList}
      edit={PhotoTypeEdit}
      create={PhotoTypeCreate}
    />

    <Resource
      name="tool-statuses"
      list={ToolStatusList}
      edit={ToolStatusEdit}
      create={ToolStatusCreate}
    />

    <Resource
      name="models"
      list={ModelList}
      edit={ModelEdit}
      create={ModelCreate}
    />

    <Resource
      name="brands"
      list={BrandList}
      edit={BrandEdit}
      create={BrandCreate}
    />

    <Resource
      name="tool-types"
      list={ToolTypeList}
      edit={ToolTypeEdit}
      create={ToolTypeCreate}
    />

    <Resource
      name="photo-sessions"
      list={PhotoSessionList}
      edit={PhotoSessionEdit}
      create={PhotoSessionCreate}
    />

    <Resource
      name="photos-for-detection"
      list={PhotoForDetectionList}
      edit={PhotoForDetectionEdit}
      create={PhotoForDetectionCreate}
    />

    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      create={UserCreate}
    />

    <Resource
      name="tool-photos"
      list={ToolPhotoList}
      edit={ToolPhotoEdit}
      create={ToolPhotoCreate}
    />

    <Resource
      name="tool-assignments"
      list={ToolAssignmentList}
      edit={ToolAssignmentEdit}
      create={ToolAssignmentCreate}
    />

    <Resource
      name="detected-tools"
      list={DetectedToolList}
      edit={DetectedToolEdit}
      create={DetectedToolCreate}
    />
  </>
);
