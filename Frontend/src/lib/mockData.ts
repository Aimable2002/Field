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
  { id: '4', name: 'Gasabo', members: []  },
];

export const defaultQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What best describes this business?',
    type: 'select',
    options: ['Retailer', 'Wholesaler', 'Supplier / Distributor', 'Accommodation / Restaurant', 'Contractor / Other'],
    required: true,
    createdAt: '2026-1',
  },
  {
    id: 'q2',
    text: 'How often do you buy or sell supplies?',
    type: 'select',
    options: ['daily', 'weekly', 'monthly', 'Occasionally'],
    required: true,
    createdAt: '2026-1',
  },
  {
    id: 'q3',
    text: 'How do you usually find suppliers or buyers when you need something?',
    type: 'text',
    required: true,
    createdAt: '2026-1',
  },
  {
    id: 'q4',
    text: `Is it True that the Following can scale or hold back business \n1. Competitive prices \n2. responsible supply chains
    \n3. business parterner reliability`,
    type: 'rating',
    required: true,
    createdAt: '2026-1',
  },
  {
    id: 'q5',
    text: `how would you feel having a way to analyse/compare multiple supplier pricing in one place \nin terms of 
    \n1. best affordable prices \n2. fastest delivery`,
    type: 'rating',
    required: true,
    createdAt: '2026-1',
  },
  {
    id: 'q6',
    text: `What causes you the most frustration?\n1. Comparing prices \n2. Finding trusted partners
    \n3. Slow responses \n4. Limited options \n5. Wasted time / follow-ups`,
    type: 'select',
    options: ['Cost Efficiency', 'Speed', 'Reliability', 'Customer Support', 'Integration'],
    required: true,
    createdAt: '2026-1',
  },
  {
    id: 'q7',
    text: 'What is your monthly budget for this solution?',
    type: 'select',
    options: ['Under RF 50,000', 'RF 50,000-RF 100,000', 'RF 100,000-RF500,000', 'Over RF 1,000,000'],
    required: false,
    createdAt: '2024-01-16',
  },
  {
    id: 'q8',
    text: 'If we help you personally, when could you try this platform and make your first request?',
    type: 'select',
    options: ['To day', 'This week', 'This month', 'Not Sure'],
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