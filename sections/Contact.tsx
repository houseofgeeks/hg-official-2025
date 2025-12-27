'use client'
import React, { useState } from 'react'

type ContactItem = {
  id: string
  label: string
  value: string
  href: string
}

const CONTACTS: ContactItem[] = [
  { id: 'instagram', label: 'Instagram', value: '@hg.iiitranchi', href: 'http://instagram.com/hg.iiitranchi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D' },
  { id: 'linkedin', label: 'LinkedIn', value: 'HG IIIT Ranchi', href: 'https://www.linkedin.com/company/hgiiitranchi/' },
  // { id: 'github', label: 'GitHub', value: 'houseofgeeks', href: 'https://github.com/houseofgeeks' },
  { id: 'email', label: 'Email', value: 'houseofgeeks@iiitranchi.ac.in', href: 'mailto:houseofgeeks@iiitranchi.ac.in' },
  // { id: 'phone', label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
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
    case 'github':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-themecolor">
          <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.28 3.438 9.75 8.205 11.325.6.112.82-.263.82-.583 0-.288-.01-1.05-.015-2.06-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.335-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.525.116-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0 1 12 6.845c1.02.004 2.045.138 3.003.405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.65.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.372.815 1.102.815 2.222 0 1.606-.014 2.9-.014 3.293 0 .322.218.698.825.58C20.565 22.25 24 17.78 24 12.5 24 5.87 18.63.5 12 .5z" stroke="currentColor" strokeWidth="0" fill="currentColor" />
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
    <section className="py-12 flex flex-col items-center gap-8">
      <div className="max-w-6xl w-full px-4">
        <h2 className="text-4xl font-montserrat font-bold text-white">Contact</h2>
        <p className="text-muted-foreground mt-2 mb-6">Reach out to us — follow on social, drop an email or give us a call. We'll get back to you soon.</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CONTACTS.map((c) => (
            <div key={c.id} className="contact-card recent-donor-card flex flex-col gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(240,66,124,0.08)] text-themecolor">
                  <Icon name={c.id} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground uppercase font-semibold">{c.label}</div>
                  <div className="text-white font-semibold truncate max-w-[220px]" title={c.value} style={{ wordBreak: 'normal', overflowWrap: 'normal' }}>{c.value}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4">
                {c.href.startsWith('http') ? (
                  <>
                    <a href={c.href} target="_blank" rel="noreferrer" className="text-sm link-underline text-white/80" title={`Visit ${c.label}`}>Visit</a>
                    <button onClick={() => handleCopy(c.href, `${c.id}-copy`)} className="text-sm text-white/80 hover:text-white" aria-label={`Copy ${c.label} link`}>Copy</button>
                  </>
                ) : (
                  <>
                    <a href={c.href} className="text-sm link-underline text-white/80" title={`Open ${c.label}`}>Open</a>
                    <button onClick={() => handleCopy(c.value, `${c.id}-copy`)} className="text-sm text-white/80 hover:text-white">Copy</button>
                  </>
                )}
              </div>

              {copied === `${c.id}-copy` && <div className="text-sm text-themecolor mt-2">Copied!</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact