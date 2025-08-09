import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button
} from '@mui/material';

const EditRequestForm = ({ request, onSave, onCancel, open }) => {
  const [formData, setFormData] = useState(request || {});

  useEffect(() => {
    if (request) setFormData(request);
  }, [request]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle>Edit Request</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key) =>
              key !== 'id' ? (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={key}
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
              ) : null
            )}
          </Grid>
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onCancel} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequestForm;