import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Clearing existing data...')
  await prisma.shortlistItem.deleteMany()
  await prisma.message.deleteMany()
  await prisma.session.deleteMany()
  await prisma.car.deleteMany()

  console.log('🚗  Seeding cars...')

  // TODO: add 50 cars here — see implementationplan.md §7 for the full list
  // Each car must have:
  //   make, model, variant, bodyType, fuelType, transmission,
  //   priceMinLakh, priceMaxLakh, mileageKmpl?, engineCc?,
  //   powerBhp, torqueNm, seating, safetyStars?, bootLitres?,
  //   groundClearanceMm?, pros (JSON string), cons (JSON string), bestFor

  // Example entry (remove when real data is added):
  await prisma.car.createMany({
    data: [
      {
        make: 'Maruti Suzuki',
        model: 'Swift',
        variant: 'ZXi+',
        bodyType: 'hatchback',
        fuelType: 'petrol',
        transmission: 'manual',
        priceMinLakh: 6.49,
        priceMaxLakh: 9.64,
        mileageKmpl: 23.2,
        engineCc: 1197,
        powerBhp: 89.7,
        torqueNm: 113,
        seating: 5,
        safetyStars: null,
        bootLitres: 268,
        groundClearanceMm: 163,
        pros: JSON.stringify(['Best-in-class mileage', 'Peppy engine', 'Excellent resale value']),
        cons: JSON.stringify(['No NCAP rating', 'Rear legroom tight', 'Basic infotainment']),
        bestFor: 'City commute, first-time buyers, budget-conscious buyers',
      },
    ],
  })

  const count = await prisma.car.count()
  console.log(`✅  Seeded ${count} car(s). Done.`)
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
