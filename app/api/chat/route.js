import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function POST(request) {
  try {
    const token = request.cookies.get('spv_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const message = String(body.message || '').trim();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.businessId,
        chatInput: message,
        source: 'portal'
      })
    });

    if (!n8nResponse.ok) {
      return NextResponse.json({ error: 'Automation unavailable' }, { status: 502 });
    }

    const data = await n8nResponse.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Automation unavailable' }, { status: 500 });
  }
}