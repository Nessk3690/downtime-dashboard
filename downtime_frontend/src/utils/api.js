// ~/downtime-dashboard/downtime_frontend/src/utils/api.js
import axios from "axios";

// 👇 If you keep Django on 9000, leave this.
// If you serve Django elsewhere, update this host:port.
const API_BASE = "http://10.0.0.134:9000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export const getHealth = async () => {
  const res = await api.get("/health");
  return res.data;
};

export const getFilters = async (filters = {}) => {
  const res = await api.get("/filters", { params: filters });
  return res.data;
};

export const getEvents = async ({ page = 1, limit = 25, filters = {}, start, end } = {}) => {
  const params = { page, limit, ...filters };
  if (start) params.start = start;
  if (end) params.end = end;
  const res = await api.get("/events", { params });
  return res.data;
};

export const getCharts = async ({ groupBy = "line", start, end, filters = {} } = {}) => {
  const params = { group_by: groupBy, ...filters };
  if (start) params.start = start;
  if (end) params.end = end;
  const res = await api.get("/charts", { params });
  return res.data;
};
