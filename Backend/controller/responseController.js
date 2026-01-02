import SurveyResponse from '../model/SurveyResponse.js';

const ALLOWED_TEAMS = [
  { name: 'Kacyiru' },
  { name: 'Nyarugenge' },
  { name: 'Kicukiro' },
];

export const createResponse = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const responseData = {
        ...req.body,
        userId: user._id,
        employeeName: user.name,
        teamName: user.teamName,
      };
  
      const response = await SurveyResponse.create(responseData);
      res.status(201).json(response);
    } catch (error) {
        console.log(error)
      res.status(400).json({ message: error.message });
    }
  };

export const getResponses = async (req, res) => {
  try {
    const responses = await SurveyResponse.find().sort({ createdAt: -1 });
    res.json(responses);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const getResponseById = async (req, res) => {
  try {
    const response = await SurveyResponse.findById(req.params.id);
    if (!response) return res.status(404).json({ message: 'Response not found' });
    res.json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const getTeamStats = async (req, res) => {
  try {
    const responses = await SurveyResponse.find();
    
    // Get all unique team names from responses
    const uniqueTeamNames = [...new Set(responses.map(r => r.teamName))];
    
    const stats = uniqueTeamNames.map(teamName => {
      const teamResponses = responses.filter(r => r.teamName === teamName);
      const totalRatings = teamResponses.reduce((sum, r) => sum + (r.overallRating || 0), 0);
      const avgRating = teamResponses.length > 0 ? totalRatings / teamResponses.length : 0;
      
      // Adjusted criteria: interestRating >= 3 is considered "interested"
      const highInterest = teamResponses.filter(r => r.interestRating >= 3).length;

      return {
        teamName: teamName,
        surveysCompleted: teamResponses.length,
        avgRating: Math.round(avgRating * 10) / 10,
        highInterestLeads: highInterest,
        potentialRate: teamResponses.length > 0 ? Math.round((highInterest / teamResponses.length) * 100) : 0,
      };
    });

    res.json(stats);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const getInterestDistribution = async (req, res) => {
  try {
    const responses = await SurveyResponse.find();
    
    // Initialize all categories with 0
    const distribution = [
      { name: 'Very High (5)', value: 0 },
      { name: 'High (4)', value: 0 },
      { name: 'Medium (3)', value: 0 },
      { name: 'Low (2)', value: 0 },
      { name: 'Very Low (1)', value: 0 },
    ];

    // Count each rating
    responses.forEach(response => {
      const rating = response.interestRating;
      if (rating >= 1 && rating <= 5) {
        const index = 5 - rating; // 5->0, 4->1, 3->2, 2->3, 1->4
        distribution[index].value += 1;
      }
    });

    // Filter out zero values if you want, or keep them all
    res.json(distribution);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};