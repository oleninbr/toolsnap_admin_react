import * as React from "react";
import { MenuItemLink } from "react-admin";

export const customMenu = ({ onMenuClick, logout }) => {
  return (
    <div>
      <h3 style={{ paddingLeft: "1em" }}>Tools</h3>
      <MenuItemLink to="/tools" primaryText="Tools" onClick={onMenuClick} />
      <MenuItemLink to="/brands" primaryText="Brands" onClick={onMenuClick} />
      <MenuItemLink to="/models" primaryText="Models" onClick={onMenuClick} />
      <MenuItemLink to="/tool-types" primaryText="Tool Types" onClick={onMenuClick} />
      <MenuItemLink to="/tool-statuses" primaryText="Tool Statuses" onClick={onMenuClick} />

      <h3 style={{ paddingLeft: "1em" }}>Users</h3>
      <MenuItemLink to="/users" primaryText="Users" onClick={onMenuClick} />
      <MenuItemLink to="/roles" primaryText="Roles" onClick={onMenuClick} />

      <h3 style={{ paddingLeft: "1em" }}>Locations</h3>
      <MenuItemLink to="/locations" primaryText="Locations" onClick={onMenuClick} />
      <MenuItemLink to="/location-types" primaryText="Location Types" onClick={onMenuClick} />

      <h3 style={{ paddingLeft: "1em" }}>Photos</h3>
      <MenuItemLink to="/photo-sessions" primaryText="Photo Sessions" onClick={onMenuClick} />
      <MenuItemLink to="/photos-for-detection" primaryText="Photos for Detection" onClick={onMenuClick} />
      <MenuItemLink to="/tool-photos" primaryText="Tool Photos" onClick={onMenuClick} />
      <MenuItemLink to="/photo-types" primaryText="Photo Types" onClick={onMenuClick} />
      <MenuItemLink to="/action-types" primaryText="Action Types" onClick={onMenuClick} />

      <h3 style={{ paddingLeft: "1em" }}>Assignments</h3>
      <MenuItemLink to="/tool-assignments" primaryText="Tool Assignments" onClick={onMenuClick} />

      {logout}
    </div>
  );
};
