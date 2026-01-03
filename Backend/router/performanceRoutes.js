import express from 'express'
import performanceController from '../controller/performanceController.js';

const router = express.Router()

// Week configuration CRUD
router.get('/config/weekly', performanceController.getWeeklyConfig);
router.get('/config/weekly/:week', performanceController.getWeekConfig);
router.post('/config/weekly', performanceController.createWeekConfig);
router.put('/config/weekly/:week', performanceController.updateWeekConfig);
router.delete('/config/weekly/:id', performanceController.deleteWeekConfig);

// Week outcomes CRUD
router.get('/outcomes', performanceController.getAllOutcomes);
router.get('/outcomes/week/:week', performanceController.getWeekOutcome);
router.post('/outcomes', performanceController.createWeekOutcome);
router.put('/outcomes/:id', performanceController.updateWeekOutcome);
router.delete('/outcomes/:id', performanceController.deleteWeekOutcome);

// Performance metrics CRUD
router.get('/metrics', performanceController.getPerformanceMetrics);
router.get('/metrics/:id', performanceController.getMetric);
router.post('/metrics', performanceController.createMetric);
router.put('/metrics/:id', performanceController.updateMetric);
router.delete('/metrics/:id', performanceController.deleteMetric);

// Metric outcomes CRUD
router.get('/metric-outcomes', performanceController.getMetricOutcomes);
router.get('/metric-outcomes/:month/:year', performanceController.getMonthlyMetricOutcomes);
router.post('/metric-outcomes', performanceController.updateMetricOutcomes);
router.put('/metric-outcomes/:id', performanceController.updateMetricOutcome);

// Events CRUD
router.get('/events', performanceController.getEvents);
router.get('/events/week/:week', performanceController.getWeekEvents);
router.get('/events/:id', performanceController.getEvent);
router.post('/events', performanceController.createEvent);
router.put('/events/:id', performanceController.updateEvent);
router.delete('/events/:id', performanceController.deleteEvent);

// App configuration
router.get('/config/app/:key', performanceController.getAppConfig);
router.put('/config/app/:key', performanceController.updateAppConfig);

// Summary and analytics
router.get('/summary/week/:week', performanceController.getWeeklySummary);
router.get('/charts/weekly', performanceController.getWeeklyChartData);
router.get('/charts/triggers', performanceController.getTriggersChartData);
router.get('/dashboard/overview', performanceController.getDashboardOverview);

// Bulk operations
router.post('/bulk/init', performanceController.initializeData);
router.post('/bulk/reset/:week', performanceController.resetWeekData);

export default router