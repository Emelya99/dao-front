import { useCountdown } from '@/hooks/useCountdown'
import { formatTimeLeft } from '@/utils/proposalHelpers'

type Props = {
  deadline: number | null
}

function ProposalCountdown({ deadline }: Props) {
  const timeLeft = useCountdown(deadline ?? 0)
  
  if (!deadline) {
    return (
      <div className="proposal-countdown">
        <strong>Time Left:</strong> Loading...
      </div>
    )
  }
  
  if (timeLeft.isExpired) {
    return (
      <div className="proposal-countdown">
        <strong>Voting ended:</strong> {formatTimeLeft(deadline, timeLeft)}
      </div>
    )
  }
  
  return (
    <div className="proposal-countdown">
      <strong>Time Left:</strong> {formatTimeLeft(deadline, timeLeft)}
    </div>
  )
}

export default ProposalCountdown

