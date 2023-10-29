import type * as z from 'zod';
import { type register, type login, profile } from './helpers/validators';

export type LoginInput = z.infer<typeof login>;

export type RegisterInput = z.infer<ReturnType<typeof register>>;

export type ProfileInput = z.infer<ReturnType<typeof profile>>;
