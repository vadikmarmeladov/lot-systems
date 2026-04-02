import { Resend } from 'resend';
import https from 'https';
import config from '../config.js';
let resend = null;
function getResendClient() {
    if (resend)
        return resend;
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set. Email sending is unavailable.');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
    return resend;
}
/**
 * Send email using the Resend REST API directly via https.request.
 * This bypasses Node.js global fetch which may fail with
 * "self-signed certificate in certificate chain" in some environments.
 */
function resendApiRequest(apiKey, emailData) {
    return new Promise((resolve) => {
        const body = JSON.stringify(emailData);
        const req = https.request({
            hostname: 'api.resend.com',
            path: '/emails',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
            // Allow self-signed certificates in the chain (e.g. corporate proxies, DigitalOcean)
            rejectUnauthorized: false,
        }, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => { responseBody += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseBody);
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({ data: parsed, error: null });
                    }
                    else {
                        resolve({ data: null, error: parsed });
                    }
                }
                catch {
                    resolve({ data: null, error: { message: `HTTP ${res.statusCode}: ${responseBody}` } });
                }
            });
        });
        req.on('error', (err) => {
            resolve({ data: null, error: { message: err.message } });
        });
        req.write(body);
        req.end();
    });
}
export async function sendEmail({ to, html, text, subject }) {
    try {
        console.log('Starting email send process...', {
            to,
            subject,
            apiKeyExists: !!process.env.RESEND_API_KEY,
            timestamp: new Date().toISOString()
        });
        const from = config.email.fromName
            ? `${config.email.fromName} <${config.email.fromEmail}>`
            : config.email.fromEmail;
        const emailData = {
            from,
            to: [to],
            subject,
            ...(html && { html }),
            ...(text && { text }),
        };
        console.log('Preparing to send email with data:', {
            ...emailData,
            html: html ? 'HTML content hidden for logging' : undefined,
            text: text ? 'Text content hidden for logging' : undefined
        });
        let data;
        let error;
        // First, try the Resend SDK
        try {
            const client = getResendClient();
            const result = await client.emails.send(emailData);
            console.log('Raw Resend response:', result);
            data = result.data;
            error = result.error;
        }
        catch (resendError) {
            // If the SDK fails for any reason (certificate issues, network errors, etc.),
            // fall back to direct HTTPS request which bypasses Node.js TLS restrictions
            const errMsg = resendError?.message || '';
            console.warn('Resend SDK failed, falling back to direct HTTPS:', errMsg);
            const apiKey = process.env.RESEND_API_KEY;
            if (!apiKey)
                throw new Error('RESEND_API_KEY is not set');
            const result = await resendApiRequest(apiKey, emailData);
            data = result.data;
            error = result.error;
        }
        if (error) {
            console.error('Resend returned error:', {
                error,
                errorDetails: error.message,
                errorCode: error.statusCode
            });
            throw error;
        }
        console.log('Email sent successfully:', {
            to,
            messageId: data?.id,
            timestamp: new Date().toISOString()
        });
        return { success: true, messageId: data?.id };
    }
    catch (error) {
        console.error('Email sending failed:', {
            error: error?.message,
            stack: error?.stack,
            to,
            timestamp: new Date().toISOString()
        });
        return {
            success: false,
            error: error?.message || 'Unknown error occurred'
        };
    }
}
