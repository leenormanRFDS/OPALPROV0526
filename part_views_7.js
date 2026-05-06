const CustodianView = ({ custodianData, setView }) => {
  const asset = custodianData[0]; // Currently targeting the first asset

  const mintClick = () => {
    setView('Mint');
    setTimeout(() => window.dispatchEvent(new CustomEvent('nav-mint-stone', { detail: asset.id })), 100);
  };

  return (
    <div className="flex flex-col gap-12 animate-[opn-fadein_0.18s_ease-out] pb-10">
      {/* HERO SECTION */}
      <div className="w-full bg-[#08090a] rounded-xl border border-[var(--gold-dim)] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(201,166,107,0.05)]">
        <div className="w-full lg:w-1/2 p-8 flex items-center justify-center relative min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#08090b] hidden lg:block z-10"></div>
          <img src={asset.img} className="max-w-[400px] w-full object-contain relative z-0 filter drop-shadow-[0_0_20px_rgba(201,166,107,0.3)] rounded-lg border border-[var(--gold-dim)]" />
        </div>
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative z-20 bg-[#08090b]">
          <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--gold)] font-medium mb-2 font-display">Cobra Cuff Collection™</div>
          <h1 className="text-[42px] font-light text-[#FFF1D0] leading-none mb-1 font-display tracking-tight">{asset.collection}</h1>
          <div className="text-[18px] font-medium text-[var(--gold)] mb-6 font-display opacity-80">No. {asset.serialNumber} of {asset.totalEdition}</div>
          
          <div className="inline-block border border-[var(--red)] text-[var(--red)] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-8 self-start bg-[var(--red-dim)] shadow-[0_0_10px_var(--red-dim)]">
            {asset.status}
          </div>

          <div className="bg-[var(--surf)] border border-[var(--bdr-hi)] rounded-lg p-5 mb-8">
            <div className="flex justify-between items-end border-b border-[var(--bdr)] pb-4 mb-4">
              <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-[0.2em] font-display">Retail Value</div>
              <div className="text-[20px] font-light text-[var(--text)] text-right font-display leading-none tracking-tight">${(asset.retailPrice || 0).toLocaleString()} <span className="text-[11px] font-bold opacity-40 ml-1 font-sans">AUD</span></div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-[0.2em] font-display">NFT Estimate</div>
              <div className="text-[28px] font-light text-[var(--gold)] text-right shadow-[0_0_15px_var(--gold-dim)] font-display leading-none tracking-tight">${(asset.nft_value || 0).toLocaleString()} <span className="text-[11px] font-bold opacity-40 ml-1 font-sans">AUD</span></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center font-light text-[24px] shadow-[0_0_20px_var(--teal-dim)] border border-[#fff2] shrink-0 font-display" style={{backgroundColor: GRADE_COLORS[asset.stone.grade], color: '#fff'}}>
              M{asset.stone.grade}
            </div>
            <div className="text-[13px] text-[var(--muted)] leading-relaxed font-medium">
              <strong className="text-white block mb-1 font-display tracking-tight text-[15px]">{asset.stone.carats}ct {asset.stone.type}</strong>
              <span className="uppercase tracking-widest text-[10px] opacity-60">{asset.stone.pattern} &middot; {asset.stone.brightness}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PROVENANCE CHAIN */}
      <div className="bg-[var(--surf)] rounded-xl border border-[var(--bdr)] p-8 overflow-x-auto custom-scrollbar">
        <h3 className="text-[14px] font-semibold text-[var(--text)] mb-6 font-display uppercase tracking-widest opacity-60">Provenance & Assembly Log</h3>
        <div className="flex items-start min-w-[800px]">
          {asset.provenance.map((p, i) => (
            <div key={i} className="flex-1 relative">
               {i < asset.provenance.length - 1 && (
                 <div className="absolute top-4 left-8 right-0 h-[1px] bg-[var(--gold)] opacity-30"></div>
               )}
               <div className="flex flex-col items-start gap-3 relative z-10 pr-6">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold font-display ${p.label === 'Mint Pending' ? 'bg-[var(--bg)] border-2 border-[var(--gold)] text-[var(--gold)] animate-pulse' : 'bg-[var(--gold)] text-[#000]'}`}>
                   {p.step}
                 </div>
                 <div>
                   <div className={`text-[12px] font-bold font-display uppercase tracking-wider ${p.label === 'Mint Pending' ? 'text-[var(--gold)]' : 'text-white'}`}>{p.label}</div>
                   <div className="text-[10px] text-[var(--muted)] mt-1 font-medium">{p.detail}</div>
                   <div className="text-[9px] text-[var(--dim)] mt-2 font-mono uppercase tracking-widest">{p.date || p.coords}</div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GPS MAP */}
        <div className="bg-[var(--surf)] rounded-xl border border-[var(--gold-dim)] overflow-hidden flex flex-col">
          <div className="p-4 bg-[var(--surf2)] border-b border-[var(--gold-dim)]">
            <h3 className="text-[13px] font-bold text-[var(--gold)] mb-1">Origin Coordinates Verified</h3>
            <p className="text-[10px] text-[var(--muted)] font-mono">{asset.stone.mine} &middot; {asset.stone.location} &middot; 30°27'17"S 137°11'22"E</p>
          </div>
          <div className="w-full h-48 relative border-t border-[var(--bdr)]">
            <img src={`https://staticmap.openstreetmap.de/staticmap.php?center=${asset.stone.coordinates.lat},${asset.stone.coordinates.lng}&zoom=14&size=600x200&markers=${asset.stone.coordinates.lat},${asset.stone.coordinates.lng},red`} className="w-full h-full object-cover opacity-80 filter brightness-75 contrast-125" />
            <div className="absolute bottom-2 right-2 bg-[#000a] text-[9px] px-2 py-1 rounded text-[var(--muted)] border border-[#fff2]">Verified mine-site coordinates embedded in NFT metadata</div>
          </div>
        </div>

        {/* STONE CERTIFICATE CARD */}
        <div className="bg-[var(--surf)] rounded-xl border border-[var(--teal-dim)] overflow-hidden flex flex-col">
           <div className="p-4 bg-[var(--surf2)] border-b border-[var(--teal-dim)]">
            <h3 className="text-[13px] font-bold text-[var(--teal)] mb-1">AOSA Stone Certificate</h3>
            <p className="text-[10px] text-[var(--muted)]">Certified under AOSA Andamooka Standard v1.0</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center gap-4 text-[12px] text-[var(--muted)] leading-relaxed bg-[var(--bg)]">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 text-[16px] rounded border border-[#fff4] text-white font-bold" style={{backgroundColor: GRADE_COLORS[asset.stone.grade]}}>M{asset.stone.grade}</div>
              <div>
                <span className="text-white font-bold block">{asset.stone.pattern} Pattern &middot; {asset.stone.brightness} Brightness</span>
              </div>
            </div>
            <div className="p-4 bg-[var(--surf2)] rounded border border-[var(--bdr-hi)] shadow-inner">
              <div className="mb-2"><strong className="text-white">Extracted, treated & set by:</strong> {asset.stone.miner}</div>
              <div><strong className="text-white">Status:</strong> {asset.stone.type}</div>
            </div>
            <div className="text-[9px] uppercase font-bold tracking-widest text-center mt-2 opacity-50 border-t border-[var(--bdr)] pt-4">Opal Provenance Network</div>
          </div>
        </div>
      </div>

      {/* EDITION TRACKER */}
      <div className="bg-[var(--surf)] rounded-xl border border-[var(--bdr)] p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
           <div>
              <h3 className="text-2xl font-light text-white mb-1 font-display tracking-tight">{asset.collection} <span className="opacity-40">Edition Tracker</span></h3>
              <p className="text-[12px] text-[var(--muted)] font-medium uppercase tracking-[0.2em] mt-2">18 of 20 available for public acquisition</p>
           </div>
           <div className="bg-[var(--surf2)] border border-[var(--gold-dim)] px-4 py-2 rounded text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--gold)] font-display">
              SOLD: 2 &middot; AVAILABLE: 18 &middot; MINTED: {asset.nft ? '1' : '0'}
           </div>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {[...Array(20)].map((_, i) => {
            const isNo1 = i === 0;
            const isNo2 = i === 1;
            return (
              <div key={i} className={`aspect-square rounded border flex flex-col items-center justify-center p-1 text-center relative overflow-hidden ${isNo1 ? 'border-[var(--gold)] bg-[var(--surf2)] shadow-[0_0_10px_var(--gold-dim)]' : isNo2 ? 'border-[var(--bdr-hi)] bg-[var(--surf2)]' : 'border-[var(--bdr)] bg-[var(--bg)] opacity-60 hover:opacity-100 transition-opacity'}`}>
                {isNo1 && <img src={asset.img} className="absolute inset-0 w-full h-full object-cover opacity-30" />}
                <div className={`text-[16px] font-mono font-bold relative z-10 ${isNo1 ? 'text-[var(--gold)]' : 'text-[var(--muted)]'}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                {isNo1 && <div className="text-[9px] font-bold text-[var(--red)] uppercase mt-1 relative z-10 tracking-widest">HELD</div>}
                {isNo2 && <div className="text-[8px] font-bold text-[var(--dim)] uppercase mt-1 relative z-10 tracking-widest">RESERVED</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* MINT BUTTON */}
      {!asset.nft ? (
        <button onClick={mintClick} className="w-full flex flex-col items-center justify-center py-8 rounded-xl hover:scale-[1.01] transition-transform shadow-[0_0_30px_var(--teal-dim)]" style={{background: 'linear-gradient(135deg, var(--gold), var(--teal))'}}>
          <div className="text-[28px] md:text-[32px] font-light text-white mb-2 leading-none text-center font-display tracking-tight">◉ MINT GENESIS NFT — No. 1 of 20</div>
          <div className="text-[14px] font-semibold text-[#0B0D12] opacity-80 mb-1 text-center font-display uppercase tracking-wider">This will be the first asset ever minted on the OPN</div>
          <div className="text-[12px] text-[#0B0D12] opacity-60 font-medium text-center">The minting process will be broadcast on Outback Opal Hunters</div>
        </button>
      ) : (
         <div className="w-full border border-[var(--teal)] bg-[var(--teal-dim)] rounded-xl py-8 flex flex-col items-center shadow-[0_0_30px_var(--teal-dim)] animate-[opn-fadein_0.3s_ease-out]">
           <div className="text-[24px] font-medium text-[var(--teal)] mb-1 uppercase tracking-widest font-display">◆ Genesis NFT Minted</div>
           <div className="text-[14px] text-white opacity-80 font-mono">Certificate ID: COBRA-CC-001-OPN-2026</div>
         </div>
      )}
    </div>
  );
};
