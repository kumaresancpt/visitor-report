import './SummaryCard.css'

interface SummaryCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function SummaryCard({ title, value, icon, trend }: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="card-header">
        {icon && <div className="card-icon">{icon}</div>}
        <h3 className="card-title">{title}</h3>
      </div>

      <div className="card-value">{value}</div>

      {trend && (
        <div className={`card-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
          {trend.isPositive ? '▲' : '▼'} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  )
}

export default SummaryCard
