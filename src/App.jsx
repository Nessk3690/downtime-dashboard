import React, { useState } from "react";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import Filters from "./components/Filters";
import Charts from "./components/Charts";
import EventsTable from "./components/EventsTable";

export default function App() {
  const [filters, setFilters] = useState({});

  return (
    <Container maxWidth="xl" style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Downtime Dashboard
      </Typography>

      {/* Filters */}
      <Card style={{ marginBottom: "20px" }}>
        <CardContent>
          <Filters onFilterChange={setFilters} />
        </CardContent>
      </Card>

      {/* Charts */}
      <Card style={{ marginBottom: "20px" }}>
        <CardContent>
          <Charts filters={filters} />
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent>
          <EventsTable filters={filters} />
        </CardContent>
      </Card>
    </Container>
  );
}
