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
    if (!isActive) return { text: 'Surveillance nominale', color: '#22C55E', bg: 'rgba(34,197,94,0.06)' };
    if (isFalseAlarm) return { text: 'FAUSSE ALARME REJETÉE — aucune sirène déclenchée', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' };
    return { text: 'ALERTE VALIDÉE — crue réelle confirmée', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' };
  }, [isActive, isFalseAlarm]);

  const statusColor = (s) => {
    if (s === 'alert') return '#EF4444';
    if (s === 'warning') return '#F59E0B';
    if (s === 'normal') return '#22C55E';
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
            padding: '2px 5px', borderRadius: 3,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon size={8} color={sc} />
              <span style={{ fontSize: 9, color: '#E2E8F0' }}>{check.label}</span>
            </div>
            <span className="mono-precision" style={{
              fontSize: 8, fontWeight: 700, color: sc,
              padding: '0px 4px', borderRadius: 2,
              background: `${sc}10`,
            }}>
              {check.value}
            </span>
          </div>
        );
      })}

      {/* Confidence + Verdict */}
      <div style={{
        marginTop: 2, padding: '4px 6px', borderRadius: 4,
        background: verdict.bg, border: `1px solid ${verdict.color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 8, fontWeight: 800, color: verdict.color, letterSpacing: '0.04em' }}>
          {verdict.text}
        </span>
        {isActive && (
          <span className="mono-precision" style={{
            fontSize: 9, fontWeight: 800, color: isFalseAlarm ? '#F59E0B' : '#22C55E',
            padding: '0 4px', borderRadius: 3,
            background: isFalseAlarm ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
          }}>
            {confidence}
          </span>
        )}
      </div>
    </div>
  );
}

export default React.memo(TrustEngine);
