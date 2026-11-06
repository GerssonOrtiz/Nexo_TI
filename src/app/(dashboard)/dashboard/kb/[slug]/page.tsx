// src/app/(dashboard)/kb/[slug]/page.tsx
// Visor de artículo KB con renderizado de Markdown sanitizado — Server Component
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, BookOpen, Eye, User, Clock, Tag } from 'lucide-react'
import Link from 'next/link'

// Basic Markdown-to-HTML sanitizer (no external deps — safe subset)
function renderMarkdown(content: string): string {
  return content
    // Escape HTML tags (XSS protection)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-text-primary mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-text-primary mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-text-primary mt-6 mb-3">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="bg-bg-elevated px-1.5 py-0.5 rounded text-xs text-neon-blue font-mono">$1</code>')
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.slice(3, -3).replace(/^\w+\n/, '')
      return `<pre class="bg-bg-elevated rounded-xl p-4 my-3 overflow-x-auto"><code class="text-xs font-mono text-text-secondary">${code}</code></pre>`
    })
    // Bullet lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-text-secondary">• $1</li>')
    // Paragraphs (lines not already converted)
    .replace(/^(?!<[hlipc]|<\/)(.*\S.*)$/gm, '<p class="text-sm text-text-secondary mb-2">$1</p>')
}

export default async function KBArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const user = await requireAuth()
  const { slug } = await params

  const article = await prisma.knowledgeArticle.findUnique({
    where: { slug },
    include: {
      author: { select: { fullName: true } },
    },
  })

  if (!article) notFound()

  // Non-admins can only see published
  if (!article.isPublished && user.role !== 'ADMIN_TI') notFound()

  // Increment view count (fire and forget)
  prisma.knowledgeArticle.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {})

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Nav */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/kb" className="btn-glass-secondary p-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{article.title}</h1>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.author.fullName}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(article.updatedAt)}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.viewCount} vistas</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-neon-blue/10 px-2 py-0.5 text-[10px] text-neon-blue">
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="glass-card rounded-2xl p-8">
        <div
          className="prose-cyber"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />
      </div>
    </div>
  )
}
