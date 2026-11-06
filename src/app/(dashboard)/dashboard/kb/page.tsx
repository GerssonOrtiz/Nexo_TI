// src/app/(dashboard)/kb/page.tsx
// Catálogo de artículos de la Base de Conocimiento — Server Component
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookOpen, Search, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function KBPage() {
  const user = await requireAuth()

  const where = user.role === 'ADMIN_TI' ? {} : { isPublished: true }

  const articles = await prisma.knowledgeArticle.findMany({
    where,
    include: {
      author: { select: { fullName: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Group by category
  const categories = [...new Set(articles.map((a) => a.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-neon-blue" />
          Base de Conocimiento
        </h1>
        <p className="text-text-secondary text-sm mt-1">{articles.length} artículos</p>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat} className="inline-flex items-center gap-1 rounded-lg bg-neon-blue/10 border border-neon-blue/20 px-3 py-1 text-xs text-neon-blue font-medium">
              <Tag className="h-3 w-3" />
              {cat}
              <span className="ml-1 text-text-secondary">{articles.filter((a) => a.category === cat).length}</span>
            </span>
          ))}
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/dashboard/kb/${article.slug}`}
            className="glass-card rounded-2xl p-5 transition-all hover:scale-[1.01] hover:border-neon-blue/20 group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-neon-blue transition-colors line-clamp-2">
                {article.title}
              </h3>
              {!article.isPublished && (
                <span className="shrink-0 ml-2 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 border border-amber-500/20">
                  Borrador
                </span>
              )}
            </div>

            <p className="text-xs text-text-secondary line-clamp-3 mb-3">
              {article.content.substring(0, 150)}...
            </p>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-text-secondary pt-2 border-t border-white/5">
              <span>{article.author.fullName}</span>
              <div className="flex items-center gap-2">
                <span>{article.viewCount} vistas</span>
                <span>{formatDate(article.updatedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Search className="h-8 w-8 text-text-secondary mx-auto mb-3" />
          <p className="text-sm text-text-secondary">No hay artículos publicados aún</p>
        </div>
      )}
    </div>
  )
}
