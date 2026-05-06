const NFTCollectionView = ({ data, onSelect, setView }) => {
  const minted = data.filter(s => s.nft);
  const unminted = data.filter(s => !s.nft && s.mk_grade >= 3);
  const genesis = minted.find(s => s.genesis);
  const others = minted.filter(s => !s.genesis);
  
  const ranking = [...minted].sort((a,b) => (b.nft_value || b.mr_offer*1.8 || 0) - (a.nft_value || a.mr_offer*1.8 || 0));

  return (
    <div className="flex flex-col gap-6 animate-[opn-fadein_0.18s_ease-out]">
      <div className="flex justify-between items-center bg-[var(--surf2)] p-4 rounded-lg border border-[var(--bdr-hi)] shadow-sm">
        <div>
          <h2 className="text-2xl font-light text-[var(--text)] font-display tracking-tight">NFT Collection & <span className="opacity-40">Provenance</span></h2>
          <p className="text-[12px] text-[var(--muted)] font-medium uppercase tracking-[0.2em] mt-1">Certified on-chain assets</p>
        </div>
        <button onClick={() => setView('Mint')} className="px-5 py-2.5 bg-[var(--teal)] hover:brightness-110 text-[#000] font-medium text-[12px] rounded-lg uppercase tracking-[0.15em] transition-all shadow-[0_0_15px_var(--teal-dim)] font-display">
          Go to The Mint &rarr;
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          {genesis && (
            <div className="bg-[var(--surf2)] border-[2px] border-[var(--gold)] rounded-lg p-1 shadow-[0_0_30px_var(--gold-dim)] overflow-hidden cursor-pointer group" onClick={() => onSelect(genesis.id)}>
              <div className="relative h-[300px] w-full overflow-hidden rounded bg-[#000]">
                <div className="absolute inset-0 flex w-full h-full">
                  <div className="w-1/2 h-full"><img src={genesis.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                  <div className="w-1/2 h-full border-l border-[var(--gold)]"><img src={genesis.nft_img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-[var(--bg)] border border-[var(--gold)] px-3 py-1 rounded text-[10px] font-bold text-[var(--gold)] tracking-widest shadow-[0_0_10px_var(--gold-dim)] font-display uppercase">GENESIS NFT</div>
                
                <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="text-4xl font-light text-white mb-2 leading-none tracking-tight font-display" style={{textShadow: '0 2px 20px rgba(0,0,0,0.8)'}}>{genesis.name}</h2>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] font-bold mb-1 opacity-80">M9 AOSA Grade &middot; Fully Consensus Verified</div>
                    <div className="text-[10px] text-[var(--dim)] font-mono opacity-60">ID: OPN-GENESIS-001 &middot; Minted via The Mint &middot; AOSA™</div>
                  </div>
                  <div className="text-right bg-[#000000AA] backdrop-blur p-4 rounded border border-[var(--teal)] shadow-[0_0_20px_var(--teal-dim)] w-full md:w-auto">
                    <div className="text-[10px] uppercase text-[var(--muted)] tracking-wider mb-1 font-display font-bold">On-chain Value</div>
                    <div className="text-4xl font-light text-[var(--gold)] font-display tracking-tight leading-none">{formatCur(genesis.nft_value || 2160)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {others.map(s => (
                <div key={s.id} onClick={() => onSelect(s.id)} className="bg-[var(--surf2)] border border-[var(--bdr)] rounded-lg overflow-hidden cursor-pointer hover:border-[var(--teal)] hover:shadow-[0_0_25px_rgba(16,200,150,0.4)] hover:scale-[1.02] transition-all duration-300 group flex flex-col">
                  <div className="relative h-[180px]">
                    <img src={s.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surf2)] to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#000000AA] backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-[var(--teal)] border border-[var(--teal-dim)]">◆ MINTED</div>
                    <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded border border-[#fff4] text-white" style={{backgroundColor: GRADE_COLORS[s.mk_grade]}}>M{s.mk_grade}</div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-[15px] text-[var(--text)] mb-3 leading-tight font-display tracking-tight">{s.name}</h3>
                    <div className="mt-auto">
                      <div className="text-[10px] text-[var(--muted)] uppercase tracking-[0.14em] mb-1 font-display font-bold">NFT Asset Value</div>
                      <div className="text-[22px] font-light text-[var(--gold)] mb-2 font-display tracking-tight">{formatCur(s.nft_value || s.mr_offer*1.8 || s.listPrice)}</div>
                      <div className="text-[9px] text-[var(--teal)] bg-[var(--teal-dim)] px-2 py-1 rounded-sm inline-block font-bold tracking-widest uppercase border border-[var(--teal-dim)]">Provenance: +{Math.round(((s.nft_value || s.mr_offer*1.8 || s.listPrice) / (s.mk_rough_total) - 1)*100)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(unminted.length > 0) && (
            <div className="mt-4 border-t border-[var(--bdr)] pt-6">
               <h3 className="text-[13px] font-bold uppercase tracking-widest text-[var(--muted)] mb-4">Available to Mint</h3>
               <div className="flex flex-col gap-3">
                 {unminted.map(s => (
                   <div key={s.id} className="bg-[var(--surf)] border border-[var(--bdr)] rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-4 hover:bg-[var(--surf2)] transition-colors">
                     <img src={s.img} className="w-12 h-12 rounded object-cover cursor-pointer" onClick={() => onSelect(s.id)} />
                     <div className="flex-1 cursor-pointer" onClick={() => onSelect(s.id)}>
                       <div className="font-bold text-[13px]">{s.name}</div>
                       <div className="text-[11px] text-[var(--muted)]">M{s.mk_grade} &middot; {formatCur(s.mk_rough_total)}</div>
                     </div>
                     <button onClick={() => { setView('Mint'); setTimeout(() => window.dispatchEvent(new CustomEvent('nav-mint-stone', {detail: s.id})), 100); }} className="px-4 py-2 border border-[var(--bdr-hi)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] font-bold text-[12px] rounded transition-all whitespace-nowrap">
                       ◉ Open in The Mint &rarr;
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
          <div className="bg-[var(--surf)] border border-[var(--bdr)] rounded-lg overflow-hidden sticky top-6">
            <div className="p-4 border-b border-[var(--bdr)] bg-[var(--surf2)]">
              <h3 className="font-bold text-[13px] uppercase tracking-widest text-[var(--gold)] mb-1">NFT Value Ranking</h3>
              <p className="text-[11px] text-[var(--muted)]">Top certified stones by value</p>
            </div>
            <div className="flex flex-col divide-y divide-[var(--bdr)]">
              {ranking.map((s, idx) => (
                <div key={s.id} className="p-3 flex items-center justify-between hover:bg-[var(--surf2)] cursor-pointer transition-colors" onClick={() => onSelect(s.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center text-[11px] font-bold ${idx === 0 ? 'bg-[var(--gold-dim)] text-[var(--gold)]' : 'bg-[var(--surf3)] text-[var(--muted)]'}`}>
                       {idx === 0 ? '👑' : idx+1}
                    </div>
                    <div className="truncate min-w-0">
                      <div className="text-[12px] font-bold text-white truncate">{s.name}</div>
                      <div className="text-[10px] px-1.5 py-0.5 rounded inline-block mt-1 font-bold border border-[#fff2]" style={{backgroundColor: GRADE_COLORS[s.mk_grade], color: '#fff'}}>M{s.mk_grade}</div>
                    </div>
                  </div>
                  <div className="text-[13px] font-mono font-bold text-[var(--gold)] shrink-0 pl-2">
                    {formatCur(s.nft_value || s.mr_offer*1.8 || s.listPrice)}
                  </div>
                </div>
              ))}
              {ranking.length === 0 && (
                <div className="p-6 text-center text-[12px] text-[var(--muted)]">No items minted.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MinerProjectionView = ({ data, onSelect }) => {
  const top = [...data].sort((a,b) => b.mk_rough_total - a.mk_rough_total).slice(0,5);

  return (
    <div className="flex flex-col gap-6 animate-[opn-fadein_0.18s_ease-out]">
      <div className="bg-[var(--surf2)] border border-[var(--bdr)] p-6 rounded-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-[200px] leading-none transform translate-x-10 -translate-y-10">⚒</div>
        <h2 className="text-2xl font-light mb-2 font-display tracking-tight">Miner Yield <span className="opacity-40">Projection (Bull Case)</span></h2>
        <p className="text-[14px] text-[var(--muted)] max-w-3xl leading-relaxed mb-8 font-medium">
          The miner's valuation relies strictly on untouched raw weight and heuristic surface qualities (brightness, pattern). It expects optimal downstream treatment without assuming the liability of the cutting process itself. This creates the "Volume Paradox" where rough pricing exceeds actual cutter margins.
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-[var(--surf)] border border-[var(--bdr)] rounded p-4 shadow-inner">
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--dim)] mb-4 font-display">Top 5 Rough Valuations</div>
            <div className="space-y-3">
              {top.map((s, i) => (
                <div key={s.id} onClick={() => onSelect(s.id)} className="flex items-center gap-3 p-2 rounded hover:bg-[var(--surf2)] cursor-pointer transition-colors border border-transparent hover:border-[var(--gold-dim)]">
                  <div className="w-6 h-6 flex justify-center items-center rounded bg-[var(--surf3)] text-[10px] font-bold text-[var(--gold)] opacity-50">{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate tracking-tight">{s.name}</div>
                    <div className="text-[10px] text-[var(--muted)] font-medium">{s.wg}g @ {formatCur(s.mk_ppg)}/g &middot; {s.ct}ct</div>
                  </div>
                  <div className="text-[15px] font-light text-[var(--gold)] font-display">{formatCur(s.mk_rough_total)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[var(--surf)] border border-[var(--bdr)] rounded p-4 flex flex-col justify-center items-center text-center">
            <div className="text-[54px] font-light text-[var(--gold)] mb-1 font-display leading-none tracking-tighter">{formatCur(data.reduce((acc, s) => acc + s.mk_rough_total, 0))}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-4 font-display">Total Inventory Rough Valuation</div>
            <div className="text-[12px] max-w-xs text-[var(--dim)] border-t border-[var(--bdr)] pt-6 font-medium">
              Represents the complete bull-case scenario if all stones yielded 100% of their raw matrix potential without loss or downgrade.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CutterYieldView = ({ data, onSelect }) => {
  const top = [...data].filter(s => s.mr_offer).sort((a,b) => b.mr_offer - a.mr_offer).slice(0,5);
  
  return (
    <div className="flex flex-col gap-6 animate-[opn-fadein_0.18s_ease-out]">
      <div className="bg-[var(--surf2)] border border-[var(--bdr)] p-6 rounded-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-[200px] leading-none transform translate-x-10 -translate-y-10">⬡</div>
        <h2 className="text-2xl font-light mb-2 font-display tracking-tight">Cutter Floor Protocol <span className="opacity-40">(Risk Adjusted)</span></h2>
        <p className="text-[14px] text-[var(--muted)] max-w-3xl leading-relaxed mb-8 font-medium">
          The cutter prices in treatment stability, cracking likelihood, disclosure liabilities, and polish loss. The "Treated Concrete Problem" dictates that beautifully colored, but structurally weak matrix is severely discounted down to zero if it cannot survive a commercial setting process.
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-[var(--surf)] border border-[var(--bdr)] rounded p-4 shadow-inner">
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--dim)] mb-4 font-display">Top 5 Acquisition Offers</div>
            <div className="space-y-3">
              {top.map((s, i) => (
                <div key={s.id} onClick={() => onSelect(s.id)} className="flex items-center gap-3 p-2 rounded hover:bg-[var(--surf2)] cursor-pointer transition-colors border border-transparent hover:border-[var(--teal-dim)]">
                  <div className="w-6 h-6 flex justify-center items-center rounded bg-[var(--surf3)] text-[10px] font-bold text-[var(--teal)] opacity-50">{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate tracking-tight">{s.name}</div>
                    <div className="text-[10px] text-[var(--muted)] font-medium">{s.stabilityRisk} Risk &middot; Yield ~40%</div>
                  </div>
                  <div className="text-[15px] font-light text-[var(--teal)] font-display">{formatCur(s.mr_offer)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[var(--surf)] border border-[var(--bdr)] rounded p-4 flex flex-col justify-center items-center text-center">
            <div className="text-[54px] font-light text-[var(--teal)] mb-1 font-display leading-none tracking-tighter">{formatCur(data.reduce((acc, s) => acc + (s.mr_offer || 0), 0))}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-4 font-display">Total Inventory Offer Book</div>
            <div className="text-[12px] max-w-xs text-[var(--dim)] border-t border-[var(--bdr)] pt-6 font-medium">
              The aggregate "cash on table" value assuming Matt R acquired the total portfolio at standard lapidary risk metrics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BenchmarkDataView = () => {
  const grades = [
    { g: "M9", desc: "Top Gem Hard Matrix", tr: "No / Low", st: "Low", pt: "Harlequin/Ribbon", val: "$10 - $15+ / ct" },
    { g: "M8", desc: "High Grade Hard Matrix", tr: "Low", st: "Low", pt: "Ribbon/Flash", val: "$3.50 - $5 / g" },
    { g: "M7", desc: "Mid-High Grade Matrix", tr: "Standard", st: "Low", pt: "Flash", val: "$3 / g" },
    { g: "M6", desc: "Mid Grade Hard Matrix", tr: "Standard", st: "Med", pt: "Flash/Pinfire", val: "$2.50 / g" },
    { g: "M5", desc: "High Grade Treated", tr: "High", st: "Med", pt: "Flash", val: "$1 - $2 / g" },
    { g: "M4", desc: "Low Grade Treated (Soft)", tr: "High", st: "High", pt: "Pinfire", val: "$0.70 - $1 / g" },
    { g: "M3", desc: "Low Grade Colour Present", tr: "Standard", st: "High", pt: "Pinfire/Speckle", val: "$0.30 - $0.50 / g" },
    { g: "M2", desc: "Solid Matrix Low Quality", tr: "Poor", st: "High", pt: "Speckle", val: "Bulk lot" },
    { g: "M1", desc: "Commercial Matrix", tr: "Poor", st: "Crit", pt: "None", val: "Untradeable" }
  ];

  return (
    <div className="flex flex-col gap-6 animate-[opn-fadein_0.18s_ease-out]">
      <div className="data-table-container shadow-2xl">
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(100,120,180,0.12)', background: 'rgba(255,255,255,0.02)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 300, marginBottom: '4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>AOSA Master Grading Standard</h2>
          <p style={{ fontSize: '13px', color: '#8B949E', fontWeight: 500 }}>The definitive matrix for Andamooka Opal valuation, bridging miner heuristics and cutter yields.</p>
        </div>
        
        <div className="overflow-x-auto bg-[#131720]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="data-table-header-row">
                <th style={{ width: '80px' }} className="font-display font-medium uppercase tracking-[0.15em] text-[9px] opacity-60">Grade</th>
                <th className="font-display font-medium uppercase tracking-[0.15em] text-[9px] opacity-60">Classification</th>
                <th className="font-display font-medium uppercase tracking-[0.15em] text-[9px] opacity-60">Typical Pattern</th>
                <th className="font-display font-medium uppercase tracking-[0.15em] text-[9px] opacity-60">Treatment Proc.</th>
                <th className="font-display font-medium uppercase tracking-[0.15em] text-[9px] opacity-60">Stability Profile</th>
                <th style={{ textAlign: 'right' }} className="font-display font-medium uppercase tracking-[0.15em] text-[9px] opacity-60">Benchmark Valuation</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(row => (
                <tr key={row.g} className="data-table-row group">
                  <td style={{ padding: '16px' }}>
                    <Badge label={row.g} color={GRADE_COLORS[parseInt(row.g[1])]} />
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600, fontSize: '13px' }} className="tracking-tight group-hover:text-white transition-colors">{row.desc}</td>
                  <td style={{ padding: '16px', color: 'var(--muted)', fontSize: '12px' }}>{row.pt}</td>
                  <td style={{ padding: '16px', color: 'var(--muted)', fontSize: '12px' }}>{row.tr} Treatment</td>
                  <td style={{ padding: '16px' }}>
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-widest" style={{backgroundColor: row.st==='High'?'var(--red-dim)':row.st==='Med'?'var(--orange-dim)':'var(--teal-dim)', color: row.st==='High'?'var(--red)':row.st==='Med'?'var(--orange)':'var(--teal)'}}>
                      {row.st}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: 'var(--gold)', fontSize: '13px' }}>{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
