import { Constants } from '@/app/constants';

const customFetch = async (url: string, config?: any) => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (!access_token) {
        window.location.href = '/login';
        return;
    }

    const fetchWithToken = async (url: string, config?: any) => {
        return await fetch(Constants.BACKEND_URL + url, {
            ...config,
            credentials: 'include',
            headers: {
                ...config?.headers,
                Authorization: access_token,
            },
        });
    };

    try {
        let response = await fetchWithToken(url, config);

        if (response.status === 401) {
            // generate new access token
            const refreshResponse = await fetch(
                Constants.BACKEND_URL + `/auth/generate-access-token?refresh_token=${refresh_token}`,
                { credentials: 'include' },
            );

            // return to login page if refresh token is invalid
            if (refreshResponse.status === 401) {
                window.location.href = '/login';
                return;
            }

            const data = await refreshResponse.json();
            localStorage.setItem('access_token', data.access_token);

            // refetch with new access token
            response = await fetchWithToken(url, config);
        }

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData?.message || 'Có gì đó không ổn!';
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error: any) {
        console.error('Lỗi Fetch:', error);
        throw new Error(error?.message || 'Đã xảy ra lỗi không xác định.');
    }
};

export default customFetch;
