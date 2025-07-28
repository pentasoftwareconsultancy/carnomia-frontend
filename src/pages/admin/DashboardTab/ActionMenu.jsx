import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import { MoreVert, Visibility, Edit, Delete } from '@mui/icons-material';

const ActionMenu = ({ request, setSelectedRequest, setRequests, setViewMode, setEditMode, viewOnly = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const actions = [
    {
      label: 'View',
      icon: <Visibility fontSize="small" />,
      action: () => {
        setSelectedRequest(request);
        setViewMode(true);
        handleClose();
      }
    },
    ...(viewOnly ? [] : [
      {
        label: 'Edit',
        icon: <Edit fontSize="small" />,
        action: () => {
          console.log('Edit clicked for request', request);
          setSelectedRequest(request);
          setEditMode(true);
          handleClose();
        }
      },
      {
        label: 'Delete',
        icon: <Delete fontSize="small" />,
        action: () => {
          if (window.confirm("Delete this request?")) {
            setRequests(prev => prev.filter(req => req.id !== request.id));
          }
          handleClose();
        },
        color: 'error'
      }
    ])
  ];

  return (
    <div>
      <IconButton aria-label="more" onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { width: '20ch' } }}
      >
        {actions.map((action, index) => (
          <MenuItem key={index} onClick={action.action} sx={{ color: action.color || 'inherit' }}>
            <Box display="flex" alignItems="center" gap={1}>
              {action.icon}
              {action.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ActionMenu;