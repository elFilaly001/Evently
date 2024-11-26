import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PasswordInput({ id, name, value, onChange }: { id: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={value} // Controlled input from parent component
        onChange={onChange} // onChange handler from parent component
      />
      <Button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 px-4"
      >
        {showPassword ? (
          <i className="fa-regular fa-eye-slash"></i>
        ) : (
          <i className="fa-regular fa-eye"></i>
        )}
      </Button>
    </div>
  );
}
