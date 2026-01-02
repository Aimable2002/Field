import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Header from '@/components/Header';
import RatingStars from '@/components/RatingStars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  TrendingUp, 
  Target, 
  ClipboardList,
  BarChart3,
  TableIcon,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'rating';
  options?: string[];
  required: boolean;
}

interface SurveyResponse {
  _id: string;
  teamName: string;
  employeeName: string;
  date: string;
  time: string;
  businessName: string;
  businessLocation: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  answers: { questionId: string; questionText: string; answer: string; type: string }[];
  interestRating: number;
  canFollowUp: boolean;
  preferredContact: 'call' | 'whatsapp' | 'email' | null;
  contactNumber: string;
  employeeRemarks: string;
  overallRating: number;
  createdAt: string;
}

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [teamStats, setTeamStats] = useState<any[]>([]);
  const [interestDistribution, setInterestDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'text' as 'text' | 'select' | 'rating',
    options: '',
    required: true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [responsesRes, statsRes, interestRes] = await Promise.all([
        api.get('/responses'),
        api.get('/responses/stats/teams'),
        api.get('/responses/stats/interest')
      ]);

      setResponses(responsesRes.data);
      setTeamStats(statsRes.data);

      console.log(responses)
      console.log(teamStats)
      
      const COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
      const interestData = interestRes.data.map((item: any, index: number) => ({
        ...item,
        fill: COLORS[index % COLORS.length]
      }));
      setInterestDistribution(interestData);
    } catch (err) {
      toast({ 
        title: 'Failed to load data', 
        description: 'Using demo data instead',
        variant: 'default' 
      });
      
      setResponses([]);
      setTeamStats([]);
      setInterestDistribution([]);
    } finally {
      setLoading(false);
    }
  };

  // if (isLoading || loading) return <div>Loading...</div>;
  // if (!isAuthenticated) return <Navigate to="/login" />;

  // Extract unique questions from all responses
  const getUniqueQuestions = (): Question[] => {
    const questionMap = new Map();
    
    responses.forEach(response => {
      response.answers.forEach(answer => {
        if (!questionMap.has(answer.questionId)) {
          questionMap.set(answer.questionId, {
            id: answer.questionId,
            text: answer.questionText,
            type: answer.type as 'text' | 'select' | 'rating',
            required: true,
          });
        }
      });
    });
    
    return Array.from(questionMap.values());
  };

  const questions = getUniqueQuestions();

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast({
        title: 'Question text required',
        variant: 'destructive',
      });
      return;
    }

    const question: Question = {
      id: `custom-${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type,
      options: newQuestion.type === 'select' ? newQuestion.options.split(',').map(o => o.trim()).filter(Boolean) : undefined,
      required: newQuestion.required,
    };

    // In a real app, you would save this to the backend
    // For now, we'll just show a message that this is a frontend-only feature
    toast({ 
      title: 'Question added (frontend only)', 
      description: 'In a real app, this would be saved to the database'
    });
    
    setNewQuestion({ text: '', type: 'text', options: '', required: true });
    setIsAddDialogOpen(false);
  };

  const handleEditQuestion = () => {
    if (!editingQuestion) return;
    
    toast({ 
      title: 'Question updated (frontend only)', 
      description: 'In a real app, this would update the database'
    });
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    toast({ 
      title: 'Question deleted (frontend only)', 
      description: 'In a real app, this would remove from database'
    });
  };

  const totalSurveys = responses.length || 0;
  const highInterestLeads = responses.filter(r => r.interestRating >= 4).length;
  const followUpRate = responses.length > 0 ? Math.round((responses.filter(r => r.canFollowUp).length / responses.length) * 100) : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor field survey performance and manage questions</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="gradient-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Surveys</p>
                  <p className="text-3xl font-bold font-display">{totalSurveys}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Interest Leads</p>
                  <p className="text-3xl font-bold font-display text-success">{highInterestLeads}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Follow-up Rate</p>
                  <p className="text-3xl font-bold font-display">{followUpRate}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Teams</p>
                  <p className="text-3xl font-bold font-display">{teamStats.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="responses" className="gap-2">
              <TableIcon className="h-4 w-4" />
              Responses
            </TabsTrigger>
            <TabsTrigger value="questions" className="gap-2">
              <Settings className="h-4 w-4" />
              Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="font-display">Team Performance</CardTitle>
                  <CardDescription>Surveys completed and potential rate by team</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teamStats}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="teamName" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="surveysCompleted" name="Surveys" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="highInterestLeads" name="High Interest" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="font-display">Interest Distribution</CardTitle>
                  <CardDescription>Breakdown of lead interest levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={interestDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {interestDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="font-display">Team Statistics</CardTitle>
                <CardDescription>Detailed breakdown by team</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">Surveys</TableHead>
                      <TableHead className="text-center">Avg Rating</TableHead>
                      <TableHead className="text-center">High Interest</TableHead>
                      <TableHead className="text-center">Potential Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamStats.map((team) => (
                      <TableRow key={team.teamName}>
                        <TableCell className="font-medium">{team.teamName}</TableCell>
                        <TableCell className="text-center">{team.surveysCompleted}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <RatingStars value={Math.round(team.avgRating)} readonly size="sm" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            {team.highInterestLeads}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={team.potentialRate >= 50 ? 'default' : 'secondary'}>
                            {team.potentialRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="font-display">All Survey Responses</CardTitle>
                <CardDescription>Complete list of field survey data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Follow-up</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responses.map((response) => (
                        <TableRow 
                          key={response._id} 
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => navigate(`/response/${response._id}`, { state: { response } })}
                        >
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm">{formatDate(response.createdAt)}</div>
                            <div className="text-xs text-muted-foreground">{response.time}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{response.teamName}</Badge>
                          </TableCell>
                          <TableCell>{response.employeeName}</TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{response.businessName}</div>
                            <div className="text-xs text-muted-foreground">{response.businessLocation}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{response.contactName}</div>
                            <div className="text-xs text-muted-foreground">{response.contactTitle}</div>
                            <div className="text-xs text-primary">{response.contactEmail}</div>
                          </TableCell>
                          <TableCell>
                            <RatingStars value={response.interestRating} readonly size="sm" />
                          </TableCell>
                          <TableCell>
                            <RatingStars value={response.overallRating} readonly size="sm" />
                          </TableCell>
                          <TableCell>
                            {response.canFollowUp ? (
                              <Badge className="bg-success/10 text-success border-success/20">
                                {response.preferredContact}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">No</Badge>
                            )}
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-sm text-muted-foreground truncate">
                              {response.employeeRemarks}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display">Survey Questions</CardTitle>
                  <CardDescription>Questions collected from survey responses</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="gradient">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Question</DialogTitle>
                      <DialogDescription>Create a new question for field surveys</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Input
                          placeholder="Enter your question..."
                          value={newQuestion.text}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                          value={newQuestion.type}
                          onValueChange={(value: 'text' | 'select' | 'rating') => 
                            setNewQuestion(prev => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Input</SelectItem>
                            <SelectItem value="select">Multiple Choice</SelectItem>
                            <SelectItem value="rating">Star Rating</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {newQuestion.type === 'select' && (
                        <div className="space-y-2">
                          <Label>Options (comma-separated)</Label>
                          <Input
                            placeholder="Option 1, Option 2, Option 3"
                            value={newQuestion.options}
                            onChange={(e) => setNewQuestion(prev => ({ ...prev, options: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddQuestion}>Add Question</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div 
                      key={question.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Q{index + 1}
                          </span>
                          <span className="font-medium">{question.text}</span>
                          {question.required && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {question.type}
                          </Badge>
                          {question.options && (
                            <span className="text-xs text-muted-foreground">
                              {question.options.length} options
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingQuestion({ ...question })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Question</DialogTitle>
                            </DialogHeader>
                            {editingQuestion && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Question Text</Label>
                                  <Input
                                    value={editingQuestion.text}
                                    onChange={(e) => setEditingQuestion(prev => 
                                      prev ? { ...prev, text: e.target.value } : null
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditQuestion}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;