import React, { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";
import axios from "axios";

export default function Filters({ onFilterChange }) {
  const [options, setOptions] = useState({
    lines: [],
    machines: [],
    categories: [],
    subcategories: [],
    codes: [],
  });

  const [filters, setFilters] = useState({});

  useEffect(() => {
    axios.get("http://10.0.0.134:8000/filters").then((res) => {
      setOptions(res.data);
    });
  }, []);

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Grid container spacing={2}>
      {["line", "machine", "category", "subcategory", "code"].map((field) => (
        <Grid item xs={12} sm={6} md={2} key={field}>
          <TextField
            select
            fullWidth
            SelectProps={{ native: true }}
            label={field}
            value={filters[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
          >
            <option value="">All</option>
            {options[field + "s"]?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </TextField>
        </Grid>
      ))}
    </Grid>
  );
}
