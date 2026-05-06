const KpiStat = ({label, value, sub, color}) => (
  <div className="glass-card rounded-xl p-6 flex flex-col justify-between border border-[var(--bdr)] hover:border-[var(--bdr-hi)] shadow-xl transition-all h-full bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none text-[84px] font-display translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">⬡</div>
    <div className="relative z-10">
      <div className="text-[10px] font-bold uppercase text-[var(--muted)] tracking-[0.2em] mb-4 font-display">{label}</div>
      <div className="text-[34px] font-light tracking-tighter leading-none mb-1 font-display transition-all group-hover:tracking-normal duration-500" style={{color, textShadow: `0 0 25px ${color}44` }}>{value}</div>
      {sub && <div className="text-[10px] text-[var(--dim)] font-bold mt-2 uppercase tracking-[0.14em] font-display opacity-60">{sub}</div>}
    </div>
  </div>
);

const Badge = ({label, color}) => (
  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider border" style={{color, borderColor: `${color}44`, backgroundColor: `${color}11`}}>{label}</span>
);

const AuthGate = ({ setLogin }) => {
  const [loading, setLoading] = useState(null);
  
  const handleLogin = (id) => {
    setLoading(id);
    setTimeout(() => setLogin(USERS[id]), 900);
  };

  return (
    <div className="w-full h-full bg-[var(--bg)] flex items-center justify-center p-6 fixed inset-0 z-50 overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col items-center py-12">
        <div className="h-16 mb-8"><AOSA_Logo_Scaled /></div>
        <h1 className="text-4xl font-light text-[var(--text)] mb-3 font-display tracking-tight text-center">Opal Provenance <span className="opacity-40">Network</span></h1>
        <p className="text-[11px] font-bold uppercase text-[var(--muted)] tracking-[0.25em] mb-12 font-display opacity-80">Andamooka &middot; South Australia &middot; Est 2026</p>
        
        <div className="flex flex-col md:flex-row gap-8">
          {Object.values(USERS).map(u => (
            <div 
              key={u.id}
              onClick={() => handleLogin(u.id)}
              className="w-[300px] rounded-2xl bg-[var(--surf)] border border-[var(--bdr)] p-8 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:border-[var(--gold-dim)] group relative overflow-hidden"
              style={{ '--btn-hover': u.color }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[64px] font-display">⬡</div>
              <div className="flex items-center gap-5 mb-8">
                <div 
                  className="w-[60px] h-[60px] rounded-full flex items-center justify-center font-light text-2xl bg-opacity-10 font-display transition-transform group-hover:scale-105"
                  style={{ color: u.color, background: `linear-gradient(135deg, ${u.color}22, ${u.color}00)`, border: `1px solid ${u.color}33` }}
                >
                  {u.initials}
                </div>
                <div>
                  <div className="font-light text-xl font-display tracking-tight leading-none mb-1">{u.name.split(' ')[0]}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] font-display" style={{color: u.color}}>{u.role}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8 text-[11px] bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="text-[var(--muted)] font-bold uppercase tracking-widest font-display text-[9px]">Network ID</span>
                <span className="font-mono text-[var(--dim)]">{u.wallet.slice(0,6)}...{u.wallet.slice(-4)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold mb-10 font-display tracking-[0.14em]" style={{color: u.color}}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: u.color}}></div>
                Full Protocol Access
              </div>
              
              <button 
                className="w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-3 font-display uppercase tracking-widest"
                style={{
                  border: `1px solid ${u.color}44`, 
                  background: `${u.color}08`,
                  color: u.color
                }}
              >
                {loading === u.id ? (
                  <><span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor: u.color, borderTopColor: 'transparent'}}></span> Connecting</>
                ) : (
                  <>Connect &rarr;</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AOSA_Logo_Scaled = () => <AosaLogo />;
