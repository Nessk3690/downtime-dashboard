import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import axios from "axios";

export default function EventsTable({ filters }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://10.0.0.134:8000/events", { params: filters }).then((res) => {
      setEvents(res.data);
    });
  }, [filters]);

  return (
    <Table size="small">
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
        {events.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{e.id}</TableCell>
            <TableCell>{e.line}</TableCell>
            <TableCell>{e.machine}</TableCell>
            <TableCell>{e.category}</TableCell>
            <TableCell>{e.subcategory}</TableCell>
            <TableCell>{e.code}</TableCell>
            <TableCell>{e.minutes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
