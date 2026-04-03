// ── Razorpay Payment API ─────────────────────────────────
// POST /api/payments — Create a Razorpay order
// POST /api/payments/verify — Verify payment after completion

import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

const PLANS = {
  monthly_99: { amount: 9900, currency: 'INR', description: 'Monthly Plan - ₹99/month' },
  yearly_799: { amount: 79900, currency: 'INR', description: 'Annual Plan - ₹799/year' },
  single_subject_29: { amount: 2900, currency: 'INR', description: 'Single Subject - ₹29/month' }
}

// Create order
export async function POST(request) {
  try {
    const { plan, studentId, studentName, studentPhone } = await request.json()

    if (!PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const planDetails = PLANS[plan]

    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount: planDetails.amount,
      currency: planDetails.currency,
      receipt: `lms_${studentId}_${Date.now()}`,
      notes: {
        student_id: studentId,
        plan: plan,
        student_name: studentName
      }
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      prefill: {
        name: studentName,
        contact: studentPhone
      },
      notes: order.notes
    })
  } catch (error) {
    console.error('Razorpay order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
