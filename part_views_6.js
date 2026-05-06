const TheMintView = ({ data, setData, custodianData, setCustodianData, addXp }) => {
  const [gemKey, setGemKey] = React.useState(localStorage.getItem('OPN-GEMINI-KEY') || localStorage.getItem('opn-gemini-key') || '');
  const [selId, setSelId] = React.useState(null);

  React.useEffect(() => {
    const handleNavMint = (e) => setSelId(e.detail);
    window.addEventListener('nav-mint-stone', handleNavMint);
    return () => window.removeEventListener('nav-mint-stone', handleNavMint);
  }, []);

  const [artStatus, setArtStatus] = React.useState('idle'); // idle, loading, success, error
  const [artImg, setArtImg] = React.useState(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = React.useState(0);

  const [mintStatus, setMintStatus] = React.useState('idle'); // idle, minting, success
  const [mintProgress, setMintProgress] = React.useState(0);
  const artIntervalRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (artIntervalRef.current) clearInterval(artIntervalRef.current);
    };
  }, []);

  const combinedStones = [
    ...data.filter(s => s.mk_grade >= 3).sort((a,b) => b.mk_grade - a.mk_grade).map(s => ({...s, isCust: false})),
    ...custodianData.map(c => ({
      ...c,
      mk_grade: c.stone.grade,
      pattern: c.stone.pattern,
      brightness: c.stone.brightness,
      treatmentQuality: c.stone.type,
      isCust: true
    }))
  ];

  const selStone = combinedStones.find(s => s.id === selId);
  const eligibleStones = combinedStones;

  const generateArt = async () => {
    if(!selStone) return;
    setArtStatus('loading');
    setArtImg(null);
    setLoadingMsgIdx(0);
    
    const msgs = ['Reading stone...','Translating matrix patterns to art...','Rendering opal colour play...','Composing digital certificate...','Finalising artwork...'];
    let idx = 0;
    if (artIntervalRef.current) clearInterval(artIntervalRef.current);
    artIntervalRef.current = setInterval(() => {
      idx = (idx + 1) % msgs.length;
      setLoadingMsgIdx(idx);
    }, 2000);

    try {
      if (!gemKey) throw new Error("No API key");
      
      const payload = {
        "contents": [{
          "parts": [{
            "text": `Create a dramatic, ultra-premium digital artwork for a luxury NFT certificate representing a piece of ${selStone.name} Andamooka Matrix Opal from Australia. Grade: M${selStone.mk_grade}/M9 on the AOSA Standard. Pattern: ${selStone.pattern}. Brightness: ${selStone.brightness}. The artwork should be epic and cinematic — think deep space meets ancient geology. Feature the opal's intense fire colours (${selStone.pattern}-pattern play of colour) glowing with a hyper-realistic, iridescent shimmer against a dramatic solid black background. Include subtle crystalline structures and geometric elements suggesting a futuristic blockchain certificate. Style: high-end luxury gem art, editorial photography aesthetic, black background, opal fire colours dominant. 4k resolution feel. Do not include any text, logos, or human hands in the image.`
          }]
        }],
        "generationConfig": {
          "responseModalities": ["IMAGE"],
          "candidateCount": 1
        }
      };

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("API response not ok");

      const resData = await res.json();
      const b64 = resData?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) throw new Error("No image data returned from API");
      
      setArtImg(`data:image/jpeg;base64,${b64}`);
      setArtStatus('success');
    } catch (err) {
      console.warn("Artwork gen error", err);
      // Fallback
      if (selStone.id === 13 || selStone.genesisAsset) {
        setArtImg(selStone.nft_image || "https://res.cloudinary.com/dkgqxred2/image/upload/v1777191838/openart-image_s4KRJWDf_1777191340348_raw_yssfes.png");
      } else {
        const color = (GRADE_COLORS[selStone.mk_grade] || '#C9A66B').replace('#','%23');
        const nameText = encodeURIComponent(selStone.name || selStone.collection);
        setArtImg(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%230b0d12"/><rect x="20" y="20" width="360" height="460" fill="none" stroke="${color}" stroke-width="2" opacity="0.3"/><circle cx="200" cy="200" r="80" fill="none" stroke="${color}" stroke-width="1"/><text x="200" y="220" fill="${color}" font-family="sans-serif" font-size="64" font-weight="bold" text-anchor="middle">M${selStone.mk_grade}</text><text x="200" y="380" fill="%23E6EDF3" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${nameText}</text><text x="200" y="420" fill="%238B949E" font-family="sans-serif" font-size="12" letter-spacing="4" text-anchor="middle">PROVENANCE CERTIFICATE</text></svg>`);
      }
      setArtStatus('error');
    } finally {
      if (artIntervalRef.current) {
        clearInterval(artIntervalRef.current);
        artIntervalRef.current = null;
      }
    }
  };

  const handleMint = () => {
    setMintStatus('minting');
    setMintProgress(0);
    
    const isCust = selStone.isCust;
    
    // We cannot use strict intervals accurately if setStep rerenders cause clearing.
    // Instead, let's use a chain of timeouts to ensure it finishes.
    setTimeout(() => { setMintProgress(33); }, isCust ? 1500 : 800);
    setTimeout(() => { setMintProgress(66); }, isCust ? 3000 : 1600);
    
    setTimeout(() => {
      setMintProgress(100);
      setMintStatus('success');
      
      const xpReward = selStone.mk_grade * 150;
      if (addXp) addXp(xpReward);

      if (isCust) {
        const fresh = custodianData.map(c => c.id === selId ? { ...c, nft: true } : c);
        setCustodianData(fresh);
      } else {
        const fresh = data.map(s => s.id === selId ? {
          ...s,
          nft: true,
          nft_img: artImg,
          genesis: s.id===13 ? true : s.genesis
        } : s);
        setData(fresh);
      }
    }, isCust ? 4500 : 2200);
  };

  const msgs = ['Reading stone characteristics...','Translating matrix patterns to art...','Rendering opal fire...','Composing digital certificate...','Finalising artwork...'];

  return (
    <div className="flex flex-col gap-10 animate-[opn-fadein_0.18s_ease-out]">
      <div className="flex justify-between items-start md:items-center">
        <div>
          <h2 className="text-4xl font-light text-[var(--gold)] mb-1 font-display tracking-tight">The <span className="opacity-40">Mint</span></h2>
          <p className="text-[13px] text-[var(--muted)] font-medium uppercase tracking-[0.2em] mt-1">Create verifiable digital provenance certificates</p>
        </div>
        <div className="px-3 py-1 bg-[var(--surf2)] border border-[var(--bdr-hi)] rounded text-[10px] font-bold text-[var(--muted)] uppercase tracking-wide">
          Powered by Google Gemini + Polygon
        </div>
      </div>

      {!gemKey && (
        <div className="bg-[var(--surf2)] border border-[var(--orange)] rounded-lg p-5 flex flex-col gap-2">
          <div className="text-[14px] font-bold text-white">Gemini API Key Required</div>
          <div className="text-[12px] text-[var(--muted)] mb-2">Enter your API key to generate custom NFT artworks.</div>
          <input type="password" value={gemKey} onChange={e => {setGemKey(e.target.value); localStorage.setItem('OPN-GEMINI-KEY', e.target.value)}} className="w-full md:w-1/2 bg-[var(--bg)] border border-[var(--bdr)] rounded p-2 text-white focus:outline-none focus:border-[var(--teal)]" placeholder="AIza..." />
        </div>
      )}

      {/* SECTION 1 - SELECT */}
      <div>
        <h3 className="text-[15px] font-bold text-white mb-1">Choose a Stone</h3>
        <p className="text-[11px] text-[var(--muted)] mb-4">Only AOSA-graded stones are eligible for minting (M3+)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {eligibleStones.map(s => (
            <div key={s.id} onClick={() => !s.nft && setSelId(s.id)} className={`relative bg-[var(--surf2)] rounded-lg border overflow-hidden p-2 flex flex-col gap-2 transition-all cursor-pointer ${s.nft ? 'opacity-50 cursor-not-allowed border-[var(--bdr)]' : selId === s.id ? 'border-[var(--gold)] shadow-[0_0_15px_var(--gold-dim)]' : 'border-[var(--bdr)] hover:border-[var(--bdr-hi)]'}`}>
              <div className="w-full h-16 rounded overflow-hidden relative">
                <img src={s.img} className="w-full h-full object-cover" />
                <div className="absolute top-1 right-1 px-1 py-0.5 rounded text-[8px] font-bold" style={{backgroundColor: GRADE_COLORS[s.mk_grade], color:'#fff'}}>M{s.mk_grade}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-white leading-tight truncate">{s.name}</div>
              </div>
              {s.nft ? (
                 <div className="mt-auto text-[10px] font-bold text-[var(--teal)] uppercase tracking-wider text-center py-1">◆ Minted</div>
              ) : (
                 <div className={`mt-auto text-[10px] font-bold uppercase tracking-wider text-center py-1 rounded ${selId === s.id ? 'bg-[var(--gold-dim)] text-[var(--gold)]' : 'bg-[var(--surf3)] text-[var(--muted)]'}`}>{selId === s.id ? 'Selected ✓' : 'Select'}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2 - GENERATE ARTWORK */}
      {selStone && (
        <div className="border-t border-[var(--bdr)] pt-8">
           <h3 className="text-[15px] font-bold text-white mb-1">Generate NFT Artwork</h3>
           <p className="text-[11px] text-[var(--muted)] mb-6">Google Gemini will create a unique digital artwork inspired by your stone's characteristics</p>
           
           <div className="flex flex-col md:flex-row gap-6">
             <div className="flex-1 bg-[var(--surf2)] rounded-xl border border-[var(--bdr)] p-5 flex flex-col items-center">
               <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-[var(--bdr-hi)] shadow-xl mb-6">
                 <img src={selStone.img} className="w-full h-full object-cover" />
               </div>
               <div className="w-full">
                 <h4 className="text-[22px] font-light text-[var(--gold)] text-center mb-6 font-display tracking-tight">{selStone.name}</h4>
                 <div className="space-y-2 text-[12px] font-mono">
                   <div className="flex justify-between"><span className="text-[var(--muted)]">Grade</span><span className="text-white">M{selStone.mk_grade} ({GRADE_COLORS[selStone.mk_grade]})</span></div>
                   <div className="flex justify-between"><span className="text-[var(--muted)]">Pattern</span><span className="text-white">{selStone.pattern}</span></div>
                   <div className="flex justify-between"><span className="text-[var(--muted)]">Brightness</span><span className="text-white">{selStone.brightness} ({selStone.bodyTone})</span></div>
                   <div className="flex justify-between"><span className="text-[var(--muted)]">Treatment</span><span className="text-white">{selStone.treatmentQuality}</span></div>
                 </div>
               </div>
             </div>

             <div className="flex-[1.5] bg-[var(--bg)] rounded-xl border border-[var(--bdr-hi)] overflow-hidden flex flex-col">
               <div className="flex-1 relative min-h-[300px] flex items-center justify-center p-6 bg-[#000]">
                 {artStatus === 'idle' && (
                   <div className="text-center">
                     <div className="text-6xl text-[var(--dim)] mb-4">◉</div>
                     <div className="text-[14px] text-[var(--muted)]">Ready to generate artwork</div>
                   </div>
                 )}
                 {artStatus === 'loading' && (
                   <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center" style={{background: 'linear-gradient(90deg, #1A2030 0%, #C9A66B33 50%, #1A2030 100%)', backgroundSize: '200% 100%', animation: 'opn-shimmer 2s infinite linear'}}>
                     <style dangerouslySetInnerHTML={{__html: `@keyframes opn-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}}/>
                     <div className="w-12 h-12 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin mb-6"></div>
                     <div className="text-[16px] font-bold text-[var(--gold)]">{msgs[loadingMsgIdx]}</div>
                   </div>
                 )}
                 {(artStatus === 'success' || artStatus === 'error') && artImg && (
                   <div className="w-full h-full p-2 flex items-center justify-center relative">
                     <img src={artImg} className="max-w-full max-h-[360px] rounded object-contain border border-[var(--gold)] shadow-[0_0_30px_var(--gold-dim)]" />
                     {artStatus === 'success' && <div className="absolute top-6 left-6 px-3 py-1 bg-[var(--teal)] text-[#000] font-bold text-[10px] uppercase tracking-widest rounded-sm">◆ Artwork Generated</div>}
                     {artStatus === 'error' && <div className="absolute top-4 left-4 right-4 text-center px-3 py-2 bg-[var(--red-dim)] border border-[var(--red)] text-white font-bold text-[11px] rounded">Custom artwork failed. Used dynamic placeholder.</div>}
                   </div>
                 )}
               </div>
               
               <div className="p-4 border-t border-[var(--bdr-hi)] bg-[var(--surf)]">
                 {artStatus !== 'loading' ? (
                   <button onClick={generateArt} className="w-full py-3 rounded bg-[var(--teal)] hover:brightness-110 text-[#000] font-extrabold text-[14px] uppercase tracking-wide transition-all">
                     {artStatus === 'idle' ? 'Generate Artwork' : 'Regenerate'}
                   </button>
                 ) : (
                   <button disabled className="w-full py-3 rounded bg-[var(--surf3)] text-[var(--muted)] font-extrabold text-[14px] uppercase tracking-wide">
                     Generating...
                   </button>
                 )}
               </div>
             </div>
           </div>
        </div>
      )}

      {/* SECTION 3 - MINT */}
      {(artStatus === 'success' || artStatus === 'error') && (
        <div className="border-t border-[var(--bdr)] pt-8">
           <h3 className="text-[15px] font-bold text-white mb-6">Mint NFT Certificate</h3>
           
           <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="w-full md:w-[480px] shrink-0 bg-[#0d1015] border border-[var(--gold-dim)] rounded-xl relative p-8 shadow-2xl" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1c22 0%, #0d1015 100%)'}}>
               <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[var(--gold-dim)]"></div>
               <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[var(--gold-dim)]"></div>
               <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[var(--gold-dim)]"></div>
               <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[var(--gold-dim)]"></div>
               
               <div className="flex gap-6 mb-8">
                 <div className="w-[140px] h-[140px] rounded overflow-hidden border-[2px] border-[var(--bg)] shadow-xl shrink-0">
                   <img src={artImg} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex flex-col justify-center">
                   <div className="text-[8px] uppercase tracking-widest text-[var(--gold)] mb-2 font-bold">Opal Provenance Network</div>
                   <div className="text-[20px] font-light text-white mb-1 font-display tracking-tight">Certificate of <span className="opacity-40 italic">Authenticity</span></div>
                   <div className="text-[15px] text-[var(--muted)] mb-4 font-display font-medium tracking-wide">{selStone.name}</div>
                   <div className="flex items-center gap-3">
                     <span className="px-2 border border-[#fff2] text-white font-bold rounded" style={{backgroundColor: GRADE_COLORS[selStone.mk_grade]}}>M{selStone.mk_grade}</span>
                     <span className="text-[10px] text-[var(--dim)]">Andamooka, SA</span>
                   </div>
                 </div>
               </div>
               
               <div className="flex justify-between items-end border-t border-[#fff1] pt-4">
                 <div className="text-[9px] text-[var(--dim)] font-mono">
                   <div className="mb-1 text-[var(--gold)]">Matt Kathagen &middot; Miner</div>
                   <div>Matt Rogers &middot; Cutter</div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <div className="w-8 h-4 opacity-50"><AOSA_Logo_Scaled /></div>
                   <div className="text-[8px] font-mono text-[var(--muted)] tracking-wider">OPN-{selStone.id}-2026-{Math.floor(1000+Math.random()*9000)}</div>
                 </div>
               </div>
             </div>

             <div className="flex-1 w-full bg-[var(--surf)] border border-[var(--bdr-hi)] rounded-xl p-6">
               <div className="space-y-4 mb-8">
                 <div className="flex justify-between border-b border-[var(--bdr)] pb-2"><span className="text-[var(--muted)] text-[12px]">Network</span><span className="text-white font-mono text-[12px]">Polygon</span></div>
                 <div className="flex justify-between border-b border-[var(--bdr)] pb-2"><span className="text-[var(--muted)] text-[12px]">Gas Fee</span><span className="text-[var(--teal)] font-mono text-[12px]">0.001 MATIC</span></div>
                 <div className="flex justify-between border-b border-[var(--bdr)] pb-2"><span className="text-[var(--muted)] text-[12px]">Royalty</span><span className="text-white font-mono text-[12px]">5% perpetual</span></div>
               </div>

               {mintStatus === 'idle' && (
                 <button onClick={handleMint} className="w-full py-4 rounded-lg shadow-[0_0_20px_var(--teal-dim)] hover:scale-[1.02] transition-transform" style={{background: 'linear-gradient(135deg, var(--gold), var(--teal))'}}>
                   <div className="text-[26px] font-light text-white text-center font-display tracking-tight leading-none">MINT TO POLYGON</div>
                 </button>
               )}

               {mintStatus === 'minting' && (
                 <div className="w-full h-24 border border-[var(--bdr-hi)] bg-[var(--surf2)] rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 h-1 bg-[var(--teal)] transition-all duration-300" style={{width: `${mintProgress}%`}}></div>
                   <div className="text-[14px] font-bold text-[var(--teal)] mb-2 text-center px-4 leading-tight">
                     {selStone.isCust ? (
                        mintProgress < 50 ? <span className="whitespace-pre-line">Preparing Genesis Certificate...{'\n'}<span className="text-[10px] text-[var(--muted)] font-mono">Synchronising provenance chain</span></span> :
                        mintProgress < 100 ? <span className="whitespace-pre-line">Embedding coordinates & provenance...{'\n'}<span className="text-[10px] text-[var(--muted)] font-mono">-30.454699, 137.189437</span></span> :
                        'Broadcasting to Polygon...'
                     ) : (
                        mintProgress < 50 ? 'Preparing certificate...' : 
                        mintProgress < 100 ? 'Broadcasting to Polygon...' : 
                        'Confirming...'
                     )}
                   </div>
                   {mintProgress >= 33 && mintProgress < 100 && (
                     <div className="flex gap-2">
                       <div className="w-2 h-2 bg-[var(--teal)] rounded-sm animate-ping delay-100"></div>
                       <div className="w-2 h-2 bg-[var(--teal)] rounded-sm animate-ping delay-200"></div>
                       <div className="w-2 h-2 bg-[var(--teal)] rounded-sm animate-ping delay-300"></div>
                     </div>
                   )}
                 </div>
               )}

               {mintStatus === 'success' && (
                 <div className="w-full border border-[var(--teal)] bg-[var(--teal-dim)] rounded-lg p-6 flex flex-col items-center animate-[opn-fadein_0.3s_ease-out]">
                   <div className="text-[48px] text-[var(--teal)] leading-none mb-4">◆</div>
                   {selStone.isCust ? (
                     <>
                       <h4 className="text-[24px] font-light text-[var(--teal)] mb-1 text-center font-display tracking-tight">Genesis NFT <span className="opacity-40">Minted</span></h4>
                       <div className="text-[12px] font-bold text-white mb-2 text-center">The first asset ever certified on the Opal Provenance Network</div>
                       <div className="text-[11px] text-[var(--muted)] mb-4 text-center">Serial No. 1 of 20 — Cobra Cuff<br/>Certificate ID: COBRA-CC-001-OPN-2026</div>
                       <div className="text-[42px] font-light text-[var(--gold)] leading-none mb-8 font-display tracking-tighter text-center drop-shadow-[0_0_15px_rgba(201,166,107,0.3)]">{formatCur(selStone.nft_value)}</div>
                       <div className="text-[10px] text-[var(--teal)] text-center max-w-[200px] leading-relaxed mb-6">Embedded: GPS coordinates &middot; M9 AOSA Grade &middot; Provenance chain &middot; Broadcast provenance</div>
                     </>
                   ) : (
                     <>
                       <h4 className="text-[28px] font-light text-[var(--teal)] mb-6 text-center font-display tracking-tight">NFT Minted Successfully</h4>
                       <div className="text-[48px] font-light text-[var(--gold)] leading-none mb-10 font-display tracking-tighter text-center drop-shadow-[0_0_15px_rgba(201,166,107,0.3)]">{formatCur(selStone.nft_value || selStone.listPrice || (selStone.mr_offer ? selStone.mr_offer*1.8 : 0) || 2000)}</div>
                       <button onClick={() => window.dispatchEvent(new CustomEvent('nav-nft'))} className="w-full py-3 mb-3 rounded bg-[var(--gold)] text-[#000] font-bold text-[14px] hover:brightness-110">View in NFT Collection &rarr;</button>
                       <button className="w-full py-2 rounded border border-[var(--teal)] text-[var(--teal)] hover:bg-[var(--teal-dim)] font-bold text-[12px]">Share Certificate</button>
                     </>
                   )}
                 </div>
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
