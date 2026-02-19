import { useState } from "react";
import { useListContext } from "react-admin";
import {
  Button,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { downloadCSV, downloadPDF, getColumnsFromRecords } from "../utils/exportUtils";

export const ExportButton = ({ filename = "export" }) => {
  const { data } = useListContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const columns = getColumnsFromRecords(data);
      const timestamp = new Date().toISOString().split("T")[0];
      downloadCSV(data, columns, `${filename}_${timestamp}.csv`);
    } catch (error) {
      console.error("Export CSV error:", error);
    } finally {
      setIsExporting(false);
      handleClose();
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const columns = getColumnsFromRecords(data);
      const timestamp = new Date().toISOString().split("T")[0];
      downloadPDF(data, columns, `${filename}_${timestamp}.pdf`);
    } catch (error) {
      console.error("Export PDF error:", error);
    } finally {
      setIsExporting(false);
      handleClose();
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        aria-controls="export-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={isExporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
        disabled={isExporting || !data || data.length === 0}
        variant="outlined"
        size="small"
      >
        Експорт
      </Button>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleExportCSV}>
          📄 Експорт в CSV
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          📕 Експорт в PDF
        </MenuItem>
      </Menu>
    </>
  );
};
