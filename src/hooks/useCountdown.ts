import { useState, useEffect } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function useCountdown(deadline: number): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => 
    calculateTimeLeft(deadline)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline))
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  return timeLeft
}

function calculateTimeLeft(deadline: number): TimeLeft {
  const now = Math.floor(Date.now() / 1000)
  const difference = deadline - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const days = Math.floor(difference / (60 * 60 * 24))
  const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((difference % (60 * 60)) / 60)
  const seconds = Math.floor(difference % 60)

  return { days, hours, minutes, seconds, isExpired: false }
}

