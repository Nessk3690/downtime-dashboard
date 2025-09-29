// ~/downtime-dashboard/downtime_frontend/src/components/Filters.jsx

import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import api from "../api";

export default function Filters({ filters, setFilters, start, setStart, end, setEnd }) {
  const [options, setOptions] = useState({
    lines: [],
    machines: [],
    categories: [],
    subcategories: [],
    codes: [],
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await api.get("/filters", { params: filters });
        setOptions(res.data);
      } catch (err) {
        console.error("Failed to load filters:", err);
      }
    };
    fetchFilters();
  }, [filters]);

  const handleChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value || undefined });
  };

  const handleClear = () => {
    setFilters({});
    setStart(null);
    setEnd(null);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      <Select
        value={filters.line || ""}
        onChange={handleChange("line")}
        displayEmpty
      >
        <MenuItem value="">Line</MenuItem>
        {options.lines.map((l) => (
          <MenuItem key={l} value={l}>{l}</MenuItem>
        ))}
      </Select>

      <Select
        value={filters.machine || ""}
        onChange={handleChange("machine")}
        displayEmpty
      >
        <MenuItem value="">Machine</MenuItem>
        {options.machines.map((m) => (
          <MenuItem key={m} value={m}>{m}</MenuItem>
        ))}
      </Select>

      <Select
        value={filters.category || ""}
        onChange={handleChange("category")}
        displayEmpty
      >
        <MenuItem value="">Category</MenuItem>
        {options.categories.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </Select>

      <Select
        value={filters.subcategory || ""}
        onChange={handleChange("subcategory")}
        displayEmpty
      >
        <MenuItem value="">Subcategory</MenuItem>
        {options.subcategories.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>

      <Select
        value={filters.code || ""}
        onChange={handleChange("code")}
        displayEmpty
      >
        <MenuItem value="">Code</MenuItem>
        {options.codes.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </Select>

      <TextField
        type="datetime-local"
        label="Start"
        value={start ? start.toISOString().slice(0, 16) : ""}
        onChange={(e) => setStart(new Date(e.target.value))}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type="datetime-local"
        label="End"
        value={end ? end.toISOString().slice(0, 16) : ""}
        onChange={(e) => setEnd(new Date(e.target.value))}
        InputLabelProps={{ shrink: true }}
      />

      <Button onClick={handleClear} variant="outlined">
        Clear Filters
      </Button>
    </Box>
  );
}
