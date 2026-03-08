import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { childName, childAge, storyConcept } = await request.json();

    if (!childName || !childAge || !storyConcept) {
      return NextResponse.json(
        { error: 'Please provide child name, age, and story concept' },
        { status: 400 }
      );
    }

    const prompt = `Write a magical bedtime story for a ${childAge}-year-old child named ${childName}.

Story concept/theme: ${storyConcept}

Requirements:
- Make it warm, comforting, and age-appropriate for a ${childAge}-year-old
- Include the child's name "${childName}" as the main character (use it 3-5 times)
- Keep it around 300-400 words (perfect for bedtime reading)
- Include a gentle moral or positive message
- Use simple, engaging language that a ${childAge}-year-old can understand
- Add a peaceful, sleepy ending that helps with relaxation
- Include some emojis to make it fun and visual (but not too many)
- Create a catchy title

Format your response as JSON exactly like this:
{
  "title": "Your Story Title Here",
  "content": "The full story text with paragraphs separated by \\n\\n"
}

Make the story unique, creative, and magical!`;

    // Check if Groq API key exists
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      // Fallback to template stories if no API key
      return NextResponse.json(generateTemplateStory(childName, childAge, storyConcept));
    }

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a wonderful children's bedtime story writer. You create magical, comforting, and age-appropriate stories that help children feel safe, loved, and ready for sleep. You always include the child's name and make them the hero of their own adventure. Your stories have gentle morals and peaceful endings.`
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

    if (!aiResponse.ok) {
      console.error('Groq API error:', aiResponse.status);
      // Fallback to template
      return NextResponse.json(generateTemplateStory(childName, childAge, storyConcept));
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
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
        title: `${childName}'s Magical Adventure`,
        content: aiContent
      };
    }

    return NextResponse.json(storyData);

  } catch (error) {
    console.error('Story generation error:', error);
    
    const { childName, childAge, storyConcept } = await request.json();
    return NextResponse.json(generateTemplateStory(childName, childAge, storyConcept));
  }
}

// Fallback template generator (when API is unavailable)
function generateTemplateStory(name, age, concept) {
  const templates = [
    {
      title: `🌟 ${name}'s Magical ${concept.charAt(0).toUpperCase() + concept.slice(1)} Adventure`,
      content: `Once upon a time, in a cozy little house just like yours, lived a brave ${age}-year-old adventurer named ${name}. 🏠✨

One peaceful evening, ${name} discovered something magical about: ${concept}. It was like finding a secret treasure! 💎

${name} closed their eyes and imagined floating on a fluffy cloud ☁️, drifting through a sky filled with twinkling stars ⭐. Each star whispered kind words: "You are brave, ${name}!" "You are kind!" "You are special!"

As ${name} journeyed through this dreamy land, they met friendly characters who loved ${concept} just as much as they did! Together, they learned that the most magical thing in the whole universe was... believing in yourself! 🌈

The moon smiled down and sang a gentle lullaby 🌙🎵. ${name} felt warm, safe, and so very sleepy...

And as ${name}'s eyes grew heavy, they knew that tomorrow would bring new adventures. But for now, it was time to rest and dream sweet dreams. 💤

Goodnight, brave ${name}. The end. 🌟`
    }
  ];
  return templates[0];
}
