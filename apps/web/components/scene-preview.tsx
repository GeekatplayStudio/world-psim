const nodes = [
  { id: "israel", label: "Israel", top: "18%", left: "18%", size: "h-16 w-16" },
  { id: "iran", label: "Iran", top: "50%", left: "70%", size: "h-20 w-20" },
  { id: "gaza", label: "Gaza", top: "64%", left: "24%", size: "h-12 w-12" },
  { id: "hezbollah", label: "Hezbollah", top: "22%", left: "62%", size: "h-14 w-14" },
  { id: "us", label: "United States", top: "10%", left: "82%", size: "h-10 w-10" },
  { id: "un", label: "UN", top: "76%", left: "54%", size: "h-12 w-12" }
];

const edges = [
  { id: "e1", from: "top-[24%] left-[24%]", to: "top-[54%] left-[66%]", tone: "bg-red-400/70" },
  { id: "e2", from: "top-[26%] left-[66%]", to: "top-[14%] left-[84%]", tone: "bg-amber-300/70" },
  { id: "e3", from: "top-[70%] left-[28%]", to: "top-[54%] left-[66%]", tone: "bg-fuchsia-400/70" },
  { id: "e4", from: "top-[78%] left-[58%]", to: "top-[70%] left-[28%]", tone: "bg-white/60" }
];

export function ScenePreview() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-panel">
      <div className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,232,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,178,107,0.18),transparent_24%)]" />

      {edges.map((edge) => (
        <div key={edge.id} className={`absolute ${edge.from} ${edge.to}`}>
          <div className={`h-px w-40 rotate-[24deg] ${edge.tone} shadow-[0_0_18px_currentColor]`} />
        </div>
      ))}

      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: node.top, left: node.left }}
        >
          <div
            className={`relative ${node.size} rounded-full border border-cyan-200/30 bg-[radial-gradient(circle_at_30%_30%,rgba(120,232,255,0.8),rgba(15,23,42,0.75)_58%,rgba(255,255,255,0.08))] shadow-[0_0_40px_rgba(120,232,255,0.25)]`}
          >
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-slate-300">
              {node.label}
            </span>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-6 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100">
        Phase 0 network staging view
      </div>
    </div>
  );
}