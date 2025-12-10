import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PawPrint, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE } from "../config";


// Same shape as in App.tsx
export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  type: "adopter" | "shelter";
};

interface LoginPageProps {
  onLogin: (user: CurrentUser, token: string) => void;
}

interface LoginPageProps {
  onLogin: (user: CurrentUser, token: string) => void;
}

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,64}$/;

const validatePassword = (pwd: string): string | null => {
  if (!PASSWORD_REGEX.test(pwd)) {
    return "Password must be 8–64 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }
  return null;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'adopter' | 'shelter'>('adopter');
  const [confirmPassword, setConfirmPassword] = useState("");


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  // 🔐 Frontend validation FIRST – no network call if something is wrong
  if (!email || !password) {
    setError("Please fill in all required fields.");
    return;
  }

  if (mode === "signup") {
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    const pwdError = validatePassword(password); // uses PASSWORD_REGEX helper
    if (pwdError) {
      setError(pwdError);
      return; // ⛔ do NOT submit to backend
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter them.");
      // clear only passwords if you like
      setPassword("");
      setConfirmPassword("");
      return; // ⛔ do NOT submit to backend
    }
  }

  // ✅ Only reach here if everything is valid
  setIsLoading(true);

  try {
    if (mode === "signin") {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Invalid email or password");
      }

      const data: any = await res.json();
      onLogin(data.user, data.token);
    } else {
      // SIGN UP – only called when validations above passed
       const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          type: accountType,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        // Special handling for email already used
        if (res.status === 409) {
          setError(
            "An account with this email already exists. Try signing in instead."
          );
          // optional: auto-switch mode
          // setMode("signin");
        } else {
          setError(body.message || "Sign up failed");
        }
        return;
      }

      const data: any = await res.json();
      localStorage.setItem("token", data.token);
      onLogin(data.user, data.token);

    }
  } catch (err: any) {
    setError(err?.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};


  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/auth/google`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: codeResponse.code }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Google sign-in failed');
        }
        const data: any = await res.json();
        localStorage.setItem('token', data.token);
        onLogin(data.user, data.token);
      } catch (err: any) {
        setError(err?.message || 'Google sign-in failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed');
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50">
      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl flex items-center justify-center gap-12 relative z-10">
        {/* Left side image & tagline */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 max-w-lg">
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900/5 border border-white/60">
            <ImageWithFallback
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
              alt="Happy dog in grass"
              className="w-full h-[420px] object-cover"
            />
          </div>
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-orange-700 font-semibold mb-1">
              <PawPrint className="w-5 h-5" />
              <span>Pet Connect</span>
            </div>
            <p className="text-slate-600 max-w-md text-sm">
              Connect with pets looking for forever homes. Find your perfect
              companion today.
            </p>
          </div>
        </div>

        {/* Right side auth card */}
        <div className="flex-1 max-w-md">
          <Card className="backdrop-blur-xl bg-white/80 shadow-xl border border-white/60">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                {mode === 'signin' ? 'Welcome back!' : 'Create your account'}
              </CardTitle>
              <CardDescription className="text-slate-500">
                {mode === 'signin'
                  ? 'Sign in to your account to continue'
                  : 'Sign up to start finding or posting pets'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full name only in signup */}
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {mode === 'signin' && (
                    <p className="text-xs text-slate-500">
                      Demo: alice@example.com or shelter@example.com (password: password123)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label htmlFor="password">Password</Label>
    {mode === "signin" && (
      <button
        type="button"
        className="text-sm text-orange-600 hover:text-orange-700 hover:underline"
      >
       
      </button>
    )}
  </div>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder={
        mode === "signin"
          ? "Enter your password"
          : "Create a strong password"
      }
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="pl-10 pr-10"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
    >
      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  </div>

  {mode === "signup" && (
  <div className="space-y-2">
    <Label htmlFor="confirmPassword">Confirm password</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
      <Input
        id="confirmPassword"
        type={showPassword ? "text" : "password"}
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="pl-10 pr-10"
        required
      />
    </div>
    <p className="text-xs text-slate-500">
      Please type the same password again to confirm.
    </p>
  </div>
)}

</div>


                {/* account type pills only in signup */}
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label className="text-sm">I am signing up as</Label>
                    <div className="flex gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => setAccountType('adopter')}
                        className={`flex-1 border rounded-full px-3 py-1.5 ${
                          accountType === 'adopter'
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Adopter
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('shelter')}
                        className={`flex-1 border rounded-full px-3 py-1.5 ${
                          accountType === 'shelter'
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Shelter
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-500">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {mode === 'signin' ? 'Signing in...' : 'Signing up...'}
                    </>
                  ) : mode === 'signin' ? (
                    'Sign in'
                  ) : (
                    'Sign up'
                  )}
                </Button>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-500">
                    OR
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => googleLogin()}
                  disabled={isLoading}
                >
                  <svg className="size-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm text-slate-600">
                    {mode === 'signin' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                              setMode("signup");
                              setError(null);
                              setPassword("");
                              setConfirmPassword("");
                            }}

                          className="text-orange-600 hover:text-orange-700 hover:underline"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("signin");
                            setError(null);
                            setPassword("");
                            setConfirmPassword("");
                          }}

                          className="text-orange-600 hover:text-orange-700 hover:underline"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.98); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
