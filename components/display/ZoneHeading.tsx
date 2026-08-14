export function ZoneHeading({
  step,
  label,
  count,
  total,
  className = '',
}: {
  step: string;
  label: string;
  count: number;
  total?: number;
  className?: string;
}) {
  return (
    <div className={`zone-heading ${className}`}>
      <div><span className="micro-label">{step}</span><h2>{label}</h2></div>
      <span className="zone-count">{count}{total ? <small>/ {total}</small> : null}</span>
    </div>
  );
}
