import React, { useState, useEffect } from 'react'
import { Shield, KeyRound, Download, Upload, RotateCcw, Check, AlertTriangle, Lock, RefreshCw, Activity } from 'lucide-react'
import { useAdminAuth } from '../../../context/AdminAuthContext'
import { useCMS } from '../../../context/CMSContext'
import { apiFetch } from '../../../utils/apiClient'

export default function SecurityBackupEditor() {
  const { adminUser } = useAdminAuth()
  const { exportDataJSON, importDataJSON, resetToFactoryDefaults } = useCMS()

  const [auditLogs, setAuditLogs] = useState([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [logError, setLogError] = useState('')

  const fetchAuditLogs = async () => {
    try {
      setIsLoadingLogs(true)
      setLogError('')
      const res = await apiFetch('/api/admin/auth/audit-logs')
      if (res.ok) {
        const data = await res.json()
        setAuditLogs(data.logs || [])
      } else {
        setLogError('Unable to fetch security logs.')
      }
    } catch (e) {
      setLogError('Network error loading logs.')
    } finally {
      setIsLoadingLogs(false)
    }
  }

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        importDataJSON(content)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
          <Shield className="w-3.5 h-3.5 text-[#D8BB7B]" />
          <span>Security Architecture & Maintenance</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sovereign Admin & System Backups</h2>
        <p className="text-xs text-slate-500 mt-1">
          Production security configuration and database snapshots for the single authorized administrator.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sovereign Admin Security Status Card */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0d1b2a]" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Sovereign Administrator Authority
              </h3>
            </div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              Enforced Active
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                Single Authorized Admin Email
              </p>
              <p className="font-semibold text-slate-900 font-mono text-sm break-all">
                {adminUser?.email || 'mohommadhuafnan756@gmail.com'}
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Sole authoritative account configured on server. All unauthorized attempts are strictly rejected.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-mono uppercase text-slate-500">Authentication</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5">2-Step Email OTP</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-mono uppercase text-slate-500">OTP Expiration</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5">5 Minutes</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-mono uppercase text-slate-500">Max Attempts</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5">5 Attempts / Lockout</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-mono uppercase text-slate-500">Rate Limiting</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5">3 Requests / 15m</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-900 text-xs">
              <p className="font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Zero Trust Architecture</span>
              </p>
              <p className="mt-1 text-[11px] text-blue-800/80 leading-relaxed">
                Frontend role spoofing is impossible. Every admin API endpoint is verified by cryptographic JWT signature and server-side authorization middleware.
              </p>
            </div>
          </div>
        </div>

        {/* Database & Content Backups */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Download className="w-4 h-4 text-[#0d1b2a]" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Content Backups & Recovery
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Export a full JSON backup of all photography sessions, testimonials, hero slides, and gallery content to store locally or restore at any time.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={exportDataJSON}
              className="w-full py-3 px-4 bg-[#0d1b2a] hover:bg-[#1b263b] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-[#D8BB7B]" />
              <span>Export Full CMS Database JSON</span>
            </button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                id="cms-import-input"
                onChange={handleImportFile}
                className="hidden"
              />
              <label
                htmlFor="cms-import-input"
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Import / Restore From JSON File</span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  if (window.confirm("WARNING: Reset all website content back to initial default presets?")) {
                    resetToFactoryDefaults()
                  }
                }}
                className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Clean Factory Presets</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Audit Activity Feed */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0d1b2a]" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Security Audit Activity Feed
            </h3>
          </div>
          <button
            onClick={fetchAuditLogs}
            disabled={isLoadingLogs}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-mono transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {logError && (
          <p className="text-xs text-red-500">{logError}</p>
        )}

        {auditLogs.length === 0 && !isLoadingLogs ? (
          <p className="text-xs text-slate-400 py-4 text-center">No security incidents recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Event</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                      {log.event}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        log.status === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'blocked'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {log.email || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
