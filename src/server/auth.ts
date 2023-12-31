import { type GetServerSidePropsContext } from 'next';
import bcrypt from 'bcryptjs';
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/server/db';
import { type Role } from '@prisma/client';
import { aesDecrypt } from '@/utils/encrypt';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      tel: string;
      citizenId: string;
      address: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
    tel: string;
    citizenId: string;
    address: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    tel: string;
  }
}

function isUpdateSessionData(
  session: unknown,
): session is Record<
  'name' | 'email' | 'image' | 'tel' | 'address',
  string | undefined
> {
  if (!session) return false;
  if (typeof session !== 'object') return false;

  return true;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user, session, trigger }) {
      if (trigger === 'update' && isUpdateSessionData(session)) {
        if (session.image) token.picture = session.image;
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.tel) token.tel = session.tel;
        if (session.address) token.address = session.address;
      }

      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.picture = user.image ? aesDecrypt(user.image) : undefined;
        token.tel = user.tel;
        token.address = user.address;
      }

      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
          name: token.name,
          email: token.email,
          image: token.picture,
          tel: token.tel,
          address: token.address,
        },
      };
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) return null;
        if (!credentials?.password) return null;

        if (
          !(await bcrypt.compare(
            aesDecrypt(credentials.password),
            user.password,
          ))
        ) {
          return null;
        }

        return { ...user, id: user.id.toString() };
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
