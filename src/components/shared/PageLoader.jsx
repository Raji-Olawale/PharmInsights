import { LoaderCircle } from 'lucide-react'

export default function PageLoader({ label = 'Loading PharmaInsight…' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f6f9fc] text-sm text-[#6f8092]" role="status" aria-live="polite">
      <LoaderCircle className="size-7 animate-spin text-[#079b59]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
