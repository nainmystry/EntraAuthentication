//import React, { useEffect, useState } from 'react';
//import apiClient from './shared/api/axiosConfig';

//interface UserData {
//    id: string;
//    name: string;
//    email: string;
//}


//const testAPICall = () => {
//    const [data, setData] = useState<UserData | null>(null);
//    const [loading, setLoading] = useState(true);
//    const [error, setError] = useState('');

//    /*
//    Fetches user data from protected API endpoint
//    */
//    const fetchData = async () => {
//        try {
//            const response = await apiClient.get<UserData>('/api/user');
//            setData(response.data);
//        } catch (err) {
//            setError('Failed to fetch data');
//            console.error('API Error:', err);
//        } finally {
//            setLoading(false);
//        }
//    };


//    useEffect(() => {
//        fetchData();
//    }, [])

//    if(loading) return <div>Loading...</div>
//    if(error) return <div>{error}</div>

//     return (
//        <div>
//            <h2>User Data</h2>
//            {data && (
//                <div>
//                    <p>ID: {data.id}</p>
//                    <p>Name: {data.name}</p>
//                    <p>Email: {data.email}</p>
//                </div>
//            )}
//        </div>
//    );
//};
//export default testAPICall;