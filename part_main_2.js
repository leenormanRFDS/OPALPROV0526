const PortfolioView = ({ data, user, onSelect }) => {
  const isK = user.id === 'mattk';
  const totK = data.reduce((sum, s) => sum + s.mk_rough_total, 0);
  const totR = data.reduce((sum, s) => sum + (s.mr_offer || 0), 0);
  const avgG = data.reduce((sum, s) => sum + (isK ? s.mk_grade : s.mr_grade), 0) / data.length;
  const consen = data.filter(s => Math.abs(s.mk_grade - s.mr_grade) <= 1).length;
  
  const metricColor = isK ? 'var(--gold)' : 'var(--teal)';

  return (
    <div className="flex flex-col gap-6 animate-[opn-fadein_0.3s_cubic-bezier(0.4, 0, 0.2, 1)]">
      {data.filter(s => s.nft).length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--teal)] opacity-80 font-display">Genesis & Minted NFT Assets</div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {data.filter(s => s.nft).map(s => (
              <div key={s.id} onClick={() => onSelect(s.id)} className="bg-[var(--surf)] border-2 border-[var(--teal-dim)] rounded-xl p-3 cursor-pointer hover:scale-[1.03] transition-all shadow-[0_0_15px_var(--teal-dim)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--teal-dim)] to-transparent opacity-20"></div>
                <div className="relative z-10">
                  <div className="text-[8px] font-bold uppercase text-[var(--teal)] mb-1 tracking-tighter opacity-70">Asset No. {s.id}</div>
                  <div className="text-[11px] font-bold text-white truncate mb-2 font-display">{s.name}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[7px] uppercase font-bold text-[var(--muted)] tracking-widest leading-none mb-0.5">Mint Value</div>
                      <div className="text-[14px] font-light text-[var(--gold)] font-display leading-none tracking-tight">{formatCur(s.nft_value || s.mr_offer*1.8)}</div>
                    </div>
                    <div className="text-[10px] font-bold text-[var(--teal)] flex items-center gap-0.5">
                      <span className="text-[8px] opacity-70">▲</span>
                      {Math.round(((s.nft_value || s.mr_offer*1.8) / (s.mk_rough_total) - 1)*100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KpiStat label={isK ? "TOTAL MINER BOOK" : "MINER ROUGH TOTAL"} value={formatCur(totK)} color="var(--gold)" />
        <KpiStat label={isK ? "TOTAL CUTTER OFFERS" : "CUTTER OFFER BOOK"} value={formatCur(totR)} color="var(--teal)" />
        <KpiStat label="AVERAGE GRADE" value={`M${avgG.toFixed(1)}`} color={GRADE_COLORS[Math.round(avgG)]} />
        <KpiStat label="MAX DIVERGENCE" value="376×" sub="Stone 5 · Treated Concrete" color="var(--orange)" />
        <KpiStat label="CONSENSUS STONES" value={consen} sub="Grades within ±1" color="var(--blue)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:h-[300px]">
        <div className="glass-card rounded-xl p-6 flex flex-col">
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--muted)] mb-6 flex items-center justify-between">
            <span>Market Signal vs Quality</span>
            <span className="text-[var(--dim)] font-mono">OPN-V3.1 &middot; LIVE</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top:0, right:10, bottom:0, left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" dataKey="mS" domain={[0,105]} tick={{fill:'var(--muted)', fontSize:10, fontWeight: 500}} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="qS" domain={[0,105]} tick={{fill:'var(--muted)', fontSize:10, fontWeight: 500}} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="sZ" range={[40, 240]} />
                <Tooltip cursor={{strokeDasharray:'4 4', stroke: 'rgba(255,255,255,0.1)'}} content={({active,payload})=>{
                  if(!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="glass p-3 rounded-lg shadow-2xl border border-[var(--bdr-hi)] min-w-[140px] animate-[opn-fadein_0.1s_ease-out]">
                      <div className="font-bold text-[13px] mb-1">{d.name}</div>
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-[var(--muted)]">Grade:</span>
                        <span style={{color: GRADE_COLORS[d.g]}}>M{d.g}</span>
                      </div>
                    </div>
                  );
                }} />
                <Scatter data={data.map(s => ({
                  ...s, mS: Number((s.mr_ppg_implied_safe/474.11)*100).toFixed(1),
                  qS: Number(((B_SCORE[s.brightness]+N_SCORE[s.bodyTone])/2).toFixed(1)),
                  sZ: s.wg, g: isK ? s.mk_grade : s.mr_grade
                }))} animationDuration={1000} onClick={(e) => e && e.id && onSelect(e.id)}>
                  {data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={GRADE_COLORS[isK ? entry.mk_grade : entry.mr_grade]} className="cursor-pointer hover:opacity-80 transition-opacity" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex flex-col">
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--muted)] mb-6 flex items-center justify-between">
            <span>Grade Distribution Matrix</span>
            <span className="text-[var(--dim)] font-mono">AOSA STATS</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[1,2,3,4,5,6,7,8,9].map(g => ({
                g: `M${g}`, val: data.filter(s => (isK ? s.mk_grade : s.mr_grade) === g).length, rawNum: g
              }))} margin={{ top:0, right:10, bottom:0, left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="g" tick={{fill:'var(--muted)', fontSize:10, fontWeight: 500}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:'var(--muted)', fontSize:10, fontWeight: 500}} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{fill:'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor:'rgba(15,18,24,0.9)', borderRadius: '8px', border:'1px solid var(--bdr-hi)', fontSize: '11px'}} itemStyle={{color:'var(--text)'}} />
                <Bar dataKey="val" radius={[4,4,0,0]} animationDuration={1200}>
                  {[1,2,3,4,5,6,7,8,9].map((g, i) => <Cell key={i} fill={GRADE_COLORS[g]} className="hover:opacity-80 transition-opacity" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="data-table-container shadow-2xl">
        <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--bdr)' }} className="font-display">
          <span>Asset Inventory</span>
          <span className="font-mono text-[9px] opacity-60">{data.length} RECORDS</span>
        </div>
        <div className="overflow-x-auto bg-[var(--bg)]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="data-table-header-row">
                <th style={{ width: '320px' }}>Asset & Specification</th>
                <th>Grade</th>
                <th className="font-mono">Mkt Score</th>
                <th className="font-mono">Qly Score</th>
                <th className="font-mono">Stability</th>
                <th style={{ textAlign: 'right', color: 'var(--gold)' }}>Miner Book</th>
                <th style={{ textAlign: 'right', color: 'var(--teal)' }}>Cutter Offer</th>
                <th style={{ textAlign: 'right' }}>Divergence</th>
              </tr>
            </thead>
            <tbody>
              {data.map(s => {
                const isUnderValued = s.mr_offer > s.mk_rough_total;
                const mS = (s.mr_ppg_implied_safe/474.11*100).toFixed(1);
                const qS = ((B_SCORE[s.brightness]+N_SCORE[s.bodyTone])/2).toFixed(1);
                const gColor = GRADE_COLORS[isK ? s.mk_grade : s.mr_grade];
                return (
                  <tr key={s.id} onClick={()=>onSelect(s.id)} className="data-table-row group">
                    <td className="flex items-center">
                      <div className="relative">
                        <img src={s.img} className="data-table-thumbnail" />
                        {s.nft && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--teal)] rounded-full border border-[var(--bg)] shadow-[0_0_6px_var(--teal)]"></div>}
                      </div>
                      <div>
                        <div className="font-semibold text-[13px] tracking-tight group-hover:text-[var(--gold)] transition-colors">{s.name}</div>
                        <div className="text-[10px] text-[var(--dim)] font-medium uppercase tracking-wide">{s.ct}ct &middot; {s.pattern} Play of Colour</div>
                      </div>
                    </td>
                    <td>
                      <Badge label={`M${isK ? s.mk_grade : s.mr_grade}`} color={gColor} />
                    </td>
                    <td className="font-mono text-[11px] font-medium text-[var(--muted)]">{mS}</td>
                    <td className="font-mono text-[11px] font-medium text-[var(--muted)]">{qS}</td>
                    <td className="font-mono text-[11px] font-medium">
                      <span className={s.stabilityRisk === 'High' ? 'text-[var(--red)]' : s.stabilityRisk === 'Medium' ? 'text-[var(--orange)]' : 'text-[var(--teal)]'}>
                        {STB_INDEX_MAP[s.treatmentQuality]}
                      </span>
                    </td>
                    <td className="font-mono text-[11px] font-bold text-right text-[var(--gold)]">{formatCur(s.mk_rough_total)}</td>
                    <td className="font-mono text-[11px] font-bold text-right text-[var(--teal)]">{formatCur(s.mr_offer)}</td>
                    <td className="font-mono text-[11px] text-right">
                      {isUnderValued ? (
                        <div className="text-[var(--blue)] font-bold flex items-center justify-end gap-1.5"><span className="text-[9px] translate-y-[0.5px] tracking-tighter">PREMIUM</span>&Delta;</div>
                      ) : (
                        <div className="font-bold" style={{color: s.div_pct_val >= 100 ? 'var(--red)' : s.div_pct_val >= 10 ? 'var(--orange)' : 'var(--teal)'}}>
                          {s.divergence_pct}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
