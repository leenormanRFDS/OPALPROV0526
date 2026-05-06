const DirectoryView = ({ data, user, onSelect, onMint }) => (
  <div className="data-table-container animate-[opn-fadein_0.18s_ease-out] shadow-2xl">
    <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--bdr)' }} className="font-display">
      <span>Master Directory</span>
      <span className="font-mono text-[9px] opacity-60">{data.length} ASSETS</span>
    </div>
    <div className="overflow-x-auto bg-[#131720]">
      <table className="w-full text-left whitespace-nowrap">
        <thead>
          <tr className="data-table-header-row">
            <th style={{ width: '240px' }} className="font-display font-medium uppercase tracking-widest text-[9px]">Asset & Details</th>
            <th className="font-display font-medium uppercase tracking-widest text-[9px]">Grade Profile</th>
            <th className="font-display font-medium uppercase tracking-widest text-[9px]">Current Value</th>
            <th className="font-display font-medium uppercase tracking-widest text-[9px]">Stability Index</th>
            <th style={{ textAlign: 'right' }} className="font-display font-medium uppercase tracking-widest text-[9px]">Network Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(s => {
            const isK = user.id === 'mattk';
            const gColor = GRADE_COLORS[isK ? s.mk_grade : s.mr_grade];
            return (
              <tr key={s.id} className="data-table-row">
                <td style={{ display: 'flex', alignItems: 'center' }} onClick={()=>onSelect(s.id)}>
                  <img src={s.img} className="data-table-thumbnail" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }} className="tracking-tight">{s.name}</div>
                    <div style={{ fontSize: '10px', color: '#8B949E' }} className="font-medium uppercase tracking-wide">{s.ct}ct &middot; {s.pattern} &middot; {s.brightness}</div>
                  </div>
                </td>
                <td onClick={()=>onSelect(s.id)}>
                  <Badge label={`M${isK ? s.mk_grade : s.mr_grade}`} color={gColor} />
                </td>
                <td style={{ fontFamily: 'monospace' }} onClick={()=>onSelect(s.id)}>
                  <span style={{color: user.color}}>{formatCur(isK ? s.mk_rough_total : s.mr_offer)}</span>
                </td>
                <td onClick={()=>onSelect(s.id)}>
                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold" style={{backgroundColor: s.stabilityRisk==='High'?'var(--red-dim)':s.stabilityRisk==='Medium'?'var(--orange-dim)':'var(--teal-dim)', color: s.stabilityRisk==='High'?'var(--red)':s.stabilityRisk==='Medium'?'var(--orange)':'var(--teal)'}}>
                    {s.stabilityRisk}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {s.nft ? (
                    <span className="px-3 py-1.5 rounded text-[11px] font-bold bg-[var(--teal)] text-[var(--bg)] shadow-[0_0_8px_var(--teal-dim)]">◆ Minted</span>
                  ) : (
                    <button onClick={(e)=>{e.stopPropagation(); onMint(s);}} className="px-3 py-1 border border-[var(--bdr)] rounded text-[11px] font-bold text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all">Mint NFT</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const DivergenceView = ({ data, onSelect }) => {
  return (
    <div className="flex flex-col gap-6 animate-[opn-fadein_0.18s_ease-out]">
      <div className="bg-[var(--surf2)] border border-[var(--bdr)] p-6 rounded-lg">
        <h2 className="text-2xl font-light mb-2 font-display tracking-tight">Where Matt K and Matt R Disagree — <span className="opacity-40">and Why It Matters</span></h2>
        <p className="text-[14px] text-[var(--muted)] border-b border-[var(--bdr)] pb-6 mb-8 font-medium">Each disagreement represents value trapped in the gap between miner knowledge and cutter expertise. AOSA bridges both.</p>
        
        <div className="flex">
          <div className="flex flex-col justify-around pr-6 border-r border-[var(--bdr)] text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--dim)] font-display">
            <div className="text-[var(--gold)]">Matt K &nbsp; Miner</div>
            <div className="text-[var(--teal)]">Matt R &nbsp; Cutter</div>
            <div className="mt-2">Variance Gap</div>
          </div>
          <div className="flex-1 overflow-x-auto pl-4 pb-2">
            <div className="flex gap-1 mb-1">
              {data.map(s => <div key={'h'+s.id} className="w-14 text-center text-[9px] text-[var(--dim)] truncate">{s.name.split(' ').slice(0,2).join(' ')}</div>)}
            </div>
            <div className="flex gap-1 mb-1">
              {data.map(s => <div key={'mk'+s.id} onClick={()=>onSelect(s.id)} className="w-14 h-11 rounded flex items-center justify-center font-bold text-[13px] cursor-pointer hover:scale-110 transition-transform relative group" style={{backgroundColor: GRADE_COLORS[s.mk_grade]+'55', border: `1px solid ${GRADE_COLORS[s.mk_grade]}BB`, color: GRADE_COLORS[s.mk_grade]}}>
                M{s.mk_grade}
              </div>)}
            </div>
            <div className="flex gap-1 mb-4">
              {data.map(s => <div key={'mr'+s.id} onClick={()=>onSelect(s.id)} className="w-14 h-11 rounded flex items-center justify-center font-bold text-[13px] cursor-pointer hover:scale-110 transition-transform" style={{backgroundColor: GRADE_COLORS[s.mr_grade]+'55', border: `1px solid ${GRADE_COLORS[s.mr_grade]}BB`, color: GRADE_COLORS[s.mr_grade]}}>
                M{s.mr_grade}
              </div>)}
            </div>
            <div className="flex gap-1 border-t border-[var(--bdr)] pt-4">
              {data.map(s => {
                const gap = Math.abs(s.mk_grade - s.mr_grade);
                const color = gap===0?'var(--teal)':gap===1?'#4EA832':gap===2?'#96981E':gap===3?'var(--orange)':'var(--red)';
                const bg = gap===0?'var(--teal-dim)':gap===1?'rgba(78,168,50,0.18)':gap===2?'rgba(150,152,30,0.18)':gap===3?'var(--orange-dim)':'var(--red-dim)';
                return <div key={'gap'+s.id} onClick={()=>onSelect(s.id)} className={`w-14 h-8 rounded flex items-center justify-center font-bold text-[11px] cursor-pointer ${gap>=4?'animate-[opn-variance-pulse_2s_infinite]':''}`} style={{backgroundColor: bg, color: color}}>{gap===0?'✓':gap>=4?`±${gap}`:`±${gap}`}</div>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
