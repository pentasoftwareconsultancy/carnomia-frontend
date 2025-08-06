import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ApiService from '../../../core/services/api.service';
import ServerUrl from '../../../core/constants/serverUrl.constant';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
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
  fontSize: '0.9rem',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#000000',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
    fontSize: '0.75rem',
  },
}));

const EngineerManagement = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);


  useEffect(() => {
    const fetchEngineers = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const response = await new ApiService().apiget(
          `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/engineer`
        );
        console.log('Engineers fetched:', response?.data);
        const fetched = response?.data?.data || [];

        // Normalize: ensure active exists (default true) and keep city fallback
        const normalized = fetched.map((eng) => ({
          ...eng,
          active: typeof eng.active === 'boolean' ? eng.active : true,
        }));
        setEngineers(normalized);
      } catch (err) {
        console.error('Failed to fetch engineers', err);
        setErrorMsg('Failed to load engineers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  const handleToggle = async (engineerId) => {
    // Optimistic update: toggle locally first
    setEngineers((prev) =>
      prev.map((eng) =>
        eng._id === engineerId || eng.id === engineerId
          ? { ...eng, active: !eng.active, _updating: true }
          : eng
      )
    );

    try {
      // Use latest state to determine current target
      let target;
      setEngineers((prev) => {
        target = prev.find(
          (e) => e._id === engineerId || e.id === engineerId
        );
        return prev;
      });

      if (!target) throw new Error('Engineer not found');

      const newStatus = !target.active;
      await apiService.apipatch(
        `${ServerUrl.API_UPDATE_USER}/${engineerId}`,
        { active: newStatus }
      );

      // Finalize state
      setEngineers((prev) =>
        prev.map((eng) =>
          eng._id === engineerId || eng.id === engineerId
            ? { ...eng, active: newStatus, _updating: false }
            : eng
        )
      );
    } catch (err) {
      console.error('Failed to toggle engineer status', err);
      // Revert _updating flag (leave original active as-is since optimistic may have flipped)
      setEngineers((prev) =>
        prev.map((eng) =>
          eng._id === engineerId || eng.id === engineerId
            ? { ...eng, _updating: false }
            : eng
        )
      );
      setErrorMsg('Could not update status. Please try again.');
    }
  };

  const renderTable = (
    data,
    columns,
    renderRow,

  ) => {
    const emptyMessage = 'No data available.';

    if (!data || data.length === 0) {
      return (
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{
            py: 4,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          {emptyMessage}
        </Typography>
      );
    }

    return (
      <StyledTableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#E8F5E9' }}>
              {columns.map((col) => (
                <StyledTableCell
                  key={col}
                  sx={{ fontWeight: 'bold', color: '#2E7D32' }}
                >
                  {col}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{data.map(renderRow)}</TableBody>
        </Table>
      </StyledTableContainer>
    );
  };

  return (
    <Box sx={{ width: '100%', p: 0, bgcolor: '#F1FFE0' }}>
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

          {errorMsg && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setErrorMsg(null)}
            >
              {errorMsg}
            </Alert>
          )}

          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 6,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            renderTable(
              engineers,
              ['Name', 'Location', 'Phone', 'Status', 'Toggle'],
              (eng, index) => {
                const uniqueKey = eng._id || eng.id || index;
                const isActive = !!eng.active;
                const isUpdating = !!eng._updating;

                return (
                  <TableRow
                    key={uniqueKey}
                    hover
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? '#ffffff' : '#f9fafb',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                  >
                    <StyledTableCell>{eng.name || '-'}</StyledTableCell>
                    <StyledTableCell>
                      {eng.city || eng.location || '-'}
                    </StyledTableCell>
                    <StyledTableCell>{eng.mobile || '-'}</StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={isActive ? 'Active' : 'Inactive'}
                        sx={{
                          fontWeight: 'bold',
                          px: 1.5,
                          backgroundColor: isActive
                            ? '#4CAF50'
                            : '#EF4444',
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
                        checked={isActive}
                        onChange={() =>
                          handleToggle(eng._id || eng.id || '')
                        }
                        color="success"
                        disabled={isUpdating}
                        inputProps={{
                          'aria-label': 'toggle engineer status',
                        }}
                      />
                    </StyledTableCell>
                  </TableRow>
                );
              },
              'No engineers available.'
            )
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default EngineerManagement;
