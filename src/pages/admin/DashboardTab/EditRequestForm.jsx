import React, { useState, useEffect } from 'react';
import { Modal, Grid, TextField, Button, Box, DialogActions } from '@mui/material';

const EditRequestForm = ({ request, onSave, onCancel }) => {
  const [formData, setFormData] = useState(request);

  useEffect(() => {
    console.log('EditRequestForm mounted with request', request);
  }, [request]);

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal title="Edit Request" onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.keys(request).map(key => (
            key !== 'id' && (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={key.replace(/([A-Z])/g, ' $1')}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            )
          ))}
        </Grid>
        <DialogActions sx={{ mt: 3 }}>
          <Button onClick={onCancel} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Modal>
  );
};

export default EditRequestForm;