import { Menu } from "react-admin";

export const CustomMenu = () => (
  <Menu>
    <Menu.Item to="/tools" primaryText="Tools" />
    <Menu.Item to="/action-types" primaryText="Action Types" />
    <Menu.Item to="/location-types" primaryText="Location Types" />
    <Menu.Item to="/roles" primaryText="Roles" />
    <Menu.Item to="/photo-types" primaryText="Photo Types" />
    <Menu.Item to="/tool-statuses" primaryText="Tool Statuses" />
    <Menu.Item to="/models" primaryText="Models" />
    <Menu.Item to="/brands" primaryText="Brands" />
    <Menu.Item to="/tool-types" primaryText="Tool Types" />
    <Menu.Item to="/photo-sessions" primaryText="Photo Sessions" />
    <Menu.Item to="/photos-for-detection" primaryText="Photos For Detection" />
    <Menu.Item to="/users" primaryText="Users" />
    <Menu.Item to="/tool-photos" primaryText="Tool Photos" />
    <Menu.Item to="/tool-assignments" primaryText="Tool Assignments" />
    <Menu.Item to="/detected-tools" primaryText="Detected Tools" />
  </Menu>
);
