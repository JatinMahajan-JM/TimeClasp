import GoogleProvider from 'next-auth/providers/google';

import UserModel from '@/models/userModel';
import { connectToDatabase } from '@/dbConfig/dbConfig';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions =
{
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session }: { session: any }) {
            // store the user id from MongoDB to session
            ////
            const sessionUser = await UserModel.findOne({ email: session.user?.email });
            session.user.id = sessionUser._id.toString();

            return session;
        },
        async signIn({ account, profile, user, credentials }) {
            try {
                await connectToDatabase();

                // check if user already exists
                const userExists = await UserModel.findOne({ email: profile?.email });

                // if not, create a new document and save user in MongoDB
                if (!userExists) {
                    await UserModel.create({
                        email: profile?.email,
                        username: profile?.name?.replace(" ", "").toLowerCase(),
                        // image: profile.picture,
                    });
                }

                return true
            } catch (error: any) {
                //
                return false
            }
        },
    }
}
