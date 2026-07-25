import { Leaf, Flame, TreePine } from 'lucide-react';

export default function EcoImpactBadge({ impact }) {
  if (!impact) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-emerald)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          <Leaf size={22} />
        </div>
        <div>
          <h5 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Sustainability & Eco Score
          </h5>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Taking transit or walking saves <strong style={{ color: 'var(--accent-emerald)' }}>{impact.saved_co2_kg || 0.75} kg CO₂</strong> for this route
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TreePine size={16} /> {impact.trees_equivalent || 12}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tree-Days</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={16} /> {impact.calories_burned || 180}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Burned kcal</div>
        </div>
      </div>
    </div>
  );
}
