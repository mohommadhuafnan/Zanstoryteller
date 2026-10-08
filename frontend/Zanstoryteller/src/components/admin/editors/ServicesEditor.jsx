import React, { useState } from 'react'
import { Sparkles, Plus, Trash2, X, Check } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function ServicesEditor() {
  const { data, updateService, addService, deleteService } = useCMS()
  const services = data.servicesData || []
  const [activeTab, setActiveTab] = useState(0)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newServiceData, setNewServiceData] = useState({
    title: '',
    number: '',
    tagline: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85',
    deliverables: ['Full Day Master Coverage', 'Curated High-Res Digital Gallery', 'Private Online Portal']
  })

  // Safe index
  const safeTab = Math.min(activeTab, Math.max(0, services.length - 1))
  const currentService = services[safeTab] || services[0]

  const handleFieldChange = (field, value) => {
    updateService(safeTab, { [field]: value })
  }

  const handleDeliverableChange = (idx, value) => {
    const deliverables = [...(currentService.deliverables || [])]
    deliverables[idx] = value
    handleFieldChange('deliverables', deliverables)
  }

  const handleAddDeliverable = () => {
    const deliverables = [...(currentService.deliverables || []), '']
    handleFieldChange('deliverables', deliverables)
  }

  const handleDeleteDeliverable = (idx) => {
    const deliverables = (currentService.deliverables || []).filter((_, i) => i !== idx)
    handleFieldChange('deliverables', deliverables)
  }

  const handleOpenAddModal = () => {
    const nextNum = String(services.length + 1).padStart(2, '0')
    setNewServiceData({
      title: '',
      number: nextNum,
      tagline: 'Exclusive bespoke visual coverage',
      description: 'Documenting moments with artistic intention and timeless poise.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85',
      deliverables: ['Full Day Master Coverage', 'Curated High-Res Digital Gallery', 'Private Online Portal']
    })
    setIsAddModalOpen(true)
  }

  const handleCreateService = (e) => {
    e.preventDefault()
    if (!newServiceData.title.trim()) {
      alert("Please provide a service title")
      return
    }
    addService({
      ...newServiceData,
      title: newServiceData.title.toUpperCase().trim()
    })
    setIsAddModalOpen(false)
    setActiveTab(services.length) // activate new service
  }

  const handleDeleteCurrentService = () => {
    if (services.length <= 1) {
      alert("At least one service offering must remain.")
      return
    }
    if (window.confirm(`Are you sure you want to delete service "${currentService.title}"? This cannot be undone.`)) {
      deleteService(safeTab)
      setActiveTab(Math.max(0, safeTab - 1))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>03 / Photography Offerings</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Services & Packages</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage titles, deliverables, descriptions, and feature cover photos for your {services.length} offerings.
          </p>
        </div>

        {/* Add New Service Button */}
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white rounded-xl text-xs font-semibold tracking-wider uppercase shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add New Service / Package</span>
        </button>
      </div>

      {/* Service Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {services.map((srv, idx) => (
          <button
            key={srv.id || idx}
            onClick={() => setActiveTab(idx)}
            className={`px-5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2.5 ${
              safeTab === idx
                ? 'bg-[#0d1b2a] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="font-mono text-[#D8BB7B]">{srv.number}</span>
            <span>{srv.title}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-300 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          title="Add another service"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Active Service Editor Card */}
      {currentService && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-semibold">
                SERVICE {currentService.number}
              </span>
              <h3 className="font-bold text-slate-900 text-lg">
                {currentService.title}
              </h3>
            </div>

            {services.length > 1 && (
              <button
                type="button"
                onClick={handleDeleteCurrentService}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete This Package</span>
              </button>
            )}
          </div>

          <ImageUploadField
            label="Service Feature Photo"
            currentImage={currentService.image}
            onImageChange={(img) => handleFieldChange('image', img)}
            onImageDelete={() => handleFieldChange('image', '')}
            aspectHint="High-end editorial photo (1400×900 px • WebP Auto-Converted)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                Service Title
              </label>
              <input
                type="text"
                value={currentService.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none font-semibold uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                Numbering Code
              </label>
              <input
                type="text"
                value={currentService.number || ''}
                onChange={(e) => handleFieldChange('number', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={currentService.tagline || ''}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                Full Description
              </label>
              <textarea
                rows={3}
                value={currentService.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none resize-none"
              />
            </div>
          </div>

          {/* Deliverables Bullet List */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Included Deliverables & Features
              </label>
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#0d1b2a] bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(currentService.deliverables || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8BB7B] shrink-0 ml-1" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleDeliverableChange(idx, e.target.value)}
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                    placeholder="e.g. Handcrafted Fine Art Album"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteDeliverable(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Service / Package */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D8BB7B]" />
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
                  Add New Photography Package
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    value={newServiceData.number}
                    onChange={(e) => setNewServiceData({ ...newServiceData, number: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Service Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MATERNITY & FAMILY"
                    value={newServiceData.title}
                    onChange={(e) => setNewServiceData({ ...newServiceData, title: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] font-bold uppercase"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cherished family milestones preserved forever"
                  value={newServiceData.tagline}
                  onChange={(e) => setNewServiceData({ ...newServiceData, tagline: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newServiceData.description}
                  onChange={(e) => setNewServiceData({ ...newServiceData, description: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] resize-none"
                />
              </div>

              <ImageUploadField
                label="Feature Image (Auto-Converted to WebP)"
                currentImage={newServiceData.image}
                onImageChange={(img) => setNewServiceData({ ...newServiceData, image: img })}
                onImageDelete={() => setNewServiceData({ ...newServiceData, image: '' })}
                aspectHint="1400×900 px"
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#0d1b2a] text-white rounded-xl shadow-md hover:bg-[#1b263b] transition flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-[#D8BB7B]" />
                  <span>Create Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
