import { Request, Response, NextFunction } from 'express';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-v4-flash';
const DEEPSEEK_API_KEY = 'sk-a0d646dce7054f5192ec118438395cc4';

export const generateIconUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant. The user will give you a category name (possibly in Vietnamese or any language). Your job is to reply with ONLY 2-4 English words that DIRECTLY and VISUALLY represent that exact category name as a clear, recognizable icon image. The image MUST look like what the category name describes — not something loosely related. For example: if the name is "Cà phê" reply "coffee cup latte art", if "Xem phim" reply "cinema movie screen", if "Bún bò" reply "Vietnamese bun bo hue bowl", if "Pizza" reply "pepperoni pizza slice". Always be SPECIFIC and LITERAL to the category name. Do NOT output anything related to violence, death, gore, or NSFW content. If the user input is inappropriate or violent, fallback to "cute toy". Do NOT include any explanation, punctuation, or extra text. Just the keywords.',
          },
          {
            role: 'user',
            content: categoryName,
          },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('Deepseek API error:', response.status, response.statusText);
      return res.status(500).json({ success: false, message: 'Failed to generate keyword from AI' });
    }

    const data = await response.json();
    const keyword = data?.choices?.[0]?.message?.content?.trim();

    if (!keyword) {
      return res.status(500).json({ success: false, message: 'AI returned empty keyword' });
    }

    const encodedKeyword = encodeURIComponent(`${keyword}, clean icon style, centered, white background, highly detailed, realistic, professional product photography`);
    const seed = Math.floor(Math.random() * 999999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedKeyword}?width=256&height=256&nologo=true&seed=${seed}&safe=true`;

    res.status(200).json({ success: true, data: imageUrl });
  } catch (error) {
    next(error);
  }
};
