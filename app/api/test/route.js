import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Story API is working!',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  console.log('🚀 [TEST API] Route called');
  
  try {
    const text = await request.text();
    console.log('📥 [TEST API] Raw request:', text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    console.log('📦 [TEST API] Parsed data:', data);
    
    return NextResponse.json({ 
      status: 'success',
      received: data,
      message: 'API is working correctly!'
    });
  } catch (error) {
    console.error('❌ [TEST API] Error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error.message 
    }, { status: 500 });
  }
}
