'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import './slot-management.css'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
  Layers,
} from 'lucide-react'

interface BookingItem {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  bookingDate: string
  startTime: string
  endTime: string
  status: 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  service?:
    | {
        id: string
        title: string
        duration?: number
      }
    | string
}

export function BookingsDashboard() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data.docs || [])
      }
    } catch (err) {
      console.error('Failed to load bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/bookings')
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load bookings. Refresh the page to try again.')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setBookings(data.docs || [])
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: BookingItem['status']) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (res.ok) {
        await fetchBookings()
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus })
        }
      }
    } catch (err) {
      console.error('Error updating booking status:', err)
    }
  }

  // Derived metrics
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  const metrics = useMemo(() => {
    const total = bookings.length
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length
    const todayCount = bookings.filter(
      (b) => b.bookingDate === todayStr && b.status === 'confirmed',
    ).length
    const completed = bookings.filter((b) => b.status === 'completed').length
    return { total, confirmed, todayCount, completed }
  }, [bookings, todayStr])

  // Services list for filter
  const servicesList = useMemo(() => {
    const map = new Map<string, string>()
    bookings.forEach((b) => {
      if (b.service && typeof b.service === 'object' && b.service.title) {
        map.set(b.service.id, b.service.title)
      }
    })
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }))
  }, [bookings])

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      if (serviceFilter !== 'all') {
        const sId = typeof b.service === 'object' ? b.service?.id : b.service
        if (sId !== serviceFilter) return false
      }
      return true
    })
  }, [bookings, statusFilter, serviceFilter])

  // Calendar month calculation
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = []

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = prevMonthDays - i
      const prevDate = new Date(year, month - 1, d)
      days.push({
        dateStr: prevDate.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      // Format manual YYYY-MM-DD to avoid timezone offset
      const mStr = String(month + 1).padStart(2, '0')
      const dStr = String(d).padStart(2, '0')
      days.push({
        dateStr: `${year}-${mStr}-${dStr}`,
        dayNum: d,
        isCurrentMonth: true,
      })
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d)
      days.push({
        dateStr: nextDate.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: false,
      })
    }

    return days
  }, [year, month, firstDayOfMonth, daysInMonth])

  return (
    <div className="slot-management">
      <div className="my-8 min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 sm:p-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <CalendarIcon size={18} />
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Consultations & Bookings Calendar
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Overview of upcoming client consultations, session status, and slot bookings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/slots-management"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Layers size={16} /> Manage Slots & Availability
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Today&apos;s Calls
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {metrics.todayCount}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Active Confirmed
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.confirmed}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Completed Sessions
            </p>
            <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metrics.completed}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Bookings
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
              {metrics.total}
            </p>
          </div>
        </div>

        {/* Filter Bar & Month Navigation */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-3 rounded-lg dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="rounded border border-gray-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            >
              <ChevronRight size={16} />
            </button>
            <span className="ml-2 font-bold text-base text-gray-800 dark:text-gray-100">
              {monthName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
              <Filter size={14} /> Filter:
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {servicesList.length > 0 && (
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="rounded border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="all">All Services</option>
                {servicesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {loading && (
          <p role="status" className="mt-4 text-sm text-gray-500">
            Loading bookings…
          </p>
        )}
        {loadError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {loadError}
          </p>
        )}
        {/* Calendar Grid */}
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="grid min-w-[700px] grid-cols-7 border-b border-gray-200 bg-gray-100 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
            <div className="py-2.5">Sun</div>
            <div className="py-2.5">Mon</div>
            <div className="py-2.5">Tue</div>
            <div className="py-2.5">Wed</div>
            <div className="py-2.5">Thu</div>
            <div className="py-2.5">Fri</div>
            <div className="py-2.5">Sat</div>
          </div>

          <div className="grid min-w-[700px] grid-cols-7 divide-x divide-y divide-gray-200 dark:divide-gray-800">
            {calendarDays.map((item, idx) => {
              const isToday = item.dateStr === todayStr
              const dayBookings = filteredBookings.filter((b) => b.bookingDate === item.dateStr)

              return (
                <div
                  key={idx}
                  className={`min-h-[105px] border-r border-b border-gray-200 p-2 transition-colors dark:border-gray-800 ${
                    item.isCurrentMonth
                      ? isToday
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'bg-white dark:bg-gray-900'
                      : 'bg-gray-50/70 text-gray-400 dark:bg-gray-950/50 dark:text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday
                          ? 'bg-emerald-600 text-white'
                          : item.isCurrentMonth
                            ? 'text-gray-800 dark:text-gray-200'
                            : 'text-gray-400'
                      }`}
                    >
                      {item.dayNum}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-[10px] font-medium text-gray-500">
                        {dayBookings.length} {dayBookings.length === 1 ? 'call' : 'calls'}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 space-y-1">
                    {dayBookings.map((b) => {
                      const statusStyle =
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : b.status === 'completed'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-950/80 dark:text-purple-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 line-through dark:bg-gray-800 dark:text-gray-400'

                      return (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBooking(b)}
                          className={`w-full text-left truncate rounded px-1.5 py-0.5 text-[11px] font-medium transition block ${statusStyle}`}
                        >
                          <span className="font-bold">{b.startTime}</span> {b.clientName}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      selectedBooking.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : selectedBooking.status === 'completed'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {selectedBooking.status.toUpperCase()}
                  </span>
                  <h3 className="text-base font-bold">Booking Details</h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Service</p>
                  <p className="font-semibold text-base">
                    {typeof selectedBooking.service === 'object'
                      ? selectedBooking.service?.title
                      : 'Consultation'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Date & Time</p>
                    <p className="font-medium flex items-center gap-1.5 mt-0.5">
                      <CalendarIcon size={14} className="text-gray-400" />
                      {selectedBooking.bookingDate}
                    </p>
                    <p className="font-medium flex items-center gap-1.5 mt-0.5">
                      <Clock size={14} className="text-gray-400" />
                      {selectedBooking.startTime} - {selectedBooking.endTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Client</p>
                    <p className="font-medium flex items-center gap-1.5 mt-0.5">
                      <User size={14} className="text-gray-400" />
                      {selectedBooking.clientName}
                    </p>
                    <p className="font-medium flex items-center gap-1.5 mt-0.5 text-xs">
                      <Mail size={14} className="text-gray-400" />
                      <a
                        href={`mailto:${selectedBooking.clientEmail}`}
                        className="text-emerald-600 underline"
                      >
                        {selectedBooking.clientEmail}
                      </a>
                    </p>
                    {selectedBooking.clientPhone && (
                      <p className="font-medium flex items-center gap-1.5 mt-0.5 text-xs">
                        <Phone size={14} className="text-gray-400" />
                        {selectedBooking.clientPhone}
                      </p>
                    )}
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Client Notes</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300 italic">
                      &quot;{selectedBooking.notes}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  {selectedBooking.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      <CheckCircle2 size={14} /> Mark Completed
                    </button>
                  )}

                  {selectedBooking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300 transition"
                    >
                      <XCircle size={14} /> Cancel Booking
                    </button>
                  )}
                </div>

                <a
                  href={`/admin/collections/bookings/${selectedBooking.id}`}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-600"
                >
                  Edit in Payload <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
