import { TimeLeft } from '@/hooks/useCountdown'

export function getProposalStatus(
  executed: boolean, 
  isExpired: boolean
): 'Executed' | 'Ended' | 'Active' {
  if (executed) return 'Executed'
  if (isExpired) return 'Ended'
  return 'Active'
}

export function formatTimeLeft(
  deadline: number | null, 
  timeLeft: TimeLeft
): string {
  if (deadline === null) return 'Loading...'
  if (timeLeft.isExpired) return 'Voting ended'
  
  const parts = []
  if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`)
  if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`)
  if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`)
  if (timeLeft.seconds > 0 && timeLeft.days === 0) parts.push(`${timeLeft.seconds}s`)
  
  return parts.length > 0 ? parts.join(' ') : 'Less than 1s'
}

