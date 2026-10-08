import React, { useState } from 'react'
import { Sparkles, Plus, Trash2, Heart } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function SocialGalleryEditor() {
  const { data, updateSocialPost, addSocialPost, deleteSocialPost } = useCMS()
  const posts = data.socialPosts || []
  const [isAdding, setIsAdding] = useState(false)
  const [newPost, setNewPost] = useState({
    caption: '',
    likes: '450',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  })

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newPost.image) return
    addSocialPost(newPost)
    setIsAdding(false)
    setNewPost({
      caption: '',
      likes: '450',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>09 / Social Feed</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Instagram & Social Gallery</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the social proof photo feed grid and like metrics ({posts.length} posts).
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-medium uppercase tracking-wider rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add Social Post</span>
        </button>
      </div>

      {/* Grid of Social Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <div
            key={post.id || idx}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-mono text-slate-500">
                Post #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this social post?")) {
                    deleteSocialPost(idx)
                  }
                }}
                className="text-slate-400 hover:text-red-600 transition p-1"
                title="Delete social post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <ImageUploadField
              label="Post Photo"
              currentImage={post.image}
              onImageChange={(img) => updateSocialPost(idx, { image: img })}
              onImageDelete={() => updateSocialPost(idx, { image: '' })}
              aspectHint="Square or vertical (800×800 px)"
            />

            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={post.caption || ''}
                  onChange={(e) => updateSocialPost(idx, { caption: e.target.value })}
                  placeholder="Caption text"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  Likes Counter
                </label>
                <input
                  type="text"
                  value={post.likes || ''}
                  onChange={(e) => updateSocialPost(idx, { likes: e.target.value })}
                  placeholder="e.g. 520"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-1">
              Add Social Post
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Add a photo to the social grid.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <ImageUploadField
                label="Photo"
                currentImage={newPost.image}
                onImageChange={(img) => setNewPost({ ...newPost, image: img })}
                onImageDelete={() => setNewPost({ ...newPost, image: '' })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={newPost.caption}
                  onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                  placeholder="e.g. Sunset in Bentota"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Likes Count
                </label>
                <input
                  type="text"
                  value={newPost.likes}
                  onChange={(e) => setNewPost({ ...newPost, likes: e.target.value })}
                  placeholder="e.g. 640"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#0d1b2a] text-white rounded-xl shadow-md hover:bg-[#1b263b] transition"
                >
                  Add Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
