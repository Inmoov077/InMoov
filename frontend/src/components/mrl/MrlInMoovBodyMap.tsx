import { INMOOV_BUTTONS, MRL_ASSET, type InMoovPanel } from '@/lib/mrlInmoovConfig';
import { cn } from '@/lib/utils';

interface MrlInMoovBodyMapProps {
  activePanel: InMoovPanel;
  onSelect: (panel: InMoovPanel) => void;
  i01State?: string;
  className?: string;
}

export function MrlInMoovBodyMap({ activePanel, onSelect, i01State, className }: MrlInMoovBodyMapProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className="relative mx-auto overflow-hidden rounded-xl border border-border/60 shadow-lg"
        style={{
          width: 620,
          height: 588,
          maxWidth: '100%',
          aspectRatio: '620/588',
          backgroundImage: `url(${MRL_ASSET('img/InMoov2/background.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {INMOOV_BUTTONS.map((btn) => {
          const isActive = activePanel === btn.name;
          const img = MRL_ASSET(`img/InMoov2/${btn.name}_${isActive ? 'Activ' : 'off'}.png`);
          return (
            <button
              key={btn.name}
              type="button"
              title={btn.name}
              onClick={() => onSelect(btn.name as InMoovPanel)}
              className="absolute z-10 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                transform: `translate(${btn.translate})`,
                left: 0,
                top: 0,
              }}
            >
              <img src={img} alt={btn.name} className="pointer-events-none max-h-16 max-w-16 sm:max-h-none sm:max-w-none" draggable={false} />
            </button>
          );
        })}

        {/* Active region overlays (like MRL GuiDisplays) */}
        {activePanel === 'head' && (
          <img src={MRL_ASSET('img/InMoov2/headA_Activ.png')} alt="" className="pointer-events-none absolute left-[38%] top-[8%] w-[22%] opacity-90" />
        )}
        {activePanel === 'arm' && (
          <>
            <img src={MRL_ASSET('img/InMoov2/armL_Activ.png')} alt="" className="pointer-events-none absolute left-[8%] top-[32%] w-[28%] opacity-90" />
            <img src={MRL_ASSET('img/InMoov2/armR_Activ.png')} alt="" className="pointer-events-none absolute right-[8%] top-[32%] w-[28%] opacity-90" />
          </>
        )}
        {activePanel === 'hand' && (
          <>
            <img src={MRL_ASSET('img/InMoov2/handL_Activ.png')} alt="" className="pointer-events-none absolute left-[12%] top-[48%] w-[20%] opacity-90" />
            <img src={MRL_ASSET('img/InMoov2/handR_Activ.png')} alt="" className="pointer-events-none absolute right-[12%] top-[48%] w-[20%] opacity-90" />
          </>
        )}
        {activePanel === 'torso' && (
          <img src={MRL_ASSET('img/InMoov2/torsoA_Activ.png')} alt="" className="pointer-events-none absolute left-[36%] top-[42%] w-[28%] opacity-90" />
        )}

        <div
          id="homeGuiButton"
          className="absolute left-[28%] top-[26%] cursor-pointer rounded bg-card/80 px-2 py-1 text-xs font-semibold shadow hover:bg-primary/20"
          onClick={() => onSelect('InMoov')}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
        >
          Intro
        </div>
        <div
          className="absolute right-[22%] top-[26%] cursor-pointer rounded bg-card/80 px-2 py-1 text-xs font-semibold shadow hover:bg-primary/20"
          onClick={() => onSelect('runtime')}
          role="button"
          tabIndex={0}
        >
          Runtime
        </div>
      </div>
      {i01State && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          i01 state: <span className="font-semibold text-foreground">{i01State}</span>
        </p>
      )}
    </div>
  );
}