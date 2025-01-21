import passport from "passport"
import google from 'passport-google-oauth20';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { User } from "@prisma/client";

const prisma = new PrismaClient();
console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);

const GoogleStrategy = google.Strategy;


passport.use(new GoogleStrategy (  //defines the google oAuth strategy for passport
    {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true  //necessary values to authenticate with google
},
  async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback

  ) => {  //these are the params provided by google during authentication
      try {
         const user = await prisma.user.upsert({  //check if a user exists by their google id
             where: {googleId: profile.id},
             update: {},
             create: {
                googleId: profile.id,
                email: profile.emails?.[0]?.value ?? '',
                firstName: profile.name?.givenName ?? '',
                lastName: profile.name?.familyName ?? '',
                password: profile.provider,
             },
         }); 
         return done(null, user)
      } catch (err) {
        console.error('Error in Google OAuth:', err);
      return done(err);
      }
  }
));

// passport.use( new GitHubStrategy(
// {
//    clientID: process.env.GITHUB_CLIENT_ID!,
//    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//    callbackURL: process.env.GITHUB_CALLBACK_URL!,
// },
//   async (accessToken: string, refreshToken:string, profile:Profile, done: any) => {
//        try {
//           const user = await prisma.user.upsert({
//             where: {githubId: profile.id},
//             update: {},
//             create: {
//                 githubId: profile.id,
//           email: profile.emails?.[0]?.value ?? '',
//           firstName: profile.username ?? '',
//           password: profile.provider
//             }
//           })
//           return done(null, user)
//        } catch (err) {
//         console.error('Error in GitHub OAuth:', err);
//         return done(err, null);
//        }
//   }
// ))

passport.serializeUser((user: any, done) => {  //serializing user saves the users id in the session or token
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {  //retrieves the id when needed
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  

export {passport}