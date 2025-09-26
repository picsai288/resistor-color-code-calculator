
document.addEventListener('DOMContentLoaded', function(){
  const COLORS = [
    {key:'black',  en:'Black',  hex:'#000000'},
    {key:'brown',  en:'Brown',  hex:'#8B4513'},
    {key:'red',    en:'Red',    hex:'#C0392B'},
    {key:'orange', en:'Orange', hex:'#F39C12'},
    {key:'yellow', en:'Yellow', hex:'#F1C40F'},
    {key:'green',  en:'Green',  hex:'#27AE60'},
    {key:'blue',   en:'Blue',   hex:'#2980B9'},
    {key:'violet', en:'Violet', hex:'#8E44AD'},
    {key:'gray',   en:'Gray',   hex:'#808080'},
    {key:'white',  en:'White',  hex:'#FFFFFF'},
    {key:'gold',   en:'Gold',   hex:'#D4AF37'},
    {key:'silver', en:'Silver', hex:'#C0C0C0'},
    {key:'none',   en:'None',   hex:'transparent'}
  ];
  const DIGIT_COLORS = ['black','brown','red','orange','yellow','green','blue','violet','gray','white'];
  const MULTIPLIERS = { black:1,brown:10,red:100,orange:1e3,yellow:1e4,green:1e5,blue:1e6,violet:1e7,gray:1e8,white:1e9,gold:0.1,silver:0.01 };
  const TOLERANCES = { brown:1,red:2,green:0.5,blue:0.25,violet:0.1,gray:0.05,gold:5,silver:10,none:20 };
  const TCR = { black:250,brown:100,red:50,orange:15,yellow:25,green:20,blue:10,violet:5,gray:1 };

  const colorObj = (key)=>COLORS.find(c=>c.key===key);
  const makeOpts = (arr,map)=>arr.map(k=>`<option value="${k}">${map(colorObj(k))}</option>`).join('');

  function formatOhms(ohms){
    if(!isFinite(ohms)) return '—';
    const abs = Math.abs(ohms);
    const sig = (n)=>{
      if (n === 0) return '0';
      const e = Math.floor(Math.log10(Math.abs(n)));
      const p = Math.max(0, 3 - e);
      return (Math.round(n*Math.pow(10,p))/Math.pow(10,p)).toString();
    };
    if (abs >= 1e9) return sig(ohms/1e9)+' GΩ';
    if (abs >= 1e6) return sig(ohms/1e6)+' MΩ';
    if (abs >= 1e3) return sig(ohms/1e3)+' kΩ';
    if (abs >= 1)   return sig(ohms)+' Ω';
    return (Math.round(ohms*1000)/1000)+' Ω';
  }

  function fillDigits(id){
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = makeOpts(DIGIT_COLORS,(c)=>`${c.en} (${DIGIT_COLORS.indexOf(c.key)})`);
  }
  function fillMultiplier(id){
    const order=['black','brown','red','orange','yellow','green','blue','violet','gray','white','gold','silver'];
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = makeOpts(order,(c)=>`${c.en} (×${MULTIPLIERS[c.key]})`);
  }
  function fillTolerance(id){
    const order=['brown','red','green','blue','violet','gray','gold','silver','none'];
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = makeOpts(order,(c)=>`${c.en} (±${TOLERANCES[c.key]}%)`);
  }
  function fillTCR(id){
    const order=['black','brown','red','orange','yellow','green','blue','violet','gray'];
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = makeOpts(order,(c)=>`${c.en} (${TCR[c.key]} ppm/°C)`);
  }

  ['b4_d1','b4_d2','b5_d1','b5_d2','b5_d3','b6_d1','b6_d2','b6_d3'].forEach(fillDigits);
  ['b4_mul','b5_mul','b6_mul'].forEach(fillMultiplier);
  ['b4_tol','b5_tol','b6_tol'].forEach(fillTolerance);
  fillTCR('b6_tcr');

  function $id(id){ return document.getElementById(id); }

  if($id('b4_d1')) $id('b4_d1').value='yellow';
  if($id('b4_d2')) $id('b4_d2').value='violet';
  if($id('b4_mul')) $id('b4_mul').value='red';
  if($id('b4_tol')) $id('b4_tol').value='gold';

  if($id('b5_d1')) $id('b5_d1').value='brown';
  if($id('b5_d2')) $id('b5_d2').value='red';
  if($id('b5_d3')) $id('b5_d3').value='brown';
  if($id('b5_mul')) $id('b5_mul').value='red';
  if($id('b5_tol')) $id('b5_tol').value='brown';

  if($id('b6_d1')) $id('b6_d1').value='blue';
  if($id('b6_d2')) $id('b6_d2').value='gray';
  if($id('b6_d3')) $id('b6_d3').value='black';
  if($id('b6_mul')) $id('b6_mul').value='red';
  if($id('b6_tol')) $id('b6_tol').value='brown';
  if($id('b6_tcr')) $id('b6_tcr').value='red';

  // tabs
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabs.forEach(b=>b.setAttribute('aria-selected','false'));
      panels.forEach(p=>p.classList.remove('active'));
      btn.setAttribute('aria-selected','true');
      const pid = btn.getAttribute('aria-controls');
      const p = document.getElementById(pid);
      if(p) p.classList.add('active');
    });
  });

  function setBandFill(id, key){
    const r = document.getElementById(id);
    if(!r) return;
    const c = colorObj(key);
    if(!c) return;
    const hex = c.hex;
    r.setAttribute('fill', hex==='transparent' ? 'rgba(0,0,0,0)' : hex);
    r.setAttribute('stroke', key==='white' ? '#ddd' : 'rgba(0,0,0,0)');
  }
  function updateLegend(id, bands){
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = bands.map(k=>{
      const c=colorObj(k);
      return `<span><i class="chip" style="background:${c.hex};${c.key==='white'?'border:1px solid #ddd':''}"></i>${c.en}</span>`;
    }).join('');
  }

  function calc4(){
    if(!$id('b4_d1')) return;
    const d1=$id('b4_d1').value, d2=$id('b4_d2').value, m=$id('b4_mul').value, t=$id('b4_tol').value;
    const base = DIGIT_COLORS.indexOf(d1)*10 + DIGIT_COLORS.indexOf(d2);
    const ohms = base*(MULTIPLIERS[m]??1), tol=TOLERANCES[t]??0;
    if($id('b4_nom')) $id('b4_nom').textContent = formatOhms(ohms);
    if($id('b4_tol_txt')) $id('b4_tol_txt').textContent = tol?`±${tol}%`:'—';
    if($id('b4_min')) $id('b4_min').textContent = formatOhms(ohms*(1-tol/100));
    if($id('b4_max')) $id('b4_max').textContent = formatOhms(ohms*(1+tol/100));
    setBandFill('b4_1',d1); setBandFill('b4_2',d2); setBandFill('b4_m',m); setBandFill('b4_t',t);
    updateLegend('legend4',[d1,d2,m,t]);
  }
  function calc5(){
    if(!$id('b5_d1')) return;
    const d1=$id('b5_d1').value,d2=$id('b5_d2').value,d3=$id('b5_d3').value,m=$id('b5_mul').value,t=$id('b5_tol').value;
    const base = DIGIT_COLORS.indexOf(d1)*100 + DIGIT_COLORS.indexOf(d2)*10 + DIGIT_COLORS.indexOf(d3);
    const ohms = base*(MULTIPLIERS[m]??1), tol=TOLERANCES[t]??0;
    if($id('b5_nom')) $id('b5_nom').textContent = formatOhms(ohms);
    if($id('b5_tol_txt')) $id('b5_tol_txt').textContent = tol?`±${tol}%`:'—';
    if($id('b5_min')) $id('b5_min').textContent = formatOhms(ohms*(1-tol/100));
    if($id('b5_max')) $id('b5_max').textContent = formatOhms(ohms*(1+tol/100));
    setBandFill('b5_1',d1); setBandFill('b5_2',d2); setBandFill('b5_3',d3); setBandFill('b5_m',m); setBandFill('b5_t',t);
    updateLegend('legend5',[d1,d2,d3,m,t]);
  }
  function calc6(){
    if(!$id('b6_d1')) return;
    const d1=$id('b6_d1').value,d2=$id('b6_d2').value,d3=$id('b6_d3').value,m=$id('b6_mul').value,t=$id('b6_tol').value,c=$id('b6_tcr').value;
    const base = DIGIT_COLORS.indexOf(d1)*100 + DIGIT_COLORS.indexOf(d2)*10 + DIGIT_COLORS.indexOf(d3);
    const ohms = base*(MULTIPLIERS[m]??1), tol=TOLERANCES[t]??0, tcr=TCR[c];
    if($id('b6_nom')) $id('b6_nom').textContent = formatOhms(ohms);
    if($id('b6_tol_txt')) $id('b6_tol_txt').textContent = tol?`±${tol}%`:'—';
    if($id('b6_min')) $id('b6_min').textContent = formatOhms(ohms*(1-tol/100));
    if($id('b6_max')) $id('b6_max').textContent = formatOhms(ohms*(1+tol/100));
    if($id('b6_tcr_txt')) $id('b6_tcr_txt').textContent = isFinite(tcr)?`${tcr} ppm/°C`:'—';
    setBandFill('b6_1',d1); setBandFill('b6_2',d2); setBandFill('b6_3',d3); setBandFill('b6_m',m); setBandFill('b6_t',t); setBandFill('b6_c',c);
    updateLegend('legend6',[d1,d2,d3,m,t,c]);
  }

  ['b4_d1','b4_d2','b4_mul','b4_tol'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('change',calc4); });
  ['b5_d1','b5_d2','b5_d3','b5_mul','b5_tol'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('change',calc5); });
  ['b6_d1','b6_d2','b6_d3','b6_mul','b6_tol','b6_tcr'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('change',calc6); });

  document.querySelectorAll('button.copy').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const n = btn.dataset.copy;
      let txt='';
      if(n==='4'){
        txt = `4-band: ${$id('b4_nom')?.textContent || '—'}, tol ${$id('b4_tol_txt')?.textContent || '—'}, range ${$id('b4_min')?.textContent || '—'} ~ ${$id('b4_max')?.textContent || '—'}`;
      } else if(n==='5'){
        txt = `5-band: ${$id('b5_nom')?.textContent || '—'}, tol ${$id('b5_tol_txt')?.textContent || '—'}, range ${$id('b5_min')?.textContent || '—'} ~ ${$id('b5_max')?.textContent || '—'}`;
      } else {
        txt = `6-band: ${$id('b6_nom')?.textContent || '—'}, tol ${$id('b6_tol_txt')?.textContent || '—'}, range ${$id('b6_min')?.textContent || '—'} ~ ${$id('b6_max')?.textContent || '—'}, TCR ${$id('b6_tcr_txt')?.textContent || '—'}`;
      }
      navigator.clipboard?.writeText?.(txt).then(()=> {
        const original = btn.textContent;
        btn.textContent = 'Copied ✓';
        setTimeout(()=>btn.textContent = original, 1200);
      }).catch(()=>{ /* ignore */ });
    });
  });

  document.querySelectorAll('button.reset').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const n = btn.dataset.reset;
      if(n==='4'){ if($id('b4_d1')) $id('b4_d1').value='yellow'; if($id('b4_d2')) $id('b4_d2').value='violet'; if($id('b4_mul')) $id('b4_mul').value='red'; if($id('b4_tol')) $id('b4_tol').value='gold'; calc4(); }
      else if(n==='5'){ if($id('b5_d1')) $id('b5_d1').value='brown'; if($id('b5_d2')) $id('b5_d2').value='red'; if($id('b5_d3')) $id('b5_d3').value='brown'; if($id('b5_mul')) $id('b5_mul').value='red'; if($id('b5_tol')) $id('b5_tol').value='brown'; calc5(); }
      else { if($id('b6_d1')) $id('b6_d1').value='blue'; if($id('b6_d2')) $id('b6_d2').value='gray'; if($id('b6_d3')) $id('b6_d3').value='black'; if($id('b6_mul')) $id('b6_mul').value='red'; if($id('b6_tol')) $id('b6_tol').value='brown'; if($id('b6_tcr')) $id('b6_tcr').value='red'; calc6(); }
    });
  });

  // initial calc
  calc4(); calc5(); calc6();
});
