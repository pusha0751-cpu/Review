require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-review', async (req, res) => {
  const { rating } = req.body;

  if (!rating) {
    return res.status(400).json({ error: 'Rating is required' });
  }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  
      const prompt = `Generate a very short, realistic Google review for "Chaurasiya Mobile", Sakaldiha. 
      Rating: ${rating} stars. 
      Length: Strictly 1 line or max 1.5 lines (maximum 15-20 words). 
      Style: Natural, local customer tone. 
      No hashtags, no emojis, no quotes.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    res.json({ review: text });
  } catch (error) {
    const fs = require('fs');
    fs.appendFileSync('error.log', `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n\n`);
    res.status(500).json({ error: 'Failed to generate review. Please check your API key or try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
