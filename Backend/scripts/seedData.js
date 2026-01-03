import mongoose from "mongoose";
import WeekConfig from "../model/WeekConfig.js";
import WeekOutcome from "../model/WeekOutcome.js";
import PerformanceMetric from "../model/PerformanceMetric.js";
import AppConfig from "../model/AppConfig.js";
import dotenv from 'dotenv'

dotenv.config()



const initialWeekConfigs = [
  {
    week: 1,
    title: "Preparation & Readiness",
    focus: "Employee training, Demo finalization, Platform testing",
    targets: [
      { label: "Training Completion", target: "100%" },
      { label: "Demo Ready", target: "Yes" },
      { label: "Platform Tested", target: "Yes" },
    ],
    actions: [
      "No marketing",
      "No onboarding",
      "Internal validation only"
    ],
    decisionTriggers: [
      { condition: "Training & demo complete", action: "Move to Week 2" },
      { condition: "Training incomplete", action: "Extend preparation phase" }
    ],
    isActive: true
  },
  {
    week: 2,
    title: "Market Entry & Validation",
    focus: "Launch marketing, acquire first users, validate onboarding flow",
    targets: [
      { label: "Signups", target: 100 },
      { label: "Onboardings", target: 5 },
    ],
    actions: [
      "Field marketing activation",
      "Social media campaigns",
      "Direct outreach to businesses"
    ],
    decisionTriggers: [
      { condition: "0 onboardings", action: "Field visit to enrolled users to identify friction" },
      { condition: "10+ onboardings", action: "Shift focus to suppliers + activate customer support line" },
      { condition: "0 signups", action: "Reassess problem-solution fit and execution plan" }
    ],
    isActive: true
  },
  {
    week: 3,
    title: "Trust & Liquidity Focus",
    focus: "Build trust, increase supplier participation, improve response time",
    targets: [
      { label: "Onboardings", target: 10 },
      { label: "Active Suppliers", target: 5 },
      { label: "Avg Response Time", target: "< 2hrs" },
    ],
    actions: [
      "Founder-led customer support",
      "Supplier outreach campaigns",
      "Manual trust-building calls"
    ],
    decisionTriggers: [
      { condition: "Buyers ghosting", action: "Improve communication & response speed" },
      { condition: "Active bidding happening", action: "Prepare proof of success stories" }
    ],
    isActive: true
  },
  {
    week: 4,
    title: "Proof & Scale Signals",
    focus: "Demonstrate value, collect testimonials, prepare for scale",
    targets: [
      { label: "Onboardings", target: 20 },
      { label: "Completed Orders", target: 15 },
      { label: "Positive Reviews", target: 10 },
    ],
    actions: [
      "Establish permanent customer service",
      "Second field marketing with testimonials",
      "Design next month metrics"
    ],
    decisionTriggers: [
      { condition: "15+ successful orders", action: "Scale outreach aggressively" },
      { condition: "No completed orders", action: "Re-evaluate trust, pricing, or matching logic" }
    ],
    isActive: true
  }
];

const initialPerformanceMetrics = [
  { label: "Total Signups", target: 100, icon: "Users", order: 1 },
  { label: "Onboardings", target: 20, icon: "UserCheck", order: 2 },
  { label: "Completed Orders", target: 15, icon: "ShoppingCart", order: 3 },
  { label: "Active Users", target: 50, icon: "Activity", order: 4 },
  { label: "Monthly Cost", target: 5000, unit: "$", icon: "DollarSign", order: 5 },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/performance_dashboard');
    
    console.log('Clearing existing data...');
    await WeekConfig.deleteMany({});
    await WeekOutcome.deleteMany({});
    await PerformanceMetric.deleteMany({});
    await AppConfig.deleteMany({});
    
    console.log('Seeding week configurations...');
    await WeekConfig.insertMany(initialWeekConfigs);
    
    console.log('Seeding performance metrics...');
    await PerformanceMetric.insertMany(initialPerformanceMetrics);
    
    console.log('Creating week outcomes...');
    const weekConfigs = await WeekConfig.find().sort({ week: 1 });
    const weekOutcomes = weekConfigs.map(config => ({
      week: config.week,
      status: config.week === 1 ? 'in-progress' : 'pending',
      outcomes: config.targets.map(target => ({
        label: target.label,
        actual: null,
        completed: false
      })),
      triggerOutcomes: config.decisionTriggers.map(() => ({
        triggered: false,
        notes: ''
      })),
      notes: config.week === 1 ? "Currently conducting training sessions" : ""
    }));
    
    await WeekOutcome.insertMany(weekOutcomes);
    
    console.log('Setting app configurations...');
    await AppConfig.create([
      { key: 'currentWeek', value: 1, description: 'Current active week' },
      { key: 'totalWeeks', value: 4, description: 'Total number of weeks in cycle' },
      { key: 'month', value: new Date().getMonth() + 1, description: 'Current month' },
      { key: 'year', value: new Date().getFullYear(), description: 'Current year' }
    ]);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${weekConfigs.length} weeks`);
    console.log(`Created ${initialPerformanceMetrics.length} metrics`);
    
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase()
  .then((result) => console.log(result))
  .catch((err) => console.log(err));