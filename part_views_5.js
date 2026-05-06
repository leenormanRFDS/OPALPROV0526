const MarketplaceView = ({ data, user, onSelect }) => {
  const [viewMode, setViewMode] = React.useState('grid');
  const [gradeFilter, setGradeFilter] = React.useState('all');
  const [buyModal, setBuyModal] = React.useState(null);
  const [offerModal, setOfferModal] = React.useState(null);
  const [purchased, setPurchased] = React.useState([]);

  const getListingPrice = (s) => {
    const base = s.mr_offer || s.mk_rough_total;
    if (s.mk_grade >= 9) return base * 1.5;
    if (s.mk_grade >= 8) return base * 1.8;
    if (s.mk_grade >= 7) return base * 2.0;
    if (s.mk_grade >= 6) return base * 2.2;
    if (s.mk_grade >= 5) return base * 2.5;
    return base * 3.0; // fallback but shouldn't hit due to filter
  };

  const eligibleStones = data.filter(s => s.mk_grade >= 5).map(s => ({
    ...s,
    listPrice: s.id === 13 ? 4500 : getListingPrice(s),
    isPurchased: purchased.includes(s.id)
  }));

  const filtered = eligibleStones.filter(s => {
    if (gradeFilter === 'm7+') return s.mk_grade >= 7;
    if (gradeFilter === 'm9') return s.mk_grade >= 9;
    return true;
  });

  const totalCap = eligibleStones.reduce((sum, s) => sum + s.listPrice, 0);
  const floorPrice = Math.min(...eligibleStones.map(s => s.listPrice));
  const featured = eligibleStones.find(s => s.id === 13);

  const handleBuy = (stone) => {
    setBuyModal(stone);
  };

  const confirmBuy = () => {
    if(!buyModal) return;
    setPurchased([...purchased, buyModal.id]);
    setBuyModal(null);
  };

  const handleOffer = (stone) => {
    setOfferModal(stone);
  };

  const confirmOffer = () => {
    setOfferModal(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-[opn-fadein_0.18s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-light text-[var(--text)] mb-1 font-display tracking-tight">OPN <span className="opacity-40 font-display">Marketplace</span></h2>
          <p className="text-[13px] text-[var(--muted)] font-medium uppercase tracking-[0.2em] mt-1">Certified Andamooka Matrix &middot; Verified Provenance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-[var(--surf2)] rounded border border-[var(--bdr)] overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-4 py-1.5 text-[11px] font-bold transition-colors ${viewMode === 'grid' ? 'bg-[var(--surf3)] text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surf3)]'}`}>Grid View</button>
            <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 text-[11px] font-bold transition-colors ${viewMode === 'list' ? 'bg-[var(--surf3)] text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surf3)]'}`}>List View</button>
          </div>
          <div className="flex bg-[var(--surf2)] rounded border border-[var(--bdr)] overflow-hidden">
            <button onClick={() => setGradeFilter('all')} className={`px-3 py-1.5 text-[11px] font-bold transition-colors ${gradeFilter === 'all' ? 'bg-[var(--surf3)] text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surf3)]'}`}>All Grades</button>
            <button onClick={() => setGradeFilter('m7+')} className={`px-3 py-1.5 text-[11px] font-bold transition-colors ${gradeFilter === 'm7+' ? 'bg-[var(--surf3)] text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surf3)]'}`}>M7+</button>
            <button onClick={() => setGradeFilter('m9')} className={`px-3 py-1.5 text-[11px] font-bold transition-colors ${gradeFilter === 'm9' ? 'bg-[var(--surf3)] text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surf3)]'}`}>M9</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '20px 24px 0' }}>
        <KpiStat label="LISTED STONES" value={eligibleStones.length} color="var(--text)" />
        <KpiStat label="TOTAL MARKET CAP" value={formatCur(totalCap)} color="var(--gold)" />
        <KpiStat label="FLOOR PRICE" value={formatCur(floorPrice)} color="var(--teal)" />
        <KpiStat label="VOLUME (24H)" value="$0" sub="Market opens soon" color="var(--muted)" />
      </div>

      {featured && (
        <div className="bg-[var(--surf2)] border border-[var(--gold)] rounded-xl overflow-hidden shadow-[0_0_30px_var(--gold-dim)] flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-[300px] flex">
            <div className="w-1/2 h-full"><img src={featured.img} className="w-full h-full object-cover" /></div>
            <div className="w-1/2 h-full"><img src={featured.nft ? featured.nft_img : featured.img} className="w-full h-full object-cover" /></div>
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 rounded-sm bg-[var(--gold-dim)] text-[var(--gold)] text-[10px] uppercase font-bold tracking-[0.2em] border border-[var(--gold)] shadow-[0_0_10px_var(--gold-dim)] font-display">◆ Genesis Listing</span>
              <span className="px-2 py-1 rounded-sm bg-[var(--teal-dim)] text-[var(--teal)] text-[10px] uppercase font-bold tracking-[0.2em] border border-[var(--teal)] font-display">M9 &middot; Harlequin Grade</span>
            </div>
            <h3 className="text-4xl font-light text-[var(--text)] mb-6 font-display tracking-tight leading-none">{featured.name}</h3>
            
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-[var(--muted)] mb-2 font-bold font-display">Listing Price</div>
                <div className="text-5xl text-[var(--gold)] font-light leading-none tracking-tighter font-display">{formatCur(featured.listPrice)} <span className="text-xl text-[var(--muted)] font-display uppercase tracking-widest font-bold ml-1">AUD</span></div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] text-[var(--teal)] font-bold mb-1">◆ NFT Certificate Included</span>
                <span className="text-[11px] text-[var(--muted)]">Both graders confirm M9 &middot; Polygon verified</span>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button disabled={featured.isPurchased} onClick={() => handleBuy(featured)} className="flex-1 bg-[var(--gold)] hover:brightness-110 text-[#000] font-bold py-3 rounded-lg text-[14px] transition-all disabled:opacity-50 min-w-0 truncate">{featured.isPurchased ? 'Owned' : `Buy Now — ${formatCur(featured.listPrice)}`}</button>
              <button disabled={featured.isPurchased} onClick={() => handleOffer(featured)} className="flex-1 border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold-dim)] font-bold py-3 rounded-lg text-[14px] transition-all disabled:opacity-50">Make Offer</button>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted)] overflow-x-auto whitespace-nowrap">
              <span>Extracted</span><span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]"></span>
              <span>Miner Cert</span><span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]"></span>
              <span>Cutter Verified</span><span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]"></span>
              <span>NFT Minted</span>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.filter(s => s.id !== 13).map(s => (
             <div key={s.id} className="bg-[var(--surf)] border border-[var(--bdr)] rounded-xl overflow-hidden hover:border-[var(--bdr-hi)] transition-colors flex flex-col">
               <div className="relative h-[180px] bg-[#000] cursor-pointer" onClick={() => onSelect(s.id)}>
                 <img src={s.img} className="w-full h-full object-cover" />
                 <div className="absolute top-2 right-2 border border-[#fff3] px-2 py-0.5 rounded text-[11px] font-bold backdrop-blur" style={{backgroundColor: GRADE_COLORS[s.mk_grade]+'dd', color: '#fff'}}>{s.mk_grade >= 7 ? 'M'+s.mk_grade : `M${s.mk_grade}`}</div>
                 {s.nft && <div className="absolute top-2 left-2 bg-[var(--teal)] text-[#000] px-2 py-0.5 rounded text-[10px] font-bold border border-black">&diams; NFT</div>}
               </div>
               <div className="p-4 flex flex-col flex-1 cursor-pointer" onClick={() => onSelect(s.id)}>
                 <div className="font-bold text-[13px] text-white leading-tight mb-1 truncate">{s.name}</div>
                 <div className="text-[11px] text-[var(--muted)] mb-3">{s.wg}g &middot; {s.ct}ct &middot; M{s.mk_grade} {s.pattern}</div>
                 
                 <div className="mt-auto mb-4">
                   <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)] mb-0.5">Listing Price</div>
                   <div className="text-[20px] font-mono font-bold text-[var(--gold)]">{formatCur(s.listPrice)}</div>
                 </div>

                 <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[var(--muted)] mb-4 pt-3 border-t border-[var(--bdr)]">
                   <div>MK: {formatCur(s.mk_rough_total)}</div>
                   <div className="text-right">MR: {s.mr_offer ? formatCur(s.mr_offer) : 'N/A'}</div>
                 </div>
               </div>
               <div className="px-4 pb-4 flex gap-2">
                 <button disabled={s.isPurchased} onClick={() => handleBuy(s)} className="flex-1 bg-[var(--gold)] hover:brightness-110 text-[#000] font-bold py-2 rounded text-[12px] transition-all disabled:opacity-50">Buy</button>
                 <button disabled={s.isPurchased} onClick={() => handleOffer(s)} className="flex-1 border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold-dim)] font-bold py-2 rounded text-[12px] transition-all disabled:opacity-50">Offer</button>
               </div>
             </div>
          ))}
        </div>
      ) : (
        <div className="data-table-container">
          <div className="overflow-x-auto bg-[#131720]">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                 <tr className="data-table-header-row">
                   <th style={{ width: '280px' }}>Asset</th>
                   <th style={{ textAlign: 'center' }}>Grade</th>
                   <th style={{ textAlign: 'right' }}>M.K (Rough)</th>
                   <th style={{ textAlign: 'right' }}>M.R (Offer)</th>
                   <th style={{ textAlign: 'right', color: 'var(--gold)' }}>Listing Price</th>
                   <th style={{ textAlign: 'right' }}>Action</th>
                 </tr>
              </thead>
              <tbody>
                 {filtered.map(s => (
                   <tr key={s.id} className="data-table-row">
                     <td style={{ display: 'flex', alignItems: 'center' }} onClick={() => onSelect(s.id)}>
                       <img src={s.img} className="data-table-thumbnail" />
                       <div>
                         <div style={{ fontWeight: 600 }}>{s.name}</div>
                         <div style={{ fontSize: '10px', color: '#8B949E' }}>{s.ct}ct &middot; {s.pattern}</div>
                       </div>
                     </td>
                     <td style={{ textAlign: 'center' }} onClick={() => onSelect(s.id)}><Badge label={`M${s.mk_grade}`} color={GRADE_COLORS[s.mk_grade]} /></td>
                     <td style={{ textAlign: 'right', fontFamily: 'monospace' }} onClick={() => onSelect(s.id)}>{formatCur(s.mk_rough_total)}</td>
                     <td style={{ textAlign: 'right', fontFamily: 'monospace' }} onClick={() => onSelect(s.id)}>{s.mr_offer ? formatCur(s.mr_offer) : <span className="text-[var(--dim)]">N/A</span>}</td>
                     <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--gold)' }} onClick={() => onSelect(s.id)}>{formatCur(s.listPrice)}</td>
                     <td style={{ textAlign: 'right' }}>
                       {s.isPurchased ? (
                         <span className="text-[10px] uppercase font-bold text-[var(--teal)]">Owned</span>
                       ) : (
                         <div className="flex justify-end gap-2">
                           <button onClick={(e) => { e.stopPropagation(); handleBuy(s); }} className="bg-[var(--gold)] text-black px-3 py-1 rounded text-[11px] font-bold transition-all hover:brightness-110">Buy</button>
                           <button onClick={(e) => { e.stopPropagation(); handleOffer(s); }} className="border border-[var(--gold)] text-[var(--gold)] px-3 py-1 rounded text-[11px] font-bold transition-all hover:bg-[var(--gold-dim)]">Offer</button>
                         </div>
                       )}
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {buyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--surf)] border border-[var(--bdr-hi)] rounded-xl w-full max-w-sm p-8 shadow-2xl flex flex-col">
            <h3 className="text-2xl font-light text-white mb-6 font-display tracking-tight">Confirm Purchase</h3>
            <div className="flex gap-4 mb-8 bg-black/20 p-3 rounded-lg border border-[var(--bdr)]">
              <img src={buyModal.img} className="w-16 h-16 rounded object-cover shadow-lg" />
              <div>
                <div className="font-medium text-[15px] leading-tight mb-2 font-display tracking-tight">{buyModal.name}</div>
                <Badge label={`M${buyModal.mk_grade}`} color={GRADE_COLORS[buyModal.mk_grade]} />
              </div>
            </div>
            
            <div className="bg-[var(--surf2)] rounded-lg p-4 font-mono text-[12px] mb-6">
              <div className="flex justify-between mb-2 text-[var(--muted)]"><span>Stone Price</span><span>{formatCur(buyModal.listPrice)}</span></div>
              <div className="flex justify-between mb-4 text-[var(--muted)]"><span>Platform Fee (2.5%)</span><span>{formatCur(buyModal.listPrice * 0.025)}</span></div>
              <div className="flex justify-between font-bold text-[16px] text-[var(--gold)] pt-4 border-t border-[var(--bdr)]"><span>Total</span><span>{formatCur(buyModal.listPrice * 1.025)}</span></div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setBuyModal(null)} className="flex-1 py-2 rounded border border-[var(--bdr)] hover:bg-[var(--surf2)] font-bold text-[13px] text-[var(--muted)] transition-colors">Cancel</button>
              <button onClick={confirmBuy} className="flex-1 py-2 rounded bg-[var(--gold)] hover:brightness-110 text-[#000] font-bold text-[13px] transition-all">Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}

      {offerModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--surf)] border border-[var(--bdr-hi)] rounded-xl w-full max-w-sm p-8 shadow-2xl flex flex-col">
            <h3 className="text-2xl font-light text-white mb-6 font-display tracking-tight">Make an <span className="opacity-40">Offer</span></h3>
            <div className="flex gap-4 mb-6 bg-black/20 p-3 rounded-lg border border-[var(--bdr)]">
              <img src={offerModal.img} className="w-16 h-16 rounded object-cover shadow-lg" />
              <div>
                <div className="font-medium text-[15px] leading-tight mb-1 font-display tracking-tight">{offerModal.name}</div>
                <div className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-widest mt-1">List price: {formatCur(offerModal.listPrice)}</div>
              </div>
            </div>
            
            <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2 mt-4 block">Your Offer (AUD)</label>
            <input type="number" defaultValue={(offerModal.mr_offer || (offerModal.mk_rough_total * 1.2)).toFixed(2)} className="w-full bg-[var(--bg)] border border-[var(--bdr)] p-3 rounded font-mono text-lg text-[var(--gold)] outline-none focus:border-[var(--gold)] mb-6" />

             <div className="flex gap-3">
              <button onClick={() => setOfferModal(null)} className="flex-1 py-2 rounded border border-[var(--bdr)] hover:bg-[var(--surf2)] font-bold text-[13px] text-[var(--muted)] transition-colors">Cancel</button>
              <button onClick={confirmOffer} className="flex-1 py-2 rounded bg-[var(--teal)] hover:brightness-110 text-[#000] font-bold text-[13px] transition-all">Submit Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
