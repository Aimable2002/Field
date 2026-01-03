// lib/api.ts
const API_BASE = '/api/performance';

export const api = {
  // Week Configuration
  getWeeklyConfig: () => fetch(`${API_BASE}/config/weekly`).then(res => res.json()),
  getWeekConfig: (week: number) => fetch(`${API_BASE}/config/weekly/${week}`).then(res => res.json()),

  // Week Outcomes
  getWeeklyOutcomes: () => fetch(`${API_BASE}/outcomes`).then(res => res.json()),
  getWeekOutcome: (week: number) => fetch(`${API_BASE}/outcomes/week/${week}`).then(res => res.json()),
  updateWeekOutcome: (id: string, data: any) => 
    fetch(`${API_BASE}/outcomes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  
  createWeekOutcome: (data: any) =>
    fetch(`${API_BASE}/outcomes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // Performance Metrics
  getPerformanceMetrics: () => fetch(`${API_BASE}/metrics`).then(res => res.json()),
  updateMetric: (id: string, data: any) =>
    fetch(`${API_BASE}/metrics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // Metric Outcomes
  getMetricOutcomes: (month?: number, year?: number) => {
    let url = `${API_BASE}/metric-outcomes`;
    if (month && year) {
      url = `${API_BASE}/metric-outcomes/${month}/${year}`;
    }
    return fetch(url).then(res => res.json());
  },
  updateMetricOutcomes: (data: any) =>
    fetch(`${API_BASE}/metric-outcomes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // Events
  getEvents: (week?: number, type?: string) => {
    let url = `${API_BASE}/events`;
    const params = new URLSearchParams();
    if (week) params.append('week', week.toString());
    if (type) params.append('type', type);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    return fetch(url).then(res => res.json());
  },
  createEvent: (data: any) =>
    fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  updateEvent: (id: string, data: any) =>
    fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  deleteEvent: (id: string) =>
    fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE'
    }).then(res => res.json()),

  // App Configuration
  getCurrentWeek: () => fetch(`${API_BASE}/config/app/currentWeek`).then(res => res.json()),
  updateCurrentWeek: (week: number) =>
    fetch(`${API_BASE}/config/app/currentWeek`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: week })
    }).then(res => res.json()),

  // Summary and Charts
  getWeeklySummary: (week: number) => fetch(`${API_BASE}/summary/week/${week}`).then(res => res.json()),
  getWeeklyChartData: () => fetch(`${API_BASE}/charts/weekly`).then(res => res.json()),
  getTriggersChartData: () => fetch(`${API_BASE}/charts/triggers`).then(res => res.json()),
  getDashboardOverview: () => fetch(`${API_BASE}/dashboard/overview`).then(res => res.json()),

  // Initialize Data (for first-time setup)
  initializeData: (data: any) =>
    fetch(`${API_BASE}/bulk/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  
  // Reset Week
  resetWeekData: (week: number) =>
    fetch(`${API_BASE}/bulk/reset/${week}`, {
      method: 'POST'
    }).then(res => res.json()),
};

export type EventNote = {
  id: string;
  week: number;
  type: 'field-visit' | 'meeting' | 'campaign' | 'feedback';
  title: string;
  description: string;
  outcome: 'positive' | 'neutral' | 'negative';
  date: string;
};

export type WeekOutcomeData = {
  _id: string;
  week: number;
  status: 'pending' | 'in-progress' | 'completed' | 'on-track' | 'at-risk' | 'failed';
  outcomes: Array<{
    label: string;
    actual: any;
    completed: boolean;
  }>;
  triggerOutcomes: Array<{
    triggered: boolean;
    notes?: string;
  }>;
  notes: string;
};

export type WeekConfig = {
  week: number;
  title: string;
  focus: string;
  targets: Array<{
    label: string;
    target: number | string;
  }>;
  actions: string[];
  decisionTriggers: Array<{
    condition: string;
    action: string;
  }>;
  isActive: boolean;
};

export type PerformanceMetric = {
  _id: string;
  label: string;
  target: number;
  icon: string;
  unit?: string;
  order: number;
  isActive: boolean;
};

export type MetricOutcome = {
  _id: string;
  label: string;
  actual: number;
  metricId: string;
  month: number;
  year: number;
};