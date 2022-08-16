export function verifyUser(username: any, address: any): Promise<boolean>;
export function generateSignature(): Promise<{
    signature: any;
    address: any;
}>;