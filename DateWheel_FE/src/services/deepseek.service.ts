import { api } from '../api/axios';

/**
 * Calls the Backend API to translate a category name into a short English keyword,
 * then returns a pollinations.ai image URL for that keyword.
 * By calling the Backend, we avoid CORS issues when accessing Deepseek directly from the browser.
 */
export async function generateCategoryImageUrl(categoryName: string): Promise<string | null> {
  if (!categoryName.trim()) return null;

  try {
    const response = await api.post('/ai/generate-icon', { categoryName });
    if (response.data && response.data.success) {
      return response.data.data; // The URL string
    }
    return null;
  } catch (error) {
    console.error('Failed to generate image URL:', error);
    return null;
  }
}
