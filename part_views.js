const DetailPanel = ({ stone, user, onClose, onMint }) => {
  const isOpen = !!stone;

  return (
    <>
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/80 z-30 backdrop-blur-sm" onClick={onClose}></div>}
      <div style={{
        width: isOpen ? '400px' : '0px',
        minWidth: isOpen ? '400px' : '0px',
        flexShrink: 0,
        height: '100vh',
        overflowY: isOpen ? 'auto' : 'hidden',
        overflowX: 'hidden',
        background: 'var(--surf)',
        borderLeft: isOpen ? '1px solid var(--bdr-hi)' : 'none',
        transform: isOpen ? 'translateX(0)' : 'translateX(400px)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 40
      }} className="fixed md:static inset-y-0 right-0 shadow-2xl md:shadow-none glass">
        
        {isOpen && (
          <>
            <div className="p-5 border-b border-[var(--bdr)] flex justify-between items-center bg-black/20 shrink-0 backdrop-blur-xl">
              <div>
                <div className="font-medium text-[16px] tracking-tight font-display">{stone.name}</div>
                <div className="text-[10px] text-[var(--muted)] font-mono uppercase tracking-widest mt-0.5 opacity-60">Andamooka Matrix &middot; #{stone.id}</div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-xl font-light text-[var(--muted)] hover:text-white">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {(() => {
                const isK = user.id === 'mattk';
                const gColor = GRADE_COLORS[isK ? stone.mk_grade : stone.mr_grade];
                const avg = ((stone.mk_grade + stone.mr_grade)/2).toFixed(1);
                const gap = Math.abs(stone.mk_grade - stone.mr_grade);
                return (
                  <>
                    <div className="p-8 text-center border-b border-[var(--bdr)] pb-10 relative overflow-hidden bg-black/10">
                      <div className="absolute inset-x-0 top-0 h-32 opacity-20" style={{background: `radial-gradient(circle at center, ${gColor} 0%, transparent 70%)`}}></div>
                      <div className="text-[92px] font-light leading-none tracking-tighter font-display" style={{color: gColor, textShadow: `0 0 40px ${gColor}33`}}>M{isK ? stone.mk_grade : stone.mr_grade}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] mt-3 mb-8 font-display" style={{color: gColor}}>
                        {stone[isK?'mk_grade':'mr_grade'] >= 8 ? 'Gem Grade \u2022 Ultra High' : stone[isK?'mk_grade':'mr_grade'] >= 5 ? 'Solid Matrix \u2022 Colour Variant' : 'Mining Grade'}
                      </div>
                      <div className="flex gap-1.5 h-1.5 px-4">
                        {[1,2,3,4,5,6,7,8,9].map(i => (
                          <div key={i} className="flex-1 rounded-full transition-all duration-500" style={{backgroundColor: i <= (isK ? stone.mk_grade : stone.mr_grade) ? gColor : 'var(--surf3)', boxShadow: i <= (isK ? stone.mk_grade : stone.mr_grade) ? `0 0 10px ${gColor}66` : 'none'}}></div>
                        ))}
                      </div>
                      <div className="text-right text-[9px] uppercase text-[var(--dim)] mt-3 font-bold tracking-widest font-mono">Standard Grade Index</div>
                    </div>

                    {stone.genesis ? (
                      <div className="m-6 rounded-2xl overflow-hidden border border-[var(--gold)] shadow-[0_10px_40px_-15px_rgba(212,175,55,0.4)] relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                        <img src={stone.nft_img} className="w-full h-[220px] object-cover scale-105 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute bottom-5 left-5 right-5">
                          <div className="text-[10px] text-[var(--gold)] font-bold tracking-[0.2em] mb-1.5 font-display uppercase">◆ Genesis Provenance NFT</div>
                          <div className="text-[42px] font-light text-white leading-none tracking-tighter mb-2 font-display" style={{textShadow: '0 2px 20px rgba(0,0,0,0.5)'}}>{formatCur(stone.nft_value)}</div>
                          <div className="text-[10px] font-mono text-[var(--muted)] flex items-center gap-2 opacity-80">
                             <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse"></span>
                             Polygon Mainnet &middot; L1_OPN_001
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="m-6 rounded-2xl overflow-hidden border border-[var(--bdr-hi)] relative">
                        <img src={stone.img} className="w-full h-[180px] object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[var(--surf)] to-transparent"></div>
                      </div>
                    )}

                    <div className="px-6 py-2 divide-y divide-[var(--bdr)] text-[12px]">
                      {[['Specification', `${stone.ct}ct \u00B7 ${stone.wg}g Gross`],
                        ['Miner Value', <span className="text-[var(--gold)] font-bold">{formatCur(stone.mk_rough_total)}</span>],
                        ['Cutter Offer', <span className="text-[var(--teal)] font-bold">{stone.mr_offer ? formatCur(stone.mr_offer) : '--'}</span>],
                        ['Brightness', <span className="font-bold">{stone.brightness} {stone.bodyTone}</span>],
                        ['Pattern', <span className="font-bold uppercase tracking-tight">{stone.pattern}</span>],
                        ['Treatment', <span className="uppercase font-bold tracking-tight">{stone.treatmentQuality}</span>],
                        ['Stability', <span className={`font-bold uppercase ${stone.stabilityRisk==='High'?'text-[var(--red)]':stone.stabilityRisk==='Medium'?'text-[var(--orange)]':'text-[var(--teal)]'}`}>{stone.stabilityRisk}</span>]].map(([k,v]) => (
                        <div key={k} className="flex justify-between py-4 items-center">
                          <span className="text-[var(--muted)] font-bold text-[10px] uppercase tracking-widest">{k}</span>
                          <span className="font-mono text-[11px] text-right">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 border-t border-[var(--bdr-hi)] bg-black/10">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--dim)] font-bold mb-6 font-display">Expert Assessments</div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-[var(--gold-dim)] text-[var(--gold)] font-bold text-[11px] flex items-center justify-center border border-[var(--gold)] shadow-[0_0_15px_var(--gold-dim)] transition-transform group-hover:scale-105">MK</div>
                          <div className="flex-1">
                            <div className="text-[12px] font-bold tracking-tight">Matt Kathagen &middot; Origin Grader</div>
                            <div className="flex gap-1 mt-1.5 items-center">
                              {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="w-2.5 h-1 rounded-full transition-all" style={{backgroundColor: i<=stone.mk_grade?GRADE_COLORS[stone.mk_grade]:'var(--surf3)'}}></div>)}
                              <span className="text-[11px] ml-2 font-mono font-bold" style={{color: GRADE_COLORS[stone.mk_grade]}}>M{stone.mk_grade}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-[var(--teal-dim)] text-[var(--teal)] font-bold text-[11px] flex items-center justify-center border border-[var(--teal)] shadow-[0_0_15px_var(--teal-dim)] transition-transform group-hover:scale-105">MR</div>
                          <div className="flex-1">
                            <div className="text-[12px] font-bold tracking-tight">Matt Rogers &middot; Market Grader</div>
                            <div className="flex gap-1 mt-1.5 items-center">
                              {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="w-2.5 h-1 rounded-full transition-all" style={{backgroundColor: i<=stone.mr_grade?GRADE_COLORS[stone.mr_grade]:'var(--surf3)'}}></div>)}
                              <span className="text-[11px] ml-2 font-mono font-bold" style={{color: GRADE_COLORS[stone.mr_grade]}}>M{stone.mr_grade}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 bg-white/[0.03] border border-[var(--bdr)] rounded-xl p-4 flex flex-col items-center">
                        <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1 font-display">AOSA Consensus</div>
                        <div className="text-3xl font-medium tracking-tighter font-display">M{avg}</div>
                        <div className="text-[10px] font-bold mt-2 px-3 py-1 rounded-full border" style={{
                          color: gap===0?'var(--teal)':gap>=3?'var(--red)':'var(--orange)',
                          borderColor: gap===0?'var(--teal-dim)':gap>=3?'var(--red-dim)':'var(--orange-dim)',
                          backgroundColor: gap===0?'var(--teal-dim)':gap>=3?'var(--red-dim)':'var(--orange-dim)'
                        }}>
                          {gap===0 ? '✓ UNIFIED GRADE' : gap>=3 ? '⚠ HIGH DIVERGENCE' : `GRADE GAP: ${gap}`}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-[var(--bdr-hi)] pb-12">
                      {stone.nft ? (
                        <div className="p-5 bg-[var(--teal-dim)] border border-[var(--teal)] rounded-xl text-center shadow-[0_10px_20px_-5px_rgba(45,212,191,0.2)]">
                          <div className="text-[11px] font-black text-[var(--teal)] uppercase tracking-wider mb-1">Provenance Certificate Verified</div>
                          <div className="text-[10px] text-[var(--muted)] font-medium">Recorded on blockchain &middot; Valuation Locked</div>
                        </div>
                      ) : (
                        <button onClick={()=>onMint(stone)} className="w-full py-5 rounded-xl border-2 border-dashed border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all flex flex-col items-center gap-1.5 focus:scale-95 tactile-btn">
                          <span className="font-medium text-[14px] uppercase tracking-[0.15em] flex items-center gap-2 font-display">
                             <span className="text-xs">◆</span> Mint NFT provenance
                          </span>
                          <span className="text-[10px] font-mono opacity-60 font-medium tracking-tight">Anchored Est: {formatCur(stone.nft_value)}</span>
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </>
  );
};
