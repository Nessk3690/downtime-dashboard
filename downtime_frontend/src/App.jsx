// ~/downtime-dashboard/downtime_frontend/src/App.jsx

import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import Filters from "./components/Filters";
import ChartsSection from "./components/ChartsSection";
import EventsTable from "./components/EventsTable";

export default function App() {
  const [filters, setFilters] = useState({});
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Downtime Dashboard 🟢
      </Typography>

      <Filters
        filters={filters}
        setFilters={setFilters}
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
      />

      <ChartsSection filters={filters} start={start} end={end} />

      <EventsTable filters={filters} start={start} end={end} />
    </Container>
  );
}
