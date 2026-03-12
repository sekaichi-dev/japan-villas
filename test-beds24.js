import { getBeds24Token } from './api/beds24/auth.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  const token = await getBeds24Token();
  const req = await fetch('https://api.beds24.com/v2/bookings?arrivalFrom=2026-03-01', {
    headers: { token: token.trim(), 'Accept': 'application/json' }
  });
  console.log(await req.json());
}
check();
