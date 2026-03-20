
// Backend service for AI-powered note management using Gemini API
// Install: npm install @google/generative-ai

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetchuser = require('../fetch');
const Note = require('../note.js');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Get AI model instance
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// ===== AI-Powered Features =====

// 1. Auto-generate tags from note content
router.post('/auto-tag', fetchuser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const prompt = `Analyze this note and suggest 3-5 relevant tags/categories in JSON format:
    Title: ${title}
    Description: ${description}
    
    Return ONLY valid JSON: {"tags": ["tag1", "tag2", "tag3"]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{.*\}/s);
    const tags = jsonMatch ? JSON.parse(jsonMatch[0]).tags : [];

    res.json({ tags });
  } catch (error) {
    console.error('AI tagging error:', error);
    res.status(500).json({ error: 'Failed to generate tags' });
  }
});

// 2. Generate smart priority suggestion
router.post('/suggest-priority', fetchuser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const prompt = `Based on the urgency and importance of this task, suggest a priority level:
    Title: ${title}
    Description: ${description}
    
    Return ONLY one of: p0, p1, p2
    p0 = Critical/Urgent
    p1 = High/Important
    p2 = Normal/Low`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const priority = response.text().trim().toLowerCase();

    res.json({ priority: ['p0', 'p1', 'p2'].includes(priority) ? priority : 'p1' });
  } catch (error) {
    console.error('Priority suggestion error:', error);
    res.status(500).json({ error: 'Failed to suggest priority' });
  }
});

// 3. Generate note summary
router.post('/summarize', fetchuser, async (req, res) => {
  try {
    const { description } = req.body;
    const prompt = `Summarize this note in 1-2 concise sentences:
    ${description}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

// 4. Generate time estimation
router.post('/estimate-time', fetchuser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const prompt = `Estimate how long this task might take in hours:
    Title: ${title}
    Description: ${description}
    
    Return ONLY a number (e.g., 2, 0.5, 8)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const timeStr = response.text().trim();
    const estimatedTime = parseFloat(timeStr) || 1;

    res.json({ estimatedTime });
  } catch (error) {
    console.error('Time estimation error:', error);
    res.status(500).json({ error: 'Failed to estimate time' });
  }
});

// 5. Get productivity insights
router.get('/productivity-insights', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ user: userId });

    // Calculate statistics
    const totalTasks = notes.length;
    const completedTasks = notes.filter(n => n.status === 'completed').length;
    const pendingTasks = notes.filter(n => n.status === 'pending').length;
    const inProgressTasks = notes.filter(n => n.status === 'inProgress').length;

    const completionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
    const avgPriority = notes.length > 0 
      ? (notes.reduce((acc, n) => acc + (n.priority === 'p0' ? 3 : n.priority === 'p1' ? 2 : 1), 0) / notes.length).toFixed(1)
      : 0;

    // Get AI recommendations
    const prompt = `Based on these productivity metrics, provide 2-3 actionable recommendations:
    - Total tasks: ${totalTasks}
    - Completed: ${completedTasks} (${completionRate}%)
    - Pending: ${pendingTasks}
    - In Progress: ${inProgressTasks}
    - Average priority level: ${avgPriority}/3
    
    Keep recommendations concise and specific.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = response.text();

    res.json({
      metrics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completionRate,
        avgPriority,
      },
      recommendations,
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// 6. Duplicate detection - find similar notes
router.post('/find-similar', fetchuser, async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user.id;
    const userNotes = await Note.find({ user: userId });

    if (userNotes.length === 0) {
      return res.json({ similarNotes: [] });
    }

    // Simple similarity check using AI
    const noteSummaries = userNotes.map(n => `${n.title}: ${n.description}`).join('\n');
    const prompt = `Find notes similar to this one in the list below:
    New note: ${description}
    
    Existing notes:
    ${noteSummaries}
    
    Return a JSON array of indices of similar notes or empty array.
    Format: {"similarIndices": [0, 2]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{.*\}/s);
    const similarIndices = jsonMatch ? JSON.parse(jsonMatch[0]).similarIndices : [];
    
    const similarNotes = similarIndices.map(idx => userNotes[idx]).filter(n => n);

    res.json({ similarNotes });
  } catch (error) {
    console.error('Similarity detection error:', error);
    res.status(500).json({ error: 'Failed to find similar notes' });
  }
});

// 7. Generate smart description from keywords
router.post('/expand-description', fetchuser, async (req, res) => {
  try {
    const { title, keywords } = req.body;
    const prompt = `Create a comprehensive task description from these keywords for: "${title}"
    Keywords: ${keywords}
    
    Generate a 2-3 sentence detailed description that expands on the keywords.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const expandedDescription = response.text();

    res.json({ expandedDescription });
  } catch (error) {
    console.error('Description expansion error:', error);
    res.status(500).json({ error: 'Failed to expand description' });
  }
});

// 8. Intelligent note classification
router.post('/classify-note', fetchuser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const prompt = `Classify this task into one category:
    Title: ${title}
    Description: ${description}
    
    Categories: Work, Personal, Health, Education, Finance, Other
    Return ONLY the category name.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const category = response.text().trim();

    res.json({ category });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Failed to classify' });
  }
});

module.exports = router;
