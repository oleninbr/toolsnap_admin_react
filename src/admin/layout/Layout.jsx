import { Layout, UserMenu, Logout, AppBar } from "react-admin";
import { Box, Typography, Chip } from "@mui/material";
import { CustomMenu } from "./Menu";

const CustomAppBar = () => (
  <AppBar>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 1,
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#d2691e",
          boxShadow: "0 0 0 4px rgba(210, 105, 30, 0.25)",
        }}
      />
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.4 }}>
        ToolSnap Admin
      </Typography>
      <Chip
        label="Industrial Suite"
        size="small"
        sx={{
          bgcolor: "rgba(255,255,255,0.18)",
          color: "#ffffff",
          fontWeight: 600,
        }}
      />
    </Box>
  </AppBar>
);

export const MyLayout = (props) => (
  <Layout
    {...props}
    menu={CustomMenu}
    appBar={CustomAppBar}
    userMenu={<UserMenu><Logout /></UserMenu>}
  />
);
