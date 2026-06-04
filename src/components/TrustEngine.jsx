import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Activity } from 'lucide-react';

function TrustEngine({ phase }) {
  const isActive = phase.level !== 'green';
  const isAlert = phase.level === 'red' || phase.level === 'black';
  const isFalseAlarm = phase.scenarioType === 'falseAlarm';

  const checks = useMemo(() => {
    if (!isActive) {
      return [
        { label: 'Capteur ultrason', value: '23.4 cm', status: 'normal', icon: Activity },
        { label: 'Capteur pression', value: '1013 hPa', status: 'normal', icon: Activity },
        { label: 'Pluviomètre', value: '8 mm/h', status: 'normal', icon: Activity },
        { label: 'Capteur amont', value: 'stable', status: 'normal', icon: Activity },
        { label: 'Caméra terrain', value: 'RAS', status: 'normal', icon: Activity },
      ];
    }
    if (isFalseAlarm) {
      return [
        { label: 'Capteur ultrason', value: 'anomalie', status: 'warning', icon: AlertTriangle },
        { label: 'Capteur pression', value: '1012 hPa', status: 'normal', icon: CheckCircle2 },
        { label: 'Pluviomètre', value: '6 mm/h', status: 'normal', icon: CheckCircle2 },
        { label: 'Capteur amont', value: 'normal', status: 'normal', icon: CheckCircle2 },
        { label: 'Caméra terrain', value: 'RAS', status: 'normal', icon: CheckCircle2 },
      ];
    }
    return [
      { label: 'Capteur ultrason', value: `${phase.level === 'black' ? '89' : '67'}.8 cm`, status: 'alert', icon: AlertTriangle },
      { label: 'Capteur pression', value: '998 hPa', status: 'alert', icon: AlertTriangle },
      { label: 'Pluviomètre', value: `${phase.rain || 45} mm/h`, status: 'alert', icon: AlertTriangle },
      { label: 'Capteur amont', value: 'confirmé', status: 'alert', icon: CheckCircle2 },
      { label: 'Caméra terrain', value: 'simulé', status: 'neutral', icon: Activity },
    ];
  }, [isActive, isAlert, isFalseAlarm, phase]);

  const verdict = useMemo(() => {
    if (!isActive) return { text: 'Surveillance nominale', color: 'var(--wg-green)', bg: 'rgba(16,185,129,0.06)' };
    if (isFalseAlarm) return { text: 'FAUSSE ALARME REJETÉE — aucune sirène déclenchée', color: 'var(--wg-green)', bg: 'rgba(16,185,129,0.08)' };
    return { text: 'ALERTE VALIDÉE — crue réelle confirmée', color: 'var(--wg-red)', bg: 'rgba(239,68,68,0.08)' };
  }, [isActive, isFalseAlarm]);

  const statusColor = (s) => {
    if (s === 'alert') return 'var(--wg-red)';
    if (s === 'warning') return 'var(--wg-orange)';
    if (s === 'normal') return 'var(--wg-green)';
    return 'var(--wg-muted)';
  };

  const confidence = isActive && !isFalseAlarm ? '97%' : isFalseAlarm ? '12%' : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {checks.map((check, i) => {
        const Icon = check.icon;
        const sc = statusColor(check.status);
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '4px 6px', borderRadius: 3,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon size={10} color={sc} />
              <span style={{ fontSize: 11, color: 'var(--wg-text)' }}>{check.label}</span>
            </div>
            <span className="mono-precision" style={{
              fontSize: 9.5, fontWeight: 700, color: sc,
              padding: '1px 5px', borderRadius: 2,
              background: `color-mix(in srgb, ${sc} 10%, transparent)`,
            }}>
              {check.value}
            </span>
          </div>
        );
      })}

      {/* Confidence + Verdict */}
      <div style={{
        marginTop: 4, padding: '5px 8px', borderRadius: 4,
        background: verdict.bg, border: `1px solid color-mix(in srgb, ${verdict.color} 20%, transparent)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: verdict.color, letterSpacing: '0.04em' }}>
          {verdict.text}
        </span>
        {isActive && (
          <span className="mono-precision" style={{
            fontSize: 10, fontWeight: 800, color: isFalseAlarm ? 'var(--wg-orange)' : 'var(--wg-green)',
            padding: '0 5px', borderRadius: 3,
            background: isFalseAlarm ? 'rgba(217,119,6,0.1)' : 'rgba(5,150,105,0.1)',
          }}>
            {confidence}
          </span>
        )}
      </div>
    </div>
  );
}

export default React.memo(TrustEngine);
