// components/SwapCasesList.tsx
"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { format, differenceInDays } from 'date-fns';

interface SwapCase {
  id: string;
  pilotRequesterId: string;
  pilotSwapId: string;
  flightNumber: string;
  flightDate: string;
  routeIATA: string;
  approvalStages: boolean[]; // [etapa 1, etapa 2, etapa 3]
  createdAt: string;
  closedAt?: string;
  status: 'open' | 'closed';
}

const FilterBar: React.FC<{
  filterRoute: string;
  setFilterRoute: (value: string) => void;
  filterStart: string;
  setFilterStart: (value: string) => void;
  filterEnd: string;
  setFilterEnd: (value: string) => void;
}> = ({ filterRoute, setFilterRoute, filterStart, setFilterStart, filterEnd, setFilterEnd }) => (
  <Paper sx={{ p: 2, mb: 4, borderRadius: 2, boxShadow: 3 }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={4}>
        <TextField
          label="Ruta (IATA)"
          variant="outlined"
          fullWidth
          value={filterRoute}
          onChange={(e) => setFilterRoute(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Desde"
          variant="outlined"
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filterStart}
          onChange={(e) => setFilterStart(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Hasta"
          variant="outlined"
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filterEnd}
          onChange={(e) => setFilterEnd(e.target.value)}
        />
      </Grid>
    </Grid>
  </Paper>
);

const ApprovalProgress: React.FC<{ stages: boolean[] }> = ({ stages }) => (
  <Box display="flex" alignItems="center">
    {stages.map((approved, index) => (
      <Box key={index} display="flex" alignItems="center">
        {approved ? (
          <CheckCircleIcon sx={{ fontSize: '1.5rem', color: '#4a286f' }} />
        ) : (
          <RadioButtonUncheckedIcon sx={{ fontSize: '1.5rem', color: 'gray' }} />
        )}
        {index < stages.length - 1 && (
          <Box
            sx={{
              width: 40,
              height: 3,
              backgroundColor: 'lightgray',
              mx: 1,
              borderRadius: 1,
            }}
          />
        )}
      </Box>
    ))}
  </Box>
);

const SwapCasesList: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [filterRoute, setFilterRoute] = useState<string>('');
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');
  const [casesData, setCasesData] = useState<SwapCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/cases/cases');
        if (!response.ok) {
          throw new Error('Error fetching cases');
        }
        const data = await response.json();
        // Mapear la data recibida de la API a nuestro formato SwapCase
        const mappedData = data.map((item: any) => ({
          id: item.request_id,
          pilotRequesterId: item.requesting_pilot_name.trim(),
          pilotSwapId: item.target_pilot_name.trim(),
          flightNumber: String(item.flight_number),
          flightDate: item.flight_date, // se asume formato yyyy-MM-dd
          routeIATA: `${item.departure_airport}-${item.arrival_airport}`,
          // Como no tenemos detalle de las etapas, se asigna un arreglo dummy:
          approvalStages: item.status === "0" ? [false, false, false] : [true, true, true],
          createdAt: item.created_at,
          closedAt: item.status === "0" ? undefined : item.updated_at,
          status: item.status === "0" ? 'open' : 'closed',
        }));
        setCasesData(mappedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const filteredCases = casesData.filter(c => {
    if (filterRoute && !c.routeIATA.toLowerCase().includes(filterRoute.toLowerCase())) {
      return false;
    }
    const flightDate = new Date(c.flightDate);
    if (filterStart && flightDate < new Date(filterStart)) return false;
    if (filterEnd && flightDate > new Date(filterEnd)) return false;
    return true;
  });

  const openCases = filteredCases.filter(c => c.status === 'open');
  const closedCasesRecent = filteredCases.filter(c => {
    if (c.status !== 'closed' || !c.closedAt) return false;
    const closedDate = new Date(c.closedAt);
    const diffDays = differenceInDays(new Date(), closedDate);
    return diffDays <= 30;
  });
  const historyCases = filteredCases.filter(c => {
    if (c.status !== 'closed' || !c.closedAt) return false;
    const closedDate = new Date(c.closedAt);
    const diffDays = differenceInDays(new Date(), closedDate);
    return diffDays > 30;
  });

  const renderOpenCaseItem = (swapCase: SwapCase) => (
    <Paper key={swapCase.id} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4a286f' }}>
            {swapCase.flightNumber} - {swapCase.routeIATA}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Piloto Solicitante: {swapCase.pilotRequesterId} | Piloto de Cambio: {swapCase.pilotSwapId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fecha de Vuelo: {format(new Date(swapCase.flightDate), 'dd/MM/yyyy')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} container alignItems="center" justifyContent="center">
          <ApprovalProgress stages={swapCase.approvalStages} />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderClosedCaseItem = (swapCase: SwapCase) => {
    const isApproved = swapCase.approvalStages.every(stage => stage === true);
    return (
      <Accordion key={swapCase.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${swapCase.id}-content`}
          id={`panel-${swapCase.id}-header`}
          sx={{
            backgroundColor: isApproved
              ? 'rgba(76, 175, 80, 0.1)'
              : 'rgba(244, 67, 54, 0.1)',
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4a286f' }}>
                {swapCase.flightNumber} - {swapCase.routeIATA}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Piloto Solicitante: {swapCase.pilotRequesterId} | Piloto de Cambio: {swapCase.pilotSwapId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha de Vuelo: {format(new Date(swapCase.flightDate), 'dd/MM/yyyy')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} container alignItems="center" justifyContent="center">
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Cerrado el {swapCase.closedAt ? format(new Date(swapCase.closedAt), 'dd/MM/yyyy') : ''}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Estado: {isApproved ? 'Cerrado y Aprobado' : 'Cerrado y No Aprobado'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Fecha de Creación: {format(new Date(swapCase.createdAt), 'dd/MM/yyyy, HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Etapas de Aprobación:
              </Typography>
              <ApprovalProgress stages={swapCase.approvalStages} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderCaseItem = (swapCase: SwapCase) =>
    swapCase.status === 'open'
      ? renderOpenCaseItem(swapCase)
      : renderClosedCaseItem(swapCase);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, p: 2 }}>
      <FilterBar
        filterRoute={filterRoute}
        setFilterRoute={setFilterRoute}
        filterStart={filterStart}
        setFilterStart={setFilterStart}
        filterEnd={filterEnd}
        setFilterEnd={setFilterEnd}
      />
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab label="Casos Abiertos" />
          <Tab label="Casos Cerrados" />
          <Tab label="Historial" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {tab === 0 && (
            <Box>
              {openCases.length > 0 ? (
                openCases.map(renderCaseItem)
              ) : (
                <Typography align="center" variant="body1" color="text.secondary">
                  No hay casos abiertos.
                </Typography>
              )}
            </Box>
          )}
          {tab === 1 && (
            <Box>
              {closedCasesRecent.length > 0 ? (
                closedCasesRecent.map(renderCaseItem)
              ) : (
                <Typography align="center" variant="body1" color="text.secondary">
                  No hay casos cerrados en el último mes.
                </Typography>
              )}
            </Box>
          )}
          {tab === 2 && (
            <Box>
              {historyCases.length > 0 ? (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: '#4a286f' }}>
                    Historial de Casos ({historyCases.length})
                  </Typography>
                  {historyCases.map(renderCaseItem)}
                  <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
                    Estos casos fueron cerrados hace más de 30 días.
                  </Typography>
                </>
              ) : (
                <Typography align="center" variant="body1" color="text.secondary">
                  No hay casos en el historial.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SwapCasesList;
