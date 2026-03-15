import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('🚀 [EID SONG API] Route called');
  console.log('🔑 [EID SONG API] DEEPSEEK_API_KEY exists:', !!process.env.DEEPSEEK_API_KEY);

  try {
    let requestData;
    try {
      const text = await request.text();
      console.log('📥 [EID SONG API] Raw request:', text.substring(0, 200));
      requestData = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ [EID SONG API] Failed to parse request:', parseError.message);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { childName, language = 'ar', generateAudio = false } = requestData;
    console.log('🎵 [EID SONG API] Request:', { childName, language, generateAudio });

    if (!childName) {
      return NextResponse.json(
        { error: 'Please provide child name' },
        { status: 400 }
      );
    }

    // Check if DeepSeek API key exists
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (apiKey) {
      console.log('✅ [EID SONG API] Using DeepSeek AI');
      try {
        const songData = await generateWithDeepSeek(childName, apiKey, language);
        if (songData && songData.title && songData.lyrics) {
          console.log('📦 [EID SONG API] AI Generated song:', { title: songData.title, lyricsLength: songData.lyrics.length });
          
          // Generate audio if requested
          if (generateAudio) {
            try {
              const audioBase64 = await generateArabicAudio(songData.lyrics);
              songData.audioUrl = audioBase64;
              console.log('🎵 [EID SONG API] Audio generated successfully');
            } catch (audioError) {
              console.warn('⚠️ [EID SONG API] Audio generation failed:', audioError.message);
              songData.audioUrl = null;
            }
          }
          
          return NextResponse.json(songData);
        } else {
          console.warn('⚠️ [EID SONG API] AI returned invalid data, using fallback');
        }
      } catch (aiError) {
        console.error('❌ [EID SONG API] DeepSeek AI error:', aiError.message);
      }
    } else {
      console.log('ℹ️ [EID SONG API] No API key, using template');
    }

    // Fallback to template
    console.log('✅ [EID SONG API] Using template song generator');
    const songData = generateTemplateSong(childName, language);
    console.log('📦 [EID SONG API] Template song:', { title: songData.title, lyricsLength: songData.lyrics.length });

    return NextResponse.json(songData);

  } catch (error) {
    console.error('❌ [EID SONG API] Unexpected error:', error);
    console.error('❌ [EID SONG API] Stack:', error.stack);

    // Always return valid JSON even on error
    return NextResponse.json({
      title: "أغنية العيد السعيد",
      lyrics: "عيد سعيد عيد سعيد\nكل عام وأنتم بخير\nفرحة وسعادة للجميع\nعيد مبارك عيد منير 🌙✨"
    });
  }
}

// Generate song with DeepSeek AI
async function generateWithDeepSeek(childName, apiKey, language = 'ar') {
  const isArabic = language === 'ar';

  const prompt = isArabic
    ? `اكتب أغنية خليجية احتفالية لعيد الفطر لطفل اسمه "${childName}".

المتطلبات:
- اجعل الأغنية باللهجة الخليجية (عامية خليجية)
- اجعلها فرحة ومرحة ومناسبة للأطفال
- ضمّن اسم الطفل "${childName}" بشكل بارز (استخدمه 5-8 مرات)
- اجعل الأغنية حوالي 4-6 مقاطع (آيات) مع كورس متكرر
- تركز على فرحة العيد والاحتفال
- ضمّن عناصر خليجية تقليدية (العيدية، الملابس الجديدة، الحلوى، التمر، القهوة العربية)
- أضف إيموجي احتفالية لجعل الأغنية ممتعة
- اجعل الكورس سهل التذكر والتكرار
- ابتكر عنوانًا جذابًا للأغنية

استجب فقط بكائن JSON بالتنسيق الدقيق التالي:
{"title": "عنوان الأغنية هنا", "lyrics": "كلمات الأغنية الكاملة مع المقاطع مفصولة بـ \\n\\n"}`
    : `Write a Gulf-style celebratory Eid al-Fitr song for a child named "${childName}".

Requirements:
- Make it in Gulf Arabic dialect (colloquial)
- Make it joyful and fun, suitable for children
- Include the child's name "${childName}" prominently (use it 5-8 times)
- Make it about 4-6 verses with a repeating chorus
- Focus on Eid joy and celebration
- Include traditional Gulf elements (Eidiya money, new clothes, sweets, dates, Arabic coffee)
- Add celebratory emojis to make it fun
- Make the chorus easy to remember and repeat
- Create a catchy title for the song

Respond with ONLY a JSON object in this exact format:
{"title": "Your Song Title Here", "lyrics": "The full song lyrics with verses separated by \\n\\n"}`;

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
          content: isArabic
            ? 'أنت كاتب أغاني أطفال خليجي مبدع. تكتب أغاني احتفالية ومرحة ومناسبة للأطفال لعيد الفطر. دائمًا ضمّن اسم الطفل واجعله بطل الاحتفال. أغانيك تحتوي على لهجة خليجية أصيلة وعناصر تقليدية. استجب دائمًا بـ JSON صالح.'
            : 'You are a creative Gulf-style children\'s songwriter. You write celebratory and fun songs for kids for Eid al-Fitr. You always include the child\'s name and make them the star of the celebration. Your songs have authentic Gulf dialect and traditional elements. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const aiContent = data.choices?.[0]?.message?.content || '';

  // Parse the AI response to extract JSON
  let songData;
  try {
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      songData = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found');
    }
  } catch {
    // If parsing fails, use the content as-is
    songData = {
      title: `أغنية عيد ${childName}`,
      lyrics: aiContent
    };
  }

  return songData;
}

