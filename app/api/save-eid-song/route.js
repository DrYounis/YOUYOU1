import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  console.log('🚀 [SAVE SONG API] Route called');

  try {
    const requestData = await request.json();
    const { parentName, parentEmail, parentPhone, childName, songTitle, songLyrics, language = 'ar' } = requestData;

    console.log('💾 [SAVE SONG API] Request:', { parentName, parentEmail, childName });

    // Validate required fields
    if (!parentName || !parentEmail || !childName || !songTitle || !songLyrics) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parentEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ [SAVE SONG API] Supabase not configured');
      return NextResponse.json(
        { error: 'Database not configured. Please contact admin.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert the song
    const { data, error } = await supabase
      .from('eid_songs')
      .insert([
        {
          parent_name: parentName,
          parent_email: parentEmail,
          parent_phone: parentPhone || null,
          child_name: childName,
          song_title: songTitle,
          song_lyrics: songLyrics,
          language: language,
          is_public: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ [SAVE SONG API] Supabase error:', error);
      console.error('❌ [SAVE SONG API] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: `Failed to save song: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('✅ [SAVE SONG API] Song saved successfully:', data.id);

    return NextResponse.json({
      success: true,
      message: 'Song saved successfully!',
      songId: data.id
    });

  } catch (error) {
    console.error('❌ [SAVE SONG API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's saved songs
export async function GET(request) {
  console.log('📖 [GET SONGS API] Route called');

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's songs
    const { data, error } = await supabase
      .from('eid_songs')
      .select('*')
      .eq('parent_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [GET SONGS API] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve songs' },
        { status: 500 }
      );
    }

    console.log('✅ [GET SONGS API] Retrieved', data.length, 'songs');

    return NextResponse.json({
      success: true,
      songs: data
    });

  } catch (error) {
    console.error('❌ [GET SONGS API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
