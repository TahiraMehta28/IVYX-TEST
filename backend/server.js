// backend/server.js - With MongoDB Database

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const app = express();

const allowedOrigins = [
  'http://localhost:3000', 
  'https://ivyx-test-2.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ============================================
// MONGODB CONNECTION
// ============================================

// MONGODB CONNECTION
// ============================================

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in environment variables!");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ============================================
// MONGODB SCHEMAS
// ============================================

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production: use bcrypt
  grade: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Assessment History Schema
const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formData: {
    grade9: String,
    grade10: String,
    grade11: String,
    grade12: String,
    advancedCourses: String,
    scholarAwards: String,
    satScore: String,
    extracurriculars: String,
    leadership: String,
    volunteerWork: String,
    uniqueSkills: String,
    internationalExperience: String
  },
  results: {
    overallScore: Number,
    academicScore: Number,
    extracurricularScore: Number,
    summary: String,
    strengths: [String],
    improvements: [String],
    recommendations: [String],
    targetSchools: [{
      name: String,
      reasoning: String
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Assessment = mongoose.model('Assessment', assessmentSchema);

// ============================================
// AUTH ENDPOINTS
// ============================================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, grade, country } = req.body;
    
    console.log('📝 Signup request:', { fullName, email, grade, country });
    
    if (!fullName || !email || !password || !grade || !country) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }
    
    // Create user
    const user = new User({ 
      fullName, 
      email, 
      password, // In production: hash with bcrypt
      grade, 
      country
    });
    
    await user.save();
    
    console.log('✅ User created:', email);
    
    res.json({ 
      token: 'mock-token-' + user._id,
      user: { 
        id: user._id,
        fullName: user.fullName, 
        email: user.email, 
        grade: user.grade, 
        country: user.country 
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login request:', email);
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ email, password });
    
    if (!user) {
      console.log('❌ Login failed: Invalid credentials');
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    console.log('✅ Login successful:', email);
    
    res.json({ 
      token: 'mock-token-' + user._id,
      user: { 
        id: user._id,
        fullName: user.fullName, 
        email: user.email, 
        grade: user.grade, 
        country: user.country 
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// AI GENERATE ENDPOINT
// ============================================

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    console.log('🤖 AI Generate request received');
    console.log('📝 Prompt length:', prompt?.length || 0);
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found');
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured'
      });
    }
    
    console.log('🔄 Calling OpenAI API...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert college admissions counselor specializing in Ivy League universities. You must respond ONLY with valid JSON, no markdown formatting, no extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = completion.choices[0].message.content;
    
    console.log('✅ OpenAI response received');
    console.log('📊 Response length:', aiResponse.length);
    
    res.json({
      success: true,
      reply: aiResponse,
      isRealAI: true,
      model: "gpt-4o-mini",
      tokensUsed: completion.usage?.total_tokens
    });
    
  } catch (error) {
    console.error('❌ AI Generate error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI response'
    });
  }
});

// ============================================
// HISTORY ENDPOINTS (MONGODB)
// ============================================

// Save Assessment
app.post('/api/history/save', async (req, res) => {
  try {
    const { userId, formData, results } = req.body;
    
    console.log('💾 Saving assessment for user:', userId);
    
    if (!userId || !formData || !results) {
      return res.status(400).json({
        success: false,
        message: 'userId, formData, and results are required'
      });
    }
    
    const assessment = new Assessment({
      userId,
      formData,
      results
    });
    
    await assessment.save();
    
    const totalAssessments = await Assessment.countDocuments({ userId });
    
    console.log('✅ Assessment saved to MongoDB. Total for user:', totalAssessments);
    
    res.json({
      success: true,
      assessment: {
        id: assessment._id,
        ...assessment.toObject()
      },
      totalAssessments
    });
    
  } catch (error) {
    console.error('❌ Save assessment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get User History
app.get('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    console.log('📖 Fetching history for user:', userId);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }
    
    let query = Assessment.find({ userId }).sort({ createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const history = await query.exec();
    
    console.log('✅ Returning', history.length, 'assessments from MongoDB');
    
    res.json({
      success: true,
      history: history.map(h => ({
        id: h._id,
        date: h.createdAt,
        formData: h.formData,
        results: h.results
      })),
      total: history.length
    });
    
  } catch (error) {
    console.error('❌ Get history error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete Single Assessment
app.delete('/api/history/:userId/:assessmentId', async (req, res) => {
  try {
    const { userId, assessmentId } = req.params;
    
    console.log('🗑️ Deleting assessment:', assessmentId, 'for user:', userId);
    
    const result = await Assessment.findOneAndDelete({ 
      _id: assessmentId, 
      userId 
    });
    
    if (result) {
      const remaining = await Assessment.countDocuments({ userId });
      
      console.log('✅ Assessment deleted from MongoDB');
      res.json({
        success: true,
        message: 'Assessment deleted',
        remaining
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
  } catch (error) {
    console.error('❌ Delete assessment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Clear All History for User
app.delete('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('🗑️ Clearing all history for user:', userId);
    
    const result = await Assessment.deleteMany({ userId });
    
    console.log('✅ Cleared', result.deletedCount, 'assessments from MongoDB');
    
    res.json({
      success: true,
      message: 'All history cleared',
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('❌ Clear history error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get Assessment Statistics
app.get('/api/history/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const history = await Assessment.find({ userId }).sort({ createdAt: -1 });
    
    if (history.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalAssessments: 0,
          averageOverallScore: 0,
          averageAcademicScore: 0,
          averageExtracurricularScore: 0,
          highestScore: 0,
          lowestScore: 0,
          improvement: 0
        }
      });
    }
    
    const scores = history.map(a => a.results.overallScore);
    const academicScores = history.map(a => a.results.academicScore);
    const extracurricularScores = history.map(a => a.results.extracurricularScore);
    
    const stats = {
      totalAssessments: history.length,
      averageOverallScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      averageAcademicScore: Math.round(academicScores.reduce((a, b) => a + b, 0) / academicScores.length),
      averageExtracurricularScore: Math.round(extracurricularScores.reduce((a, b) => a + b, 0) / extracurricularScores.length),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      improvement: history.length > 1 ? scores[0] - scores[scores.length - 1] : 0,
      lastAssessmentDate: history[0].createdAt
    };
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/', async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAssessments = await Assessment.countDocuments();
  
  res.json({ 
    status: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    endpoints: {
      auth: [
        'POST /api/auth/signup',
        'POST /api/auth/login'
      ],
      ai: [
        'POST /api/generate'
      ],
      history: [
        'POST /api/history/save',
        'GET /api/history/:userId',
        'GET /api/history/:userId/stats',
        'DELETE /api/history/:userId/:assessmentId',
        'DELETE /api/history/:userId'
      ]
    },
    stats: {
      totalUsers,
      totalAssessments
    }
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 IvyX Backend Server Started');
  console.log('='.repeat(60));
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log(`✅ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Connecting...'}`);
  console.log(`✅ Auth endpoints ready`);
  console.log(`✅ AI endpoint ready`);
  console.log(`✅ History endpoints ready (MongoDB)`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ NOT CONFIGURED'}`);
  console.log('='.repeat(60));
  console.log('');
});