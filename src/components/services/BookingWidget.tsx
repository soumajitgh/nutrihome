'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CalendarPlus,
  Download,
  AlertCircle,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react'

interface Slot {
  id: number
  date: string
  startTime: string
  endTime: string
  status: string
}

interface BookingWidgetProps {
  service: {
    id: number
    title: string
    slug: string
  }
}

export function BookingWidget({ service }: BookingWidgetProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [slotsError, setSlotsError] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // Booking form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<{
    booking: { bookingDate: string; startTime: string; endTime: string }
    calendar: { googleUrl: string; icsData: string }
  } | null>(null)

  // Format current year & month
  const yearMonth = useMemo(() => {
    const y = currentDate.getFullYear()
    const m = String(currentDate.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
  }, [currentDate])

  const monthName = useMemo(() => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  }, [currentDate])

  // Fetch slots for current month and service
  useEffect(() => {
    let isCancelled = false

    fetch(`/api/slots?serviceId=${service.id}&month=${yearMonth}&status=available`)
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load availability')
        return res.json()
      })
      .then((data) => {
        if (!isCancelled) {
          if (data.docs) {
            const sortedSlots: Slot[] = [...data.docs].sort((a: Slot, b: Slot) =>
              `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`),
            )
            setSlots(sortedSlots)
            // Auto-select first date with slots if no date is selected
            if (data.docs.length > 0) {
              const today = new Date()
              const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
              const firstAvailable =
                sortedSlots.find((slot) => slot.date >= todayString)?.date || null
              setSelectedDate((prev) => (prev ? prev : firstAvailable))
            }
          }
          setLoadingSlots(false)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Failed to load slots:', err)
          setSlotsError(true)
          setLoadingSlots(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [yearMonth, service.id])

  // Days in month calculation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate()

    const days: {
      dayNumber: number
      dateStr: string
      isCurrentMonth: boolean
      hasSlots: boolean
      isPast: boolean
    }[] = []

    const todayStr = new Date().toISOString().split('T')[0]

    // Empty padding days for previous month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: 0, dateStr: '', isCurrentMonth: false, hasSlots: false, isPast: true })
    }

    for (let day = 1; day <= totalDays; day++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isPast = dStr < todayStr
      const daySlots = slots.filter((s) => s.date === dStr)
      days.push({
        dayNumber: day,
        dateStr: dStr,
        isCurrentMonth: true,
        hasSlots: daySlots.length > 0 && !isPast,
        isPast,
      })
    }

    return days
  }, [currentDate, slots])

  // Slots available on the selected date
  const availableSlotsForDate = useMemo(() => {
    if (!selectedDate) return []
    return slots
      .filter((s) => s.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [selectedDate, slots])

  const handlePrevMonth = () => {
    const today = new Date()
    // Don't go to past months
    if (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() <= today.getMonth()
    ) {
      return
    }
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setLoadingSlots(true)
    setSlotsError(false)
    setSlots([])
    setSelectedDate(null)
    setSelectedSlot(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setLoadingSlots(true)
    setSlotsError(false)
    setSlots([])
    setSelectedDate(null)
    setSelectedSlot(null)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) return

    setBookingLoading(true)
    setBookingError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          serviceId: service.id,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          notes,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete booking')
      }

      setBookingResult(data)
    } catch (err: unknown) {
      setBookingError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
      )
    } finally {
      setBookingLoading(false)
    }
  }

  const handleDownloadIcs = () => {
    if (!bookingResult?.calendar?.icsData) return
    const blob = new Blob([bookingResult.calendar.icsData], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `consultation-${bookingResult.booking.bookingDate || 'booking'}.ics`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setBookingResult(null)
    setSelectedSlot(null)
    setName('')
    setEmail('')
    setPhone('')
    setNotes('')
    // Refresh slots
    setLoadingSlots(true)
    fetch(`/api/slots?serviceId=${service.id}&month=${yearMonth}&status=available`)
      .then((res) => res.json())
      .then((data) => {
        if (data.docs) setSlots(data.docs)
        setLoadingSlots(false)
      })
      .catch(() => setLoadingSlots(false))
  }

  return (
    <div
      className="booking-widget-card static! min-w-0 rounded-xl! border-[#19332a33]! shadow-[0_10px_35px_#19332a0a]! [&_.slot-day-btn]:min-h-11 [&_.slot-day-btn]:p-1! [&_.slot-day-btn]:text-[13px]! [&_.time-chip-btn]:min-h-11 [&_.time-chip-btn]:text-sm! [&_.booking-input]:min-h-[46px] [&_.booking-input]:text-base!"
      id="book-call"
    >
      {/* Widget Header */}
      <div className="booking-widget-header px-[18px]! py-6! sm:px-7!">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.9,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <CalendarIcon size={14} /> Your next step
        </div>
        <h3 className="mt-2 text-[28px]!">Book your consultation</h3>
        <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px', margin: 0 }}>
          30-minute consultation
        </p>
      </div>

      <div className="booking-widget-body p-[18px]! sm:p-7!">
        {!bookingResult && (
          <p
            className="booking-progress"
            style={{ fontSize: '12px', margin: '0 0 20px', color: 'var(--color-forest)' }}
          >
            {selectedSlot ? '02 — Your details' : '01 — Choose a date & time'}
          </p>
        )}
        {/* VIEW 3: Booking Success Screen */}
        {bookingResult ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-lime-soft)',
                border: '2px solid var(--color-forest)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px',
                color: 'var(--color-forest)',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', margin: '0 0 8px' }}>
              You&apos;re Booked!
            </h4>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-forest)',
                opacity: 0.85,
                margin: '0 0 20px',
              }}
            >
              A confirmation has been sent to <strong>{email}</strong>.
            </p>

            <div
              style={{
                background: 'rgba(185, 216, 76, 0.2)',
                border: '1px solid var(--color-forest)',
                borderRadius: '4px',
                padding: '16px',
                textAlign: 'left',
                marginBottom: '24px',
                fontSize: '13px',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>{service.title}</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--color-forest)',
                }}
              >
                <CalendarIcon size={14} /> {bookingResult.booking.bookingDate}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--color-forest)',
                  marginTop: '4px',
                }}
              >
                <Clock size={14} /> {bookingResult.booking.startTime} -{' '}
                {bookingResult.booking.endTime}
              </div>
            </div>

            {/* Calendar Integration Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bookingResult.calendar?.googleUrl && (
                <a
                  href={bookingResult.calendar.googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill pill-dark"
                  style={{ justifyContent: 'center', width: '100%', textDecoration: 'none' }}
                >
                  <CalendarPlus size={16} /> Add to Google Calendar
                </a>
              )}

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="pill pill-outline"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                <Download size={16} /> Download Calendar File (.ics)
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  marginTop: '12px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  color: 'var(--color-forest)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Book another appointment
              </button>
            </div>
          </div>
        ) : selectedSlot ? (
          /* VIEW 2: Client Info Form */
          <div>
            <button
              type="button"
              onClick={() => setSelectedSlot(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-forest)',
                marginBottom: '16px',
                padding: 0,
              }}
            >
              <ArrowLeft size={14} /> Back to slot selection
            </button>

            <div
              style={{
                padding: '12px 14px',
                border: '1px solid var(--color-forest)',
                background: 'var(--color-lime-soft)',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div>
                <strong>Date:</strong> {selectedSlot.date}
              </div>
              <div>
                <strong>Time:</strong> {selectedSlot.startTime} – {selectedSlot.endTime}
              </div>
              <div>
                <strong>Duration:</strong> 30 mins
              </div>
            </div>

            {bookingError && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#fee2e2',
                  border: '1px solid #ef4444',
                  borderRadius: '4px',
                  color: '#991b1b',
                  fontSize: '13px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} /> {bookingError}
              </div>
            )}

            <form
              onSubmit={handleBookingSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div>
                <label
                  htmlFor="booking-name"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="booking-name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="booking-input"
                    style={{ paddingLeft: '34px' }}
                  />
                  <User
                    size={15}
                    style={{ position: 'absolute', left: '10px', top: '12px', opacity: 0.5 }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    id="booking-email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="booking-input"
                    style={{ paddingLeft: '34px' }}
                  />
                  <Mail
                    size={15}
                    style={{ position: 'absolute', left: '10px', top: '12px', opacity: 0.5 }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-phone"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    id="booking-phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="booking-input"
                    style={{ paddingLeft: '34px' }}
                  />
                  <Phone
                    size={15}
                    style={{ position: 'absolute', left: '10px', top: '12px', opacity: 0.5 }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Notes & Goals (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    rows={3}
                    id="booking-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What would you like support with?"
                    className="booking-input"
                    style={{ paddingLeft: '34px', resize: 'vertical' }}
                  />
                  <MessageSquare
                    size={15}
                    style={{ position: 'absolute', left: '10px', top: '12px', opacity: 0.5 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="pill pill-dark"
                style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
              >
                {bookingLoading ? 'Reserving your slot...' : 'Confirm Call Booking'}
              </button>
            </form>
          </div>
        ) : (
          /* VIEW 1: Date & Time Picker */
          <div>
            {/* Month Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                disabled={
                  currentDate.getFullYear() === new Date().getFullYear() &&
                  currentDate.getMonth() === new Date().getMonth()
                }
                style={{
                  background: 'none',
                  border: '1px solid rgba(25, 51, 42, 0.2)',
                  borderRadius: '4px',
                  width: '44px',
                  height: '44px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={16} />
              </button>

              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 600 }}>
                {monthName}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                style={{
                  background: 'none',
                  border: '1px solid rgba(25, 51, 42, 0.2)',
                  borderRadius: '4px',
                  width: '44px',
                  height: '44px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Calendar Days Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
                textAlign: 'center',
                marginBottom: '8px',
              }}
            >
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span
                  key={d}
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    opacity: 0.6,
                    padding: '4px 0',
                  }}
                >
                  {d}
                </span>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
                marginBottom: '20px',
              }}
            >
              {calendarDays.map((cd, index) => {
                if (!cd.isCurrentMonth) {
                  return <div key={index} style={{ height: '36px' }} />
                }

                const isSelected = selectedDate === cd.dateStr
                const isDisabled = cd.isPast || loadingSlots || !cd.hasSlots

                return (
                  <button
                    key={cd.dateStr}
                    type="button"
                    disabled={isDisabled}
                    aria-label={new Date(`${cd.dateStr}T12:00:00`).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDate(cd.dateStr)}
                    className={`slot-day-btn ${isSelected ? 'active' : ''}`}
                    style={{
                      height: '36px',
                      position: 'relative',
                      opacity: isDisabled ? 0.3 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <span>{cd.dayNumber}</span>
                    {cd.hasSlots && !isSelected && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '3px',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-lime-dark)',
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Slots list for selected date */}
            <div
              aria-live="polite"
              style={{ borderTop: '1px solid rgba(25, 51, 42, 0.15)', paddingTop: '16px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {selectedDate ? `Available Times (${selectedDate}):` : 'Select a date'}
                </span>
                {loadingSlots && (
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', opacity: 0.6 }}>
                    Checking slots...
                  </span>
                )}
              </div>

              {availableSlotsForDate.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {availableSlotsForDate.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className="time-chip-btn"
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-forest)',
                    opacity: 0.7,
                    margin: '8px 0',
                  }}
                >
                  {loadingSlots
                    ? 'Loading available slots...'
                    : slotsError
                      ? 'Availability could not be loaded. Please try another month or refresh the page.'
                      : slots.length === 0
                        ? 'No sessions available this month. Try the next month to find a time.'
                        : selectedDate
                          ? 'No available slots on this date. Please pick another day.'
                          : 'Select a highlighted date on the calendar to view available slots.'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
