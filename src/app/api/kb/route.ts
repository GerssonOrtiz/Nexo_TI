// src/app/api/kb/route.ts
// API de Base de Conocimiento: GET (listar) y POST (crear)

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { z } from 'zod'

const CreateArticleSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(20),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
})

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const where = user.role === 'ADMIN_TI' ? {} : { isPublished: true }

    const articles = await prisma.knowledgeArticle.findMany({
      where,
      include: {
        author: { select: { fullName: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: articles })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN_TI') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = CreateArticleSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = parsed.data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const article = await prisma.knowledgeArticle.create({
      data: {
        ...parsed.data,
        slug,
        authorId: user.id,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'KB_ARTICLE',
        entityId: article.id,
        userId: user.id,
        metadata: { title: article.title },
      },
    })

    return NextResponse.json({ success: true, data: article }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
