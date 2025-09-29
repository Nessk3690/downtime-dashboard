// ~/downtime-dashboard/downtime_frontend/src/components/EventsTable.jsx

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress } from "@mui/material";
import api from "../api"; // this points to your src/api.js file

// Helper: convert epoch seconds -> readable string
const formatDate = (epoch) => {
  if (!epoch) return "";
  const d = new Date(epoch * 1000);
  return d.toLocaleString();
};

export default function EventsTable({ filters, start, end }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // DataGrid is 0-based
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: page + 1, // backend expects 1-based
          limit: pageSize,
          ...filters,
        };
        if (start) params.start = start.toISOString();
        if (end) params.end = end.toISOString();

        const res = await api.get("/events", { params });
        setRows(
          res.data.rows.map((row) => ({
            id: row.id,
            line: row.line,
            machine: row.machine,
            category: row.category,
            subcategory: row.subcategory,
            code: row.code,
            start: formatDate(row.start_epoch),
            closeout: formatDate(row.closeout_epoch),
            severity: row.severity,
            comment: row.comment,
          }))
        );
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, start, end, page, pageSize]);

  const columns = [
    { field: "line", headerName: "Line", flex: 1 },
    { field: "machine", headerName: "Machine", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "subcategory", headerName: "Subcategory", flex: 1 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "start", headerName: "Start", flex: 1.5 },
    { field: "closeout", headerName: "Closeout", flex: 1.5 },
    { field: "severity", headerName: "Severity", flex: 1 },
    { field: "comment", headerName: "Comment", flex: 2 },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={total}
          pagination
          paginationMode="server"
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      )}
    </Box>
  );
}
