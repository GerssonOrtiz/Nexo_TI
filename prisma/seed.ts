// prisma/seed.ts
// Seeder inicial con cuenta admin 'Venllas'

import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'Venllas'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin1234!'

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: {
        fullName: 'Administrador Principal',
        username: adminUsername,
        passwordHash,
        role: Role.ADMIN_TI,
        isActive: true,
      },
    })
    console.log(`✅ Admin user '${adminUsername}' created successfully.`)
  } else {
    console.log(`ℹ️  Admin user '${adminUsername}' already exists. Skipping.`)
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
