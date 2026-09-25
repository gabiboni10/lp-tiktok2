const TARGET='snssdk1180://webview?url=https://tinyurl.com/5bu7fwrb&hide_nav_bar=1';
const WAIT_MS=10000;
const LAST_STEP=3;

export const config={maxDuration:20};

export default {
  async fetch(request){
    if(request.method!=='GET'){
      return new Response('Method not allowed',{status:405,headers:{Allow:'GET','Cache-Control':'no-store'}});
    }
    const url=new URL(request.url);
    const value=url.searchParams.get('step');
    if(value!==null&&!/^[0-3]$/.test(value)){
      return new Response('Invalid step',{status:400,headers:{'Cache-Control':'no-store'}});
    }
    const step=value===null?0:Number(value);
    await new Promise(resolve=>setTimeout(resolve,WAIT_MS));
    const location=step===LAST_STEP?TARGET:'/api/lp1-handoff?step='+(step+1);
    return new Response(null,{
      status:302,
      headers:{
        Location:location,
        'Cache-Control':'no-store, max-age=0',
        'Referrer-Policy':'no-referrer',
        'X-Content-Type-Options':'nosniff'
      }
    });
  }
};
