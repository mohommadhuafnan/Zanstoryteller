import React, { useState } from 'react'
import { Shield, KeyRound, Download, Upload, RotateCcw, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { useAdminAuth } from '../../../context/AdminAuthContext'
import { useCMS } from '../../../context/CMSContext'

export default function SecurityBackupEditor() {
  const { credentials, updateCredentials } = useAdminAuth()
  const { exportDataJSON, importDataJSON, resetToFactoryDefaults } = useCMS()

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [passMessage, setPassMessage] = useState(null)

  // Profile state
  const [adminUsername, setAdminUsername] = useState(credentials.username || 'admin')
  const [adminEmail, setAdminEmail] = useState(credentials.email || 'fowzan80@gmail.com')
  const [profileMessage, setProfileMessage] = useState(null)

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    setPassMessage(null)

    if (currentPassword !== credentials.password) {
      setPassMessage({ type: 'error', text: 'Current password does not match.' })
      return
    }

    if (newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'New password must be at least 6 characters.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    updateCredentials({ password: newPassword })
    setPassMessage({ type: 'success', text: 'Password successfully changed!' })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    updateCredentials({
      username: adminUsername.trim(),
      email: adminEmail.trim()
    })
    setProfileMessage('Admin credentials updated!')
    setTimeout(() => setProfileMessage(null), 3000)
  }

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
          <span>Security & System Maintenance</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Admin Security & Data Backups</h2>
        <p className="text-xs text-slate-500 mt-1">
          Update the portal login credentials and manage JSON database backups for total independence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Change Admin Password */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-[#0d1b2a]" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Change Admin Passcode
            </h3>
          </div>

          {passMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              passMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {passMessage.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              <span>{passMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Current Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#0d1b2a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                New Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#0d1b2a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Confirm New Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#0d1b2a]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPass ? 'Hide passwords' : 'Show passwords'}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Change Username & Email */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-[#0d1b2a]" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Admin Login Identity
            </h3>
          </div>

          {profileMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{profileMessage}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#0d1b2a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Admin Notification Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#0d1b2a]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                Save Identity
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Backup & Restore Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
          Database Backup & Snapshot Archives
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          You can download a complete backup of all custom text, newly uploaded images, and configuration as a single `.json` file anytime. If you migrate or clear browser history, simply import your file back to restore 100% of your website content in seconds.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Export JSON */}
          <button
            type="button"
            onClick={exportDataJSON}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0d1b2a] hover:bg-[#1b263b] text-white rounded-xl text-xs font-semibold tracking-wide shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D8BB7B]" />
            <span>Export Website Data JSON</span>
          </button>

          {/* Import JSON */}
          <label className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold tracking-wide border border-slate-300 transition cursor-pointer">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {/* Factory Reset */}
          <button
            type="button"
            onClick={resetToFactoryDefaults}
            className="inline-flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold tracking-wide border border-red-200 transition ml-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset To Original Defaults</span>
          </button>
        </div>
      </div>
    </div>
  )
}
