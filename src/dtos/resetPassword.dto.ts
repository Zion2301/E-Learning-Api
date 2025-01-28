import { IsNotEmpty, isNotEmpty, IsString, isString, Length } from "class-validator";

export class ResetPasswordDTO {
     id!: number
    //  [x: string]: string;
     @IsNotEmpty()
     @IsString()
     newPasword!: string;
}

export class ChangePasswordDTO {
    @IsNotEmpty()
    @IsString()
    oldPassword!: string

    @IsNotEmpty()
    @IsString()
    @Length(5)
    newPassword!: string
} 