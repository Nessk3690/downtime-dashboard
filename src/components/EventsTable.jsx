import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import client from '../api'
import dayjs from 'dayjs'
import { buildParams } from '../utils'

// Table column setup
const columns = [
  { field: 'id', headerName: 'id', width: 80 },
  { field: 'line', headerName: 'line', width: 160 },
  { field: 'machine', headerName: 'machine', width: 180 },
  { field: 'category', headerName: 'category', width: 220 },
  { field: 'subcategory', headerName: 'subcategory', width: 220 },
  { field: 'code', headerName: 'code', width: 140 },
  {
    field: 'start_time',
    headerName: 'start epoch',
    width: 180,
    valueGetter: (v, row) =>
      row.start_time ? dayjs(row.start_time).format('M/D/YYYY, h:mm:ss A') : '—',
  },
  {
    field: 'end_time',
    headerName: 'closeout epoch',
    width: 180,
    valueGetter: (v, row) =>
      row.end_time ? dayjs(row.end_time).format('M/D/YYYY, h:mm:ss A') : '—',
  },
]

export default function EventsTable({ filters }) {
  const [rows, setRows] = useState([])
  const [rowCount, setRowCount] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [loading, setLoading] = useState(false)

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0)
  }, [filters])

  // Load events from backend
  useEffect(() => {
    const query = buildParams({
      start: filters.start,
      end: filters.end,
      line: filters.line,
      machine: filters.machine,
      category: filters.category,
      subcategory: filters.subcategory,
      code: filters.code,
      employee_id: filters.employee_id,
      labour_requested: filters.labour_requested,
      severity: filters.severity,
      page: page + 1,
      limit: pageSize,
    })

    setLoading(true)
    client
      .get(`/events?${query}`)
      .then((res) => {
        const items = res.data?.items || res.data || []
        const normalized = items.map((it) => ({
          id: it.id,
          line: it.line || it.production_line || '',
          machine: it.machine || it.machine_name || '',
          category: it.category || '',
          subcategory: it.subcategory || '',
          code: it.code || '',
          start_time: it.start_time || it.start || it.start_epoch || it.start_dt,
          end_time: it.end_time || it.end || it.closeout_epoch || it.end_dt,
        }))
        setRows(normalized)
        setRowCount(res.data?.total ?? normalized.length)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filters, page, pageSize])

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Events
        </Typography>
        <div style={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={rowCount}
            
