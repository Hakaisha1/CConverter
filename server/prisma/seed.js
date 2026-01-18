import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function main() {
  console.log('Starting seeding...');

  const currencyPairs = [
    { base: 'USD', target: 'IDR' },
    { base: 'USD', target: 'EUR' },
    { base: 'USD', target: 'GBP' },
    { base: 'USD', target: 'JPY' },
  ];

  const baseRates = {
    IDR: 16000,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
  };

  // Generate last 7 days
  for (let day = 6; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    const dateOnly = new Date(date.toISOString().split('T')[0]);

    for (const pair of currencyPairs) {
      // Random variance ±2% for realistic data
      const variance = 1 + (Math.random() - 0.5) * 0.04;
      const rate = baseRates[pair.target] * variance;

      await prisma.exchangeRate.create({
        data: {
          baseCurrency: pair.base,
          targetCurrency: pair.target,
          rate: rate,
          rateDate: dateOnly,
        },
      });

      console.log(`Seeded ${pair.base}/${pair.target} for ${dateOnly.toISOString().split('T')[0]}: ${rate.toFixed(6)}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
