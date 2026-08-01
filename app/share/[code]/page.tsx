'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ShareRedirectPage() {
    const params = useParams();
    const code = params?.code as string;
    const router = useRouter();

    useEffect(() => {
        if (code) {
            router.replace(`/shared/${code}`);
        }
    }, [code, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-dark">
            <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
