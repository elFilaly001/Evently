import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/ui/PasswordInput";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
// import { axiosInstance } from "@/services/axiosInstence";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authslice";
import axios from "axios";




export default function LoginForm() {
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch(); 
    const navigate = useNavigate();

    const validateForm = (): boolean => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (data.email === "") {
            document.getElementById("email")?.classList.add("border-red-500");
            toast.error("Please enter your email.");
            return false;
        }
        if (!emailRegex.test(data.email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        if (data.password === "") {
            document.getElementById("password")?.classList.add("border-red-500");
            toast.error("Please enter your password.");
            return false;
        }

        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return false;
        }

        return true;
    };
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (validateForm() === false) {
                return false;
            }

            const response = await axios.post(import.meta.env.VITE_BACKEND_URL +'/api/auth/login', data);

            if (response.status === 201) {
                const userData = {
                    id: response.data.user.id,
                    username: response.data.user.username,
                    email: response.data.user.email,
                    isAuthenticated: true
                };
                
                localStorage.setItem("ticket", response.data.token);
                console.log("token login", localStorage.getItem("ticket"))
                dispatch(setUser(userData));
                
                toast.success("Logged in successfully");
                setTimeout(() => {
                    navigate("/inscription");
                }, 2500);
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Toaster
                position="top-right"
                reverseOrder={false}
            />  
            <Card className="w-[500px]">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Login</CardTitle>
                        <CardDescription>Welcome back!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email" className="text-left ml-2">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Enter your Email"
                                    value={data.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password" className="text-left ml-2">Password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <Link to="/ForgetPassword" className="text-sm hover:underline hover:text-gray-600 font-bold">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link to="/register" className="text-sm hover:underline text-black-100 hover:text-gray-600 font-bold">Register</Link>
                        <Button type="submit" disabled={loading}>
                            Log in
                        </Button>
                    </CardFooter>
                </form>

                {/* Loader */}
                {loading && (
                    <div className="loader-overlay">
                        <span className="loader"></span>
                    </div>
                )}
            </Card>

            <style>{`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999; /* Ensure it's on top */
    }
    .loader {
      width: 4.8px;
      height: 4.8px;
      display: block;
      position: relative;
      border-radius: 4px;
      color: #FFF;
      background: currentColor;
      box-sizing: border-box;
      animation: animloader 0.3s 0.3s linear infinite alternate;
    }
    .loader::after,
    .loader::before {
      content: '';  
      box-sizing: border-box;
      width: 4.8px;
      height: 4.8px;
      border-radius: 4px;
      background: currentColor;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 15px;
      animation: animloader 0.3s 0.45s linear infinite alternate;
    }
    .loader::after {
      top: -15px;
      animation-delay: 0s;
    }
    @keyframes animloader {
      0% { width: 4.8px }
      100% { width: 48px }
    }
  `}</style>
        </div>

    );
}
