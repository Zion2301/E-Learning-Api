import { loginDTO } from "../dtos/login.dto";
export interface AuthService {
    login(data: loginDTO): Promise<{accessToken: string; refreshToken: string}>; 
}
