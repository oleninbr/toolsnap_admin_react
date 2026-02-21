import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

export const FileInput = ({ value, onChange, accept = "image/*", label = "Upload File" }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(value || null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onChange(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>

      {!file ? (
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{
            py: 2,
            borderStyle: 'dashed',
            borderWidth: 2,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
            },
          }}
        >
          Choose File
          <input
            type="file"
            hidden
            accept={accept}
            onChange={handleFileChange}
          />
        </Button>
      ) : (
        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {preview ? (
              <CardMedia
                component="img"
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
                image={preview}
                alt={file.name}
              />
            ) : (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.selected',
                  borderRadius: 2,
                }}
              >
                <ImageIcon sx={{ fontSize: 40, color: 'action.active' }} />
              </Box>
            )}
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>

            <IconButton onClick={handleRemove} color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Card>
      )}
    </Box>
  );
};
