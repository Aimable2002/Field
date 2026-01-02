import axios from "axios";

export interface Team {
  id: string;
  name: string;
  members: string[];
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'rating';
  options?: string[];
  required: boolean;
  createdAt: string;
}

export interface SurveyResponse {
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

export const teams: Team[] = [
  { id: '1', name: 'Kacyiru', members: [] },
  { id: '2', name: 'Nyarugenge', members: [] },
  { id: '3', name: 'Kicukiro', members: [] },
];

export const defaultQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is your current solution for managing inventory?',
    type: 'text',
    required: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'q2',
    text: 'How satisfied are you with your current provider?',
    type: 'rating',
    required: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'q3',
    text: 'What features are most important to you?',
    type: 'select',
    options: ['Cost Efficiency', 'Speed', 'Reliability', 'Customer Support', 'Integration'],
    required: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'q4',
    text: 'What is your monthly budget for this solution?',
    type: 'select',
    options: ['Under $500', '$500-$1000', '$1000-$5000', 'Over $5000'],
    required: false,
    createdAt: '2024-01-16',
  },
  {
    id: 'q5',
    text: 'Any specific pain points with your current setup?',
    type: 'text',
    required: false,
    createdAt: '2024-01-17',
  },
];

export const getTeamStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/responses/stats/teams', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getInterestDistribution = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/responses/stats/interest', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    const COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
    
    return data.map((item: any, index: number) => ({
      ...item,
      fill: COLORS[index % COLORS.length]
    }));
  } catch (error) {
    return [];
  }
};

export const getMockSurveyResponses = async (): Promise<SurveyResponse[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/responses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const responses = response.data;
    console.log(' response :', response)
    return responses.map((response: any) => ({
      id: response._id,
      _id: response._id,
      teamName: response.teamName,
      employeeName: response.employeeName,
      date: response.date,
      time: response.time,
      businessName: response.businessName,
      businessLocation: response.businessLocation || '',
      contactName: response.contactName,
      contactTitle: response.contactTitle || '',
      contactEmail: response.contactEmail || '',
      answers: response.answers || [],
      interestRating: response.interestRating,
      canFollowUp: response.canFollowUp,
      preferredContact: response.preferredContact || null,
      contactNumber: response.contactNumber || '',
      employeeRemarks: response.employeeRemarks || '',
      overallRating: response.overallRating || 0,
      createdAt: response.createdAt
    }));
  } catch (error) {
    return [];
  }
};