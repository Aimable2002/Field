import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { defaultQuestions, Question } from '@/lib/mockData';
import Header from '@/components/Header';
import RatingStars from '@/components/RatingStars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building2, 
  User, 
  Mail, 
  MapPin, 
  Send, 
  Plus,
  Trash2,
  Phone,
  MessageSquare,
  ClipboardCheck,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import api from '@/lib/api';

interface CustomQuestion {
  id: string;
  text: string;
  answer: string;
}

const Survey = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Business Info
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  // Q&A
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  
  // Interest & Follow-up
  const [interestRating, setInterestRating] = useState(0);
  const [canFollowUp, setCanFollowUp] = useState(false);
  const [preferredContact, setPreferredContact] = useState<string>('');
  const [contactNumber, setContactNumber] = useState('');
  
  // Employee Remarks
  const [employeeRemarks, setEmployeeRemarks] = useState('');
  const [overallRating, setOverallRating] = useState(0);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const addCustomQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQuestion: CustomQuestion = {
      id: `custom-${Date.now()}`,
      text: newQuestionText,
      answer: '',
    };
    setCustomQuestions(prev => [...prev, newQuestion]);
    setNewQuestionText('');
  };

  const updateCustomQuestionAnswer = (id: string, answer: string) => {
    setCustomQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, answer } : q)
    );
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Basic required field validation
    if (!businessName.trim() || !contactName.trim() || interestRating === 0) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in business name, contact name, and interest rating',
        variant: 'destructive',
      });
      return;
    }
  
    // Build the complete answers array
    const formattedAnswers = [
      // 1. Default questions (static ones from defaultQuestions.ts)
      ...defaultQuestions.map((q) => ({
        questionId: q.id,
        questionText: q.text,
        type: q.type,                     // 'text' | 'select' | 'rating'
        answer: answers[q.id] || '',      // answer from state (string for all types)
      })),
  
      // 2. Custom questions added by the employee during this survey
      ...customQuestions.map((cq) => ({
        questionId: cq.id,                // e.g. "custom-1700000000000"
        questionText: cq.text,
        type: 'text' as const,            // custom questions are always free-text
        answer: cq.answer || '',
      })),
    ];
  
    // Prepare payload for backend
    const payload = {
      businessName: businessName.trim(),
      businessLocation: businessLocation.trim() || undefined,
      contactName: contactName.trim(),
      contactTitle: contactTitle.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      answers: formattedAnswers,
      interestRating,
      overallRating: overallRating || undefined,
      canFollowUp,
      preferredContact: canFollowUp ? preferredContact : null,
      contactNumber: canFollowUp ? contactNumber.trim() : '',
      employeeRemarks: employeeRemarks.trim() || undefined,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    };
  
    try {
      await api.post('/responses', payload);
  
      toast({
        title: 'Survey submitted!',
        description: 'Thank you for completing the field survey.',
      });
  
      // Reset the entire form after successful submission
      setBusinessName('');
      setBusinessLocation('');
      setContactName('');
      setContactTitle('');
      setContactEmail('');
      setAnswers({});
      setCustomQuestions([]);
      setNewQuestionText('');
      setInterestRating(0);
      setOverallRating(0);
      setCanFollowUp(false);
      setPreferredContact('');
      setContactNumber('');
      setEmployeeRemarks('');
    } catch (err: any) {
      console.error('Survey submission error:', err);
      toast({
        title: 'Submission failed',
        description: err.response?.data?.message || 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Textarea
            placeholder="Enter your answer..."
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="resize-none"
          />
        );
      case 'select':
        return (
          <Select
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'rating':
        return (
          <RatingStars
            value={parseInt(answers[question.id] || '0')}
            onChange={(value) => handleAnswerChange(question.id, value.toString())}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <Card className="animate-fade-in shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Building2 className="h-5 w-5 text-primary" />
                Business Information
              </CardTitle>
              <CardDescription>
                Enter details about the business you're visiting
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Company Inc."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLocation">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessLocation"
                      placeholder="123 Main St, City"
                      className="pl-10"
                      value={businessLocation}
                      onChange={(e) => setBusinessLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactName"
                      placeholder="John Smith"
                      className="pl-10"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactTitle">Title/Position</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactTitle"
                      placeholder="Manager"
                      className="pl-10"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="contact@example.com"
                      className="pl-10"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Survey Questions */}
          <Card className="animate-fade-in shadow-md" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Survey Questions
              </CardTitle>
              <CardDescription>
                Complete the prepared questions below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {defaultQuestions.map((question, index) => (
                <div key={question.id} className="space-y-2 p-4 rounded-lg bg-muted/50">
                  <Label className="text-base">
                    {index + 1}. {question.text}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderQuestion(question)}
                </div>
              ))}

              {/* Custom Questions */}
              {customQuestions.map((question, index) => (
                <div key={question.id} className="space-y-2 p-4 rounded-lg bg-accent/30 border border-accent/50">
                  <div className="flex items-start justify-between gap-2">
                    <Label className="text-base">
                      {defaultQuestions.length + index + 1}. {question.text}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeCustomQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Enter answer..."
                    value={question.answer}
                    onChange={(e) => updateCustomQuestionAnswer(question.id, e.target.value)}
                    className="resize-none"
                  />
                </div>
              ))}

              {/* Add Custom Question */}
              <div className="p-4 rounded-lg border-2 border-dashed border-border">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Add your own question
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your question here..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addCustomQuestion}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interest Rating */}
          <Card className="animate-fade-in shadow-md" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="font-display">Interest Level Assessment</CardTitle>
              <CardDescription>
                Rate the interviewee's interest and engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>How interested was the person in our offering? *</Label>
                <div className="flex items-center gap-4">
                  <RatingStars
                    value={interestRating}
                    onChange={setInterestRating}
                    size="lg"
                  />
                  <span className="text-sm text-muted-foreground">
                    {interestRating === 0 && 'Select rating'}
                    {interestRating === 1 && 'Not interested'}
                    {interestRating === 2 && 'Slightly interested'}
                    {interestRating === 3 && 'Moderately interested'}
                    {interestRating === 4 && 'Very interested'}
                    {interestRating === 5 && 'Extremely interested'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up Consent */}
          <Card className="animate-fade-in shadow-md" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="font-display">Follow-up Permission</CardTitle>
              <CardDescription>
                Ask if we can contact them for future communications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="followUp"
                  checked={canFollowUp}
                  onCheckedChange={(checked) => setCanFollowUp(checked as boolean)}
                />
                <Label htmlFor="followUp" className="cursor-pointer">
                  Permission granted for future follow-ups
                </Label>
              </div>

              {canFollowUp && (
                <div className="space-y-4 mt-4 p-4 rounded-lg bg-muted/50 animate-fade-in">
                  <Label>Preferred method of contact</Label>
                  <RadioGroup
                    value={preferredContact}
                    onValueChange={setPreferredContact}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="call" id="call" />
                      <Label htmlFor="call" className="flex items-center gap-1.5 cursor-pointer">
                        <Phone className="h-4 w-4" />
                        Phone Call
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="flex items-center gap-1.5 cursor-pointer">
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="flex items-center gap-1.5 cursor-pointer">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                    </div>
                  </RadioGroup>

                  {(preferredContact === 'call' || preferredContact === 'whatsapp') && (
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="contactNumber">
                        {preferredContact === 'call' ? 'Phone Number' : 'WhatsApp Number'}
                      </Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        placeholder="+1 555-123-4567"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employee Remarks */}
          <Card className="animate-fade-in shadow-md" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="font-display">Your Observations</CardTitle>
              <CardDescription>
                Add your overall remarks and assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks & Notes</Label>
                <Textarea
                  id="remarks"
                  placeholder="Describe your observations, key insights, next steps..."
                  value={employeeRemarks}
                  onChange={(e) => setEmployeeRemarks(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Your overall assessment of this lead</Label>
                <div className="flex items-center gap-4">
                  <RatingStars
                    value={overallRating}
                    onChange={setOverallRating}
                    size="lg"
                  />
                  <span className="text-sm text-muted-foreground">
                    {overallRating === 0 && 'Rate this lead'}
                    {overallRating === 1 && 'Poor lead'}
                    {overallRating === 2 && 'Fair lead'}
                    {overallRating === 3 && 'Good lead'}
                    {overallRating === 4 && 'Great lead'}
                    {overallRating === 5 && 'Excellent lead'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" variant="gradient" size="lg" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Survey
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Survey;
