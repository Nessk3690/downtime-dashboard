// ~/downtime-dashboard/downtime_frontend/src/components/ChartsSection.jsx

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api";

function ChartCard({ title, groupBy, filters, start, end }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const params = { group_by: groupBy, ...filters };
        if (start) params.start = start.toISOString();
        if (end) params.end = end.toISOString();

        const res = await api.get("/charts", { params });
        setData(res.data.data);
      } catch (err) {
        console.error(`Failed to load chart for ${groupBy}:`, err);
      }
    };
    fetchChart();
  }, [filters, start, end, groupBy]);

  return (
    <Box sx={{ flex: 1, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default function ChartsSection({ filters, start, end }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <ChartCard title="By Line" groupBy="line" filters={filters} start={start} end={end} />
      <ChartCard title="By Machine" groupBy="machine" filters={filters} start={start} end={end} />
      <ChartCard title="By Code" groupBy="code" filters={filters} start={start} end={end} />
    </Box>
  );
}
