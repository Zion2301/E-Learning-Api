import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreatedUserDTO {
    @IsNotEmpty()
    @Length(2, 50)
    firstName!: string

    @IsNotEmpty()
    @Length(2, 50)
    lastName!: string

    @IsNotEmpty()
    @Length(2, 50)
    phoneNumber!: string

    @IsEmail()
    email!: string

    @IsNotEmpty()
    @Length(6, 20)
    password!: string

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Role)
    role!: Role;
}