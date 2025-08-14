import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.3-alpha/deno-dom.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY')!;
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-pro';

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get today's date in NZ time
    const now = new Date();
    const nzTime = new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Auckland' }));
    const today = nzTime.toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if today's gospel already exists in the database
    const { data: existingGospel, error: fetchError } = await supabase
      .from('gospels')
      .select('*')
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
      console.error('Error fetching existing gospel:', fetchError);
      return new Response(JSON.stringify({ error: 'Database fetch error' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (existingGospel) {
      console.log('Today\'s gospel already exists in the database.');
      return new Response(JSON.stringify({
        verse: existingGospel.verse,
        excerpt: existingGospel.excerpt,
        source: 'database',
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // If not found, parse the Vatican News page
    const vaticanNewsUrl = 'https://www.vaticannews.va/en/word-of-the-day.html';
    const response = await fetch(vaticanNewsUrl);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const gospelElement = doc?.querySelector('.article__text');
    const gospelText = gospelElement?.textContent.trim();

    if (!gospelText) {
      return new Response(JSON.stringify({ error: 'Could not find gospel text on the page.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Use Google Gemini API to create an excerpt and book verse
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `Given the following gospel text, extract the Bible verse reference (e.g., "John 3:16" or "Matthew 5:1-12") and create a concise, meaningful excerpt (around 2-3 sentences) that captures the essence of the gospel.

Gospel Text:
"${gospelText}"

Format your response as a JSON object with 'verse' and 'excerpt' keys.`;

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response;
    const text = geminiResponse.text();

    let parsedGeminiResponse;
    try {
      parsedGeminiResponse = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Gemini raw text:', text);
      return new Response(JSON.stringify({ error: 'Failed to parse Gemini API response.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const { verse, excerpt } = parsedGeminiResponse;

    if (!verse || !excerpt) {
      return new Response(JSON.stringify({ error: 'Gemini API did not return expected verse and excerpt.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Save to database
    const { data, error: insertError } = await supabase
      .from('gospels')
      .insert([{ date: today, verse, excerpt }])
      .select();

    if (insertError) {
      console.error('Error inserting gospel into database:', insertError);
      return new Response(JSON.stringify({ error: 'Database insert error' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('Successfully parsed, processed, and saved today\'s gospel.');
    return new Response(JSON.stringify({ verse, excerpt, source: 'newly_parsed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
