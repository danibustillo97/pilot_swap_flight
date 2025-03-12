// components/SwapCasesList.tsx
"use client";
import React, { useState } from 'react';
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

// Datos de prueba simulados (10 casos)
// Algunos casos cerrados tienen fechas recientes (dentro de los últimos 30 días) y otros antiguos (para historial).
const sampleCases: SwapCase[] = [
  {
    id: '1',
    pilotRequesterId: '12345',
    pilotSwapId: '67890',
    flightNumber: 'AA123',
    flightDate: '2025-04-20',
    routeIATA: 'SDQ-KIN-SDQ',
    approvalStages: [true, false, false],
    createdAt: '2025-04-15T10:00:00Z',
    status: 'open',
  },
  {
    id: '2',
    pilotRequesterId: '54321',
    pilotSwapId: '09876',
    flightNumber: 'BB456',
    flightDate: '2025-04-21',
    routeIATA: 'KIN-SDQ-KIN',
    approvalStages: [true, true, true],
    createdAt: '2025-03-20T09:00:00Z',
    closedAt: '2025-04-05T12:00:00Z', // Cerrado reciente
    status: 'closed',
  },
  {
    id: '3',
    pilotRequesterId: '11111',
    pilotSwapId: '22222',
    flightNumber: 'CC789',
    flightDate: '2025-04-22',
    routeIATA: 'SDQ-KIN-SDQ',
    approvalStages: [true, true, false],
    createdAt: '2025-02-10T11:00:00Z',
    closedAt: '2025-04-03T15:00:00Z', // Cerrado reciente
    status: 'closed',
  },
  {
    id: '4',
    pilotRequesterId: '33333',
    pilotSwapId: '44444',
    flightNumber: 'DD101',
    flightDate: '2025-05-01',
    routeIATA: 'NYC-LAX-NYC',
    approvalStages: [false, false, false],
    createdAt: '2025-04-25T08:00:00Z',
    status: 'open',
  },
  {
    id: '5',
    pilotRequesterId: '55555',
    pilotSwapId: '66666',
    flightNumber: 'EE202',
    flightDate: '2025-04-25',
    routeIATA: 'LAX-SFO-LAX',
    approvalStages: [true, true, true],
    createdAt: '2025-04-20T07:00:00Z',
    closedAt: '2025-04-08T10:00:00Z', // Cerrado reciente
    status: 'closed',
  },
  {
    id: '6',
    pilotRequesterId: '77777',
    pilotSwapId: '88888',
    flightNumber: 'FF303',
    flightDate: '2025-04-18',
    routeIATA: 'CHI-MIA-CHI',
    approvalStages: [true, false, false],
    createdAt: '2025-04-15T11:00:00Z',
    status: 'open',
  },
  {
    id: '7',
    pilotRequesterId: '99999',
    pilotSwapId: '10101',
    flightNumber: 'GG404',
    flightDate: '2025-03-15',
    routeIATA: 'LON-PAR-LON',
    approvalStages: [true, true, true],
    createdAt: '2025-03-10T10:00:00Z',
    closedAt: '2022-03-16T14:00:00Z', // Histórico
    status: 'closed',
  },
  {
    id: '8',
    pilotRequesterId: '12121',
    pilotSwapId: '13131',
    flightNumber: 'HH505',
    flightDate: '2025-02-20',
    routeIATA: 'BER-MAD-BER',
    approvalStages: [true, true, true],
    createdAt: '2025-02-15T09:00:00Z',
    closedAt: '2022-02-21T16:00:00Z', // Histórico
    status: 'closed',
  },
  {
    id: '9',
    pilotRequesterId: '14141',
    pilotSwapId: '15151',
    flightNumber: 'II606',
    flightDate: '2025-05-05',
    routeIATA: 'SYD-AKL-SYD',
    approvalStages: [true, false, false],
    createdAt: '2025-04-30T08:00:00Z',
    status: 'open',
  },
  {
    id: '10',
    pilotRequesterId: '16161',
    pilotSwapId: '17171',
    flightNumber: 'JJ707',
    flightDate: '2025-04-10',
    routeIATA: 'TOK-SEO-TOK',
    approvalStages: [true, true, false],
    createdAt: '2025-04-05T10:00:00Z',
    closedAt: '2025-04-09T12:00:00Z', // Cerrado reciente
    status: 'closed',
  },
];

// Componente para la barra de aprobación
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

// Componente de filtros (sin título)
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

const SwapCasesList: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [filterRoute, setFilterRoute] = useState<string>('');
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // Aplicar filtros
  const filteredCases = sampleCases.filter(c => {
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
      {/* Barra de filtros */}
      <FilterBar
        filterRoute={filterRoute}
        setFilterRoute={setFilterRoute}
        filterStart={filterStart}
        setFilterStart={setFilterStart}
        filterEnd={filterEnd}
        setFilterEnd={setFilterEnd}
      />
      {/* Tabs */}
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
      {/* Lista de Casos */}
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
    </Box>
  );
};

export default SwapCasesList;
