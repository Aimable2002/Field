import User from '../model/User.js';
import jwt from 'jsonwebtoken';

const ALLOWED_TEAMS = [
  { id: '1', name: 'Kacyiru' },
  { id: '2', name: 'Nyarugenge' },
  { id: '3', name: 'Kicukiro' },
];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const team = ALLOWED_TEAMS.find(t => t.name === user.teamName);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        teamId: team ? team.id : '',
        teamName: user.teamName,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, teamId } = req.body;

    if (!name || !email || !password || !teamId) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const team = ALLOWED_TEAMS.find(t => t.id === teamId);
    if (!team) {
      return res.status(400).json({ message: 'Invalid team selected' });
    }

    const user = await User.create({
      name,
      email,
      password,
      teamName: team.name,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        teamName: user.teamName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, teamId } = req.body;

    if (!email || !password || !teamId) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const team = ALLOWED_TEAMS.find(t => t.id === teamId);
    if (!team) {
      return res.status(400).json({ message: 'Invalid team selected' });
    }

    const user = await User.findOne({ email, teamName: team.name });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        teamName: user.teamName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};