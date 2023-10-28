import { db } from '@/server/db';
import { faker } from '@faker-js/faker';
import { type Prisma } from '@prisma/client';
import { slugify } from '@/features/shared/helpers/slugify';
import { aesEncrypt } from '@/utils/encrypt';

async function main() {
  // Create Admin
  const admin = await db.user.upsert({
    where: { email: 'jittanan.jck@gmail.com' },
    update: {},
    create: {
      email: 'jittanan.jck@gmail.com',
      name: 'Admin',
      password: 'Milopbo@089',
      role: 'ADMIN',
      image: faker.internet.avatar(),
      tel: faker.phone.number(),
      citizenId: faker.helpers.fromRegExp(
        '[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]',
      ),
    },
  });

  // Create Users
  const numOfUsers = 10;
  const userIds: number[] = [admin.id];

  for (let i = 0; i < numOfUsers; i++) {
    const createUserInput: Prisma.UserCreateInput = {
      name: faker.internet.displayName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      image: faker.internet.avatar(),
      role: faker.helpers.arrayElement(['ADMIN', 'MANAGER', 'MEMBER']),
      tel: faker.phone.number(),
      citizenId: faker.helpers.fromRegExp(
        '[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]',
      ),
    };
    const user = await db.user.upsert({
      where: { email: createUserInput.email },
      update: {},
      create: createUserInput,
    });

    userIds.push(user.id);
  }

  // Create Item
  const numOfItems = 100;

  for (let i = 0; i < numOfItems; i++) {
    const title = faker.commerce.productName();
    const createItmesInput: Prisma.ItemCreateInput = {
      title,
      slug: slugify(title),
      excerpt: faker.lorem.paragraph(),
      content: faker.commerce.productName(),
      image: faker.image.url(),
      price: +faker.commerce.price({ min: 30, max: 1000 }),
      user: { connect: { id: faker.helpers.arrayElement(userIds) } },
      sold: faker.number.int({ min: 0, max: 999 }),
      viewer: faker.number.int({ min: 0, max: 999 }),
    };

    await db.item.upsert({
      where: {
        slug: createItmesInput.slug,
      },
      update: {},
      create: createItmesInput,
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    await db.$disconnect();
    process.exit(1);
  });
