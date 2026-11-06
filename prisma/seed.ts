// prisma/seed.ts
// Seeder inicial con cuenta admin 'Venllas' tanto en Prisma como en Supabase Auth

import { PrismaClient, Role } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'Venllas'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin1234!'
  const adminEmail = `${adminUsername.toLowerCase()}@nexoti.local`

  let existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    existingAdmin = await prisma.user.create({
      data: {
        fullName: 'Administrador Principal',
        username: adminUsername,
        passwordHash,
        role: Role.ADMIN_TI,
        isActive: true,
      },
    })
    console.log(`✅ Admin user '${adminUsername}' created in database.`)
  } else {
    console.log(`ℹ️  Admin user '${adminUsername}' already exists in database.`)
  }

  // Sincronizar o crear usuario en Supabase Auth
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: userList } = await supabase.auth.admin.listUsers()
    const supabaseUser = userList?.users?.find(
      (u) => u.id === existingAdmin!.id || u.email === adminEmail
    )

    if (!supabaseUser) {
      await supabase.auth.admin.createUser({
        id: existingAdmin.id,
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { username: adminUsername, fullName: existingAdmin.fullName },
      })
      console.log(`✅ Admin user '${adminUsername}' synced with Supabase Auth (${adminEmail}).`)
    } else {
      console.log(`ℹ️  Admin user already present in Supabase Auth.`)
    }
  }

  // Seed de pipeline de reparación por defecto
  const defaultPipeline = await prisma.repairPipeline.findFirst({
    where: { name: 'Pipeline Estándar de Reparación' },
  })

  if (!defaultPipeline) {
    await prisma.repairPipeline.create({
      data: {
        name: 'Pipeline Estándar de Reparación',
        description: 'Flujo estándar de diagnóstico y reparación de tarjetas electrónicas.',
        steps: {
          create: [
            { stepOrder: 1, title: 'Recepción e Inspección Visual', description: 'Inspección visual de la tarjeta. Identificar daños evidentes, componentes quemados o corrosión.', isMandatory: true },
            { stepOrder: 2, title: 'Diagnóstico Eléctrico', description: 'Mediciones de voltajes, resistencias y continuidad. Identificar componentes defectuosos.', isMandatory: true },
            { stepOrder: 3, title: 'Reparación / Reemplazo de Componentes', description: 'Desoldar y reemplazar componentes defectuosos según BOM aprobado.', isMandatory: true },
            { stepOrder: 4, title: 'Pruebas Funcionales', description: 'Verificar funcionamiento correcto de la tarjeta reparada bajo condiciones de operación.', isMandatory: true },
            { stepOrder: 5, title: 'Documentación y Entrega', description: 'Documentar reparación realizada, generar reporte técnico y preparar entrega.', isMandatory: true },
          ],
        },
      },
    })
    console.log('✅ Default repair pipeline created.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
