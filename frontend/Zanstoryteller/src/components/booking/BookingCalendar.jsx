import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, AlertCircle, Calendar as CalendarIcon } from 'lucide-react'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function BookingCalendar({ selectedDate, onSelectDate, error }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [fridayNotice, setFridayNotice] = useState(false)

  // Navigate to previous month (cannot go before current month/year)
  const handlePrevMonth = () => {
    if (currentYear === today.getFullYear() && currentMonth <= today.getMonth()) {
      return
    }
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Navigate to next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Get total days in month & first day index
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()

  // Generate calendar cells
  const calendarCells = []

  // Blank padding cells for start of month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ key: `blank-${i}`, isBlank: true })
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(currentYear, currentMonth, day)
    cellDate.setHours(0, 0, 0, 0)

    const dayOfWeek = cellDate.getDay() // 0 = Sun, 5 = Fri
    const isFriday = dayOfWeek === 5
    const isPast = cellDate < today
    const isToday = cellDate.getTime() === today.getTime()

    // Format ISO string YYYY-MM-DD
    const isoString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isSelected = selectedDate === isoString

    calendarCells.push({
      key: `day-${day}`,
      day,
      date: cellDate,
      isoString,
      isFriday,
      isPast,
      isToday,
      isSelected,
      isDisabled: isPast || isFriday
    })
  }

  const handleCellClick = (cell) => {
    if (cell.isBlank) return

    if (cell.isFriday) {
      setFridayNotice(true)
      return
    }

    if (cell.isPast) return

    setFridayNotice(false)
    onSelectDate(cell.isoString)
  }

  const isPrevDisabled = currentYear === today.getFullYear() && currentMonth <= today.getMonth()

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm p-5 sm:p-7">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-white/60" />
          <h3 className="text-base sm:text-lg font-light text-white uppercase tracking-wider font-mono">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className={`p-2 rounded-sm border transition-colors ${
              isPrevDisabled
                ? 'border-white/5 text-white/20 cursor-not-allowed'
                : 'border-white/15 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/[0.04]'
            }`}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-sm border border-white/15 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/[0.04] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {DAYS_OF_WEEK.map((d, idx) => {
          const isFri = idx === 5
          return (
            <div
              key={d}
              className={`text-[11px] font-mono uppercase tracking-wider py-1.5 ${
                isFri ? 'text-red-400/80 font-medium' : 'text-white/40'
              }`}
            >
              {d}
              {isFri && <span className="block text-[8px] tracking-normal text-red-400/60 uppercase">Closed</span>}
            </div>
          )
        })}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2" role="grid">
        {calendarCells.map((cell) => {
          if (cell.isBlank) {
            return <div key={cell.key} className="h-9 sm:h-11" />
          }

          let buttonClasses = 'w-full h-9 sm:h-11 flex flex-col items-center justify-center rounded-sm font-mono text-xs sm:text-sm transition-all relative '

          if (cell.isSelected) {
            // Selected active date
            buttonClasses += 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-2 ring-white scale-105 z-10'
          } else if (cell.isFriday) {
            // Friday: Closed
            buttonClasses += 'bg-white/[0.02] text-white/20 border border-red-500/20 cursor-not-allowed line-through hover:bg-red-500/[0.06]'
          } else if (cell.isPast) {
            // Past dates
            buttonClasses += 'text-white/15 cursor-not-allowed'
          } else {
            // Available dates
            buttonClasses += 'text-white/80 border border-white/5 hover:border-white/30 hover:bg-white/[0.06] hover:text-white cursor-pointer'
          }

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => handleCellClick(cell)}
              disabled={cell.isPast}
              aria-label={`${cell.day} ${MONTH_NAMES[currentMonth]} ${currentYear}${cell.isFriday ? ', closed on Fridays' : ''}`}
              aria-disabled={cell.isDisabled}
              className={buttonClasses}
            >
              <span>{cell.day}</span>
              {cell.isToday && !cell.isSelected && (
                <span className="w-1 h-1 rounded-full bg-white/70 absolute bottom-1" />
              )}
            </button>
          )
        })}
      </div>

      {/* Friday Closed Notice */}
      {fridayNotice && (
        <div className="mt-4 p-3 rounded-sm bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block uppercase tracking-wider text-[11px]">We're closed on Fridays.</span>
            <span>Please choose another date between Saturday and Thursday.</span>
          </div>
        </div>
      )}

      {/* Inline Date Error */}
      {error && !fridayNotice && (
        <div className="mt-4 p-2.5 rounded-sm bg-red-950/30 border border-red-500/30 text-xs text-red-300 font-mono flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
