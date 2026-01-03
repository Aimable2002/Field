// PerformanceDashboard.tsx
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Users,
  UserCheck,
  ShoppingCart,
  Activity,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Plus,
  Calendar,
  Target,
  TrendingUp,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Settings,
  Clock,
  Lock,
  Edit3,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  api,
  EventNote,
  WeekOutcomeData,
  WeekConfig,
  PerformanceMetric,
  MetricOutcome,
} from "@/lib/performanceData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  UserCheck,
  ShoppingCart,
  Activity,
  DollarSign,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-600 border-green-500/30";
    case "in-progress":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "on-track":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "at-risk":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
    case "failed":
      return "bg-red-500/10 text-red-600 border-red-500/30";
    case "pending":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "on-track":
      return <TrendingUp className="h-4 w-4 text-blue-600" />;
    case "at-risk":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "pending":
      return <Lock className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
};

const getOutcomeIcon = (outcome: string) => {
  switch (outcome) {
    case "positive":
      return <ThumbsUp className="h-4 w-4 text-green-600" />;
    case "negative":
      return <ThumbsDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPercentage = (actual: number | null, target: number) => {
  if (actual === null || actual === undefined) return 0;
  return Math.round((actual / target) * 100);
};

const getPercentageColor = (percentage: number) => {
  if (percentage >= 100) return "text-green-600";
  if (percentage >= 70) return "text-yellow-600";
  if (percentage === 0) return "text-muted-foreground";
  return "text-red-600";
};

export default function PerformanceDashboard() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weeklyConfig, setWeeklyConfig] = useState<WeekConfig[]>([]);
  const [outcomes, setOutcomes] = useState<WeekOutcomeData[]>([]);
  const [performanceTargets, setPerformanceTargets] = useState<PerformanceMetric[]>([]);
  const [metricOutcomes, setMetricOutcomes] = useState<MetricOutcome[]>([]);
  const [events, setEvents] = useState<EventNote[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [triggersChartData, setTriggersChartData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ worked: [] as string[], failed: [] as string[], recommendations: [] as string[] });
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    week: 1,
    type: "meeting" as EventNote["type"],
    title: "",
    description: "",
    outcome: "neutral" as EventNote["outcome"],
  });

  // Fetch all data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        configs,
        outcomesRes,
        metricsRes,
        eventsRes,
        chartsRes,
        triggersRes,
        overviewRes
      ] = await Promise.all([
        api.getWeeklyConfig(),
        api.getWeeklyOutcomes(),
        api.getPerformanceMetrics(),
        api.getEvents(),
        api.getWeeklyChartData(),
        api.getTriggersChartData(),
        api.getDashboardOverview()
      ]);

      setWeeklyConfig(configs);
      setOutcomes(outcomesRes);
      setPerformanceTargets(metricsRes);
      setEvents(eventsRes);
      setChartData(chartsRes);
      setTriggersChartData(triggersRes);
      setCurrentWeek(overviewRes.currentWeek);
      setSelectedWeek(overviewRes.currentWeek);

      // Load metric outcomes for current month/year
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const metricOutcomesRes = await api.getMetricOutcomes(month, year);
      setMetricOutcomes(metricOutcomesRes);

      // Load summary for current week
      const summaryRes = await api.getWeeklySummary(overviewRes.currentWeek);
      setSummary(summaryRes);

    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update summary when selected week changes
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const summaryRes = await api.getWeeklySummary(selectedWeek);
        setSummary(summaryRes);
      } catch (error) {
        console.error('Failed to load summary:', error);
      }
    };
    loadSummary();
  }, [selectedWeek]);

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) return;
    try {
      const event = await api.createEvent(newEvent);
      setEvents([...events, event]);
      setNewEvent({
        week: currentWeek,
        type: "meeting",
        title: "",
        description: "",
        outcome: "neutral",
      });
      setIsAddEventOpen(false);
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const updateOutcome = async (weekIdx: number, outcomeIdx: number, value: string) => {
    const newOutcomes = [...outcomes];
    newOutcomes[weekIdx].outcomes[outcomeIdx].actual = value;
    setOutcomes(newOutcomes);
    
    try {
      await api.updateWeekOutcome(newOutcomes[weekIdx]._id, newOutcomes[weekIdx]);
    } catch (error) {
      console.error('Failed to update outcome:', error);
    }
  };

  const updateOutcomeCompleted = async (weekIdx: number, outcomeIdx: number, completed: boolean) => {
    const newOutcomes = [...outcomes];
    newOutcomes[weekIdx].outcomes[outcomeIdx].completed = completed;
    setOutcomes(newOutcomes);
    
    try {
      await api.updateWeekOutcome(newOutcomes[weekIdx]._id, newOutcomes[weekIdx]);
    } catch (error) {
      console.error('Failed to update outcome:', error);
    }
  };

  const updateTrigger = async (weekIdx: number, triggerIdx: number, triggered: boolean) => {
    const newOutcomes = [...outcomes];
    newOutcomes[weekIdx].triggerOutcomes[triggerIdx].triggered = triggered;
    setOutcomes(newOutcomes);
    
    try {
      await api.updateWeekOutcome(newOutcomes[weekIdx]._id, newOutcomes[weekIdx]);
    } catch (error) {
      console.error('Failed to update trigger:', error);
    }
  };

  const updateWeekStatus = async (weekIdx: number, status: WeekOutcomeData["status"]) => {
    const newOutcomes = [...outcomes];
    newOutcomes[weekIdx].status = status;
    setOutcomes(newOutcomes);
    
    try {
      await api.updateWeekOutcome(newOutcomes[weekIdx]._id, newOutcomes[weekIdx]);
    } catch (error) {
      console.error('Failed to update week status:', error);
    }
  };

  const updateWeekNotes = async (weekIdx: number, notes: string) => {
    const newOutcomes = [...outcomes];
    newOutcomes[weekIdx].notes = notes;
    setOutcomes(newOutcomes);
    
    try {
      await api.updateWeekOutcome(newOutcomes[weekIdx]._id, newOutcomes[weekIdx]);
    } catch (error) {
      console.error('Failed to update week notes:', error);
    }
  };

  const updateMetric = async (idx: number, value: number) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    const metric = performanceTargets[idx];
    let existingOutcome = metricOutcomes.find(mo => mo.label === metric.label);
    
    try {
      if (existingOutcome) {
        // Update existing outcome
        const updatedOutcome = { ...existingOutcome, actual: value };
        await api.updateMetricOutcomes({
          outcomes: [updatedOutcome],
          month,
          year
        });
      } else {
        // Create new outcome
        const newOutcome = {
          label: metric.label,
          actual: value,
          metricId: metric._id,
          month,
          year
        };
        await api.updateMetricOutcomes({
          outcomes: [newOutcome],
          month,
          year
        });
      }
      
      // Refresh metric outcomes
      const updatedOutcomes = await api.getMetricOutcomes(month, year);
      setMetricOutcomes(updatedOutcomes);
      
    } catch (error) {
      console.error('Failed to update metric:', error);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const selectedConfig = weeklyConfig.find((w) => w.week === selectedWeek);
  const selectedOutcome = outcomes.find((w) => w.week === selectedWeek);
  const weekIdx = outcomes.findIndex((w) => w.week === selectedWeek);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Monthly Performance Dashboard
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span>Week 1–4 Execution Tracking</span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                <Clock className="h-3 w-3 mr-1" />
                Currently: Week {currentWeek}
              </Badge>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {selectedOutcome && (
              <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Outcomes
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit3 className="h-5 w-5" />
                      Configure Week {selectedWeek} Outcomes
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    {/* Week Status */}
                    <div>
                      <Label className="text-sm font-medium">Week Status</Label>
                      <Select
                        value={selectedOutcome?.status || "pending"}
                        onValueChange={(v) => updateWeekStatus(weekIdx, v as WeekOutcomeData["status"])}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="on-track">On Track</SelectItem>
                          <SelectItem value="at-risk">At Risk</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Outcomes */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Target Outcomes</Label>
                      <div className="space-y-3">
                        {selectedConfig?.targets.map((target, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{target.label}</p>
                              <p className="text-xs text-muted-foreground">
                                Target: {target.target}
                              </p>
                            </div>
                            <Input
                              className="w-24"
                              placeholder="Actual"
                              value={selectedOutcome?.outcomes[idx]?.actual?.toString() || ""}
                              onChange={(e) => updateOutcome(weekIdx, idx, e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={selectedOutcome?.outcomes[idx]?.completed || false}
                                onCheckedChange={(checked) => updateOutcomeCompleted(weekIdx, idx, checked)}
                              />
                              <Label className="text-xs">Done</Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decision Triggers */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Decision Triggers</Label>
                      <div className="space-y-3">
                        {selectedConfig?.decisionTriggers.map((trigger, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium">If: {trigger.condition}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <ArrowRight className="h-3 w-3" />
                                {trigger.action}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={selectedOutcome?.triggerOutcomes[idx]?.triggered || false}
                                onCheckedChange={(checked) => updateTrigger(weekIdx, idx, checked)}
                              />
                              <Label className="text-xs">Triggered</Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label className="text-sm font-medium mb-1 block">Week Notes</Label>
                      <Textarea
                        value={selectedOutcome?.notes || ""}
                        onChange={(e) => updateWeekNotes(weekIdx, e.target.value)}
                        placeholder="Add observations, blockers, or context..."
                        rows={3}
                      />
                    </div>

                    <Button onClick={() => setIsConfigOpen(false)} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Section 1: Weekly Timeline View */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Timeline
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {weeklyConfig.map((config) => {
              const outcome = outcomes.find(o => o.week === config.week);
              const isActive = config.week === currentWeek;
              return (
                <Card
                  key={config.week}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedWeek === config.week
                      ? "ring-2 ring-primary shadow-md"
                      : ""
                  } ${isActive ? "border-blue-500/50" : ""}`}
                  onClick={() => setSelectedWeek(config.week)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm flex items-center gap-1">
                        Week {config.week}
                        {isActive && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </span>
                      {getStatusIcon(outcome?.status || "pending")}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {config.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(outcome?.status || "pending")}`}
                    >
                      {outcome?.status?.replace("-", " ") || "pending"}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Section 2: Performance Metrics Overview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Performance Metrics
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Monthly Metrics</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {performanceTargets.map((target, idx) => {
                    const IconComponent = iconMap[target.icon];
                    const outcome = metricOutcomes.find(mo => mo.label === target.label);
                    return (
                      <div key={target._id} className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{target.label}</p>
                          <p className="text-xs text-muted-foreground">
                            Target: {target.unit || ""}{target.target}
                          </p>
                        </div>
                        <Input
                          type="number"
                          className="w-24"
                          value={outcome?.actual || 0}
                          onChange={(e) => updateMetric(idx, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {performanceTargets.map((target) => {
              const IconComponent = iconMap[target.icon];
              const outcome = metricOutcomes.find(mo => mo.label === target.label);
              const actual = outcome?.actual || 0;
              const percentage = getPercentage(actual, target.target);
              return (
                <Card key={target._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <span
                        className={`text-sm font-bold ${getPercentageColor(percentage)}`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {target.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold">
                        {target.unit || ""}{actual}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / {target.unit || ""}{target.target}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentage >= 100
                            ? "bg-green-500"
                            : percentage >= 70
                            ? "bg-yellow-500"
                            : percentage > 0
                            ? "bg-red-500"
                            : "bg-muted-foreground/20"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Section 3: Charts & Visualizations */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Charts & Visualizations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Line Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Signups & Onboardings Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="signups"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                      name="Signups"
                    />
                    <Line
                      type="monotone"
                      dataKey="onboardings"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-2))" }}
                      name="Onboardings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Targets vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="targetOnboardings"
                      fill="hsl(var(--muted-foreground))"
                      name="Target"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="onboardings"
                      fill="hsl(var(--primary))"
                      name="Actual"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Triggers Chart */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Decision Trigger Activations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={triggersChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="week" type="category" className="text-xs" width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="triggered"
                      fill="hsl(var(--chart-1))"
                      name="Triggered"
                      radius={[0, 4, 4, 0]}
                      stackId="a"
                    />
                    <Bar
                      dataKey="notTriggered"
                      fill="hsl(var(--muted))"
                      name="Not Triggered"
                      radius={[0, 4, 4, 0]}
                      stackId="a"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Decision & Action Triggers Panel */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Decision Triggers — Week {selectedWeek}
          </h2>
          {selectedConfig && selectedOutcome && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {selectedConfig.title}
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedOutcome.status)}
                  >
                    {selectedOutcome.status.replace("-", " ")}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">{selectedConfig.focus}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedOutcome.status === "pending" ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Week not yet started</p>
                    <p className="text-xs">Complete previous weeks first</p>
                  </div>
                ) : (
                  selectedConfig.decisionTriggers.map((trigger, idx) => {
                    const outcome = selectedOutcome.triggerOutcomes[idx];
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          outcome?.triggered
                            ? "bg-primary/5 border-primary/30"
                            : "bg-muted/50 border-border"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 p-1 rounded-full ${
                              outcome?.triggered ? "bg-primary/20" : "bg-muted"
                            }`}
                          >
                            {outcome?.triggered ? (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">If: {trigger.condition}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">{trigger.action}</p>
                            </div>
                          </div>
                          <Badge
                            variant={outcome?.triggered ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {outcome?.triggered ? "Triggered" : "Not Triggered"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
                {selectedOutcome.notes && selectedOutcome.status !== "pending" && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Notes:</p>
                    <p className="text-sm">{selectedOutcome.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Section 5: Events & Notes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Events & Notes
            </h2>
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-1 block">Week</Label>
                      <Select
                        value={newEvent.week.toString()}
                        onValueChange={(v) => setNewEvent({ ...newEvent, week: parseInt(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map((w) => (
                            <SelectItem key={w} value={w.toString()}>
                              Week {w}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1 block">Type</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(v) => setNewEvent({ ...newEvent, type: v as EventNote["type"] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="field-visit">Field Visit</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="campaign">Campaign</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Title</Label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Description</Label>
                    <Textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Event description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Outcome</Label>
                    <Select
                      value={newEvent.outcome}
                      onValueChange={(v) => setNewEvent({ ...newEvent, outcome: v as EventNote["outcome"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddEvent} className="w-full">
                    Add Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="field-visit">Field Visits</TabsTrigger>
              <TabsTrigger value="meeting">Meetings</TabsTrigger>
              <TabsTrigger value="campaign">Campaigns</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            {["all", "field-visit", "meeting", "campaign", "feedback"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid md:grid-cols-2 gap-3">
                  {events
                    .filter((e) => tab === "all" || e.type === tab)
                    .map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Week {event.week}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {event.type.replace("-", " ")}
                              </Badge>
                            </div>
                            {getOutcomeIcon(event.outcome)}
                          </div>
                          <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">{event.date}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Section 6: Weekly Summary & Insights */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Week {selectedWeek} Summary & Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  What Worked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.worked.length > 0 ? (
                    summary.worked.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No data yet</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                  <XCircle className="h-4 w-4" />
                  What Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.failed.length > 0 ? (
                    summary.failed.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No failures recorded</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-primary">
                  <Lightbulb className="h-4 w-4" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.recommendations.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* End of Month Section */}
        <section>
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                End of Month — Relationship Reinforcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Action</p>
                  <p className="text-sm font-medium">Revisit all users</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Collect</p>
                  <p className="text-sm font-medium">Feedback from all users</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Strengthen</p>
                  <p className="text-sm font-medium">User relationships</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Identify</p>
                  <p className="text-sm font-medium">Improvement opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}