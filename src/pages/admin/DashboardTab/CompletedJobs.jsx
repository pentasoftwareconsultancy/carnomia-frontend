import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  useMediaQuery,
  Avatar,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FiTool, FiUser, FiCalendar, FiDownload } from 'react-icons/fi';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  width: '100%',
  margin: 0,
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(1.5)
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  backgroundColor: '#f8fafc',
  overflowX: 'auto',
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(1)
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(1.5),
  textAlign: 'center',
  verticalAlign: 'middle',
  color: '#333',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: '0.8125rem'
  }
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  padding: theme.spacing(0.75, 1.5),
  textTransform: 'none',
  backgroundColor: '#4CAF50',
  color: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  whiteSpace: 'nowrap',
  minWidth: 'fit-content',
  '&:hover': {
    backgroundColor: '#388E3C'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1),
    fontSize: '0.75rem'
  }
}));

const CompletedJobs = ({ requests }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  const renderTable = (data, columns, renderRow, emptyMessage) => (
    data.length === 0 ? (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: '8px',
        my: 2
      }}>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    ) : (
      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: isMobile ? '700px' : '100%' }}>
          <TableHead sx={{ backgroundColor: '#E8F5E9' }}>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column} sx={{ fontWeight: 700, color: '#2E7D32' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 0 : 1
                  }}>
                    {column === 'Job ID' && <FiTool size={14} />}
                    {column === 'Customer' && <FiUser size={14} />}
                    {column === 'Engineer' && <FiUser size={14} />}
                    {column === 'Date' && <FiCalendar size={14} />}
                    {isMobile ? column.split(' ')[0] : column}
                  </Box>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((r) => (
              <TableRow key={r.id}>
                <StyledTableCell sx={{ fontWeight: 600 }}>
                  {r.bookingId}
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isMobile ? r.customerName.split(' ')[0] : r.customerName}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isMobile ? r.assignedEngineer.split(' ')[0] : r.assignedEngineer}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>{r.date}</StyledTableCell>
                <StyledTableCell>{r.slot || 'N/A'}</StyledTableCell>
                <StyledTableCell>
                  <DownloadButton
                    size="small"
                    startIcon={!isMobile && <FiDownload size={14} />}
                    onClick={() => alert(`Downloading report for ${r.bookingId}`)}
                  >
                    {isMobile ? 'Report' : 'Download Report'}
                  </DownloadButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    )
  );

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 }, bgcolor: '#F1FFE0' }}>
      <StyledCard>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: '#2E7D32',
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              mb: 2
            }}
          >
            Completed Jobs
          </Typography>
          
          {renderTable(
            requests.filter(r => r.status === 'completed'),
            ['Job ID', 'Customer', 'Engineer', 'Date', 'Slot', 'Actions'],
            (r) => (
              <React.Fragment key={r.id}>
                <StyledTableCell sx={{ fontWeight: 600 }}>{r.bookingId}</StyledTableCell>
                <StyledTableCell>{r.customerName}</StyledTableCell>
                <StyledTableCell>{r.assignedEngineer}</StyledTableCell>
                <StyledTableCell>{r.date}</StyledTableCell>
                <StyledTableCell>{r.slot || 'N/A'}</StyledTableCell>
                <StyledTableCell>
                  <DownloadButton
                    size="small"
                    onClick={() => alert(`Downloading report for ${r.bookingId}`)}
                  >
                    Report
                  </DownloadButton>
                </StyledTableCell>
              </React.Fragment>
            ),
            'No completed jobs available.'
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default CompletedJobs;