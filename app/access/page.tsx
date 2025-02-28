"use client"

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';

const validCodes = process.env.NEXT_PUBLIC_ACCESS_CODES?.split(",") || [];
const globalPassPhrase = process.env.NEXT_PUBLIC_PASS_PHRASE;

const AccessPage = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validCodes.includes(code)) {

            document.cookie = `${globalPassPhrase}=valid; path=/; max-age=86400`;
            router.push('/explore');
        } else {
            setCode("");
            setError('Invalid code. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">Enter Access Code</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter your code"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                            Submit
                        </Button>
                    </div>
                </form>

                {error && (
                    <Alert className="mt-4 bg-red-200 text-red-800 p-4 rounded-md shadow-md">
                        {error}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default AccessPage;
