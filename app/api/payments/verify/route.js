import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, studentId, subjectId } = await request.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Calculate expiry
    const expiresAt = new Date()
    if (plan === 'monthly_99') expiresAt.setMonth(expiresAt.getMonth() + 1)
    else if (plan === 'yearly_799') expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    else expiresAt.setMonth(expiresAt.getMonth() + 1)

    const amounts = { monthly_99: 9900, yearly_799: 79900, single_subject_29: 2900 }

    // Create subscription record
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        student_id: studentId,
        plan,
        subject_id: subjectId || null,
        razorpay_payment_id,
        amount_paise: amounts[plan],
        expires_at: expiresAt.toISOString()
      })

    if (error) throw error

    return NextResponse.json({ success: true, expiresAt: expiresAt.toISOString() })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
