import { User } from "@prisma/client";
import { db } from "../config/db";
import { CreatedUserDTO } from "../dtos/createUser.dto";
import { UserServices } from "./user.service";
import { CustomError } from "../error/customerror";
import { comparePassword, hashPassword } from "../error/password.utils";
import { StatusCodes } from "http-status-codes";
import { ChangePasswordDTO, ResetPasswordDTO } from "../dtos/resetPassword.dto";
// import { compare } from "bcryptjs";

export class UserServiceImpl implements UserServices {
  async setPassword(id: number, data: ChangePasswordDTO): Promise<void> {
      await db.$transaction(async (transaction) => {
         const user = await transaction.user.findUnique({
            where: {
               id
            }
         })

         if (!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "User not found")
         }

         const isPasswordValid = await comparePassword(
            data.oldPassword,
            user.password || ""
         ) 

         if (!isPasswordValid) {
            throw new CustomError(400, "Password is incorrect")
         }

         const previousPasswords = await transaction.passwordHistory.findMany({
            where: {
               userId: id
            },
            select: {
               passwordHash: true
            },
         })
         for(const history of previousPasswords){
            const isPreviouslyUsed = await comparePassword(
               data.newPassword,
               history.passwordHash
            );

            if (isPreviouslyUsed) {
               throw new CustomError(400, "This new password has been used before. Please choos a new password")
            }
         }

         if (user.password) {
            await transaction.passwordHistory.create({
               data: {userId: user.id, passwordHash: user.password},
            })
         }

         const hashedPassword = await hashPassword(data.newPassword);

         await transaction.user.update({
            where: {id},
            data: {password: hashedPassword},
         })

         const passwordHistoryCount = await transaction.passwordHistory.count({
            where: {userId: id},
         })
       if (passwordHistoryCount > 5) {
         const oldestPassword = await transaction.passwordHistory.findFirst({
            where: {userId: id},
            orderBy: {createdAt: "asc"}
           })

           if (oldestPassword) {
            await transaction.passwordHistory.delete({
               where: {id}
            })
        }
       }
       
      })

     
   }
   async createUser(data: CreatedUserDTO): Promise<User> {
      const isUserExist = await db.user.findFirst({
        where: {
            email: data.email,
        },
      })

      if (isUserExist) {
         throw new CustomError(409, "Email already taken");
         
      }
      const user = await db.user.create({
        data: {
            email: data.email,
            password: await hashPassword(data.password),
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            phoneNumber: data.phoneNumber
        },
      })
      return user;
   }

   async getUserById(id: number): Promise<User | null> {
      const user = await db.user.findFirst({
         where: {id},
      });
      if(!user) {
         throw new CustomError(404, `User with ${id} doesnt exist`);
         
      }
      return user;
   }
   async getAllUsers(): Promise<User[]> {
      return await db.user.findMany();
   }
  async updateUser(id: number, data: Partial<CreatedUserDTO>): Promise<User> {
      const isUserexists = await db.user.findFirst({
         where: {
            id,
         },
      });

      if(!isUserexists){
         throw new CustomError(404, "User with this ID does not exist");
         
      }
      const user = await db.user.update({
         where: {id},
         data,
      })
      return user;
   }
   async deleteUser(id: number): Promise<void> {
      const isUserexists = await db.user.findFirst({
         where: {
            id,
         },
      });

      if(!isUserexists){
         throw new CustomError(404, "User with this ID does not exist");
         
      }
       await db.user.delete({
         where: {id}
      })
   }
   

   async profile(id: number): Promise<Omit<User, "password">> {
      const user = await db.user.findFirst({
         where: {
            id,
         }
      });

      if(!user) {
         throw new CustomError(
            StatusCodes.NOT_FOUND,
            `user with id ${id} not found`
         );
      }
      return user;
   }

   async updateProfilePic(
      id: number,
      data: { profilePic: string }
    ): Promise<Object | any> {
      const user = await db.user.findFirst({
        where: { id },
      });
  
      if (!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
      }
      const updatedUser = await db.user.update({
        where: {
          id,
        },
        data: { profilePicture: data.profilePic },
      });
  
      //return updateuser without sensitive fileds like password
      return {
        id: updatedUser.id,
        name: updatedUser.firstName,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      };
    }
} 