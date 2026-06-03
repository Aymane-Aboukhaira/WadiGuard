import React, { useState } from 'react';
import { Smartphone, MessageSquare, Globe } from 'lucide-react';
import { levelColor } from '../utils';

const TABS = [
  { id: 'fr', label: 'Français', icon: MessageSquare },
  { id: 'ar', label: 'العربية', icon: Globe },
  { id: 'inst', label: 'Institutionnel', icon: Smartphone },
];

function CitizenAlertPreview({ phase, scenario, consequences, selectedAsset }) {
  const [lang, setLang] = useState('fr');
  const color = levelColor(phase.level);
  const isActive = phase.level !== 'green';
  const isRed = phase.level === 'red' || phase.level === 'black';
  const zone = scenario?.zones?.[0] || 'martil';
  const zoneName = zone.charAt(0).toUpperCase() + zone.slice(1);
  const eta = consequences?.eta || '—';

  const messages = {
    fr: {
      title: isRed ? '🔴 ALERTE ROUGE — WadiGuard' : isActive ? '🟠 PRÉ-ALERTE — WadiGuard' : '',
      body: isRed
        ? `⚠️ Crue confirmée — Oued ${zoneName}\n\n🚫 Évitez RN1 / Pont ${zoneName}.\n🏫 Dirigez-vous vers le refuge le plus proche.\n⏱ Impact estimé : ${eta}.\n\nSuivez les instructions de la Protection Civile.\n📞 Urgences : 150 / 177`
        : isActive
        ? `Vigilance renforcée — Oued ${zoneName}\n\nMontée des eaux détectée en amont.\nRestez attentifs aux consignes.\nÉvitez les zones basses.`
        : '',
      footer: isRed ? `${consequences?.sms ? consequences.sms.toLocaleString() : '0'} SMS envoyés` : '',
    },
    ar: {
      title: isRed ? '🔴 إنذار أحمر — WadiGuard' : isActive ? '🟠 إنذار مسبق — WadiGuard' : '',
      body: isRed
        ? `⚠️ فيضان مؤكد — واد ${zoneName}\n\n🚫 تجنبوا طريق RN1 / قنطرة ${zoneName}.\n🏫 توجهوا نحو مركز الإيواء الأقرب.\n⏱ الوقت المتوقع: ${eta}.\n\nاتبعوا تعليمات الوقاية المدنية.\n📞 الطوارئ: 150 / 177`
        : isActive
        ? `يقظة مرتفعة — واد ${zoneName}\n\nارتفاع منسوب المياه.\nابقوا متيقظين.\nتجنبوا المناطق المنخفضة.`
        : '',
      footer: isRed ? `${consequences?.sms ? consequences.sms.toLocaleString() : '0'} رسالة مرسلة` : '',
    },
    inst: {
      title: isRed ? 'ALERTE OPÉRATIONNELLE — NIVEAU ROUGE' : isActive ? 'NOTE DE VIGILANCE' : '',
      body: isRed
        ? `De : WadiGuard v4 — ABH Loukkos\nÀ : Wali TTH, Protection Civile, DGH, Communes\n\nObjet : Crue ${scenario?.name || ''}\n\nNiveau : ${phase.level?.toUpperCase()}\nZone : ${zoneName}\nPopulation exposée : ${consequences?.population?.toLocaleString() || 0}\nRoutes fermées : ${consequences?.roads || 0}\nÉquipes : ${consequences?.teams || 0}\n\nAction requise immédiate.`
        : isActive
        ? `De : WadiGuard v4\nÀ : Autorités régionales\n\nObjet : Vigilance ${scenario?.name || ''}\nMonitoring renforcé en cours.`
        : '',
      footer: 'Format conforme protocole DGH',
    },
  };

  const msg = messages[lang];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 2 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setLang(t.id)} style={{
            flex: 1, padding: '3px 0', borderRadius: 4, fontSize: 8, fontWeight: 700,
            cursor: 'pointer', border: '1px solid var(--wg-border)', fontFamily: 'Outfit, sans-serif',
            background: lang === t.id ? 'rgba(0,240,255,0.08)' : 'transparent',
            color: lang === t.id ? '#00F0FF' : 'var(--wg-muted)',
            borderColor: lang === t.id ? 'rgba(0,240,255,0.25)' : 'var(--wg-border)',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Phone-like preview */}
      {isActive ? (
        <div style={{
          borderRadius: 8, overflow: 'hidden',
          border: `1px solid ${isRed ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.2)'}`,
          background: 'var(--wg-bg-deep)',
        }}>
          {/* Notification header */}
          <div style={{
            padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: isRed ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.06)',
            borderBottom: `1px solid ${isRed ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.1)'}`,
          }}>
            <span style={{ fontSize: 8.5, fontWeight: 800, color, letterSpacing: '0.04em' }}>{msg.title}</span>
            <span className="mono-precision" style={{ fontSize: 7.5, color: 'var(--wg-muted)' }}>maintenant</span>
          </div>
          {/* Message body */}
          <div style={{
            padding: '6px 8px', fontSize: 9.5, color: '#E2E8F0', lineHeight: 1.5,
            whiteSpace: 'pre-line', fontFamily: lang === 'ar' ? 'system-ui, sans-serif' : 'Outfit, sans-serif',
            direction: lang === 'ar' ? 'rtl' : 'ltr',
            maxHeight: 100, overflowY: 'auto',
          }}>
            {msg.body}
          </div>
          {/* Footer */}
          {msg.footer && (
            <div style={{
              padding: '3px 8px', borderTop: '1px solid var(--wg-border)',
              fontSize: 7.5, color: 'var(--wg-muted)', display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{msg.footer}</span>
              <span style={{ color: '#22C55E', fontWeight: 700 }}>✓ ENVOYÉ</span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--wg-muted)', fontSize: 9, borderRadius: 6, background: 'var(--wg-bg-deep)', border: '1px solid var(--wg-border)' }}>
          Surveillance nominale — aucune alerte citoyenne
        </div>
      )}

      <p style={{ fontSize: 7, color: 'var(--wg-muted)', textAlign: 'center', fontStyle: 'italic' }}>
        Simulation d'alerte citoyenne · Intégration SMS/WhatsApp future
      </p>
    </div>
  );
}

export default React.memo(CitizenAlertPreview);
