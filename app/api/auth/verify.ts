import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const storedCode = cookies().get('verification_code')?.value;

    if (!storedCode) {
      return NextResponse.json(
        { error: 'Verification code expired' },
        { status: 400 }
      );
    }

    if (code !== storedCode) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Clear verification code
    cookies().delete('verification_code');

    // Set authentication cookie
    cookies().set('auth_token', 'user_authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Verification successful' 
    });

  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
