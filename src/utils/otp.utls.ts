export const generateOTP = (): string => {
    return Math.floor(10000 +Math.random() * 9000).toString()
}