// Generate Arabic audio using free TTS service
async function generateArabicAudio(lyrics) {
  // Clean up lyrics - remove emojis for better TTS
  const cleanLyrics = lyrics.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '');
  
  // Use Free TTS API (voicerss or similar free service)
  // Alternative: Use Google Translate TTS (unofficial but free)
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(cleanLyrics.substring(0, 200))}`;
  
  // Return the URL directly - client will handle playback
  return ttsUrl;
}

// Fallback template generator (when API is unavailable)
function generateTemplateSong(childName, language = 'ar') {
  const isArabic = language === 'ar';

  if (isArabic) {
    return {
      title: `🌙 عيد ${childName} السعيد 🌙`,
      lyrics: `🎵 الكورس 🎵
عيد سعيد عيد سعيد
يا ${childName} كل عام وأنت بخير
فرحة وسعادة للجميع
عيد مبارك عيد منير ✨

🎵 المقطع الأول 🎵
لبس ${childName} ثوبه الجديد
والعيديّة صارت في الإيد
الحلوى والتمر والشاي
والكل يقول عيد مبارك يا ${childName} يا غالي 🍬

🎵 الكورس 🎵
عيد سعيد عيد سعيد
يا ${childName} كل عام وأنت بخير
فرحة وسعادة للجميع
عيد مبارك عيد منير ✨

🎵 المقطع الثاني 🎵
${childName} يضحك ويلعب ويطير
والعيد فرحة ما بتشير
الأهل والأحباب مجتمعين
والقلب سعيد ومطمئن 🏠

🎵 الكورس 🎵
عيد سعيد عيد سعيد
يا ${childName} كل عام وأنت بخير
فرحة وسعادة للجميع
عيد مبارك عيد منير ✨

🎵 المقطع الثالث 🎵
يا ${childName} يا نجمنا الكبير
العيد فرحة والكل سرور
رمضان راح وجاء العيد
نفرح ونلعب ونزيد 🌙

🎵 الكورس الأخير 🎵
عيد سعيد عيد سعيد
يا ${childName} كل عام وأنت بخير
فرحة وسعادة للجميع
عيد مبارك عيد منير ✨

🎉 كل عام وأنت بخير يا ${childName}! 🎉`
    };
  }

  return {
    title: `🌙 ${childName}'s Happy Eid 🌙`,
    lyrics: `🎵 Chorus 🎵
Eid Mubarak, Eid Mubarak
Dear ${childName}, joy to you
Celebrating with family
Eid blessings, bright and true ✨

🎵 Verse 1 🎵
${childName} wears new clothes so bright
Eidiya money, what a delight
Sweets and dates and Arabic tea
Everyone says "Happy Eid" to ${childName} 🍬

🎵 Chorus 🎵
Eid Mubarak, Eid Mubarak
Dear ${childName}, joy to you
Celebrating with family
Eid blessings, bright and true ✨

🎵 Verse 2 🎵
${childName} laughs and plays all day
Eid happiness in every way
Family gathered all around
Joy and peace in hearts are found 🏠

🎵 Chorus 🎵
Eid Mubarak, Eid Mubarak
Dear ${childName}, joy to you
Celebrating with family
Eid blessings, bright and true ✨

🎵 Bridge 🎵
Dear ${childName}, our shining star
Eid joy reaches near and far
Ramadan's gone, now Eid is here
Let's celebrate with joy and cheer 🌙

🎵 Final Chorus 🎵
Eid Mubarak, Eid Mubarak
Dear ${childName}, joy to you
Celebrating with family
Eid blessings, bright and true ✨

🎉 Eid Mubarak, ${childName}! 🎉`
  };
}
