// LoginPage.jsx

const LoginPage = () => {
    const handleGoogleSignIn = () => {
      window.location.href = 'http://localhost:3000/auth/google';
    };
  
    return (
      <div className="login-page">
        <h1>Sign In</h1>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  };
  
  export default LoginPage;
  