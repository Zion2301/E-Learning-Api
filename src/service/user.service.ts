import { User } from "@prisma/client";
import { CreatedUserDTO } from "../dtos/createUser.dto";

export interface UserServices {
    createUser(data: CreatedUserDTO): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, data: Partial<CreatedUserDTO>): Promise<User>;
    deleteUser(id: number): Promise<void>;
}