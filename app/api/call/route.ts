import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Get the farmer's phone number from the frontend request
    const body = await req.json();
    const { customerNumber } = body;

    if (!customerNumber) {
      return NextResponse.json({ error: 'Customer phone number is required' }, { status: 400 });
    }

    // 2. Securely call the Vapi API from the backend
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VAPI_PRIVATE_KEY}`, // Hidden from users
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID, // The +1 (512)... number
        customer: {
          number: customerNumber, // The number we want to dial (e.g., +91...)
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Vapi Outbound Error:", data);
      return NextResponse.json({ error: 'Failed to initiate call', details: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, callId: data.id, message: "Calling farmer now!" });

  } catch (error) {
    console.error('Server error making outbound call:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}