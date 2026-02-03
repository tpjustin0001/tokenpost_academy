$env:NEXT_PUBLIC_TP_CLIENT_ID = "SaOvfXcB39qBajLd5wTpMg14X6k9HdCi"
$env:NEXT_PUBLIC_REDIRECT_URI = "https://academy.tokenpost.kr/callback"
$env:TP_CLIENT_SECRET = "QjLMXfJ6baEv1EVFby5SrAbs47LPn1lJShIVZKzBakWMk18Vg1UXFQxoP3DL52VAgZ4hALt1zFaBK7q3U5Ub1oqWcKpHAeRVOLu5Xxu1o7JXlcwLQCsgXd3xCZgw8rDY"
$env:SESSION_SECRET = "tokenpost-academy-very-secure-session-key-2024"
$env:DEV_MODE = "true"

# Remove existing (ignore errors if not exists)
npx vercel env rm NEXT_PUBLIC_TP_CLIENT_ID production --yes 2>$null
npx vercel env rm NEXT_PUBLIC_REDIRECT_URI production --yes 2>$null
npx vercel env rm TP_CLIENT_SECRET production --yes 2>$null
npx vercel env rm DEV_MODE production --yes 2>$null

# Add new
echo $env:NEXT_PUBLIC_TP_CLIENT_ID | npx vercel env add NEXT_PUBLIC_TP_CLIENT_ID production
echo $env:NEXT_PUBLIC_REDIRECT_URI | npx vercel env add NEXT_PUBLIC_REDIRECT_URI production
echo $env:TP_CLIENT_SECRET | npx vercel env add TP_CLIENT_SECRET production
echo $env:SESSION_SECRET | npx vercel env add SESSION_SECRET production
echo $env:DEV_MODE | npx vercel env add DEV_MODE production
