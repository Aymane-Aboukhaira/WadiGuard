import { useMemo } from 'react';
import { ASSETS } from '../data/assets';
import { clamp, statusFromWater, riskScore } from '../utils';

export function useLiveAssets(scenario, phase, simTime, running) {
  return useMemo(() => {
    return ASSETS.map((asset, index) => {
      const affected = scenario.affected.includes(asset.id);
      const wave = running ? Math.sin((simTime + index * 7) / 7) * 2.5 : 0;
      const water = clamp(asset.baseWater + (affected ? phase.bump : 0) + wave);
      const rain = clamp(
        asset.baseRain + (affected ? Math.max(0, phase.rain - 15) : 0) + Math.max(0, wave * 0.4),
        0, 130,
      );
      const flow = Math.round(asset.flow * (1 + (affected ? phase.bump / 60 : 0)));
      const flowRatio = asset.flow > 0 ? flow / asset.flow : 1;
      const risk = riskScore(water, rain, flowRatio);
      const status = affected ? phase.level : statusFromWater(water);
      const etaMinutes = affected && phase.level !== 'green'
        ? Math.max(3, Math.round(45 - phase.bump * 0.45))
        : null;

      return {
        ...asset,
        affected,
        water: Math.round(water),
        rain: Math.round(rain),
        flow,
        riskScore: risk,
        status,
        online: true,
        battery: clamp(94 - index * 2 + (asset.type === 'road' ? 4 : 0), 67, 98),
        latency: affected && phase.level !== 'green' ? 280 + index * 14 : 115 + index * 9,
        etaMinutes,
        lastSync: `${(index % 18) + 3}s`,
      };
    });
  }, [phase, running, scenario.affected, simTime]);
}
