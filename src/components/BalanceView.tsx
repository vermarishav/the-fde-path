import React, { useEffect, useRef } from 'react';
import { BucketType } from '../types';

interface BalanceViewProps {
  stats: {
    bucketTotals: Record<BucketType, number>;
    bucketDone: Record<BucketType, number>;
  };
}

export const BalanceView: React.FC<BalanceViewProps> = ({ stats }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { bucketTotals, bucketDone } = stats;

  const corePct = bucketTotals.core ? Math.round((bucketDone.core / bucketTotals.core) * 100) : 0;
  const aiPct = bucketTotals.ai ? Math.round((bucketDone.ai / bucketTotals.ai) * 100) : 0;
  const customerPct = bucketTotals.customer
    ? Math.round((bucketDone.customer / bucketTotals.customer) * 100)
    : 0;

  const totalDone = bucketDone.core + bucketDone.ai + bucketDone.customer;

  // Diagnostic note generator
  let diagnosticNote = "Check off items in the syllabus and this fills in. It's reading your real progress, not a demo.";
  if (totalDone > 0) {
    const list = [
      { key: 'Core engineering', pct: corePct },
      { key: 'Applied AI', pct: aiPct },
      { key: 'Customer-facing', pct: customerPct },
    ].sort((a, b) => a.pct - b.pct);

    const lowest = list[0];
    const highest = list[2];

    if (highest.pct - lowest.pct > 15 && totalDone > 4) {
      diagnosticNote = `${lowest.key} is trailing your other buckets right now (${lowest.pct}% vs ${highest.pct}%) — consider prioritizing those sprints to maintain hiring readiness.`;
    } else {
      diagnosticNote = "Nicely balanced across all three buckets — keep this equilibrium as you move into deeper phases.";
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display support
    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const w = size;
    const h = size;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = 96;

    ctx.clearRect(0, 0, w, h);

    const buckets: BucketType[] = ['core', 'ai', 'customer'];
    const pcts = [corePct / 100, aiPct / 100, customerPct / 100];
    const angleStep = (Math.PI * 2) / 3;
    const startAngle = -Math.PI / 2;
    const bLabel: Record<BucketType, string> = {
      core: 'Core',
      ai: 'AI',
      customer: 'Customer',
    };
    const bucketColors: Record<BucketType, string> = {
      core: '#2954A6',
      ai: '#B8863A',
      customer: '#71875F',
    };

    // Concentric grid rings
    ctx.strokeStyle = '#E3DED0';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * f, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Radial spokes
    buckets.forEach((_, i) => {
      const a = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
      ctx.strokeStyle = '#E3DED0';
      ctx.stroke();
    });

    // Data polygon
    ctx.beginPath();
    buckets.forEach((_, i) => {
      const a = startAngle + i * angleStep;
      const r = Math.max(pcts[i] * maxR, 6);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(41, 84, 166, 0.16)';
    ctx.fill();
    ctx.strokeStyle = '#2954A6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vertices dots and outer labels
    buckets.forEach((b, i) => {
      const a = startAngle + i * angleStep;
      const r = Math.max(pcts[i] * maxR, 6);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = bucketColors[b];
      ctx.fill();
      ctx.strokeStyle = '#FAF8F3';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer label
      const lx = cx + Math.cos(a) * (maxR + 28);
      const ly = cy + Math.sin(a) * (maxR + 28);
      ctx.fillStyle = '#55524A';
      ctx.font = "600 11px 'IBM Plex Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bLabel[b], lx, ly);
    });
  }, [corePct, aiPct, customerPct]);

  return (
    <div className="space-y-6 pt-2 sm:pt-4 max-w-[800px] mx-auto pb-12">
      <div className="border-b border-[#E3DED0] pb-3">
        <p className="font-mono text-xs text-[#2954A6]">02.5 — live diagnostic</p>
        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B19]">
          Bucket balance
        </h3>
        <p className="text-xs sm:text-sm text-[#55524A] mt-1 leading-relaxed">
          FDE hiring weighs three buckets unevenly by role, but neglecting any one shows up fast in
          interviews. This tracks how your checked-off work is actually distributed as you go.
        </p>
      </div>

      <div className="bg-[#F2EFE6] border border-[#E3DED0] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xs">
        {/* Radar Canvas */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            style={{ width: 280, height: 280 }}
            className="touch-none"
          />
        </div>

        {/* Readout stats */}
        <div className="flex-1 w-full space-y-4">
          <div className="space-y-3">
            {/* Core */}
            <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2954A6]" />
                <div>
                  <div className="text-xs font-semibold text-[#1C1B19]">Core engineering</div>
                  <div className="text-[10px] font-mono text-[#948E7E]">
                    {bucketDone.core} of {bucketTotals.core} items
                  </div>
                </div>
              </div>
              <span className="font-mono text-base font-semibold text-[#2954A6]">{corePct}%</span>
            </div>

            {/* AI */}
            <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#B8863A]" />
                <div>
                  <div className="text-xs font-semibold text-[#1C1B19]">Applied AI</div>
                  <div className="text-[10px] font-mono text-[#948E7E]">
                    {bucketDone.ai} of {bucketTotals.ai} items
                  </div>
                </div>
              </div>
              <span className="font-mono text-base font-semibold text-[#B8863A]">{aiPct}%</span>
            </div>

            {/* Customer */}
            <div className="bg-[#FAF8F3] border border-[#E3DED0] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#71875F]" />
                <div>
                  <div className="text-xs font-semibold text-[#1C1B19]">Customer-facing</div>
                  <div className="text-[10px] font-mono text-[#948E7E]">
                    {bucketDone.customer} of {bucketTotals.customer} items
                  </div>
                </div>
              </div>
              <span className="font-mono text-base font-semibold text-[#71875F]">{customerPct}%</span>
            </div>
          </div>

          <p className="text-xs text-[#55524A] bg-[#FAF8F3]/60 p-3 rounded-md border border-[#E3DED0] italic leading-relaxed">
            {diagnosticNote}
          </p>
        </div>
      </div>
    </div>
  );
};
