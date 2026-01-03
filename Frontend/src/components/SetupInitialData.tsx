// components/SetupInitialData.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Database } from "lucide-react";
import { api } from "@/lib/performanceData";

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

export function SetupInitialData() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInitialize = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      const data = {
        weeks: initialWeekConfigs,
        metrics: initialPerformanceMetrics,
        currentWeek: 1
      };
      
      const result = await api.initializeData(data);
      setMessage(`Successfully initialized ${result.weeks} weeks of data!`);
      
      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Failed to initialize data'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Database className="h-4 w-4 mr-2" />
          Initialize Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initialize Database</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            This will initialize the database with default week configurations and performance metrics.
            This should only be done once when setting up the application for the first time.
          </p>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">What will be created:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 4 weeks of configuration</li>
              <li>• 5 performance metrics</li>
              <li>• Week outcomes for tracking</li>
              <li>• App configuration (current week: 1)</li>
            </ul>
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/10 text-red-700' : 'bg-green-500/10 text-green-700'}`}>
              <p className="text-sm">{message}</p>
            </div>
          )}
          
          <Button 
            onClick={handleInitialize} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              'Initialize Database'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}