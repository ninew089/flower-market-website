import bcrypt from 'bcryptjs';
import * as validators from '@/features/auth/helpers/validators';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { aesDecrypt, aesEncrypt } from '@/utils/encrypt';
import { TRPCError } from '@trpc/server';

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(validators.register(true))
    .mutation(async ({ input, ctx }) => {
      console.log(aesDecrypt(input.password));
      const hashedPassword = await bcrypt.hash(aesDecrypt(input.password), 12);
      const citizenId = await aesDecrypt(input.citizenId);
      const availableInfo = await ctx.db.user.findMany({
        where: {
          OR: [
            {
              email: input.email,
            },
            {
              citizenId: citizenId,
            },
          ],
        },
      });

      if (availableInfo?.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This email or citizen ID already registered',
        });
      }

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
          address: true,
        },
      });

      return user;
    }),
  update: protectedProcedure
    .input(validators.profile(true))
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
            password: password
              ? await bcrypt.hash(aesDecrypt(password), 12)
              : undefined,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            address: true,
          },
        });
        return profile;
      } catch (error) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
    }),
});
