import { User } from "@prisma/client";
import { db } from "../config/db";
import { CreatedUserDTO } from "../dtos/createUser.dto";
import { UserServices } from "./user.service";
import { CustomError } from "../error/customerror";
import { hashPassword } from "../error/password.utils";

export class UserServiceImpl implements UserServices {
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
      const user = await db.user.delete({
         where: {id}
      })
   }
   
} 