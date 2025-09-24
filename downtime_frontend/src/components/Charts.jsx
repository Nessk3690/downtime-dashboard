import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import ParetoChart from './ParetoChart'

export default function Charts({ filters }) {
  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Pareto Charts</Typography>
        </CardContent>
      </Card>

      <ParetoChart title="By Line" groupBy="line" filters={filters} />
      <ParetoChart title="By Machine" groupBy="machine" filters={filters} />
      <ParetoChart title="By Code" groupBy="code" filters={filters} />
    </>
  )
}
