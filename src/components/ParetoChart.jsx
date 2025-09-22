import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList,
} from 'recharts'
import client from '../api'
import { buildParams, humanMinutes } from '../utils'

// Custom label for minutes bar
function MinutesLabel({ x, y, width, value }) {
  if (value === undefined || value === null) return null
  const cx = x + width / 2
  const cy = y - 6
  return (
    <text x={cx} y={cy} fontSize={12} textAnchor="middle">
      {humanMinutes(value)}
    </text>
  )
}

export default function ParetoChart({ title, groupBy, filters }) {
  const [data, setData] = useState([])

  useEffect(() => {
    const query = buildParams({
      start: filters.start, end: filters.end,
      line: filters.line, machine: filters.machine,
      category: filters.category, subcategory: filters.subcategory,
      code: filters.code, employee_id: filters.employee_id,
      labour_requested: filters.labour_requested, severity: filters.severity,
      group_by: groupBy,
    })
    client.get(`/charts?${query}`).then(res => {
      const rows = (res.data?.data || []).map(r => ({
        name: r.key,
        events: Number(r.events || r.count || 0),
        minutes: Number(r.total_minutes || r.minutes || 0),
      }))
      setData(rows)
    }).catch(console.error)
  }, [filters, groupBy])

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>{title}</Typography>
        <Box sx={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-15}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="events" name="Count" maxBarSize={28} />
              <Bar yAxisId="right" dataKey="minutes" name="Minutes" maxBarSize={28}>
                <LabelList dataKey="minutes" content={<MinutesLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}
