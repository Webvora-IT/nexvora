'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string, publicId?: string) => void
  folder?: string
  label?: string
  aspectRatio?: 'square' | 'landscape' | 'portrait'
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label = 'Upload Image',
  aspectRatio = 'landscape',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      onChange(data.url, data.publicId)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      {label && <label className="block text-sm text-gray-400 mb-2">{label}</label>}

      {value ? (
        <div className={`relative ${aspectClasses[aspectRatio]} rounded-xl overflow-hidden border border-white/10`}>
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => inputRef.current?.click()}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
            >
              <Upload size={16} />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange('')}
              className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500"
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          whileHover={{ borderColor: 'rgba(99,102,241,0.5)' }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`${aspectClasses[aspectRatio]} border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-colors`}
        >
          {uploading ? (
            <Loader2 size={28} className="text-primary-400 animate-spin" />
          ) : (
            <>
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <ImageIcon size={22} className="text-primary-400" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-300 font-medium">Drop image or click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}
