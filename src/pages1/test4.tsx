import { ApiUrl } from "@/lib/api";

export default function LoginPage() {
    const handleLogin = () => {
      window.location.href = "/api/user";
    };
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Naver Login</h1>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login with Naver
        </button>
      </div>
    );
  }
  