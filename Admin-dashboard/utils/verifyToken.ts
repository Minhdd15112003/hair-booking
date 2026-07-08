// lib/auth.ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    exp: number;
}

export async function verifyToken(token: string): Promise<boolean> {
    try {
        // Sử dụng ACCESS_SECRET để verify
        const SECRET_KEY = process.env.JWT_ACCESS_SECRET;
        if (!SECRET_KEY) {
            console.error('JWT Access Secret is not defined');
            return false;
        }

        // Giải mã và xác thực token
        const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;

        // Kiểm tra thời gian hết hạn
        const currentTime = Math.floor(Date.now() / 1000);

        // Kiểm tra token còn hiệu lực không
        if (decoded.exp < currentTime) {
            console.log('Token đã hết hạn');
            return false;
        }

        return true;
    } catch (error) {
        // Log chi tiết lỗi
        console.error('Token verification error:', error);
        return false;
    }
}

// Hàm tạo token
export function generateToken(userId: string): string {
    const SECRET_KEY = process.env.JWT_ACCESS_SECRET;
    if (!SECRET_KEY) {
        throw new Error('JWT Access Secret is not defined');
    }

    return jwt.sign({ userId }, SECRET_KEY, {
        expiresIn: '1h', // Token hết hạn sau 1 giờ
    });
}

// Hàm refresh token (nếu cần)
export function generateRefreshToken(userId: string): string {
    const SECRET_KEY = process.env.JWT_REFRESH_SECRET;
    if (!SECRET_KEY) {
        throw new Error('JWT Refresh Secret is not defined');
    }

    return jwt.sign({ userId }, SECRET_KEY, {
        expiresIn: '7d', // Refresh token hết hạn sau 7 ngày
    });
}
