import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, TextField, MenuItem } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import client from '../api'
import { toISO } from '../utils'

const pick = (arr) => (Array.isArray(arr) && arr.length ? arr : [])

export default function Filters({ onChange }) {
  const [start, setStart] = useState(dayjs().subtract(7, 'day').startOf('day'))
  const [end, setEnd] = useState(dayjs().endOf('day'))

  const [lines, setLines] = useState(['All'])
  const [machines, setMachines] = useState(['All'])
  const [categories, setCategories] = useState(['All'])
  const [subcategories, setSubcategories] = useState(['All'])
  const [codes, setCodes] = useState(['All'])
  const [employees, setEmployees] = useState(['All'])
  const [labours, setLabours] = useState(['All'])
  const [severities, setSeverities] = useState(['All'])

  const [line, setLine] = useState('All')
  const [machine, setMachine] = useState('All')
  const [category, setCategory] = useState('All')
  const [subcategory, setSubcategory] = useState('All')
  const [code, setCode] = useState('All')
  const [employee, setEmployee] = useState('All')
  const [labour, setLabour] = useState('All')
  const [severity, setSeverity] = useState('All')

  useEffect(() => {
    client.get('/filters').then(res => {
      const d = res.data || {}
      setLines(['All', ...pick(d.lines)])
      setMachines(['All', ...pick(d.machines)])
      setCategories(['All', ...pick(d.categories)])
      setSubcategories(['All', ...pick(d.subcategories)])
      setCodes(['All', ...pick(d.codes)])
      setEmployees(['All', ...pick(d.employee_ids || d.employees)])
      setLabours(['All', ...pick(d.labour_requested || d.labours || d.labour)])
      setSeverities(['All', ...pick(d.severities || d.severity)])
    }).catch(console.error)
  }, [])

  useEffect(() => {
    onChange({
      start: toISO(start),
      end: toISO(end),
      line,
      machine,
      category,
      subcategory,
      code,
      employee_id: employee,
      labour_requested: labour,
      severity,
    })
  }, [start, end, line, machine, category, subcategory, code, employee, labour, severity])

  const renderSelect = (label, value, setValue, options) => (
    <TextField
      select fullWidth size="small" label={label}
      value={value} onChange={(e)=>setValue(e.target.value)}
    >
      {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
    </TextField>
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <DateTimePicker
                label="Start"
                value={start}
                onChange={setStart}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DateTimePicker
                label="End"
                value={end}
                onChange={setEnd}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>{renderSelect('Line', line, setLine, lines)}</Grid>
            <Grid item xs={12} sm={6} md={2}>{renderSelect('Machine', machine, setMachine, machines)}</Grid>
            <Grid item xs={12} sm={6} md={2}>{renderSelect('Category', category, setCategory, categories)}</Grid>
            <Grid item xs={12} sm={6} md={2}>{renderSelect('Subcategory', subcategory, setSubcategory, subcategories)}</Grid>
            <Grid item xs={12} sm={6} md={2}>{renderSelect('Code', code, setCode, codes)}</Grid>
            <Grid item xs={12} sm={6} md={2}>{renderSelect('Employee ID', employee, setEmployee, employees)}</Grid>
            <Grid item xs={12} sm={6} md={2}>{renderSelect('Labour Requested', labour, setLabour, labours)}</Grid>
            <Grid item xs={12} sm={6} md={2}>{renderSelect('Severity', severity, setSeverity, severities)}</Grid>
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}
