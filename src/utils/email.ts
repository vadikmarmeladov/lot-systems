import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  try {
    console.log('Sending verification email to:', email);
    
    const { data, error } = await resend.emails.send({
      from: 'auth@lot-systems.com', // Your verified domain
      to: [email],
      subject: 'Lot Systems - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Lot Systems</h2>
          <p>Your verification code is: <strong style="font-size: 24px; color: 
#4A5568;">${code}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Detailed error:', error);
    throw error;
  }
}
