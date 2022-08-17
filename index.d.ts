export function verifyUser(username: string, address: string): Promise<boolean>;
export function generateSignature(): Promise<{
    signature: string;
    address: string;
}>;
