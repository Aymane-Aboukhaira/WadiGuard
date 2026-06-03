import { LEVELS } from '../../data/assets';
import { levelColor, levelSoft } from '../../utils';
import { X, Dam, Waves, TrafficCone, Wrench, Users, MapPin, AlertTriangle, Cpu } from 'lucide-react';

function assetIcon(type) {
  if (type === 'dam')  return Dam;
  if (type === 'road') return TrafficCone;
  return Waves;
}
function typeLabel(type) {
  if (type === 'dam')  return 'Barrage';
  if (type === 'road') return 'Gate VMS';
  return 'Oued / Rivière';
}

function SensorRow({ sensor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8, padding: '8px 12px', background: 'rgba(6,14,26,0.7)', border: '1px solid #1A2F4A' }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#E8F4FD', fontFamily: 'JetBrains Mono, monospace' }}>{sensor.id}</p>
        <p style={{ fontSize: 10, color: '#8BA3BE', marginTop: 2 }}>{sensor.role}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#4A9FE0' }}>{sensor.protocol}</p>
        <p style={{ fontSize: 9, color: sensor.battery < 20 ? '#EF4444' : '#22C55E', marginTop: 2 }}>{sensor.battery}%</p>
      </div>
    </div>
  );
}

export default function AssetModal({ asset, onClose }) {
  if (!asset) return null;
  const Icon  = assetIcon(asset.type);
  const lv    = LEVELS[asset.status];
  const color = levelColor(asset.status);
  const soft  = levelSoft(asset.status);
  const isAlert = asset.status === 'red' || asset.status === 'black';

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-scale-in" style={{ maxWidth: 560 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderRadius: '14px 14px 0 0', background: soft, borderBottom: `1px solid ${color}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 11, display: 'grid', placeItems: 'center', background: `${color}22`, border: `1px solid ${color}50`, flexShrink: 0 }}>
              <Icon size={20} color={color} />
              {isAlert && <span className="ring-expand" style={{ borderColor: color, color }} />}
            </div>
            <div>
              <p style={{ fontSize: 10, color: '#8BA3BE' }}>{asset.basin} · {asset.province} · {typeLabel(asset.type)}</p>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#E8F4FD', lineHeight: 1.2 }}>{asset.name}</h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color, background: `${color}20`, border: `1px solid ${color}40` }}>{lv.label}</span>
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px 10px' }}><X size={15} /></button>
          </div>
        </div>

        <div style={{ padding: 20, overflowY: 'auto', maxHeight: 'calc(90vh - 70px)' }}>
          {/* Live metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Eau',     value: `${asset.water}%`,       color },
              { label: 'Pluie',   value: `${asset.rain}mm/h`,     color: '#4A9FE0' },
              { label: 'Risque',  value: `${asset.riskScore}/100`, color: asset.riskScore>70?'#EF4444':asset.riskScore>40?'#F59E0B':'#22C55E' },
              { label: 'Latence', value: `${asset.latency}ms`,    color: '#8BA3BE' },
            ].map(m => (
              <div key={m.label} style={{ borderRadius: 9, padding: '9px 10px', background: 'rgba(6,14,26,0.85)', border: '1px solid #1A2F4A', textAlign: 'center' }}>
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8BA3BE' }}>{m.label}</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 800, color: m.color, marginTop: 3 }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              ['Capacité', asset.capacity], ['Construit', asset.builtYear ?? '—'],
              ['Opérateur', asset.operator], ['Priorité', asset.priority],
              ['Batterie', `${asset.battery}%`], ['Dernière sync', `il y a ${asset.lastSync}`],
            ].map(([k, v]) => (
              <div key={k} style={{ borderRadius: 8, padding: '8px 10px', background: 'rgba(6,14,26,0.7)', border: '1px solid #1A2F4A' }}>
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8BA3BE' }}>{k}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#E8F4FD', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Sensors */}
          {asset.sensors?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8BA3BE', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Cpu size={11} color="#4A9FE0" /> Capteurs IoT ({asset.sensors.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {asset.sensors.map(s => <SensorRow key={s.id} sensor={s} />)}
              </div>
            </div>
          )}

          {/* Critical infra */}
          {asset.critical?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8BA3BE', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertTriangle size={11} color="#F59E0B" /> Infrastructures critiques
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {asset.critical.map(c => (
                  <span key={c} style={{ borderRadius: 7, padding: '3px 10px', fontSize: 10, fontWeight: 600, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F59E0B' }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Evacuation zones */}
          {asset.evacuationZones?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8BA3BE', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={11} color="#4A9FE0" /> Zones évacuation · cap. {(asset.shelterCapacity ?? 0).toLocaleString('fr-MA')} pers.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {asset.evacuationZones.map(z => (
                  <span key={z} style={{ borderRadius: 7, padding: '3px 10px', fontSize: 10, fontWeight: 600, background: 'rgba(74,159,224,0.1)', border: '1px solid rgba(74,159,224,0.2)', color: '#4A9FE0', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={9} />{z}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance */}
          {asset.maintenance && (
            <div style={{ borderRadius: 10, padding: 14, background: 'rgba(6,14,26,0.8)', border: '1px solid #1A2F4A' }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8BA3BE', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Wrench size={11} color="#4A9FE0" /> Maintenance
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
                {[
                  ['Dernière inspection', asset.maintenance.lastInspection],
                  ['Prochaine prévue',    asset.maintenance.nextScheduled],
                  ['Statut',             asset.maintenance.status],
                  ['Notes',              asset.maintenance.notes],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p style={{ color: '#8BA3BE', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</p>
                    <p style={{ color: k === 'Statut' ? (v === 'Opérationnel' ? '#22C55E' : '#F59E0B') : '#E8F4FD', fontWeight: 600, marginTop: 2, fontSize: 11 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
