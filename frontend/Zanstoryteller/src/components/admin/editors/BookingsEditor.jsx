import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarCheck,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock3,
  XCircle,
  Archive,
  Trash2,
  ExternalLink,
  MessageCircle,
  FileText,
  AlertCircle
} from 'lucide-react'
import { supabase } from '../../../utils/supabase'
import { apiFetch } from '../../../utils/apiClient'
import { useCMS } from '../../../context/CMSContext'

export default function BookingsEditor() {
  const { showToast } = useCMS()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
  const [editingNotesId, setEditingNotesId] = useState(null)
  const [notesDraft, setNotesDraft] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(null)

  // -------------------------------------------------------------
  // Fetch Bookings from Supabase / API
  // -------------------------------------------------------------
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Direct bookings fetch notice:', error.message)
        // Fallback to API endpoint
        const res = await apiFetch('/api/bookings')
        if (res.ok) {
          const apiData = await res.json()
          setBookings(apiData.bookings || [])
          return
        }
      }

      setBookings(data || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
      showToast('Unable to load bookings: ' + err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // -------------------------------------------------------------
  // Status Update Handler
  // -------------------------------------------------------------
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setIsUpdatingStatus(bookingId)

      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) {
        // Fallback to API
        await apiFetch('/api/bookings', {
          method: 'PATCH',
          body: JSON.stringify({ id: bookingId, status: newStatus })
        })
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      )

      showToast(`Booking marked as ${newStatus}!`, 'success')
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error')
    } finally {
      setIsUpdatingStatus(null)
    }
  };

  // -------------------------------------------------------------
  // Save Admin Notes
  // -------------------------------------------------------------
  const handleSaveNotes = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ notes: notesDraft })
        .eq('id', bookingId)

      if (error) {
        await apiFetch('/api/bookings', {
          method: 'PATCH',
          body: JSON.stringify({ id: bookingId, notes: notesDraft })
        })
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, notes: notesDraft } : b))
      )

      setEditingNotesId(null)
      showToast('Booking notes saved!', 'success')
    } catch (err) {
      showToast('Failed to save notes: ' + err.message, 'error')
    }
  }

  // -------------------------------------------------------------
  // Delete Booking
  // -------------------------------------------------------------
  const handleDeleteBooking = async (bookingId, clientName) => {
    if (!window.confirm(`Are you sure you want to delete the booking for "${clientName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) {
        await apiFetch(`/api/bookings?id=${bookingId}`, { method: 'DELETE' })
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
      showToast('Booking deleted successfully.', 'success')
    } catch (err) {
      showToast('Failed to delete booking: ' + err.message, 'error')
    }
  }

  // -------------------------------------------------------------
  // Filter & Search Logic
  // -------------------------------------------------------------
  const filteredBookings = bookings.filter((b) => {
    // Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) {
      return false
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const name = (b.name || '').toLowerCase()
      const email = (b.email || '').toLowerCase()
      const phone = (b.phone || '').toLowerCase()
      const type = (b.session_type || b.sessionType || '').toLowerCase()
      const loc = (b.location || '').toLowerCase()

      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        type.includes(q) ||
        loc.includes(q)
      )
    }

    return true
  })

  // Statistics
  const totalCount = bookings.length
  const pendingCount = bookings.filter((b) => b.status === 'pending').length
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length
  const completedCount = bookings.filter((b) => b.status === 'completed').length

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Archive className="w-3.5 h-3.5" />
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock3 className="w-3.5 h-3.5" />
            Pending Review
          </span>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* HEADER SECTION */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-[#D8BB7B]" />
            <h1 className="text-xl font-bold text-slate-900 font-sans tracking-wide">
              Client Photoshoot Bookings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming photoshoot reservations, manage booking statuses, and connect directly with clients.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STATS OVERVIEW CARDS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-mono uppercase text-slate-400">Total Requests</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">All-time website bookings</p>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm">
          <p className="text-[11px] font-mono uppercase text-amber-800">Pending Review</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</p>
          <p className="text-[11px] text-amber-700 mt-1">Awaiting confirmation</p>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <p className="text-[11px] font-mono uppercase text-emerald-800">Confirmed Sessions</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{confirmedCount}</p>
          <p className="text-[11px] text-emerald-700 mt-1">Scheduled photoshoots</p>
        </div>

        <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 shadow-sm">
          <p className="text-[11px] font-mono uppercase text-blue-800">Completed Sessions</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{completedCount}</p>
          <p className="text-[11px] text-blue-700 mt-1">Delivered &amp; archived</p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SEARCH & FILTERS BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, phone, location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#D8BB7B] focus:ring-1 focus:ring-[#D8BB7B]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All', count: totalCount },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'confirmed', label: 'Confirmed', count: confirmedCount },
            { id: 'completed', label: 'Completed', count: completedCount },
            { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#0d1b2a] text-[#D8BB7B] shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOOKINGS LIST */}
      {/* ------------------------------------------------------------- */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#D8BB7B] animate-spin mb-3">
            <RefreshCw className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Loading client reservations...
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Bookings Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery
              ? 'No reservations matched your search query.'
              : 'There are currently no bookings in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const cleanPhone = (b.phone || '').replace(/[^0-9+]/g, '')
            const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}`
            const sessionType = b.session_type || b.sessionType || 'Unspecified'

            return (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                {/* Header Row: Client Name, Badge, Date & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0d1b2a] text-[#D8BB7B] font-bold font-mono text-sm flex items-center justify-center shrink-0">
                      {b.name ? b.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900 font-sans">
                          {b.name}
                        </h3>
                        {getStatusBadge(b.status)}
                      </div>
                      <p className="text-xs font-mono text-[#D8BB7B] font-semibold mt-0.5">
                        {sessionType}
                      </p>
                    </div>
                  </div>

                  {/* Submission Timestamp */}
                  <div className="text-left md:text-right text-[11px] font-mono text-slate-400">
                    Booked on{' '}
                    {b.created_at
                      ? new Date(b.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Recently'}
                  </div>
                </div>

                {/* Info Grid: Date, Time, Location, Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-xs">
                  {/* Date */}
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#D8BB7B] shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Requested Date</p>
                      <p className="font-semibold text-slate-800">{b.date || 'To be scheduled'}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#D8BB7B] shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Preferred Time</p>
                      <p className="font-semibold text-slate-800">{b.time || 'Flexible'}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D8BB7B] shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Location</p>
                      <p className="font-semibold text-slate-800 truncate" title={b.location}>
                        {b.location || 'Studio / To be agreed'}
                      </p>
                    </div>
                  </div>

                  {/* Contact Links */}
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#D8BB7B] shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Contact</p>
                      <p className="font-semibold text-slate-800">{b.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Client Message / Notes */}
                {b.message && (
                  <div className="bg-amber-50/50 border-l-2 border-[#D8BB7B] p-3 rounded-r-xl text-xs">
                    <p className="text-[10px] font-mono text-amber-800 uppercase font-semibold mb-1">
                      Client Special Vision / Notes:
                    </p>
                    <p className="text-slate-700 italic">"{b.message}"</p>
                  </div>
                )}

                {/* Admin Notes Section */}
                <div className="pt-2">
                  {editingNotesId === b.id ? (
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <label className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                        Private Administrator Notes:
                      </label>
                      <textarea
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        placeholder="Add private studio notes (e.g. Deposit paid, lens requirements, client style preferences)..."
                        rows={2}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#D8BB7B]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveNotes(b.id)}
                          className="px-3 py-1.5 bg-[#0d1b2a] text-[#D8BB7B] rounded-lg text-xs font-semibold hover:bg-[#1b263b] transition cursor-pointer"
                        >
                          Save Notes
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-300 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {b.notes ? `Studio Note: ${b.notes}` : 'No private notes added yet.'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNotesId(b.id)
                          setNotesDraft(b.notes || '')
                        }}
                        className="text-[11px] font-mono text-[#0d1b2a] hover:text-[#D8BB7B] font-semibold underline transition cursor-pointer shrink-0 ml-2"
                      >
                        {b.notes ? 'Edit Notes' : '+ Add Note'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar: Communication & Status Changers */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  {/* Quick Connect Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-medium transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`mailto:${b.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-medium transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>

                  {/* Status Changers & Delete */}
                  <div className="flex items-center gap-2">
                    {b.status !== 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                        disabled={isUpdatingStatus === b.id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    )}

                    {b.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'completed')}
                        disabled={isUpdatingStatus === b.id}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        Complete
                      </button>
                    )}

                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                        disabled={isUpdatingStatus === b.id}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteBooking(b.id, b.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Booking Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
