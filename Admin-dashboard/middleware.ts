import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Lấy access_token từ cookies
    // const accessToken = request.cookies.get('access_token')?.value;

    // // Định nghĩa các route không cần authentication
    // const publicPaths = ['/login'];

    // // Kiểm tra nếu route hiện tại là public
    // const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    // // Nếu không có token và không phải public path, chuyển về login
    // if (!accessToken && !isPublicPath) {
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }

    // // Nếu đã có token và đang ở trang login, chuyển về trang chủ
    // if (accessToken && request.nextUrl.pathname.startsWith('/login')) {
    //     return NextResponse.next();
    // }

    return NextResponse.next();
}

// Cấu hình middleware áp dụng cho các route cụ thể
// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };
