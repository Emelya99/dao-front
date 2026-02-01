import { useCountdown } from '@/hooks/useCountdown'
import { formatTimeLeft } from '@/utils/proposalHelpers'

type Props = {
  deadline: number | null
}

function ProposalCountdown({ deadline }: Props) {
  const timeLeft = useCountdown(deadline ?? 0)
  
  if (!deadline) {
    return (
      <div className="countdown-section">
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Loading...</h3>
      </div>
    )
  }
  
  if (timeLeft.isExpired) {
    return (
      <div className="countdown-section">
        <h3 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--warning-orange)' }}>
          ⏱ Voting Ended
        </h3>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 0 }}>
          {formatTimeLeft(deadline, timeLeft)}
        </p>
      </div>
    )
  }
  
  return (
    <div className="countdown-section">
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Time Remaining</h3>
      <div className="countdown-timer">
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.hours}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.minutes}</span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.seconds}</span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>
    </div>
  )
}

export default ProposalCountdown

