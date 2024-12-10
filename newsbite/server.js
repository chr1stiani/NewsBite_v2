const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { JSDOM } = require('jsdom');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper function to clean text
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .replace(/[^\w\s.,?!-]/g, ' ')
        .trim()
        .slice(0, 1000); // Reduced from 5000 to 1000 to prevent API issues
}

// Helper function to extract main content from HTML
function extractMainContent(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Remove scripts, styles, and other non-content elements
    const elementsToRemove = document.querySelectorAll('script, style, nav, header, footer, iframe, noscript');
    elementsToRemove.forEach(element => element.remove());
    
    // Get text from main content areas
    const mainContent = document.querySelector('main, article, .content, #content, .main');
    const textContent = mainContent ? mainContent.textContent : document.body.textContent;
    
    return cleanText(textContent);
}

app.post('/api/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        let contentToSummarize = text;

        // If it's a URL, fetch and extract content
        if (text.startsWith('http')) {
            try {
                const webResponse = await axios.get(text);
                contentToSummarize = extractMainContent(webResponse.data);
            } catch (error) {
                throw new Error('Failed to fetch URL content');
            }
        } else {
            contentToSummarize = cleanText(text);
        }

        // Check if content is too short
        if (contentToSummarize.length < 50) {
            throw new Error('Text is too short to summarize');
        }

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
            {
                inputs: contentToSummarize,
                parameters: {
                    max_new_tokens: 150,  // Changed from max_length
                    min_new_tokens: 30,   // Changed from min_length
                    do_sample: false,
                    num_beams: 4,         // Added for better summary quality
                    no_repeat_ngram_size: 3,  // Prevent repetition
                    length_penalty: 2.0    // Encourage longer summaries
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        if (response.data && response.data[0] && response.data[0].summary_text) {
            res.json({ summary: response.data[0].summary_text });
        } else {
            throw new Error('Failed to generate summary');
        }

    } catch (error) {
        console.error('Summarization error:', error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
