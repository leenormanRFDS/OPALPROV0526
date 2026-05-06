const MintModal = ({ stone, nftVal, onConfirm, onCancel }) => {
  const [step, setStep] = useState(1);
  
  const handleConfirm = () => {
    setStep(2);
    setTimeout(() => setStep(3), 1800);
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(7,10,18,0.9)] backdrop-blur-md animate-[opn-fadein_0.2s_ease-out]">
      <div className="w-[420px] bg-[var(--surf)] border border-[var(--bdr-hi)] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative">
        {step === 1 && (
          <div className="animate-[opn-fadein_0.2s_ease-out]">
            <img src={stone.genesis ? stone.nft_img : stone.img} className="w-full h-[180px] object-cover" />
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-xl tracking-tight font-display">{stone.name}</h3>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--surf3)] border border-[var(--bdr)] uppercase tracking-wider" style={{color: GRADE_COLORS[stone.mk_grade]}}>
                  M{stone.mk_grade}
                </div>
              </div>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between"><span className="text-[var(--muted)]">Rough Value</span><span className="font-mono">{formatCur(stone.mk_rough_total)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Cutter Offer</span><span className="font-mono">{formatCur(stone.mr_offer)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Premium %</span><span className="font-mono text-[var(--teal)]">+{((nftVal / (stone.mr_offer || stone.mk_rough_total) - 1) * 100).toFixed(0)}%</span></div>
                <div className="flex justify-between pt-4 border-t border-[var(--bdr)] items-end">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest font-display">Mint Value Est.</span>
                  <span className="font-light text-[var(--gold)] text-3xl font-display leading-none tracking-tighter">{formatCur(nftVal)}</span>
                </div>
              </div>
              
              {stone.genesis && (
                <div className="mb-6 p-3 rounded bg-[var(--surf2)] border border-[var(--gold-dim)] text-xs text-[var(--gold)]">
                  Both graders confirm M9. NFT value anchored to consensus.
                </div>
              )}
              
              <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3 text-sm font-bold text-[var(--muted)] hover:text-white transition-colors rounded-lg bg-[var(--surf2)]">Cancel</button>
                <button onClick={handleConfirm} className="flex-1 py-3 text-sm font-bold text-[var(--teal)] bg-[var(--teal-dim)] border border-[var(--teal)] rounded-lg hover:bg-opacity-30 transition-all flex items-center justify-center gap-2">
                  <span className="text-xs">◆</span> Confirm Mint
                </button>
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="p-12 flex flex-col items-center justify-center h-[400px] animate-[opn-fadein_0.2s_ease-out]">
            <div className="w-12 h-12 rounded-full border-4 border-[var(--surf3)] border-t-[var(--teal)] animate-[opn-spin_1s_linear_infinite] mb-6"></div>
            <h3 className="text-base font-bold text-[var(--text)] mb-1">Minting on Polygon...</h3>
            <p className="text-xs text-[var(--muted)] mb-8">Creating provenance certificate</p>
            <div className="w-full h-1 bg-[var(--surf3)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--teal)] animate-[opn-mint-progress_1.8s_linear_forwards]"></div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="p-12 flex flex-col items-center justify-center text-center animate-[opn-fadein_0.2s_ease-out]">
            <div className="text-4xl text-[var(--teal)] mb-4 font-bold">◆</div>
            <h3 className="text-2xl font-light text-[var(--teal)] mb-1 font-display tracking-tight">NFT Minted!</h3>
            <p className="text-[13px] font-medium text-[var(--muted)] mb-8 font-display uppercase tracking-widest">{stone.name}</p>
            <div className="text-4xl font-light text-[var(--gold)] mb-10 font-display leading-none tracking-tighter">{formatCur(nftVal)}</div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--dim)] mb-8 leading-relaxed font-semibold">Certificate Recorded ◉ Polygon Network<br/>AOSA Verified Provenance</p>
            <button onClick={() => { onConfirm(); }} className="w-full py-4 text-sm font-bold text-white bg-[var(--surf3)] hover:bg-[var(--bdr-hi)] transition-colors rounded-xl font-display uppercase tracking-widest">
              View Collection &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
