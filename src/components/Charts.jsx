import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const chartFields = ["line", "machine", "category", "subcategory", "code"];

export default function Charts({ filters }) {
  const [data, setData] = useState({});

  useEffect(() => {
    chartFields.forEach((field) => {
      axios
        .get(`http://10.0.0.134:8000/charts?group_by=${field}`, {
          params: filters,
        })
        .then((res) => {
          setData((prev) => ({ ...prev, [field]: res.data }));
        });
    });
  }, [filters]);

  return (
    <Grid container spacing={4}>
      {chartFields.map((field) => (
        <Grid item xs={12} md={6} key={field}>
          <Typography variant="h6" align="center" gutterBottom>
            By {field.charAt(0).toUpperCase() + field.slice(1)}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data[field] || []}>
              <XAxis dataKey="group_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2196f3" name="Count" />
              <Bar dataKey="minutes" fill="#ff9800" name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      ))}
    </Grid>
  );
}
