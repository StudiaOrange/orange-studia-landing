// src/app/api/yookassa/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { amount, description, partnerId } = await req.json()
    const shopId = process.env.YOOKASSA_SHOP_ID
    const secretKey = process.env.YOOKASSA_SECRET_KEY

    if (!shopId || !secretKey) {
      return NextResponse.json({ testMode: true }, { status: 200 })
    }

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64')
    const res = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: { value: String(amount), currency: 'RUB' },
        description,
        metadata: { partnerId },
      }),
    })
    const data = await res.json()
    return NextResponse.json({
      confirmationUrl: data.confirmation?.confirmation_url,
      paymentId: data.id,
    })
  } catch {
    return NextResponse.json({ error: 'Payment error' }, { status: 500 })
  }
}