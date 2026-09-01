/**
 * Stripe Webhook Local Smoke Test Script
 * 
 * Tests the /api/stripe/webhook endpoint by constructing a signed test event
 * payload without placing any real card transactions.
 * 
 * Usage:
 *   node scripts/test-stripe-webhook.js [OPTIONAL_ENDPOINT_URL] [OPTIONAL_SECRET]
 * 
 * Example:
 *   node scripts/test-stripe-webhook.js http://localhost:3000/api/stripe/webhook whsec_testsecret
 */

const crypto = require('crypto');
const http = require('http');
const https = require('https');

const targetUrl = process.argv[2] || process.env.WEBHOOK_URL || 'http://localhost:3000/api/stripe/webhook';
const secret = process.argv[3] || process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret_key';

const timestamp = Math.floor(Date.now() / 1000);

const testPayload = JSON.stringify({
  id: `evt_test_${Date.now()}`,
  object: 'event',
  api_version: '2025-02-24.acacia',
  created: timestamp,
  type: 'checkout.session.completed',
  data: {
    object: {
      id: `cs_test_${Date.now()}`,
      object: 'checkout.session',
      customer_email: 'test-creator@example.com',
      metadata: {
        userId: 'demo-user-1',
        planType: 'pro',
      },
      payment_status: 'paid',
      status: 'complete',
    },
  },
});

// Compute HMAC SHA256 signature matching Stripe format: t=timestamp,v1=hash
const signedPayload = `${timestamp}.${testPayload}`;
const signatureHash = crypto
  .createHmac('sha256', secret)
  .update(signedPayload, 'utf8')
  .digest('hex');

const stripeSignature = `t=${timestamp},v1=${signatureHash}`;

console.log(`📡 Sending test Stripe webhook event to: ${targetUrl}`);
console.log(`🔑 Signature Header: ${stripeSignature}`);

const parsedUrl = new URL(targetUrl);
const transport = parsedUrl.protocol === 'https:' ? https : http;

const options = {
  hostname: parsedUrl.hostname,
  port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
  path: parsedUrl.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testPayload),
    'stripe-signature': stripeSignature,
  },
};

const req = transport.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`\n✅ Response Status Code: ${res.statusCode}`);
    console.log(`📄 Response Body: ${responseData}`);

    if (res.statusCode === 200) {
      console.log('\n🎉 SUCCESS: Webhook endpoint verified successfully!');
    } else {
      console.log('\n⚠️ Webhook verification returned non-200 status.');
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
});

req.write(testPayload);
req.end();
