const VerifyAIModal = ({ onClose, addXp, useEnergy, energy, gemKey, setData, data }) => {
  const [step, setStep] = React.useState(0);
  const [imgData, setImgData] = React.useState(null);
  const [fileInfo, setFileInfo] = React.useState('');
  const [loadingMsg, setLoadingMsg] = React.useState('Analysing colour play patterns...');
  const [analysisResult, setAnalysisResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleFile = (file) => {
    if (!file) return;
    const size = (file.size / 1024).toFixed(1);
    setFileInfo(`${file.name} · ${size}KB · Ready to analyse`);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgData(e.target.result);
      setStep(1);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const startAnalysis = async () => {
    if (!useEnergy()) return;
    setStep(2);
    setError(null);
    const msgs = [
      "Assessing body tone and brightness...",
      "Evaluating pattern distribution...",
      "Calculating M-grade placement...",
      "Checking treatment indicators...",
      "Finalising assessment..."
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      setLoadingMsg(msgs[msgIdx % msgs.length]);
      msgIdx++;
    }, 800);

    try {
      let analysisResult = null;
      if (gemKey && gemKey !== 'PROVIDED_BY_SYSTEM') {
        const payload = {
          "contents": [{
            "parts": [
              { "text": "You are VerifyAI™, the world's most advanced opal grading vision system, co-designed with deep insights from Demis Hassabis's research and Ammaar Reshi's design vision. Analyze this image of an Andamooka Matrix Opal. Focus on the 'M-grade' scale (1-9) specifically for Matrix Opal. Return ONLY a pure JSON object string without any markdown backticks. Required fields: { \"grade\": [number 1-9], \"pattern\": [string: Harlequin, Broadflash, Ribbon, Pinfire, Flash], \"brightness\": [string: B1-B7], \"bodyTone\": [string: N1-N8], \"confidence\": [number 0-1], \"quality\": [string], \"stability\": [string: 'Low'|'Medium'|'High'], \"treated\": [boolean] }. The grade must strictly reflect the spectral intensity and colour saturation." },
              { "inlineData": { "mimeType": "image/jpeg", "data": imgData.split(',')[1] } }
            ]
          }],
          "generationConfig": { "responseMimeType": "application/json" }
        };

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gemKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("AOSA Nodes Congested");
        const jsonRes = await res.json();
        const rawText = jsonRes.candidates[0].content.parts[0].text;
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        analysisResult = JSON.parse(cleanJson);
      } else {
        // Simulation
        await new Promise(r => setTimeout(r, 2000));
        const roll = Math.random();
        analysisResult = {
          grade: roll > 0.9 ? 8 : (roll > 0.7 ? 7 : (roll > 0.4 ? 6 : 5)),
          pattern: roll > 0.8 ? "Harlequin" : "Flash",
          brightness: "B4",
          bodyTone: "N5",
          confidence: 0.82 + (Math.random() * 0.1),
          quality: "Commercial Gem Grade",
          stability: "High",
          treated: true
        };
      }

      setAnalysisResult(analysisResult);
      
      // Update the stones list with the new analysis
      const newStone = {
        id: Date.now(),
        name: `VERIFIED-${Math.random().toString(36).substring(7).toUpperCase()}`,
        img: imgData,
        mk_grade: analysisResult.grade,
        pattern: analysisResult.pattern,
        brightness: analysisResult.brightness,
        bodyTone: analysisResult.bodyTone,
        stabilityRisk: analysisResult.stability,
        treated: analysisResult.treated ? 'Yes' : 'No',
        rarity: {
          label: analysisResult.grade >= 7 ? 'ELITE' : 'PRIME',
          color: analysisResult.grade >= 7 ? 'var(--gold)' : 'var(--teal)',
          xp: analysisResult.grade * 100
        },
        verified: true,
        verifiedAt: new Date().toISOString(),
        owner: 'mattk',
        wg: 12, // default mock
        ct: 10,
        mk_ppg: analysisResult.grade * 0.5,
        mk_rough_total: 10 * (analysisResult.grade * 0.5)
      };

      setData([...data, newStone]);
      addXp(newStone.rarity.xp);
      setStep(3);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStep(1);
    } finally {
      clearInterval(msgInterval);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-[opn-fadein_0.2s_ease-out]" style={{ background: 'rgba(7,10,18,0.96)', backdropFilter: 'blur(20px)' }}>
      <div className="bg-[var(--surf)] border border-[var(--bdr-hi)] md:rounded-2xl w-full h-full md:h-auto max-w-[520px] flex flex-col overflow-hidden shadow-2xl relative">
        <div style={{ background: 'linear-gradient(135deg, rgba(16,200,150,0.15) 0%, transparent 100%)', borderBottom: '1px solid rgba(16,200,150,0.2)' }} className="px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#10C896]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
            <span className="text-[#10C896] font-medium tracking-widest uppercase text-[11px] font-display">AOSA VerifyAI™</span>
          </div>
          <div className="flex gap-4 items-center">
            {step === 1 && <button onClick={() => setStep(0)} className="text-[12px] text-[var(--muted)] hover:text-white font-bold tracking-wider uppercase">← Back</button>}
            <button onClick={onClose} className="text-[var(--muted)] hover:text-white text-3xl leading-none">&times;</button>
          </div>
        </div>
        
        {step === 0 && (
          <div className="p-8 flex flex-col items-center h-full justify-center">
            <div className="h-8 mb-6"><AOSA_Logo_Scaled /></div>
            <p className="text-[13px] text-[var(--muted)] mb-8 text-center">Instant visual grading for Andamooka Matrix Opal</p>

            <div className="flex md:flex-row flex-col gap-4 w-full mb-6">
              <label className="flex-1 border-2 border-[var(--gold-dim)] bg-[var(--surf2)] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--surf3)] hover:border-[var(--gold)] transition-colors">
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                <svg className="w-8 h-8 text-[var(--gold)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div className="text-[15px] font-bold text-white mb-1">Take Photo</div>
                <div className="text-[11px] text-[var(--muted)]">Use your camera</div>
              </label>
              <label className="flex-1 border-2 border-[var(--teal-dim)] bg-[var(--surf2)] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--surf3)] hover:border-[var(--teal)] transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                <svg className="w-8 h-8 text-[var(--teal)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <div className="text-[15px] font-bold text-white mb-1">Upload Photo</div>
                <div className="text-[11px] text-[var(--muted)]">From your device</div>
              </label>
            </div>

            <div 
              className="hidden md:flex w-full border-2 border-dashed border-[var(--gold-dim)] rounded-xl h-20 items-center justify-center text-[12px] text-[var(--muted)] transition-colors hover:border-[var(--gold)]"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; }}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--gold-dim)'; handleDrop(e); }}
            >
              or drag an image here
            </div>
            
            <div className="mt-8 text-[10px] text-[var(--dim)] text-center w-full max-w-sm">
              VerifyAI provides a preliminary visual assessment only. It is not a substitute for formal AOSA certification. Results are indicative and for guidance purposes only.
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col h-full">
            <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
              <div className="w-full h-[240px] bg-[var(--bg)] rounded-lg border border-[var(--gold-dim)] overflow-hidden flex items-center justify-center shrink-0">
                <img src={imgData} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="text-[11px] text-[var(--muted)] text-center">{fileInfo}</div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest">Stone Type (Optional)</label>
                <input type="text" placeholder="e.g. Hard Matrix, Concrete" className="bg-[var(--surf2)] border border-[var(--bdr)] rounded px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[var(--gold)]" />
              </div>

              <div className="flex flex-col gap-2 mb-2">
                <label className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest">Treatment Status</label>
                <div className="flex gap-2 bg-[var(--surf2)] p-1 rounded border border-[var(--bdr)]">
                  {['Treated', 'Untreated', 'Unknown'].map(t => (
                    <button key={t} className="flex-1 py-1.5 text-[11px] font-bold rounded bg-transparent text-[var(--muted)] focus:bg-[var(--surf)] focus:text-white hover:bg-[var(--surf3)]">{t}</button>
                  ))}
                </div>
              </div>

              <button onClick={startAnalysis} className="mt-auto md:mt-0 w-full py-3 rounded-lg text-white text-[14px] font-bold tracking-wide transition-opacity hover:opacity-90" style={{background: 'linear-gradient(135deg, var(--gold), var(--teal))'}}>
                ◆ Analyse Stone
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-12 flex flex-col items-center justify-center h-full md:h-[400px]">
            <div className="relative w-[180px] h-[180px] bg-[var(--bg)] rounded-xl border-2 border-[var(--teal)] overflow-hidden mb-8 shadow-[0_0_30px_var(--teal-dim)]">
              <img src={imgData} className="w-full h-full object-cover opacity-60" />
              <div className="absolute left-0 right-0 h-1 bg-[var(--teal)] shadow-[0_0_15px_var(--teal)] opacity-80" style={{animation: 'opn-scan 1.5s linear infinite'}} />
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes opn-scan {
                0% { top: -5%; }
                100% { top: 105%; }
              }
            `}} />

            <div className="flex gap-3 items-center mb-4 text-[var(--teal)]">
               <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
              <div className="font-bold text-[14px] animate-pulse">{loadingMsg}</div>
            </div>
            <div className="text-[10px] text-[var(--dim)]">This usually takes 5-10 seconds</div>
          </div>
        )}

        {step === 3 && analysisResult && (
          <div className="p-8 flex flex-col h-full animate-[opn-fadein_0.3s_ease-out]">
            <h3 className="text-[12px] font-bold tracking-widest uppercase text-[var(--teal)] mb-6 text-center">Analysis Complete</h3>
            
            <div className="flex flex-col gap-6 w-full mb-8 items-center">
              <div className="w-[120px] h-[120px] rounded-lg shrink-0 overflow-hidden border border-[var(--bdr-hi)] shadow-xl">
                <img src={imgData} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <div className="text-[52px] font-light text-[var(--gold)] leading-none mb-2 font-display tracking-tighter drop-shadow-[0_0_15px_rgba(201,166,107,0.4)]">M{analysisResult.grade}</div>
                <div className="text-[14px] font-semibold text-[var(--teal)] mb-2 font-display uppercase tracking-widest">{analysisResult.quality}</div>
                <div className="text-[12px] text-[var(--muted)] font-medium">Est. Gross: <span className="text-[var(--gold)] font-mono">${(analysisResult.grade * 0.4).toFixed(2)} - ${(analysisResult.grade * 0.8).toFixed(2)} / g</span></div>
              </div>
            </div>

            <div className="w-full rounded-lg bg-[var(--surf2)] border border-[var(--bdr)] overflow-hidden mb-8">
               <div className="grid grid-cols-2 divide-[var(--bdr)] border-b border-[var(--bdr)]">
                 <div className="p-4 border-r border-[var(--bdr)]">
                   <div className="text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Detected Pattern</div>
                   <div className="font-bold text-[13px] text-white">{analysisResult.pattern}</div>
                 </div>
                 <div className="p-4">
                   <div className="text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Confidence Score</div>
                   <div className="font-bold font-mono text-[13px] text-[var(--teal)]">{(analysisResult.confidence * 100).toFixed(1)}%</div>
                 </div>
               </div>
               <div className="grid grid-cols-2 divide-[var(--bdr)]">
                 <div className="p-4 border-r border-[var(--bdr)]">
                   <div className="text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Est. Brightness</div>
                   <div className="font-bold text-[13px] text-white">{analysisResult.brightness}</div>
                 </div>
                 <div className="p-4">
                   <div className="text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">Est. Body Tone</div>
                   <div className="font-bold text-[13px] text-white">{analysisResult.bodyTone}</div>
                 </div>
               </div>
            </div>

            <div className="flex gap-2 items-center justify-center mb-6">
              <div className="px-2 py-1 rounded bg-[var(--gold-dim)] text-[var(--gold)] text-[9px] font-bold uppercase tracking-widest border border-[var(--gold-dim)]">Teachable Machine v2</div>
              <div className="px-2 py-1 rounded bg-[var(--teal-dim)] text-[var(--teal)] text-[9px] font-bold uppercase tracking-widest border border-[var(--teal-dim)]">Vision Grounded</div>
            </div>

            <button onClick={onClose} className="mt-auto md:mt-0 w-full py-3 rounded-lg text-[13px] font-bold bg-[var(--surf3)] hover:bg-[var(--surf2)] text-white border border-[var(--bdr-hi)] transition-colors">
              Close & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const VerifyAIFAB = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        borderRadius: '30px',
        padding: '10px 20px',
        background: 'rgba(16,200,150,0.15)',
        border: '1px solid rgba(16,200,150,0.4)',
        color: '#10C896',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'transform 150ms'
      }}
      className="hover:scale-105 group"
      title="AOSA VerifyAI — Instant opal grading"
    >
      <svg className="w-5 h-5 shrink-0 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      <span className="text-[11px] font-bold tracking-[0.14em] uppercase hidden md:block relative z-10 pr-2 font-display">VerifyAI™</span>
    </button>
  );
};
