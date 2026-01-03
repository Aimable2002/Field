import WeekConfig from '../model/WeekConfig.js';
import WeekOutcome from '../model/WeekOutcome.js';
import PerformanceMetric from '../model/PerformanceMetric.js';
import MetricOutcome from '../model/MetricOutcome.js';
import EventNote from '../model/EventNote.js';
import AppConfig from '../model/AppConfig.js';

const performanceController = {
  // Week Configuration CRUD
  getWeeklyConfig: async (req, res) => {
    try {
      const configs = await WeekConfig.find().sort({ week: 1 });
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getWeekConfig: async (req, res) => {
    try {
      const week = req.params.week;
      const config = await WeekConfig.findOne({ week });
      if (!config) return res.status(404).json({ error: 'Week config not found' });
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWeekConfig: async (req, res) => {
    try {
      const config = new WeekConfig(req.body);
      await config.save();
      res.status(201).json(config);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateWeekConfig: async (req, res) => {
    try {
      const week = req.params.week;
      const config = await WeekConfig.findOneAndUpdate(
        { week },
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!config) return res.status(404).json({ error: 'Week config not found' });
      res.json(config);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteWeekConfig: async (req, res) => {
    try {
      const config = await WeekConfig.findByIdAndDelete(req.params.id);
      if (!config) return res.status(404).json({ error: 'Week config not found' });
      res.json({ message: 'Week config deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Week Outcomes CRUD
  getAllOutcomes: async (req, res) => {
    try {
      const outcomes = await WeekOutcome.find().sort({ week: 1 });
      res.json(outcomes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getWeekOutcome: async (req, res) => {
    try {
      const week = req.params.week;
      const outcome = await WeekOutcome.findOne({ week });
      if (!outcome) return res.status(404).json({ error: 'Week outcome not found' });
      res.json(outcome);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWeekOutcome: async (req, res) => {
    try {
      const outcome = new WeekOutcome(req.body);
      await outcome.save();
      res.status(201).json(outcome);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateWeekOutcome: async (req, res) => {
    try {
      const outcome = await WeekOutcome.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!outcome) return res.status(404).json({ error: 'Week outcome not found' });
      res.json(outcome);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteWeekOutcome: async (req, res) => {
    try {
      const outcome = await WeekOutcome.findByIdAndDelete(req.params.id);
      if (!outcome) return res.status(404).json({ error: 'Week outcome not found' });
      res.json({ message: 'Week outcome deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Performance Metrics CRUD
  getPerformanceMetrics: async (req, res) => {
    try {
      const metrics = await PerformanceMetric.find({ isActive: true }).sort({ order: 1 });
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMetric: async (req, res) => {
    try {
      const metric = await PerformanceMetric.findById(req.params.id);
      if (!metric) return res.status(404).json({ error: 'Metric not found' });
      res.json(metric);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createMetric: async (req, res) => {
    try {
      const metric = new PerformanceMetric(req.body);
      await metric.save();
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateMetric: async (req, res) => {
    try {
      const metric = await PerformanceMetric.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!metric) return res.status(404).json({ error: 'Metric not found' });
      res.json(metric);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteMetric: async (req, res) => {
    try {
      const metric = await PerformanceMetric.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
      if (!metric) return res.status(404).json({ error: 'Metric not found' });
      res.json({ message: 'Metric deactivated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Metric Outcomes CRUD
  getMetricOutcomes: async (req, res) => {
    try {
      const { month, year } = req.query;
      const now = new Date();
      const currentMonth = month || now.getMonth() + 1;
      const currentYear = year || now.getFullYear();
      
      const outcomes = await MetricOutcome.find({ 
        month: currentMonth, 
        year: currentYear 
      }).populate('metricId');
      
      res.json(outcomes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMonthlyMetricOutcomes: async (req, res) => {
    try {
      const { month, year } = req.params;
      const outcomes = await MetricOutcome.find({ 
        month: parseInt(month), 
        year: parseInt(year) 
      }).populate('metricId');
      
      res.json(outcomes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateMetricOutcomes: async (req, res) => {
    try {
      const { outcomes, month, year } = req.body;
      
      // Delete existing outcomes for this month/year
      await MetricOutcome.deleteMany({ month, year });
      
      // Create new outcomes
      const newOutcomes = outcomes.map(outcome => ({
        ...outcome,
        month,
        year,
        metricId: outcome.metricId || outcome._id
      }));
      
      const created = await MetricOutcome.insertMany(newOutcomes);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateMetricOutcome: async (req, res) => {
    try {
      const outcome = await MetricOutcome.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!outcome) return res.status(404).json({ error: 'Metric outcome not found' });
      res.json(outcome);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Events CRUD
  getEvents: async (req, res) => {
    try {
      const { week, type } = req.query;
      let query = {};
      if (week) query.week = parseInt(week);
      if (type) query.type = type;
      
      const events = await EventNote.find(query).sort({ date: -1 });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getWeekEvents: async (req, res) => {
    try {
      const events = await EventNote.find({ week: parseInt(req.params.week) }).sort({ date: -1 });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEvent: async (req, res) => {
    try {
      const event = await EventNote.findById(req.params.id);
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createEvent: async (req, res) => {
    try {
      const event = new EventNote(req.body);
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const event = await EventNote.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const event = await EventNote.findByIdAndDelete(req.params.id);
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json({ message: 'Event deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // App Configuration
  getAppConfig: async (req, res) => {
    try {
      const config = await AppConfig.findOne({ key: req.params.key });
      if (!config) return res.status(404).json({ error: 'Config not found' });
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateAppConfig: async (req, res) => {
    try {
      const config = await AppConfig.findOneAndUpdate(
        { key: req.params.key },
        { value: req.body.value, updatedAt: Date.now() },
        { new: true, upsert: true, runValidators: true }
      );
      res.json(config);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Summary and Analytics
  getWeeklySummary: async (req, res) => {
    try {
      const week = parseInt(req.params.week);
      const outcome = await WeekOutcome.findOne({ week });
      
      if (!outcome || outcome.status === 'pending') {
        return res.json({
          worked: [],
          failed: [],
          recommendations: ["Week not yet started - complete previous weeks first"]
        });
      }
      
      if (outcome.status === 'in-progress') {
        const completed = outcome.outcomes.filter(o => o.completed).map(o => `${o.label}: ${o.actual}`);
        const pending = outcome.outcomes.filter(o => !o.completed).map(o => o.label);
        
        return res.json({
          worked: completed.length > 0 ? completed : ["Work in progress..."],
          failed: [],
          recommendations: pending.length > 0 
            ? [`Complete remaining: ${pending.join(", ")}`]
            : ["Review and finalize week outcomes"]
        });
      }
      
      const config = await WeekConfig.findOne({ week });
      let worked = [];
      let failed = [];
      let recommendations = [];
      
      if (config) {
        outcome.outcomes.forEach((outcomeItem, idx) => {
          const target = config.targets[idx];
          if (target) {
            if (outcomeItem.completed) {
              worked.push(`${outcomeItem.label}: ${outcomeItem.actual} (target: ${target.target})`);
            } else {
              failed.push(`${outcomeItem.label}: Not achieved (target: ${target.target})`);
            }
          }
        });
        
        if (outcome.status === 'completed') {
          recommendations.push("Document learnings for next cycle");
          recommendations.push("Proceed to next week");
        } else if (outcome.status === 'at-risk') {
          recommendations.push("Take immediate corrective actions");
          recommendations.push("Review resource allocation");
        } else if (outcome.status === 'failed') {
          recommendations.push("Conduct root cause analysis");
          recommendations.push("Revise strategy and targets");
        }
      }
      
      res.json({ worked, failed, recommendations });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getWeeklyChartData: async (req, res) => {
    try {
      const outcomes = await WeekOutcome.find().sort({ week: 1 });
      const configs = await WeekConfig.find().sort({ week: 1 });
      
      const chartData = outcomes.map((outcome, idx) => {
        const config = configs[idx];
        const signupsOutcome = outcome.outcomes.find(o => o.label.includes('Signup') || o.label.includes('signup'));
        const onboardingsOutcome = outcome.outcomes.find(o => o.label.includes('Onboarding') || o.label.includes('onboarding'));
        const signupsTarget = config?.targets?.find(t => t.label.includes('Signup') || t.label.includes('signup'));
        const onboardingsTarget = config?.targets?.find(t => t.label.includes('Onboarding') || t.label.includes('onboarding'));
        
        return {
          week: `Week ${outcome.week}`,
          signups: typeof signupsOutcome?.actual === 'number' ? signupsOutcome.actual : 0,
          onboardings: typeof onboardingsOutcome?.actual === 'number' ? onboardingsOutcome.actual : 0,
          targetSignups: typeof signupsTarget?.target === 'number' ? signupsTarget.target : 0,
          targetOnboardings: typeof onboardingsTarget?.target === 'number' ? onboardingsTarget.target : 0,
        };
      });
      
      res.json(chartData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTriggersChartData: async (req, res) => {
    try {
      const outcomes = await WeekOutcome.find().sort({ week: 1 });
      
      const triggersChartData = outcomes.map((outcome) => ({
        week: `Week ${outcome.week}`,
        triggered: outcome.triggerOutcomes.filter(t => t.triggered).length,
        notTriggered: outcome.triggerOutcomes.filter(t => !t.triggered).length,
      }));
      
      res.json(triggersChartData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getDashboardOverview: async (req, res) => {
    try {
      const [outcomes, events, metrics, currentWeekConfig] = await Promise.all([
        WeekOutcome.find().sort({ week: 1 }),
        EventNote.find().sort({ date: -1 }).limit(5),
        PerformanceMetric.find({ isActive: true }).sort({ order: 1 }),
        AppConfig.findOne({ key: 'currentWeek' })
      ]);
      
      const currentWeek = currentWeekConfig ? currentWeekConfig.value : 1;
      const activeOutcome = outcomes.find(o => o.week === currentWeek);
      const completedWeeks = outcomes.filter(o => o.status === 'completed').length;
      const totalWeeks = outcomes.length;
      
      res.json({
        currentWeek,
        totalWeeks,
        completedWeeks,
        completionRate: totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0,
        activeWeekStatus: activeOutcome ? activeOutcome.status : 'pending',
        recentEvents: events,
        metricsCount: metrics.length,
        atRiskTriggers: outcomes.reduce((acc, o) => 
          acc + o.triggerOutcomes.filter(t => t.triggered).length, 0
        )
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Bulk Operations
  initializeData: async (req, res) => {
    try {
      const { weeks, metrics, currentWeek } = req.body;
      
      // Initialize week configs
      if (weeks && weeks.length > 0) {
        await WeekConfig.deleteMany({});
        await WeekConfig.insertMany(weeks);
      }
      
      // Initialize performance metrics
      if (metrics && metrics.length > 0) {
        await PerformanceMetric.deleteMany({});
        await PerformanceMetric.insertMany(metrics);
      }
      
      // Set current week
      if (currentWeek) {
        await AppConfig.findOneAndUpdate(
          { key: 'currentWeek' },
          { value: currentWeek, description: 'Current active week' },
          { upsert: true }
        );
      }
      
      // Initialize empty outcomes for each week
      const weekConfigs = await WeekConfig.find().sort({ week: 1 });
      await WeekOutcome.deleteMany({});
      
      const weekOutcomes = weekConfigs.map(config => ({
        week: config.week,
        status: 'pending',
        outcomes: config.targets.map(target => ({
          label: target.label,
          actual: null,
          completed: false
        })),
        triggerOutcomes: config.decisionTriggers.map(() => ({
          triggered: false,
          notes: ''
        })),
        notes: ''
      }));
      
      await WeekOutcome.insertMany(weekOutcomes);
      
      res.json({ message: 'Data initialized successfully', weeks: weekConfigs.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resetWeekData: async (req, res) => {
    try {
      const week = parseInt(req.params.week);
      
      // Reset week outcome
      const config = await WeekConfig.findOne({ week });
      if (!config) return res.status(404).json({ error: 'Week config not found' });
      
      await WeekOutcome.findOneAndUpdate(
        { week },
        {
          status: 'pending',
          outcomes: config.targets.map(target => ({
            label: target.label,
            actual: null,
            completed: false
          })),
          triggerOutcomes: config.decisionTriggers.map(() => ({
            triggered: false,
            notes: ''
          })),
          notes: '',
          updatedAt: Date.now()
        },
        { upsert: true }
      );
      
      res.json({ message: `Week ${week} data reset successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default performanceController;