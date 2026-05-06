const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('opn-v3-stones');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only keep if it matches our seed count and doesn't have extra IDs
        if (parsed.length === 12 && !parsed.some(s => s.id > 12)) return parsed;
      }
    } catch(e) {}
    return DEFAULT_STONES;
  });

  const [custodianData, setCustodianData] = useState(() => {
    try {
      const saved = localStorage.getItem('opn-v3-custodian');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return CUSTODIAN_ASSETS;
  });
  const [view, setView] = useState('Portfolio');
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('opn-v3-profile');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      xp: 0,
      level: 1,
      energy: 10,
      maxEnergy: 10,
      collections: {
        genesis: 1,
        andamookaOrigins: 0
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('opn-v3-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const addXp = (amount) => {
    setUserProfile(prev => {
      const newXp = prev.xp + amount;
      const nextLevelXp = prev.level * 1000;
      if (newXp >= nextLevelXp) {
        return {
          ...prev,
          xp: newXp - nextLevelXp,
          level: prev.level + 1,
          energy: prev.maxEnergy // Refill energy on level up
        };
      }
      return { ...prev, xp: newXp };
    });
  };

  const useEnergy = (amount = 1) => {
    if (userProfile.energy < amount) return false;
    setUserProfile(prev => ({ ...prev, energy: prev.energy - amount }));
    return true;
  };
  const [selectedId, setSelectedId] = useState(null);
  const [mintingStone, setMintingStone] = useState(null);
  const [verifyAIOpen, setVerifyAIOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check for Env Keys (for the "check" the user requested)
  const hasGeminiEnv = !!(typeof process !== 'undefined' && process.env && process.env["OPN_GEMINI_KEY"]);
  const hasAnthropicEnv = !!(typeof process !== 'undefined' && process.env && process.env.OPN_ANTHROPIC_KEY);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gemKey, setGemKey] = useState(localStorage.getItem('OPN_GEMINI_KEY') || '');
  const [antKey, setAntKey] = useState(localStorage.getItem('OPN_ANTHROPIC_KEY') || '');
  
  // Link env keys if present and local is empty
  useEffect(() => {
    if (hasGeminiEnv && !gemKey) setGemKey('PROVIDED_BY_SYSTEM');
    if (hasAnthropicEnv && !antKey) setAntKey('PROVIDED_BY_SYSTEM');
  }, [hasGeminiEnv, hasAnthropicEnv]);

  useEffect(() => {
    localStorage.setItem('opn-v3-stones', JSON.stringify(data));
    setSaving(true);
    const t = setTimeout(() => setSaving(false), 2000);
    return () => clearTimeout(t);
  }, [data]);

  useEffect(() => {
    localStorage.setItem('opn-v3-custodian', JSON.stringify(custodianData));
  }, [custodianData]);

  useEffect(() => {
    const handleNav = () => setView('NFTs');
    window.addEventListener('nav-nft', handleNav);
    return () => window.removeEventListener('nav-nft', handleNav);
  }, []);

  const handleMint = (stone) => {
    const fresh = data.map(s => s.id === stone.id ? { ...s, nft: true, genesis: s.id === 13 ? true : s.genesis, nft_img: s.id === 13 ? s.nft_img : s.img } : s);
    setData(fresh);
    setMintingStone(null);
    if(view !== 'NFTs') {
      setView('NFTs');
      setSelectedId(null);
    }
  };

  const selectedStone = data.find(s => s.id === selectedId);

  if (!user) return <AuthGate setLogin={setUser} />;

  return (
    <>
      {mintingStone && <MintModal stone={mintingStone} nftVal={mintingStone.nft_value} onCancel={() => setMintingStone(null)} onConfirm={() => handleMint(mintingStone)} />}
      
      <aside style={{ width: '240px', minWidth: '240px', flexShrink: 0, height: '100vh', overflowY: 'auto', background: 'var(--surf)', borderRight: '1px solid var(--bdr-hi)', display: 'flex', flexDirection: 'column' }} className="hidden md:flex z-20 relative">
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--bdr)' }}>
          <div style={{ height: '28px' }}><AOSA_Logo_Scaled /></div>
        </div>
        
        <div className="glass-card m-4 p-5 rounded-2xl border border-[var(--bdr-hi)] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-dim)] to-transparent opacity-50"></div>
          <div className="relative">
            <div className="flex justify-between items-end mb-2">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--gold)] font-display">Level {userProfile.level}</div>
              <div className="text-[9px] font-mono text-[var(--dim)]">{userProfile.xp} / {userProfile.level * 1000} XP</div>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-4 border border-white/5">
              <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--teal)] transition-all duration-700" style={{ width: `${(userProfile.xp / (userProfile.level * 1000)) * 100}%` }}></div>
            </div>
            <div className="flex justify-between items-center mb-4">
               <div className="flex gap-1">
                 {[...Array(userProfile.maxEnergy)].map((_, i) => (
                   <div key={i} className={`w-1.5 h-3 rounded-sm ${i < userProfile.energy ? 'bg-[var(--teal)] shadow-[0_0_5px_var(--teal)]' : 'bg-white/5'}`}></div>
                 ))}
               </div>
               <div className="text-[9px] font-bold text-[var(--teal)] uppercase tracking-widest">{userProfile.energy} Energy</div>
            </div>
            <div className="text-[8px] font-bold tracking-[0.2em] uppercase text-[var(--muted)] mb-2">{user.id === 'mattk' ? 'MINER BOOK' : 'CUTTER OFFER BOOK'}</div>
            <div className="text-[24px] font-light font-display text-[var(--text)] tracking-tight leading-none mb-1 group-hover:text-[var(--gold)] transition-colors">
              {formatCur(data.reduce((sum, s) => sum + (user.id === 'mattk' ? s.mk_rough_total : (s.mr_offer || 0)), 0))}
            </div>
            <div className="text-[9px] text-[var(--teal)] font-bold flex items-center gap-1.5 mt-2">
              <span className="w-1 h-1 rounded-full bg-[var(--teal)] animate-pulse"></span>
              +14% VS MARKET
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 4px' }} className="overflow-y-auto custom-scrollbar">
          {[
            { label: 'Portfolio Analytics', icon: '◈', route: 'Portfolio', group: null },
            { label: 'Asset Directory', icon: '⊟', route: 'Directory', group: null },
            { label: 'Marketplace', icon: '⊛', route: 'Marketplace', group: null },
            { label: 'Cobra Cuff', icon: <img src="https://res.cloudinary.com/dkgqxred2/image/upload/v1777209434/COBRA-ORNGE-LOGO_fkgc2s.png" style={{ height: '24px', objectFit: 'contain' }} alt="Cobra Cuff"/>, route: 'Custodian', group: 'COLLECTIONS' },
            { label: 'Divergence Desk', icon: '⌖', route: 'Divergence', group: 'MODELS' },
            { label: 'Miner Projection', icon: '◐', route: 'Miner', group: 'MODELS' },
            { label: 'Cutter Yield', icon: '◑', route: 'Cutter', group: 'MODELS' },
            { label: 'NFT Collection', icon: '◆', route: 'NFTs', group: 'SYSTEM' },
            { label: 'The Mint', icon: '◉', route: 'Mint', group: 'SYSTEM' },
            { label: 'Benchmark Data', icon: '◫', route: 'Benchmark', group: 'SYSTEM' },
          ].map((item, i, arr) => {
            const showHeader = item.group && (i === 0 || arr[i - 1].group !== item.group);
            const active = view === item.route;
            const itemColor = active ? user.color : 'var(--muted)';
            return (
              <React.Fragment key={item.route}>
                {showHeader && <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--dim)] px-5 pt-8 pb-2 font-display">{item.group}</div>}
                <div onClick={() => setView(item.route)} 
                  style={{ 
                    height: '42px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '0 16px', 
                    borderRadius: '10px', 
                    margin: '2px 12px', 
                    fontSize: '13px', 
                    cursor: 'pointer', 
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    background: active ? `${user.color}15` : 'transparent', 
                    color: active ? 'var(--text)' : 'var(--muted)',
                    border: active ? `1px solid ${user.color}30` : '1px solid transparent',
                    fontWeight: active ? 600 : 400
                  }} 
                  className="hover:bg-white/[0.04] hover:text-white group"
                >
                  <span className="w-5 text-center opacity-70 text-lg flex justify-center group-hover:scale-110 transition-transform" style={active ? {color: user.color} : {}}>{item.icon}</span> 
                  <span className="tracking-tight">{item.label}</span>
                  {active && <div className="ml-auto w-1 h-1 rounded-full" style={{backgroundColor: user.color}}></div>}
                </div>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[var(--bdr-hi)] space-y-6">
          <div className="bg-white/[0.03] rounded-2xl p-4 border border-[var(--bdr)] transition-all hover:bg-white/[0.05]" onClick={() => setSettingsOpen(!settingsOpen)}>
            <div className="flex justify-between items-center text-[10px] font-bold text-[var(--dim)] tracking-widest uppercase hover:text-[var(--muted)] cursor-pointer">
              <span>Expert Config</span>
              <span className="text-[8px] transition-transform" style={{transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}>&darr;</span>
            </div>
            {settingsOpen && (
              <div className="flex flex-col gap-4 mt-5" onClick={e => e.stopPropagation()}>
                <div className="space-y-1.5">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--dim)] font-bold flex justify-between">
                    <span>Anthropic</span>
                    {antKey ? <span className="text-[var(--teal)] font-bold uppercase">Active</span> : <span>Offline</span>}
                  </div>
                  <input type="password" value={antKey} onChange={e => {setAntKey(e.target.value); localStorage.setItem('OPN_ANTHROPIC_KEY', e.target.value)}} className="w-full bg-black/40 border border-[var(--bdr)] rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold-dim)] font-mono transition-all" placeholder="sk-ant-..." />
                </div>
                <div className="space-y-1.5">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--dim)] font-bold flex justify-between">
                    <span>Gemini AI</span>
                    {gemKey ? <span className="text-[var(--teal)] font-bold uppercase">Active</span> : <span>Offline</span>}
                  </div>
                  <input type="password" value={gemKey} onChange={e => {setGemKey(e.target.value); localStorage.setItem('OPN_GEMINI_KEY', e.target.value)}} className="w-full bg-black/40 border border-[var(--bdr)] rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold-dim)] font-mono transition-all" placeholder="AIza..." />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 group cursor-pointer" onClick={()=>setUser(null)}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium font-display text-[12px] bg-opacity-20 shadow-lg border transition-transform group-hover:scale-105" style={{ color: user.color, background: `${user.color}11`, borderColor: `${user.color}33` }}>{user.initials}</div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-[var(--text)] tracking-tight">{user.name.split(' ')[0]}</div>
              <div className="text-[10px] text-[var(--dim)] font-bold uppercase tracking-widest group-hover:text-[var(--muted)] transition-colors">Sign Out &rarr;</div>
            </div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, height: '100vh', overflowY: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }} className="relative z-10 shrink shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        <header style={{ height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'var(--bg)', borderBottom: '1px solid var(--bdr-hi)', position: 'sticky', top: 0, zIndex: 20 }} className="glass-card">
          <div className="text-[13px] font-medium font-display text-[var(--text)] uppercase tracking-[0.2em] opacity-80 shrink-0">{view === 'NFTs' ? 'NFT Collection' : view === 'Mint' ? 'The Mint' : view}</div>
          
          <div className="hidden lg:flex gap-1.5 bg-black/20 p-1 rounded-full border border-[var(--bdr)] mx-8">
            {[
              { label: 'Portfolio', route: 'Portfolio' },
              { label: 'Directory', route: 'Directory' },
              { label: 'Marketplace', route: 'Marketplace' },
              { label: 'Custodian', route: 'Custodian' },
              { label: 'Divergence', route: 'Divergence' },
              { label: 'NFTs', route: 'NFTs' },
              { label: 'Mint', route: 'Mint' }
            ].map(t => {
              const active = view === t.route;
              return (
                <div key={t.route} onClick={() => setView(t.route)} className={`px-4 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${active ? 'bg-white text-black shadow-lg scale-105' : 'text-[var(--dim)] hover:text-[var(--muted)]'}`}>
                  {t.label}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '10px', color: 'var(--muted)', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: saving ? 'var(--orange)' : 'var(--teal)', color: saving ? 'var(--orange)' : 'var(--teal)', opacity: saving ? 0.8 : 1 }}></div>
              <span className="font-mono tracking-tighter">{saving ? 'SYNCING...' : 'SYNCED'}</span>
            </span>
            <span className="font-mono opacity-60 tracking-widest hidden sm:inline">{new Date().toLocaleTimeString('en-US',{hour12:false})}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:pb-6 pb-24 relative custom-scrollbar">
          {view === 'Portfolio'  && <PortfolioView data={data} user={user} onSelect={setSelectedId} profile={userProfile} />}
          {view === 'Directory'  && <DirectoryView data={data} user={user} onSelect={setSelectedId} onMint={setMintingStone} />}
          {view === 'Marketplace'&& <MarketplaceView data={data} user={user} onSelect={setSelectedId} />}
          {view === 'Custodian'  && <CustodianView custodianData={custodianData} setView={setView} />}
          {view === 'Divergence' && <DivergenceView data={data} onSelect={setSelectedId} />}
          {view === 'NFTs'       && <NFTCollectionView data={data} setView={setView} onSelect={setSelectedId} />}
          {view === 'Mint'       && <TheMintView data={data} setData={setData} custodianData={custodianData} setCustodianData={setCustodianData} addXp={addXp} gemKey={gemKey} />}
          {view === 'Miner'      && <MinerProjectionView data={data} onSelect={setSelectedId} />}
          {view === 'Cutter'     && <CutterYieldView data={data} onSelect={setSelectedId} />}
          {view === 'Benchmark'  && <BenchmarkDataView />}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--surf2)] border-t border-[var(--bdr)] flex items-center justify-around px-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] overflow-x-auto">
        {[
          { icon: '◈', route: 'Portfolio', label: 'Portfolio' },
          { icon: '⊟', route: 'Directory', label: 'Directory' },
          { icon: '⊛', route: 'Marketplace', label: 'Marketplace' },
          { icon: '⌖', route: 'Divergence', label: 'Divergence' },
          { icon: '◉', route: 'Mint', label: 'The Mint' },
        ].map((v) => {
          const active = view === v.route;
          return (
            <button key={v.route} onClick={() => setView(v.route)} className={`flex flex-col flex-shrink-0 items-center justify-center gap-1 w-16 h-12 rounded-lg transition-colors ${active ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`} style={active ? {color: user.color} : {}}>
              <span className="text-xl leading-none">{v.icon}</span>
              <span className="text-[8px] font-bold tracking-wider uppercase truncate w-full text-center">{v.label}</span>
            </button>
          );
        })}
      </nav>

      <DetailPanel stone={selectedStone} user={user} onClose={() => setSelectedId(null)} onMint={setMintingStone} />
      {view !== 'Mint' && <VerifyAIFAB onClick={() => setVerifyAIOpen(true)} energy={userProfile.energy} />}
      {verifyAIOpen && <VerifyAIModal onClose={() => setVerifyAIOpen(false)} addXp={addXp} useEnergy={useEnergy} energy={userProfile.energy} gemKey={gemKey} setData={setData} data={data} />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
