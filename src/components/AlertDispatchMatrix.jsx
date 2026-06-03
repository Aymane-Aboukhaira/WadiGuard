import React from 'react';
import { MessageSquare, Phone, Megaphone, Monitor, Mail, FileText, Radio } from 'lucide-react';

const CHANNELS = [
  { key: 'sms',       icon: MessageSquare, label: 'SMS' },
  { key: 'whatsapp',  icon: Phone,         label: 'WhatsApp' },
  { key: 'siren',     icon: Megaphone,     label: 'Sirènes' },
  { key: 'led',       icon: Monitor,       label: 'LED/VMS' },
  { key: 'dashboard', icon: Radio,         label: 'Dashboard' },
  { key: 'email',     icon: Mail,          label: 'Email' },
  { key: 'cap',       icon: FileText,      label: 'CAP' },
];

const STATUS_STYLE = {
  standby:    { bg: 'rgba(127,142,159,0.06)', border: 'var(--wg-border)',         color: 'var(--wg-muted)',  label: 'STANDBY' },
  queued:     { bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.3)',     color: 'var(--wg-orange)',          label: 'EN FILE' },
  sent:       { bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.3)',     color: 'var(--wg-blue)',          label: 'ENVOYÉ' },
  active:     { bg: 'rgba(0,240,255,0.06)',    border: 'rgba(0,240,255,0.25)',     color: 'var(--wg-cyan)',          label: 'ACTIF' },
  delivered:  { bg: 'rgba(34,197,94,0.08)',    border: 'rgba(34,197,94,0.3)',      color: 'var(--wg-green)',          label: 'LIVRÉ' },
  generating: { bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.3)',     color: 'var(--wg-orange)',          label: 'GÉNÉR...' },
  generated:  { bg: 'rgba(34,197,94,0.08)',    border: 'rgba(34,197,94,0.3)',      color: 'var(--wg-green)',          label: 'GÉNÉRÉ' },
  failed:     { bg: 'rgba(239,68,68,0.1)',     border: 'rgba(239,68,68,0.3)',      color: 'var(--wg-red)',          label: 'ÉCHEC' },
};

function AlertDispatchMatrix({ activeChannels }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
      {CHANNELS.map(ch => {
        const status = activeChannels[ch.key] || 'standby';
        const st = STATUS_STYLE[status] || STATUS_STYLE.standby;
        const Icon = ch.icon;

        return (
          <div key={ch.key} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '6px 4px', borderRadius: 4,
            background: st.bg, border: `1px solid ${st.border}`,
            transition: 'all 0.3s ease', minHeight: 48,
          }}>
            <Icon size={12} color={st.color} style={{ marginBottom: 3, flexShrink: 0 }} />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--wg-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>
              {ch.label}
            </span>
            <span className="mono-precision" style={{
              fontSize: 8, fontWeight: 800, color: st.color,
              letterSpacing: '0.04em', marginTop: 2,
            }}>
              {st.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(AlertDispatchMatrix);
