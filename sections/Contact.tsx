'use client'
import React, { useState } from 'react'

type ContactItem = {
  id: string
  label: string
  value: string
  href: string
}

const CONTACTS: ContactItem[] = [
  { id: 'instagram', label: 'Instagram', value: '@houseofgeeks', href: 'https://instagram.com/houseofgeeks' },
  { id: 'linkedin', label: 'LinkedIn', value: 'House of Geeks', href: 'https://linkedin.com/company/house-of-geeks' },
  { id: 'email', label: 'Email', value: 'hello@houseofgeeks.com', href: 'mailto:hello@houseofgeeks.com' },
  { id: 'phone', label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
]

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case 'instagram':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-themecolor">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-themecolor">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 11v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8.5 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
          <path d="M12.5 11v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12.5 8.5c1 0 2 .5 2 2.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'email':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-themecolor">
          <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4 7.5l8 6 8-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'phone':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-themecolor">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.08 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72c.12 1.38.44 2.72.94 4a2 2 0 0 1-.45 2.11L9.91 11.09a15.05 15.05 0 0 0 6 6l1.16-1.16a2 2 0 0 1 2.11-.45c1.26.5 2.6.82 4 .94A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}

const Contact = () => {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 1600)
    } catch (err) {
      console.error('copy failed', err)
    }
  }

  return (
    <section className="py-16 flex flex-col items-center gap-8">
      <div className="max-w-6xl w-full px-4">
        <h2 className="text-4xl font-montserrat font-bold text-white">Contact</h2>
        <p className="text-muted-foreground mt-2 mb-6">Reach out to us — follow on social, drop an email or give us a call. We'll get back to you soon.</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CONTACTS.map((c) => (
            <div key={c.id} className="contact-card recent-donor-card flex flex-col gap-3">
              <div className="flex items-center justify-between">
<div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(240,66,124,0.08)] text-themecolor">
                    <Icon name={c.id} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground uppercase font-semibold">{c.label}</div>
                    <div className="text-white font-semibold min-w-0" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>{c.value}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {c.href.startsWith('http') ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="text-sm link-underline text-white/80">Visit</a>
                  ) : (
                    <div className="flex items-center gap-3">
                      <a href={c.href} className="text-sm link-underline text-white/80">Open</a>
                      <button onClick={() => handleCopy(c.value, c.id)} className="text-sm text-white/80 hover:text-white">Copy</button>
                    </div>
                  )}
                </div>
              </div>
              {copied === c.id && <div className="text-sm text-themecolor mt-1">Copied!</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact