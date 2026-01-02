import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RatingStars from '@/components/RatingStars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SurveyResponse {
  _id: string;
  teamName: string;
  employeeName: string;
  date: string;
  time: string;
  businessName: string;
  businessLocation?: string;
  contactName: string;
  contactTitle?: string;
  contactEmail?: string;
  answers: {
    questionId: string;
    questionText: string;
    answer: string;
    type: string;
  }[];
  interestRating: number;
  overallRating: number;
  canFollowUp: boolean;
  preferredContact?: 'call' | 'whatsapp' | 'email' | null;
  contactNumber?: string;
  employeeRemarks?: string;
}

const ResponseDetail = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const response = location.state?.response as SurveyResponse;

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  if (!response) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Response Not Found</h1>
            <p className="text-muted-foreground mb-6">No response data available. Please go back and select a response.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="gradient-primary rounded-2xl p-6 md:p-8 mb-6 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold">{response.businessName}</h1>
                  {response.businessLocation && (
                    <div className="flex items-center gap-2 text-primary-foreground/80 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{response.businessLocation}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary-foreground/70" />
                  <div>
                    <p className="text-xs text-primary-foreground/70">Contact Name</p>
                    <p className="font-medium">{response.contactName}</p>
                  </div>
                </div>
                {response.contactTitle && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                      {response.contactTitle}
                    </Badge>
                  </div>
                )}
                {response.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary-foreground/70" />
                    <span className="text-sm">{response.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-base px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                {response.teamName}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {response.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {response.time}
                </div>
              </div>
              <p className="text-sm text-primary-foreground/80">
                Surveyed by: <span className="font-medium text-primary-foreground">{response.employeeName}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interest Level</p>
                <div className="mt-1">
                  <RatingStars value={response.interestRating} readonly />
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Rating</p>
                <div className="mt-1">
                  <RatingStars value={response.overallRating} readonly />
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Follow-up</p>
                <div className="mt-1 flex items-center gap-2">
                  {response.canFollowUp ? (
                    <>
                      <Badge className="bg-success/10 text-success border-success/20">
                        {response.preferredContact || 'Allowed'}
                      </Badge>
                      {response.contactNumber && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {response.contactNumber}
                        </span>
                      )}
                    </>
                  ) : (
                    <Badge variant="secondary">Not Available</Badge>
                  )}
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Survey Questions & Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {response.answers.map((qa, index) => (
                <div key={qa.questionId + index} className="group">
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{qa.questionText}</p>
                      <p className="mt-2 text-muted-foreground bg-muted/50 rounded-lg p-3">
                        {qa.type === 'rating' ? (
                          <RatingStars value={parseInt(qa.answer) || 0} readonly size="sm" />
                        ) : (
                          qa.answer || <em className="text-muted-foreground/70">No answer provided</em>
                        )}
                      </p>
                    </div>
                  </div>
                  {index < response.answers.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {response.employeeRemarks && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-display">Employee Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {response.employeeRemarks}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ResponseDetail;