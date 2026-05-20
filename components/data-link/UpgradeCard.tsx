// src/components/data-link/UpgradeCard.tsx

type UpgradeCardProps = {
  billing: any;
  limits: any;
  onUpgrade: () => Promise<void>;
};

export function UpgradeCard({ billing, limits, onUpgrade }: UpgradeCardProps) {
  if (!billing?.can_upgrade) {
    return (
      <section className="dl-panel dl-small-panel">
        <h2>STARTER active</h2>
        <p className="dl-muted">
          You can process larger files and use custom filters.
        </p>

        <ul className="dl-feature-list">
          <li>{limits.files_per_month} files/month</li>
          <li>{limits.max_file_size_mb} MB per file</li>
          <li>{limits.max_records_per_file.toLocaleString()} records per file</li>
          <li>Custom filters enabled</li>
        </ul>
      </section>
    );
  }

  return (
    <section className="dl-panel dl-small-panel dl-upgrade-card">
      <h2>Upgrade to STARTER</h2>
      <p className="dl-muted">
        Process larger files, unlock all presets and use custom filters.
      </p>

      <ul className="dl-feature-list">
        <li>100 files/month</li>
        <li>100 MB per file</li>
        <li>2M records per file</li>
        <li>All presets</li>
        <li>Custom filters</li>
        <li>24h file retention</li>
      </ul>

      <button className="dl-primary-btn" onClick={onUpgrade}>
        Upgrade to STARTER
      </button>
    </section>
  );
}