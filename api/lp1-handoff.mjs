const TARGET_BASE = 'https://tinyurl.com/48sv9upj';
const WAIT_MS = 10000;
const LAST_STEP = 3;

export const config = { maxDuration: 20 };

export default {
  async fetch(request) {
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET', 'Cache-Control': 'no-store' } });
    }
    const url = new URL(request.url);
    const value = url.searchParams.get('step');
    if (value !== null && !/^[0-3]$/.test(value)) {
      return new Response('Invalid step', { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    const step = value === null ? 0 : Number(value);
    const utmContent = url.searchParams.get('utm_content');

    await new Promise(resolve => setTimeout(resolve, WAIT_MS));

    let location;
    if (step === LAST_STEP) {
      const target = new URL(TARGET_BASE);
      if (utmContent !== null) target.searchParams.set('utm_content', utmContent);
      location = 'snssdk1180://webview?url=' + target.href + '&hide_nav_bar=1';
    } else {
      // repassa o utm_content para o próximo step
      const next = new URL('/api/lp1-handoff', url.origin);
      next.searchParams.set('step', String(step + 1));
      if (utmContent !== null) next.searchParams.set('utm_content', utmContent);
      location = next.href;
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: location,
        'Cache-Control': 'no-store, max-age=0',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
};
