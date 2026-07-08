'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Constants } from '@/app/constants';

export function useCustomFetch() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const customFetch = useCallback(
        async (url: string, config?: any) => {
            setIsLoading(true);
            try {
                const response = await fetch(Constants.BACKEND_URL + url, {
                    ...config,
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = errorData?.message || 'Something went wrong!';
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setIsLoading(false);
                return data;
            } catch (error: any) {
                setIsLoading(false);
                console.error('Fetch error:', error);

                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: error.message || 'An unknown error occurred.',
                });

                throw error;
            }
        },
        [toast],
    );

    return { customFetch, isLoading };
}
