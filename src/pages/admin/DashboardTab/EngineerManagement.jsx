import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Switch,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  margin: 0,
  width: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.01)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  boxShadow: theme.shadows[4],
  backgroundColor: '#f8fafc',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: { xs: '0.8rem', sm: '0.9rem' },
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#000000',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
    fontSize: '0.75rem',
  },
}));

const EngineerManagement = ({ engineers, setEngineers }) => {
  const handleToggle = (id) => {
    setEngineers(engineers.map(eng =>
      eng.id === id ? { ...eng, active: !eng.active } : eng
    ));
  };

  const renderTable = (data, columns, renderRow, emptyMessage) => (
    data.length === 0 ? (
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ py: 4, fontSize: { xs: '0.9rem', sm: '1rem' }, animation: 'fadeIn 0.5s ease-out' }}
      >
        {emptyMessage}
      </Typography>
    ) : (
      <StyledTableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#E8F5E9' }}>
              {columns.map((column) => (
                <StyledTableCell key={column} sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                  {column}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(renderRow)}
          </TableBody>
        </Table>
      </StyledTableContainer>
    )
  );

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', p: 0, m: 0, bgcolor: '#F1FFE0' }}>
      <StyledCard>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: '#2E7D32',
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              animation: 'fadeIn 0.5s ease-out',
            }}
          >
            Engineers Management
          </Typography>
          {renderTable(
            engineers,
            ['Name', 'Location', 'Phone', 'Status', 'Toggle'],
            (eng, index) => (
              <TableRow
                key={eng.id}
                hover
                sx={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                  transition: 'background-color 0.3s ease',
                  '&:hover': { backgroundColor: '#f1f5f9' },
                }}
              >
                <StyledTableCell>{eng.name}</StyledTableCell>
                <StyledTableCell>{eng.location}</StyledTableCell>
                <StyledTableCell>{eng.phone}</StyledTableCell>
                <StyledTableCell>
                  <Chip
                    label={eng.active ? 'Active' : 'Inactive'}
                    sx={{
                      fontWeight: 'bold',
                      px: 1.5,
                      backgroundColor: eng.active ? '#4CAF50' : '#EF4444',
                      color: '#fff',
                      borderRadius: 2,
                      fontSize: '0.75rem',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Switch
                    checked={eng.active}
                    onChange={() => handleToggle(eng.id)}
                    color="success"
                    inputProps={{ 'aria-label': 'toggle engineer status' }}
                  />
                </StyledTableCell>
              </TableRow>
            ),
            'No engineers available.'
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default EngineerManagement;
