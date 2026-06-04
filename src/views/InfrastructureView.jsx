import React, { useState, useMemo } from 'react';
import {
  Cloud, Router, Server, Cpu, Radio, ShieldAlert, Monitor, Activity, Terminal, ShieldCheck, HardDrive, Filter, Droplets, CloudRain, BellRing, MonitorPlay
} from 'lucide-react';

export default function InfrastructureView({ phase, cyberState }) {
  const [filter, setFilter] = useState('All');

  // Derive global context from phase
  const isAlert = phase.level === 'red' || phase.level === 'black';
  const isWarning = phase.level === 'orange';
  const isFallback = cyberState?.primaryLink === 'down' || cyberState?.primaryLink?.includes('down');
  const isRogueBlocked = cyberState?.rogueDevice === 'blocked' || cyberState?.rogueDevice?.includes('blocked');
  const isFalseAlarm = phase.id === 'false_alarm';

  // Base equipment topology
  const equipmentData = useMemo(() => {
    return [
      // 1. External / Cloud
      {
        id: 'Z0-Cloud-GSM',
        name: 'Opérateur Telecom GSM',
        zone: 'Z0-Cloud',
        vlan: 'N/A',
        role: 'Connectivité 4G/LTE',
        type: 'Network',
        icon: Cloud,
        status: isFallback ? 'DEGRADED' : 'ONLINE',
        ip: 'Public IP',
        latency: isFallback ? '1450ms' : '45ms',
        protocol: '4G/LTE',
      },
      {
        id: 'Z0-API-GW',
        name: 'Passerelle CAP/SMS',
        zone: 'Z0-Cloud',
        vlan: 'N/A',
        role: 'Alerte Citoyenne',
        type: 'Servers',
        icon: Radio,
        status: isAlert ? 'ACTIVE' : 'ONLINE',
        ip: 'API Endpoint',
        latency: '12ms',
        protocol: 'HTTP/REST',
        action: isAlert ? 'Envoi Cell Broadcast...' : 'Standby',
      },
      // 2. Core Network
      {
        id: 'Z1-Router-WAN',
        name: 'Routeur WAN Principal',
        zone: 'Z1-Core',
        vlan: 'Trunk',
        role: 'Routage & VPN',
        type: 'Network',
        icon: Router,
        status: isFallback ? 'DEGRADED' : 'ONLINE',
        ip: '10.0.0.1',
        latency: '2ms',
        protocol: 'OSPF/BGP',
        action: isFallback ? 'Failover LoRa initié' : 'Routage Nominal',
      },
      {
        id: 'Z1-Core-SW',
        name: 'Switch Core L3',
        zone: 'Z1-Core',
        vlan: 'Trunk',
        role: 'Routage Inter-VLAN',
        type: 'Network',
        icon: HardDrive,
        status: 'ONLINE',
        ip: '10.0.0.2',
        latency: '<1ms',
        protocol: '802.1Q',
      },
      // 3. IoT Field Zone — VLAN 10
      {
        id: 'Z2-IoT-SW',
        name: 'Switch Terrain Industriel',
        zone: 'Z2-IoT',
        vlan: 'VLAN 10',
        role: 'Concentrateur Capteurs',
        type: 'Network',
        icon: HardDrive,
        status: 'ONLINE',
        ip: '10.10.10.1',
        latency: '<1ms',
        protocol: 'PoE+',
      },
      {
        id: 'Z2-Edge-SBC',
        name: 'Passerelle Edge (SBC)',
        zone: 'Z2-IoT',
        vlan: 'VLAN 10',
        role: 'Traitement Local & Secours',
        type: 'IoT',
        icon: Cpu,
        status: isFallback && isAlert ? 'ACTIVE' : 'ONLINE',
        ip: '10.10.10.10',
        latency: '2ms',
        protocol: isFallback ? 'LoRaWAN' : 'MQTT',
        battery: 'Sur Secteur',
        action: isFallback && isAlert ? 'Décision locale (Siren)' : 'Monitoring',
      },
      {
        id: 'Z2-WaterSensor',
        name: 'Capteur Radar Oued',
        zone: 'Z2-IoT',
        vlan: 'VLAN 10',
        role: 'Mesure Niveau Eau',
        type: 'IoT',
        icon: Droplets,
        status: isAlert ? 'ACTIVE' : isWarning ? 'WARNING' : 'ONLINE',
        ip: '10.10.10.21',
        latency: '8ms',
        protocol: 'MQTT',
        battery: '98%',
        action: isAlert || isWarning ? 'Polling Haute Fréquence' : 'Polling Standard',
      },
      {
        id: 'Z2-RainSensor',
        name: 'Pluviomètre Connecté',
        zone: 'Z2-IoT',
        vlan: 'VLAN 10',
        role: 'Mesure Précipitations',
        type: 'IoT',
        icon: CloudRain,
        status: isAlert ? 'ACTIVE' : isWarning ? 'WARNING' : 'ONLINE',
        ip: '10.10.10.22',
        latency: '11ms',
        protocol: 'MQTT',
        battery: '95%',
        action: isAlert || isWarning ? 'Polling Haute Fréquence' : 'Polling Standard',
      },
      {
        id: 'Z2-LED-Panel',
        name: 'Panneau Affichage Variable',
        zone: 'Z2-IoT',
        vlan: 'VLAN 10',
        role: 'Signalisation Routière',
        type: 'Alerts',
        icon: MonitorPlay,
        status: (isAlert || isWarning) && !isFalseAlarm ? 'ACTIVE' : 'ONLINE',
        ip: '10.10.10.30',
        latency: '15ms',
        protocol: 'HTTP',
        battery: 'Solaire (100%)',
        action: isAlert && !isFalseAlarm ? 'Message: ROUTE FERMÉE' : isWarning ? 'Message: PRUDENCE' : 'Veille',
      },
      {
        id: 'Z2-Siren',
        name: 'Sirène d\'Alerte Civile',
        zone: 'Z2-IoT',
        vlan: 'VLAN 10',
        role: 'Alerte Sonore',
        type: 'Alerts',
        icon: BellRing,
        status: isAlert && !isFalseAlarm ? 'ACTIVE' : 'ONLINE',
        ip: '10.10.10.35',
        latency: '4ms',
        protocol: 'Modbus TCP',
        battery: 'Sur Secteur',
        action: isAlert && !isFalseAlarm ? 'Sonnerie Générale' : 'Silencieux',
      },
      // 4. Authority / Servers
      {
        id: 'Z3-Authority-SW',
        name: 'Switch Autorités L2',
        zone: 'Z3-Authority',
        vlan: 'VLAN 20',
        role: 'Distribution PC',
        type: 'Network',
        icon: HardDrive,
        status: 'ONLINE',
        ip: '10.20.20.1',
        latency: '<1ms',
        protocol: '802.1Q',
      },
      {
        id: 'Z3-Authority-PC',
        name: 'Poste Commandement',
        zone: 'Z3-Authority',
        vlan: 'VLAN 20',
        role: 'Validation Humaine',
        type: 'Servers',
        icon: Monitor,
        status: isAlert || isWarning ? 'ACTIVE' : 'ONLINE',
        ip: '10.20.20.50',
        latency: '1ms',
        protocol: 'HTTPS',
        action: isAlert ? 'Opérateur en ligne' : 'Veille',
      },
      {
        id: 'Z4-Server',
        name: 'Serveur IA / Backend',
        zone: 'Z4-Servers',
        vlan: 'VLAN 30',
        role: 'Traitement Données',
        type: 'Servers',
        icon: Server,
        status: 'ONLINE',
        ip: '10.30.30.10',
        latency: '1ms',
        protocol: 'HTTPS/WSS',
        action: isAlert ? 'Génération rapports CAP' : 'Ingestion nominale',
      },
      // 5. Cybersecurity / Isolation
      {
        id: 'Z5-Rogue',
        name: 'Machine Non Autorisée',
        zone: 'Z5-External',
        vlan: 'Unknown',
        role: 'Tentative Intrusion',
        type: 'Cybersecurity',
        icon: ShieldAlert,
        status: isRogueBlocked ? 'BLOCKED' : 'OFFLINE',
        ip: '192.168.1.99',
        latency: '—',
        protocol: 'SSH / Ping',
        action: isRogueBlocked ? 'Drop par ACL VLAN 20' : 'Aucune détection',
      },
    ];
  }, [isAlert, isWarning, isFallback, isRogueBlocked, isFalseAlarm]);

  const filteredEquipment = useMemo(() => {
    if (filter === 'All') return equipmentData;
    return equipmentData.filter(e => e.type === filter);
  }, [equipmentData, filter]);

  // Topology Stats
  const stats = useMemo(() => {
    let online = 0; let warning = 0; let active = 0; let blocked = 0; let offline = 0;
    equipmentData.forEach(e => {
      if (e.status === 'ONLINE') online++;
      else if (e.status === 'WARNING' || e.status === 'DEGRADED') warning++;
      else if (e.status === 'ACTIVE') active++;
      else if (e.status === 'BLOCKED') blocked++;
      else offline++;
    });
    return { total: equipmentData.length, online, warning, active, blocked, offline };
  }, [equipmentData]);

  // Styling helper for status pills
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ONLINE': return { bg: 'rgba(16,185,129,0.1)', color: 'var(--wg-green)', border: 'var(--wg-green)' };
      case 'WARNING':
      case 'DEGRADED': return { bg: 'rgba(245,158,11,0.1)', color: 'var(--wg-orange)', border: 'var(--wg-orange)' };
      case 'ACTIVE': return { bg: 'rgba(0,240,255,0.1)', color: 'var(--wg-cyan)', border: 'var(--wg-cyan)' };
      case 'BLOCKED': return { bg: 'rgba(239,68,68,0.1)', color: 'var(--wg-red)', border: 'var(--wg-red)' };
      default: return { bg: 'rgba(156,163,175,0.1)', color: 'var(--wg-muted)', border: 'var(--wg-muted)' };
    }
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header section */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--wg-text)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={24} color="var(--wg-cyan)" />
          État de l'Infrastructure
        </h1>
        <p style={{ fontSize: 13, color: 'var(--wg-muted)', marginTop: 4 }}>
          Surveillance en temps réel de la topologie réseau, de l'isolation des VLANs, et de la connectivité Edge/IoT.
        </p>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {[
          { label: 'Équipements Total', value: stats.total, color: 'var(--wg-text)' },
          { label: 'En Ligne (Nominal)', value: stats.online, color: 'var(--wg-green)' },
          { label: 'Dégradé / Alerte', value: stats.warning, color: 'var(--wg-orange)' },
          { label: 'Réponse Active', value: stats.active, color: 'var(--wg-cyan)' },
          { label: 'Menaces Bloquées', value: stats.blocked, color: 'var(--wg-red)' },
        ].map((stat, i) => (
          <div key={i} className="glass" style={{ padding: 16, borderRadius: 'var(--radius-lg)' }}>
            <p className="section-label" style={{ fontSize: 11, marginBottom: 4 }}>{stat.label}</p>
            <p className="mono-precision" style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Filter size={14} color="var(--wg-muted)" style={{ marginRight: 4 }} />
        {['All', 'Network', 'IoT', 'Servers', 'Alerts', 'Cybersecurity'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              background: filter === f ? 'var(--wg-cyan)' : 'var(--wg-surface)',
              color: filter === f ? '#000' : 'var(--wg-muted)',
              border: `1px solid ${filter === f ? 'var(--wg-cyan)' : 'var(--wg-border)'}`,
            }}
          >
            {f === 'All' ? 'Tous' : f}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, paddingBottom: 40 }}>
        {filteredEquipment.map(eq => {
          const sStyle = getStatusStyle(eq.status);
          const Icon = eq.icon;
          return (
            <div key={eq.id} className="glass" style={{
              borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
              borderLeft: `3px solid ${sStyle.color}`, transition: 'all 0.3s'
            }}>

              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--wg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--wg-border)' }}>
                    <Icon size={18} color="var(--wg-text)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--wg-text)', margin: '0 0 2px 0' }}>{eq.name}</h3>
                    <p style={{ fontSize: 11, color: 'var(--wg-muted)', margin: 0 }}>{eq.id}</p>
                  </div>
                </div>
                <span className="mono-precision" style={{
                  fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12,
                  background: sStyle.bg, color: sStyle.color, border: `1px solid ${sStyle.border}`
                }}>
                  {eq.status}
                </span>
              </div>

              {/* Technical Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', background: 'var(--wg-bg-deep)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--wg-border)' }}>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--wg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>Zone</p>
                  <p className="mono-precision" style={{ fontSize: 11, color: 'var(--wg-text)', margin: 0, fontWeight: 600 }}>{eq.zone}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--wg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>VLAN</p>
                  <p className="mono-precision" style={{ fontSize: 11, color: 'var(--wg-cyan)', margin: 0, fontWeight: 600 }}>{eq.vlan}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--wg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>Adresse IP</p>
                  <p className="mono-precision" style={{ fontSize: 11, color: 'var(--wg-text)', margin: 0 }}>{eq.ip}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: 'var(--wg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>Protocole</p>
                  <p className="mono-precision" style={{ fontSize: 11, color: 'var(--wg-text)', margin: 0 }}>{eq.protocol}</p>
                </div>
                {eq.battery && (
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--wg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>Alimentation</p>
                    <p className="mono-precision" style={{ fontSize: 11, color: 'var(--wg-text)', margin: 0 }}>{eq.battery}</p>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: 10, color: 'var(--wg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>Latence</p>
                  <p className="mono-precision" style={{ fontSize: 11, color: 'var(--wg-text)', margin: 0 }}>{eq.latency}</p>
                </div>
              </div>

              {/* Action/Role Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <Terminal size={12} color="var(--wg-muted)" />
                <span style={{ fontSize: 12, color: 'var(--wg-text)', fontWeight: 500 }}>
                  {eq.action || eq.role}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
