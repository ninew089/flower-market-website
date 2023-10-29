import bcrypt from 'bcryptjs';
import { profile, register } from '@/features/auth/helpers/validators';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { aesDecrypt, aesEncrypt } from '@/utils/encrypt';
import { TRPCError } from '@trpc/server';

export const authRouter = createTRPCRouter({
  register: publicProcedure.input(register).mutation(async ({ input, ctx }) => {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    const citizenId = await aesDecrypt(input.citizenId, 12);
    const user = await ctx.db.user.create({
      data: {
        ...input,
        citizenId: citizenId,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        tel: true,
      },
    });

    return user;
  }),
  update: protectedProcedure
    .input(profile)
    .mutation(async ({ input: { password, image, ...data }, ctx }) => {
      const id = +ctx.session.user.id;
      try {
        const profile = await ctx.db.user.update({
          where: {
            id,
          },
          data: {
            ...data,
            image: image ? await aesEncrypt(image) : undefined,
            password: password ? await bcrypt.hash(password, 12) : undefined,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        });
      } catch (error) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return profile;
    }),
});
