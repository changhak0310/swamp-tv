import { useEffect, useState } from "react";

export default function One() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const test = async () => {
            try {
                const response = await fetch('/api/oneoneone', {
                    method: 'POST',
                });
                const result = await response.json(); // 서버로부터 받은 데이터를 JSON으로 변환
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        test();
    }, []);

    return (
        <div>
            <h1>One</h1>
            <div>
                {data ? JSON.stringify(data) : "Loading..."}
            </div>
        </div>
    );
}
