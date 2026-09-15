'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, Check, Lock, Unlock } from 'lucide-react'
import { generateAppointments } from '@/lib/availability'
import './slot-management.css'

interface Slot {
  id: number
  date: string
  startTime: string
  endTime: string
  status: 'available' | 'booked' | 'blocked'
}
const localDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const field =
  'mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base dark:border-gray-700 dark:bg-gray-800'
const card =
  'rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6'

export function SlotManagementView() {
  const [startDate, setStartDate] = useState(localDate)
  const [endDate, setEndDate] = useState(localDate)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [duration, setDuration] = useState(60)
  const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6])
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null)
  const [filterDate, setFilterDate] = useState(localDate)

  useEffect(() => {
    let cancelled = false
    fetch('/api/slots?all=true')
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load existing availability.')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setSlots(data.docs || [])
      })
      .catch((error) => {
        if (!cancelled) setMessage({ error: true, text: error.message })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const preview = useMemo(() => {
    try {
      return {
        appointments: generateAppointments({
          startDate,
          endDate,
          startTime,
          endTime,
          duration,
          daysOfWeek: startDate === endDate ? undefined : days,
        }),
        error: '',
      }
    } catch (error) {
      return {
        appointments: [],
        error: error instanceof Error ? error.message : 'Check your available hours.',
      }
    }
  }, [startDate, endDate, startTime, endTime, duration, days])
  const firstDay = preview.appointments[0]?.date
  const dailyPreview = preview.appointments.filter((slot) => slot.date === firstDay)
  const visibleSlots = slots
    .filter((slot) => slot.date === filterDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  async function saveAvailability(event: React.FormEvent) {
    event.preventDefault()
    if (preview.error || saving) return
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'availability',
          startDate,
          endDate,
          startTime,
          endTime,
          duration,
          daysOfWeek: startDate === endDate ? undefined : days,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save availability.')
      setMessage({
        error: false,
        text: `${result.createdCount} slots created. ${result.skippedCount || 0} existing or overlapping times left unchanged.`,
      })
      setFilterDate(startDate)
      const refreshed = await fetch('/api/slots?all=true')
      if (!refreshed.ok)
        throw new Error('Availability saved, but the list could not refresh. Reload this page.')
      setSlots((await refreshed.json()).docs || [])
    } catch (error) {
      setMessage({
        error: true,
        text: error instanceof Error ? error.message : 'Could not save availability.',
      })
    } finally {
      setSaving(false)
    }
  }

  async function toggleSlot(slot: Slot) {
    setBusyId(slot.id)
    try {
      const response = await fetch('/api/slots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slot.id,
          status: slot.status === 'blocked' ? 'available' : 'blocked',
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not update slot.')
      setSlots((current) => current.map((item) => (item.id === slot.id ? result.doc : item)))
    } catch (error) {
      setMessage({
        error: true,
        text: error instanceof Error ? error.message : 'Could not update slot.',
      })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="slot-management">
      <div className="mx-auto max-w-6xl p-5 text-gray-900 dark:text-gray-100 sm:p-10">
        <Link
          href="/admin"
          className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            YOUR SCHEDULE
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Set your available hours</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Choose when you are available and how long each appointment lasts. We will create the
            slots for you.
          </p>
        </header>
        {message && (
          <div
            role={message.error ? 'alert' : 'status'}
            className={`mb-6 rounded-lg border p-4 text-sm ${message.error ? 'border-red-300 bg-red-50 text-red-800' : 'border-emerald-300 bg-emerald-50 text-emerald-800'}`}
          >
            {message.text}
          </div>
        )}
        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form onSubmit={saveAvailability} className={card}>
            <h2 className="mb-5 text-lg font-semibold">Availability</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                From date
                <input
                  className={field}
                  type="date"
                  required
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value)
                    if (endDate < event.target.value) setEndDate(event.target.value)
                  }}
                />
              </label>
              <label className="text-sm font-medium">
                Until date
                <input
                  className={field}
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </label>
            </div>
            {startDate !== endDate && (
              <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-medium">Repeat on</legend>
                <div className="flex flex-wrap gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={days.includes(index)}
                      onClick={() =>
                        setDays((current) =>
                          current.includes(index)
                            ? current.filter((day) => day !== index)
                            : [...current, index],
                        )
                      }
                      className={`min-h-10 rounded-lg border px-3 text-xs ${days.includes(index) ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-transparent'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Start time
                <input
                  className={field}
                  type="time"
                  required
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
              </label>
              <label className="text-sm font-medium">
                End time
                <input
                  className={field}
                  type="time"
                  required
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                />
              </label>
            </div>
            <label className="mt-5 block text-sm font-medium">
              Each appointment (minutes)
              <input
                className={field}
                type="number"
                min={1}
                max={1440}
                step={1}
                required
                value={Number.isNaN(duration) ? '' : duration}
                onChange={(event) => setDuration(event.target.valueAsNumber)}
              />
            </label>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              For example: 9 AM–5 PM with 60-minute appointments creates 8 slots per day.
            </p>
            <button
              type="submit"
              disabled={saving || !!preview.error || loading}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check size={17} />
              {saving ? 'Creating slots…' : 'Save availability'}
            </button>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Existing slots and bookings are kept. Times that overlap are skipped.
            </p>
          </form>
          <section className={card} aria-labelledby="preview-title">
            <h2 id="preview-title" className="flex items-center gap-2 text-lg font-semibold">
              <Clock size={19} /> Slot preview
            </h2>
            <div aria-live="polite">
              {preview.error ? (
                <p className="mt-4 text-sm text-amber-700 dark:text-amber-400">{preview.error}</p>
              ) : (
                <>
                  <p className="mt-4 text-3xl font-semibold">
                    {preview.appointments.length}
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                      slots across {new Set(preview.appointments.map((slot) => slot.date)).size}{' '}
                      day(s)
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Daily times · {duration} minutes each
                  </p>
                  <div className="mt-4 grid max-h-80 grid-cols-2 gap-2 overflow-y-auto">
                    {dailyPreview.map((slot) => (
                      <span
                        key={slot.startTime}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        {slot.startTime} – {slot.endTime}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
        <section className={`${card} mt-8`} aria-labelledby="existing-title">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 id="existing-title" className="flex items-center gap-2 text-lg font-semibold">
              <CalendarDays size={19} /> Your slots
            </h2>
            <label className="text-sm">
              View date
              <input
                type="date"
                className={field}
                value={filterDate}
                onChange={(event) => setFilterDate(event.target.value)}
              />
            </label>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500">Loading availability…</p>
          ) : visibleSlots.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {slot.startTime} – {slot.endTime}
                    </p>
                    <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
                      {slot.status}
                    </span>
                  </div>
                  {slot.status !== 'booked' && (
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => toggleSlot(slot)}
                      className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-transparent px-3 py-1 text-xs dark:border-gray-600"
                    >
                      {slot.status === 'blocked' ? <Unlock size={13} /> : <Lock size={13} />}
                      {busyId === slot.id
                        ? 'Saving…'
                        : slot.status === 'blocked'
                          ? 'Unblock'
                          : 'Block'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No slots for this date. Set your available hours above to add them.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
