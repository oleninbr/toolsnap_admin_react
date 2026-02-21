import { Menu, useSidebarState } from "react-admin";
import { Box, Divider, Typography } from "@mui/material";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

export const CustomMenu = () => {
  const [open] = useSidebarState();

  return (
    <Menu>
      {open && (
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            Tools
          </Typography>
        </Box>
      )}
    <Menu.Item to="/tools" primaryText="Tools" leftIcon={<BuildRoundedIcon />} />
    <Menu.Item to="/tool-types" primaryText="Tool Types" leftIcon={<CategoryRoundedIcon />} />
    <Menu.Item to="/tool-statuses" primaryText="Tool Statuses" leftIcon={<PrecisionManufacturingRoundedIcon />} />
    <Menu.Item to="/models" primaryText="Models" leftIcon={<ApartmentRoundedIcon />} />
    <Menu.Item to="/brands" primaryText="Brands" leftIcon={<CategoryRoundedIcon />} />

    <Divider sx={{ my: 1.5 }} />

    {open && (
      <Box sx={{ px: 2, pt: 1, pb: 1 }}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Assignments
        </Typography>
      </Box>
    )}
    <Menu.Item to="/tool-assignments" primaryText="Tool Assignments" leftIcon={<AssignmentRoundedIcon />} />
    <Menu.Item to="/detected-tools" primaryText="Detected Tools" leftIcon={<PrecisionManufacturingRoundedIcon />} />
    <Menu.Item to="/action-types" primaryText="Action Types" leftIcon={<AssignmentRoundedIcon />} />

    <Divider sx={{ my: 1.5 }} />

    {open && (
      <Box sx={{ px: 2, pt: 1, pb: 1 }}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Photos
        </Typography>
      </Box>
    )}
    <Menu.Item to="/tool-photos" primaryText="Tool Photos" leftIcon={<PhotoCameraRoundedIcon />} />
    <Menu.Item to="/photo-types" primaryText="Photo Types" leftIcon={<PhotoCameraRoundedIcon />} />
    <Menu.Item to="/photo-sessions" primaryText="Photo Sessions" leftIcon={<PhotoCameraRoundedIcon />} />
    <Menu.Item to="/photos-for-detection" primaryText="Photos For Detection" leftIcon={<PhotoCameraRoundedIcon />} />

    <Divider sx={{ my: 1.5 }} />

    {open && (
      <Box sx={{ px: 2, pt: 1, pb: 1 }}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Locations
        </Typography>
      </Box>
    )}
    <Menu.Item to="/locations" primaryText="Locations" leftIcon={<LocationOnRoundedIcon />} />
    <Menu.Item to="/location-types" primaryText="Location Types" leftIcon={<MapRoundedIcon />} />

    <Divider sx={{ my: 1.5 }} />

    {open && (
      <Box sx={{ px: 2, pt: 1, pb: 1 }}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Users
        </Typography>
      </Box>
    )}
    <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleAltRoundedIcon />} />
    <Menu.Item to="/roles" primaryText="Roles" leftIcon={<PeopleAltRoundedIcon />} />
    </Menu>
  );
};
