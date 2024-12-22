import { IsNotEmpty, Length, IsOptional} from "class-validator";


export class CreatedCourseDto {
    @IsNotEmpty()
    @Length(2, 100)
    title!: string
    
    @IsOptional()
    @IsNotEmpty()
    @Length(2, 100)
    description!: string

    @IsNotEmpty()
    price!: number

    @IsNotEmpty()
    duration!: number

    
}



