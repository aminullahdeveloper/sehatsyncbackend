const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.generateHealthStatus = async (req, res) => {
  const { text } = req.body;

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Based on the following lab reports and prescription summaries, provide a current health status in 100 words and don't mention any heading : ${text}` },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const healthStatus = openaiResponse.data.choices[0].message.content.trim();

    const urduOpenaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Based on the following lab reports and prescription summaries, provide a current health status in 100 words and don't mention any heading and respond in urdu : ${text}` },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const healthStatusUrdu = urduOpenaiResponse.data.choices[0].message.content.trim();

    res.json({ summary: healthStatus, summaryUrdu: healthStatusUrdu });
  } catch (error) {
    console.error('Health status generation error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.summarizeLab = async (req, res) => {
  const { text } = req.body;

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Summarize the following medical info in 50 understandable words as I am a patient  and also consider the date with each info while making the response and also ignore any irrelevant information provided by me: ${text}` },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const summary = openaiResponse.data.choices[0].message.content.trim();

    const urduOpenaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Summarize the following medical info in 50 understandable words as I am a patient and also consider the date with each info while making the response and also ignore any irrelevant information provided by me and respond in urdu : ${text}` },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const summaryUrdu = urduOpenaiResponse.data.choices[0].message.content.trim();

    res.json({ summary, summaryUrdu });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.summarizePresc = async (req, res) => {
  const { presc } = req.body;

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Summarize the following prescription in 50 words because I am a patient and I don't know what is the use for the prescription given to me: ${presc}` },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const summary = openaiResponse.data.choices[0].message.content.trim();

    const urduOpenaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Summarize the following prescription in 50 words because I am a patient and I don't know what is the use for the prescription given to me, and dont mention any heading and respond in urdu: ${presc}` },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const summaryUrdu = urduOpenaiResponse.data.choices[0].message.content.trim();

    res.json({ summary, summaryUrdu });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.performOCR = async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const uploadsDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const imagePath = path.join(uploadsDir, `image_${Date.now()}.jpg`);

    fs.writeFile(imagePath, buffer, async (err) => {
      if (err) {
        console.error('Failed to save image:', err);
        return res.status(500).json({ error: 'Failed to save image' });
      }

      try {
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Failed to delete image file:', unlinkErr);
          }
        });

        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: `I am a patient and this is my medical Laboratory report OCR text. I am not a doctor. Please give me a summary in 50 simple and understandable words for me and ignore any invalid information that does not correspond to lab data if it exists in my input and don't mention the heading Summary:\n\n${text}` },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
          }
        );

        const summary = openaiResponse.data.choices[0].message.content.trim();

        const urduOpenaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: `I am a patient and this is my medical Laboratory report OCR text. I am not a doctor. Please give me a summary in 50 simple and understandable words for me and ignore any invalid information that does not correspond to lab data if it exists in my input and don't mention the heading Summary and respond in urdu:\n\n${text}` },
            ], 
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
          }
        );

        const summaryUrdu = urduOpenaiResponse.data.choices[0].message.content.trim();

        res.json({ text, summary, summaryUrdu });
      } catch (error) {
        console.error('OCR or Summarization error:', error);
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: error.message });
  }
};
