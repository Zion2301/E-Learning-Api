import { isValidPhoneNumber as validatePhoneNumber} from "libphonenumber-js";

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
    return validatePhoneNumber(phoneNumber);
}