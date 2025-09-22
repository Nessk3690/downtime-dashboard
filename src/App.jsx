import React, { useState } from 'react'
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import Filters from './components/Filters'
import ChartsSection from './components/ChartsSection'
import EventsTable from './components/EventsTable'

// Light theme with soft background (like your screenshots)
const theme = createTheme({
  palette: {
    background: { default: '#f5f7fb' },
  },
  shape: { borderRadius: 12 },
})

export default function App() {
  const [filters, setFilters] = useState({})

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6">Downtime Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Filters at the top */}
        <Filters onChange={setFilters} />

        {/* Pareto Charts section */}
        <ChartsSection filters={filters} />

        {/* Events table at the bottom */}
        <EventsTable filters={filters} />
      </Container>
    </ThemeProvider>
  )
}
