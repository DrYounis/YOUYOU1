import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('🚀 API Route called');
  
  try {
    let requestData;
    try {
      requestData = await request.json();
      console.log('📥 Request data:', requestData);
    } catch (parseError) {
      console.error('Failed to parse request:', parseError);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { childName, childAge, storyConcept } = requestData;

    console.log('📖 Story request received:', { childName, childAge, storyConcept });
    console.log('🔑 DeepSeek API Key exists:', !!process.env.DEEPSEEK_API_KEY);

    if (!childName || !childAge || !storyConcept) {
      return NextResponse.json(
        { error: 'Please provide child name, age, and story concept' },
        { status: 400 }
      );
    }

    // Check if DeepSeek API key exists
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (apiKey) {
      console.log('✅ Using DeepSeek AI');
      try {
        const storyData = await generateWithDeepSeek(childName, childAge, storyConcept, apiKey);
        console.log('📦 AI Generated story:', { title: storyData.title, contentLength: storyData.content.length });
        return NextResponse.json(storyData);
      } catch (aiError) {
        console.error('DeepSeek AI error, using fallback:', aiError.message);
      }
    }

    // Fallback to template
    console.log('✅ Using template story generator (fallback)');
    const storyData = generateTemplateStory(childName, childAge, storyConcept);
    console.log('📦 Generated story:', { title: storyData.title, contentLength: storyData.content.length });
    
    return NextResponse.json(storyData);

  } catch (error) {
    console.error('❌ Story generation error:', error);
    console.error('Error details:', error.message, error.stack);
    
    // Return a valid JSON response even on error
    return NextResponse.json({
      title: "A Magical Bedtime Story",
      content: "Once upon a time, there was a wonderful child who loved adventures. One day, they discovered something magical that changed their life forever. And they lived happily ever after. 🌟"
    });
  }
}

// Generate story with DeepSeek AI
async function generateWithDeepSeek(name, age, concept, apiKey) {
  const prompt = `Write a magical bedtime story for a ${age}-year-old child named ${name}.

Story concept/theme: ${concept}

Requirements:
- Make it warm, comforting, and age-appropriate for a ${age}-year-old
- Include the child's name "${name}" as the main character (use it 3-5 times)
- Keep it around 300-400 words (perfect for bedtime reading)
- Include a gentle moral or positive message
- Use simple, engaging language that a ${age}-year-old can understand
- Add a peaceful, sleepy ending that helps with relaxation
- Include some emojis to make it fun and visual (but not too many)
- Create a catchy title

Respond with ONLY a JSON object in this exact format:
{"title": "Your Story Title Here", "content": "The full story text with paragraphs separated by \\n\\n"}`;

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a wonderful children\'s bedtime story writer. You create magical, comforting, and age-appropriate stories that help children feel safe, loved, and ready for sleep. You always include the child\'s name and make them the hero of their own adventure. Your stories have gentle morals and peaceful endings. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const aiContent = data.choices?.[0]?.message?.content || '';

  // Parse the AI response to extract JSON
  let storyData;
  try {
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      storyData = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found');
    }
  } catch {
    // If parsing fails, use the content as-is
    storyData = {
      title: `${name}'s Magical Adventure`,
      content: aiContent
    };
  }

  return storyData;
}

// Fallback template generator (when API is unavailable)
function generateTemplateStory(name, age, concept) {
  const capitalizedConcept = concept.charAt(0).toUpperCase() + concept.slice(1);
  
  return {
    title: `🌟 ${name}'s Magical ${capitalizedConcept} Adventure`,
    content: `Once upon a time, in a cozy little house just like yours, lived a brave ${age}-year-old adventurer named ${name}. 🏠✨

One peaceful evening, ${name} discovered something magical about: ${concept}. It was like finding a secret treasure! 💎

${name} closed their eyes and imagined floating on a fluffy cloud ☁️, drifting through a sky filled with twinkling stars ⭐. Each star whispered kind words: "You are brave, ${name}!" "You are kind!" "You are special!"

As ${name} journeyed through this dreamy land, they met friendly characters who loved ${concept} just as much as they did! Together, they learned that the most magical thing in the whole universe was... believing in yourself! 🌈

The moon smiled down and sang a gentle lullaby 🌙🎵. ${name} felt warm, safe, and so very sleepy...

And as ${name}'s eyes grew heavy, they knew that tomorrow would bring new adventures. But for now, it was time to rest and dream sweet dreams. 💤

Goodnight, brave ${name}. The end. 🌟`
  };
}
