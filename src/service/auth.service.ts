import { loginDTO } from "../dtos/login.dto";
export interface AuthService {
    login(data: loginDTO): Promise<{accessToken: string; refreshToken: string}>; 

    updateProfilePic(id: number, data: { profilePic: string }): Promise<Object | any>;
}
