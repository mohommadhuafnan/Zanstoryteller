import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { InstagramIcon } from './Icons'
import { socialPosts as defaultSocialPosts } from '../data/photographyData'
import { getResponsiveUnsplash } from '../utils/imageOptimizer'
import { useCMS } from '../context/CMSContext'

export default function SocialGallery() {
  const { data } = useCMS()
  const socialPosts = data?.socialPosts || defaultSocialPosts
  return (
    <section className="relative z-10 w-full bg-[#FAFAFA] text-[#111111] py-24 sm:py-32 px-6 sm:px-12 md:px-20 border-t border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#EAEAEA]"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <InstagramIcon className="w-4 h-4 text-[#111111]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#666666] uppercase">
                Social Journal
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#111111] uppercase">
              Follow The Stories
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span className="text-sm text-[#777777] font-light">
              More moments, behind the scenes & recent work.
            </span>
            <a
              href="https://www.instagram.com/zan_storyteller?stkn=MWg4ejhjam56YjJhZg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono tracking-widest uppercase px-4 py-2 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-all rounded-full"
            >
              @zanstoryteller
            </a>
          </div>
        </motion.div>

        {/* 6-Photo Clean Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {socialPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square overflow-hidden rounded-sm bg-[#EEEEEE]"
            >
              <img
                {...getResponsiveUnsplash(post.image, 400, '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px')}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter saturate-[0.95]"
                loading="lazy"
                decoding="async"
              />

              {/* Hover Dark Overlay with Likes & Caption */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <InstagramIcon className="w-3.5 h-3.5 opacity-80" />
                </div>
                <div>
                  <p className="text-[11px] font-light line-clamp-2 mb-2 opacity-90">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/70">
                    <Heart className="w-3 h-3 fill-current text-white/80" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
