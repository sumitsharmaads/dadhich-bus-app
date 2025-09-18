"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { authService } from "@/lib/api/services/auth.service";

interface PasswordStrength {
  score: number;
  level: "weak" | "fair" | "good" | "strong" | "very-strong";
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    specialChars: boolean;
    noSequential: boolean;
    noRepeated: boolean;
    notCommon: boolean;
  };
}

interface PasswordStrengthMeterProps {
  password: string;
  onStrengthChange?: (response: {
    strength: PasswordStrength;
    isValid: boolean;
  }) => void;
  showRequirements?: boolean;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  onStrengthChange,
  showRequirements = true,
  className = "",
}) => {
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const isValidatingRef = useRef(false);

  const validatePasswordStrength = useCallback(
    async (pwd: string) => {
      if (!pwd || pwd.length === 0) {
        setStrength(null);
        setIsValid(false);
        return;
      }

      // Prevent multiple simultaneous calls
      if (isValidatingRef.current) {
        return;
      }

      isValidatingRef.current = true;
      setIsValidating(true);
      setError(null);

      try {
        const response = await authService.validatePassword(pwd);

        // Now response should be { strength: {...}, isValid: boolean }
        if (response && response.strength) {
          setStrength(response.strength);
          setIsValid(response.isValid || false);
          onStrengthChange?.(response);
        } else {
          setError("Invalid response from server");
          setIsValid(false);
        }
      } catch (err: any) {
        setError("Failed to validate password strength");
        setIsValid(false);
      } finally {
        isValidatingRef.current = false;
        setIsValidating(false);
      }
    },
    [onStrengthChange]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validatePasswordStrength(password);
    }, 300); // Debounce validation

    return () => clearTimeout(timeoutId);
  }, [password]); // Removed validatePasswordStrength from dependencies

  // Cleanup effect to reset ref on unmount
  useEffect(() => {
    return () => {
      isValidatingRef.current = false;
    };
  }, []);

  const getStrengthColor = (level: string, isValid: boolean) => {
    // If password is invalid, always show red regardless of score
    if (!isValid) {
      return "bg-red-500";
    }

    switch (level) {
      case "weak":
        return "bg-red-500";
      case "fair":
        return "bg-orange-500";
      case "good":
        return "bg-yellow-500";
      case "strong":
        return "bg-blue-500";
      case "very-strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthText = (level: string, isValid: boolean) => {
    // If password is invalid, always show "Invalid" regardless of score
    if (!isValid) {
      return "Invalid";
    }

    switch (level) {
      case "weak":
        return "Weak";
      case "fair":
        return "Fair";
      case "good":
        return "Good";
      case "strong":
        return "Strong";
      case "very-strong":
        return "Very Strong";
      default:
        return "";
    }
  };

  // Always show the component if there's a password, even if it's short
  if (!password || password.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password Strength:</span>
          <span
            className={`font-medium ${
              strength
                ? `text-${
                    !isValid
                      ? "red"
                      : strength.level === "weak"
                      ? "red"
                      : strength.level === "fair"
                      ? "orange"
                      : strength.level === "good"
                      ? "yellow"
                      : strength.level === "strong"
                      ? "blue"
                      : "green"
                  }-600`
                : "text-gray-500"
            }`}
          >
            {isValidating
              ? "Checking..."
              : strength
              ? getStrengthText(strength.level, isValid)
              : password.length > 0
              ? "Analyzing..."
              : "Enter password"}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strength
                ? getStrengthColor(strength.level, isValid)
                : "bg-gray-300"
            }`}
            style={{
              width: strength ? `${strength.score}%` : "0%",
              minWidth: strength ? "4px" : "0px", // Ensure minimum visibility
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Requirements */}
      {showRequirements && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Requirements:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div
              className={`flex items-center space-x-2 ${
                strength?.requirements?.length
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="text-xs">✓</span>
              <span>At least 12 characters</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                strength?.requirements?.uppercase
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="text-xs">✓</span>
              <span>Uppercase letter</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                strength?.requirements?.lowercase
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="text-xs">✓</span>
              <span>Lowercase letter</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                strength?.requirements?.numbers
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="text-xs">✓</span>
              <span>Number</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                strength?.requirements?.specialChars
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="text-xs">✓</span>
              <span>Special character</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                strength?.requirements?.noSequential
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="text-xs">✓</span>
              <span>No sequential chars</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                strength?.requirements?.noRepeated
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="text-xs">✓</span>
              <span>No repeated chars</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                strength?.requirements?.notCommon
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="text-xs">✓</span>
              <span>Not common password</span>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Messages */}
      {strength && strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((message, index) => (
            <div key={index} className="text-red-600 text-sm">
              • {message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
