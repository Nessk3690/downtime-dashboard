import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from "@mui/material";

export default function EventsTable({ filters }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(filters).toString();
    axios.get(`http://10.0.0.134:8000/events?${query}`).then((res) => {
      setEvents(res.data);
    });
  }, [filters]);

  return (
    <Paper style={{ marginTop: "20px", padding: "10px" }}>
      <Typography variant="h6" gutterBottom>
        Events
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Line</TableCell>
            <TableCell>Machine</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Subcategory</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Minutes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>{event.line}</TableCell>
              <TableCell>{event.machine}</TableCell>
              <TableCell>{event.category}</TableCell>
              <TableCell>{event.subcategory}</TableCell>
              <TableCell>{event.code}</TableCell>
              <TableCell>{event.minutes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
