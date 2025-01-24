import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/db"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }