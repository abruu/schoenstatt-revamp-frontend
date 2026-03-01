"use client";

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  CreditCard,
  Send,
  Upload,
  X,
  CheckCircle,
  Home,
  ArrowLeft,
  RotateCcw,
  XCircle,
  Building,
  GraduationCap,
  Languages,
  Target,
  Briefcase,
  FileCheck,
} from "lucide-react";
import { useCourseLevels } from "@/hooks/use-course-levels";
import { useCenters } from "@/hooks/use-centers";
import Image from "next/image";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { ParticleBackground } from "@/components/layout/particle-background";
import { Footer } from "@/components/layout/footer";

// Form values interface
interface FormValues {
  photo: File | null;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  isWhatsappSameAsPhone: boolean;
  address: string;
  fathersName: string;
  mothersName: string;
  parentContact: string;
  aadhaarNumber: string;
  center: string;
  courseLevel: string;
  hostelFacility: boolean;
  highestQualification: string;
  otherQualification: string;
  studiedGerman: boolean;
  levelCompleted: string;
  purposeLearningGerman: string[];
  workExperience: boolean;
  declaration: boolean;
  turnstileToken: string;
}

// Qualification options
const qualificationOptions = [
  "Plus Two",
  "Diploma",
  "Degree",
  "Postgraduate",
  "Nursing",
  "Other",
];

// Learning purpose options
const learningPurposeOptions = [
  "Higher Studies in Germany",
  "Ausbildung",
  "Job in Germany",
  "Migration",
  "Personal Interest",
  "Not Decided Yet",
];

// Aadhaar checksum validation using Verhoeff algorithm
const verhoeffTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const permutationTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const validateAadhaar = (aadhaar: string): boolean => {
  if (!/^\d{12}$/.test(aadhaar)) return false;
  if (/^(\d)\1{11}$/.test(aadhaar)) return false; // No repeated digits

  let checksum = 0;
  for (let i = 0; i < 12; i++) {
    checksum =
      verhoeffTable[checksum][permutationTable[i % 8][parseInt(aadhaar[i])]];
  }
  return checksum === 0;
};

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

// Validation schema
const validationSchema = Yup.object({
  photo: Yup.mixed()
    .required("Photo is required")
    .test(
      "fileType",
      "Please upload a valid image (JPG, PNG, WebP)",
      (value) => {
        if (!value) return false;
        const file = value as File;
        return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        );
      },
    )
    .test("fileSize", "File size must be 5MB or less", (value) => {
      if (!value) return false;
      const file = value as File;
      return file.size <= 5 * 1024 * 1024;
    }),
  firstName: Yup.string()
    .transform((value) => sanitizeInput(value))
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .transform((value) => sanitizeInput(value))
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  gender: Yup.string().required("Gender is required"),
  dateOfBirth: Yup.string()
    .required("Date of birth is required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Please enter date in DD/MM/YYYY format")
    .test("valid-date", "Please enter a valid date", (value) => {
      if (!value) return false;
      const [day, month, year] = value.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year
      );
    })
    .test(
      "year-range",
      "Year must be between 1950 and current year",
      (value) => {
        if (!value) return false;
        const [day, month, year] = value.split("/").map(Number);
        const currentYear = new Date().getFullYear();
        return year >= 1950 && year <= currentYear;
      },
    )
    .test("age", "You must be at least 10 years old", (value) => {
      if (!value) return false;
      const [day, month, year] = value.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 10;
      }
      return age >= 10;
    })
    .test("not-future", "Date of birth cannot be in the future", (value) => {
      if (!value) return false;
      const [day, month, year] = value.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      return birthDate <= new Date();
    }),
  email: Yup.string()
    .transform((value) => (value ? value.toLowerCase().trim() : value))
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .transform((value) => (value ? value.replace(/\D/g, "") : value))
    .matches(
      /^(\+91)?[6-9]\d{9}$/,
      "Please enter a valid Indian phone number (10 digits, starting with 6-9, optionally with +91)",
    )
    .test("no-leading-zero", "Phone number cannot start with 0", (value) => {
      if (!value) return true;
      const cleanNumber = value.replace(/^\+91/, "");
      return !cleanNumber.startsWith("0");
    })
    .required("Phone number is required"),
  whatsappNumber: Yup.string()
    .transform((value) => (value ? value.replace(/\D/g, "") : value))
    .when("isWhatsappSameAsPhone", {
      is: false,
      then: (schema) =>
        schema.matches(
          /^(\+91)?[6-9]\d{9}$/,
          "Please enter a valid Indian phone number",
        ),
      otherwise: (schema) => schema,
    }),
  isWhatsappSameAsPhone: Yup.boolean(),
  address: Yup.string()
    .transform((value) => sanitizeInput(value))
    .min(10, "Address must be at least 10 characters")
    .max(250, "Address cannot exceed 250 characters")
    .required("Address is required"),
  fathersName: Yup.string()
    .transform((value) => sanitizeInput(value))
    .matches(
      /^[a-zA-Z\s]+$/,
      "Father's name can only contain letters and spaces",
    )
    .min(2, "Father's name must be at least 2 characters")
    .max(50, "Father's name cannot exceed 50 characters")
    .required("Father's name is required"),
  mothersName: Yup.string()
    .transform((value) => sanitizeInput(value))
    .matches(
      /^[a-zA-Z\s]+$/,
      "Mother's name can only contain letters and spaces",
    )
    .min(2, "Mother's name must be at least 2 characters")
    .max(50, "Mother's name cannot exceed 50 characters")
    .required("Mother's name is required"),
  parentContact: Yup.string()
    .transform((value) => (value ? value.replace(/\D/g, "") : value))
    .matches(
      /^(\+91)?[6-9]\d{9}$/,
      "Please enter a valid Indian phone number (10 digits, starting with 6-9, optionally with +91)",
    )
    .test("no-leading-zero", "Phone number cannot start with 0", (value) => {
      if (!value) return true;
      const cleanNumber = value.replace(/^\+91/, "");
      return !cleanNumber.startsWith("0");
    })
    .required("Parent contact number is required"),
  aadhaarNumber: Yup.string()
    .transform((value) => (value ? value.replace(/\D/g, "") : value))
    .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits")
    .required("Aadhaar number is required"),
  center: Yup.string().required("Please select a training center"),
  courseLevel: Yup.string().required("Please select a course level"),
  hostelFacility: Yup.boolean().required(
    "Please select hostel facility preference",
  ),
  highestQualification: Yup.string().required(
    "Please select your highest qualification",
  ),
  otherQualification: Yup.string().when("highestQualification", {
    is: "Other",
    then: (schema) =>
      schema
        .required("Please specify your qualification")
        .min(2, "Qualification must be at least 2 characters"),
    otherwise: (schema) => schema,
  }),
  studiedGerman: Yup.boolean().required(
    "Please select if you have studied German before",
  ),
  levelCompleted: Yup.string().when("studiedGerman", {
    is: true,
    then: (schema) => schema.required("Please specify the level completed"),
    otherwise: (schema) => schema,
  }),
  purposeLearningGerman: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one purpose")
    .required("Please select your purpose of learning German"),
  workExperience: Yup.boolean().required(
    "Please select your work experience status",
  ),
  declaration: Yup.boolean()
    .oneOf([true], "You must accept the declaration to proceed")
    .required("Declaration is required"),
  turnstileToken: Yup.string().required(
    "Please complete the security verification",
  ),
});

// Initial form values
const initialValues: FormValues = {
  photo: null,
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  whatsappNumber: "",
  isWhatsappSameAsPhone: false,
  address: "",
  fathersName: "",
  mothersName: "",
  parentContact: "",
  aadhaarNumber: "",
  center: "",
  courseLevel: "",
  hostelFacility: false,
  highestQualification: "",
  otherQualification: "",
  studiedGerman: false,
  levelCompleted: "",
  purposeLearningGerman: [],
  workExperience: false,
  declaration: false,
  turnstileToken: "",
};

export function RegistrationPageContent() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { centers, loading: centersLoading } = useCenters();
  const { courseLevels, loading: courseLevelsLoading } = useCourseLevels();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const renderTurnstile = (setFieldValue: any) => {
    if (turnstileLoaded && turnstileRef.current && !turnstileWidgetId) {
      (window as any).onTurnstileSuccess = (token: string) => {
        setFieldValue("turnstileToken", token);
      };

      const widgetId = (window as any).turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          setFieldValue("turnstileToken", token);
        },
        "error-callback": () => {
          setFieldValue("turnstileToken", "");
        },
        "expired-callback": () => {
          setFieldValue("turnstileToken", "");
        },
        theme: "dark",
      });

      setTurnstileWidgetId(widgetId);
    }
  };

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        // Clear the file input and show error
        event.target.value = "";
        setSubmitStatus("error");
        setSubmitMessage(
          "File size must be 5MB or less. Please choose a smaller image.",
        );
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        // Clear the file input and show error
        event.target.value = "";
        setSubmitStatus("error");
        setSubmitMessage("Please upload a valid image (JPG, PNG, WebP).");
        return;
      }

      // Clear any previous error messages and start loading
      setSubmitStatus("idle");
      setSubmitMessage("");
      setPhotoUploading(true);

      try {
        // Compress image to 999KB (0.999MB)
        const options = {
          maxSizeMB: 0.999, // 999KB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: file.type,
        };

        const compressedFile = await imageCompression(file, options);

        setFieldValue("photo", compressedFile);

        // Create preview URL from compressed file
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target?.result as string);
          setPhotoUploading(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
        setSubmitStatus("error");
        setSubmitMessage(
          "Failed to compress image. Please try a different image.",
        );
        setPhotoUploading(false);
        event.target.value = "";
      }
    }
  };

  const removePhoto = (setFieldValue: any) => {
    setFieldValue("photo", null);
    setPhotoPreview(null);
    setPhotoUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearPhotoPreview = () => {
    setPhotoPreview(null);
    setPhotoUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      setSubmitStatus("idle");

      if (!values.turnstileToken) {
        setSubmitStatus("error");
        setSubmitMessage("Please complete the security verification");
        setSubmitting(false);
        return;
      }

      // Check for duplicates first
      const duplicateCheck = await fetch("/api/registrations/check-duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          phone: values.phone,
        }),
      });

      const duplicateResult = await duplicateCheck.json();

      if (duplicateResult.exists) {
        setSubmitStatus("error");
        setSubmitMessage(
          `A registration already exists with this ${duplicateResult.field}. Please contact the institution if you need assistance.`,
        );
        setSubmitting(false);
        if (turnstileWidgetId && (window as any).turnstile) {
          (window as any).turnstile.reset(turnstileWidgetId);
        }
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | File);
        }
      });

      const response = await fetch("/api/registrations", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage(
          "Registration successful! You will be contacted by the institution.",
        );
        setRegistrationComplete(true);
        resetForm();
        clearPhotoPreview();
        if (turnstileWidgetId && (window as any).turnstile) {
          (window as any).turnstile.reset(turnstileWidgetId);
        }
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          result.details ||
            result.error ||
            "Failed to submit registration. Please try again later",
        );
        if (turnstileWidgetId && (window as any).turnstile) {
          (window as any).turnstile.reset(turnstileWidgetId);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "Network error. Please check your connection and try again.",
      );
      if (turnstileWidgetId && (window as any).turnstile) {
        (window as any).turnstile.reset(turnstileWidgetId);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen component
  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />

        <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-400">
              Registration Successful!
            </h1>
            <p className="text-white/80 text-lg">
              A confirmation email has been sent to your registered email
              address. Please also check your spam or junk folder if you do not
              see it in your inbox.
            </p>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
            <div className="text-center space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <div className="space-y-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-black font-bold text-xs sm:text-sm">
                      1
                    </span>
                  </div>
                  <p>We'll review your registration</p>
                </div>
                <div className="space-y-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-black font-bold text-xs sm:text-sm">
                      2
                    </span>
                  </div>
                  <p>Contact you with course details</p>
                </div>
                <div className="space-y-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-black font-bold text-xs sm:text-sm">
                      3
                    </span>
                  </div>
                  <p>Begin your German journey</p>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
      //  <Footer />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <section className="relative z-10 py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Enhanced Back to Home Button - Always Visible */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white/90 hover:text-white transition-all duration-300 group shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 backdrop-blur-sm">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2" />
                <span className="text-yellow-400 font-medium text-xs sm:text-sm">
                  STUDENT REGISTRATION
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold px-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Register Now
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                Complete your registration for our German language courses.
                Please fill in all required information accurately to process
                your enrollment.
              </p>
            </div>

            {/* Registration Form */}
            <div className="relative  sm:mx-0">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20"></div>

              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    setFieldValue,
                    values,
                    isSubmitting,
                    errors,
                    touched,
                    isValid,
                    submitForm,
                  }) => {
                    const submitAttemptedRef = useRef(false);

                    useEffect(() => {
                      renderTurnstile(setFieldValue);
                    }, [turnstileLoaded, setFieldValue]);

                    // Auto-sync WhatsApp number when phone changes and checkbox is checked
                    useEffect(() => {
                      if (values.isWhatsappSameAsPhone) {
                        setFieldValue("whatsappNumber", values.phone);
                      }
                    }, [
                      values.phone,
                      values.isWhatsappSameAsPhone,
                      setFieldValue,
                    ]);

                    // Focus on first error field only after submit attempt
                    useEffect(() => {
                      if (
                        submitAttemptedRef.current &&
                        Object.keys(errors).length > 0 &&
                        Object.keys(touched).length > 0
                      ) {
                        const firstErrorField = Object.keys(errors)[0];
                        const errorElement = document.querySelector(
                          `[name="${firstErrorField}"]`,
                        ) as HTMLElement;

                        if (errorElement) {
                          errorElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          errorElement.focus();
                        }
                        submitAttemptedRef.current = false;
                      }
                    }, [errors, touched]);

                    const handleFormSubmit = (e: React.FormEvent) => {
                      submitAttemptedRef.current = true;
                      e.preventDefault();
                      submitForm();
                    };

                    return (
                      <Form className="space-y-8 sm:space-y-10">
                        {/* Error Message Display */}
                        {submitStatus === "error" && submitMessage && (
                          <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30 text-red-400">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-5 w-5 flex-shrink-0" />
                              <span className="text-sm">{submitMessage}</span>
                            </div>
                          </div>
                        )}

                        {/* ==================== SECTION 1: Personal Information ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                              <User className="h-5 w-5 text-black" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              Personal Information
                            </h2>
                          </div>

                          {/* Photo Upload */}
                          <div className="space-y-2 sm:space-y-3">
                            <label
                              htmlFor="photo"
                              className="text-sm font-medium text-white flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Photo <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              {photoUploading ? (
                                <div className="border-2 border-dashed border-yellow-400/30 rounded-lg p-6 text-center bg-yellow-400/5">
                                  <div className="flex flex-col items-center space-y-3">
                                    <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                                    <p className="text-yellow-400 font-medium">
                                      Processing image...
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      Compressing and preparing your photo
                                    </p>
                                  </div>
                                </div>
                              ) : photoPreview ? (
                                <div className="space-y-3">
                                  <div className="relative w-32 h-32 mx-auto">
                                    <img
                                      src={photoPreview}
                                      alt="Photo preview"
                                      className="w-full h-full object-cover rounded-lg border-2 border-white/20"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removePhoto(setFieldValue)}
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      fileInputRef.current?.click()
                                    }
                                    className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                    Change Photo
                                  </button>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/30 transition-colors">
                                  <Upload className="h-8 w-8 text-white/50 mx-auto mb-2" />
                                  <p className="text-white/70 mb-2">
                                    Click to upload photo
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    JPG, PNG, WebP - Max 5MB
                                  </p>
                                </div>
                              )}
                              <input
                                ref={fileInputRef}
                                id="photo"
                                name="photo"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(event) =>
                                  handlePhotoChange(event, setFieldValue)
                                }
                                disabled={photoUploading}
                                className={
                                  photoPreview || photoUploading
                                    ? "hidden"
                                    : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                }
                              />
                              <ErrorMessage
                                name="photo"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          </div>

                          {/* First Name & Last Name */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                              <label
                                htmlFor="firstName"
                                className="text-sm font-medium text-white"
                              >
                                First Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Enter your first name"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="firstName"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="lastName"
                                className="text-sm font-medium text-white"
                              >
                                Last Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Enter your last name"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="lastName"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          </div>

                          {/* Gender & Date of Birth */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                              <label
                                htmlFor="gender"
                                className="text-sm font-medium text-white"
                              >
                                Gender <span className="text-red-500">*</span>
                              </label>
                              <Field
                                as="select"
                                id="gender"
                                name="gender"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              >
                                <option
                                  value=""
                                  className="bg-black text-gray-400"
                                >
                                  Select gender
                                </option>
                                <option
                                  value="Male"
                                  className="bg-black text-white"
                                >
                                  Male
                                </option>
                                <option
                                  value="Female"
                                  className="bg-black text-white"
                                >
                                  Female
                                </option>
                                <option
                                  value="Other"
                                  className="bg-black text-white"
                                >
                                  Other
                                </option>
                              </Field>
                              <ErrorMessage
                                name="gender"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="dateOfBirth"
                                className="text-sm font-medium text-white flex items-center gap-2"
                              >
                                <Calendar className="h-4 w-4" />
                                Date of Birth{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="text"
                                placeholder="DD/MM/YYYY"
                                maxLength={10}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                  const inputValue = e.target.value;
                                  const currentValue = values.dateOfBirth || "";
                                  if (inputValue.length < currentValue.length) {
                                    if (inputValue.endsWith("/")) {
                                      setFieldValue(
                                        "dateOfBirth",
                                        inputValue.slice(0, -1),
                                      );
                                      return;
                                    }
                                    setFieldValue("dateOfBirth", inputValue);
                                    return;
                                  }
                                  let value = inputValue.replace(/\D/g, "");
                                  if (value.length >= 2)
                                    value =
                                      value.substring(0, 2) +
                                      "/" +
                                      value.substring(2);
                                  if (value.length >= 5)
                                    value =
                                      value.substring(0, 5) +
                                      "/" +
                                      value.substring(5, 9);
                                  setFieldValue("dateOfBirth", value);
                                }}
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="dateOfBirth"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          </div>

                          {/* Email & Phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                              <label
                                htmlFor="email"
                                className="text-sm font-medium text-white flex items-center gap-2"
                              >
                                <Mail className="h-4 w-4" />
                                Email Address{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="phone"
                                className="text-sm font-medium text-white flex items-center gap-2"
                              >
                                <Phone className="h-4 w-4" />
                                Mobile Number{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Enter your mobile number"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="phone"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          </div>

                          {/* WhatsApp Number with Checkbox */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Field
                                type="checkbox"
                                id="isWhatsappSameAsPhone"
                                name="isWhatsappSameAsPhone"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                  setFieldValue(
                                    "isWhatsappSameAsPhone",
                                    e.target.checked,
                                  );
                                  if (e.target.checked) {
                                    setFieldValue(
                                      "whatsappNumber",
                                      values.phone,
                                    );
                                  }
                                }}
                                className="w-5 h-5 rounded border-white/20 bg-white/5 text-yellow-400 focus:ring-yellow-400/20"
                              />
                              <label
                                htmlFor="isWhatsappSameAsPhone"
                                className="text-base text-white/80"
                              >
                                Same as mobile number?
                              </label>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="whatsappNumber"
                                className="text-sm font-medium text-white"
                              >
                                WhatsApp Number
                              </label>
                              <Field
                                id="whatsappNumber"
                                name="whatsappNumber"
                                type="tel"
                                placeholder="Enter your WhatsApp number"
                                disabled={values.isWhatsappSameAsPhone}
                                className={`w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base ${values.isWhatsappSameAsPhone ? "opacity-50 cursor-not-allowed" : ""}`}
                              />
                              <ErrorMessage
                                name="whatsappNumber"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          </div>

                          {/* Address */}
                          <div className="space-y-2">
                            <label
                              htmlFor="address"
                              className="text-sm font-medium text-white flex items-center gap-2"
                            >
                              <MapPin className="h-4 w-4" />
                              Full Address{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field
                              as="textarea"
                              id="address"
                              name="address"
                              placeholder="Enter your complete address"
                              rows={3}
                              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base resize-none"
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="text-red-400 text-xs mt-1"
                            />
                          </div>
                        </div>

                        {/* ==================== SECTION 2: Parent Details ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              Parent Details
                            </h2>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                              <label
                                htmlFor="fathersName"
                                className="text-sm font-medium text-white"
                              >
                                Father's Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="fathersName"
                                name="fathersName"
                                type="text"
                                placeholder="Enter father's full name"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="fathersName"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="mothersName"
                                className="text-sm font-medium text-white"
                              >
                                Mother's Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="mothersName"
                                name="mothersName"
                                type="text"
                                placeholder="Enter mother's full name"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="mothersName"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="parentContact"
                              className="text-sm font-medium text-white flex items-center gap-2"
                            >
                              <Phone className="h-4 w-4" />
                              Parent Mobile Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field
                              id="parentContact"
                              name="parentContact"
                              type="tel"
                              placeholder="Enter parent's phone number"
                              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                            />
                            <ErrorMessage
                              name="parentContact"
                              component="div"
                              className="text-red-400 text-xs mt-1"
                            />
                          </div>
                        </div>

                        {/* ==================== SECTION 3: Identification ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              Identification
                            </h2>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="aadhaarNumber"
                              className="text-sm font-medium text-white"
                            >
                              Aadhaar Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field
                              id="aadhaarNumber"
                              name="aadhaarNumber"
                              type="text"
                              placeholder="Enter your 12-digit Aadhaar number"
                              maxLength={12}
                              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                            />
                            <ErrorMessage
                              name="aadhaarNumber"
                              component="div"
                              className="text-red-400 text-xs mt-1"
                            />
                          </div>
                        </div>

                        {/* ==================== SECTION 4: Course Information ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                              <Building className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              Course Information
                            </h2>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                              <label
                                htmlFor="center"
                                className="text-sm font-medium text-white"
                              >
                                Center <span className="text-red-500">*</span>
                              </label>
                              <Field name="center">
                                {({ field }: any) => (
                                  <select
                                    {...field}
                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                                  >
                                    <option
                                      value=""
                                      disabled
                                      className="bg-black text-gray-400"
                                    >
                                      Select your training center
                                    </option>
                                    {centersLoading ? (
                                      <option
                                        value=""
                                        disabled
                                        className="bg-black"
                                      >
                                        Loading centers...
                                      </option>
                                    ) : (
                                      centers.map((center) => (
                                        <option
                                          key={center.id}
                                          value={center.id}
                                          className="bg-black text-white"
                                        >
                                          {center.name}
                                        </option>
                                      ))
                                    )}
                                  </select>
                                )}
                              </Field>
                              <ErrorMessage
                                name="center"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="courseLevel"
                                className="text-sm font-medium text-white flex items-center gap-2"
                              >
                                <BookOpen className="h-4 w-4" />
                                Course Level{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                as="select"
                                id="courseLevel"
                                name="courseLevel"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              >
                                <option
                                  value=""
                                  disabled
                                  className="bg-black text-gray-400"
                                >
                                  Select your level
                                </option>
                                {courseLevelsLoading ? (
                                  <option
                                    disabled
                                    className="bg-black text-gray-400"
                                  >
                                    Loading levels...
                                  </option>
                                ) : (
                                  courseLevels.map((level) => (
                                    <option
                                      key={level.id}
                                      value={level.id}
                                      className="bg-black text-white"
                                    >
                                      {level.name}
                                    </option>
                                  ))
                                )}
                              </Field>
                              <ErrorMessage
                                name="courseLevel"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="hostelFacility"
                              className="text-sm font-medium text-white flex items-center gap-2"
                            >
                              <Home className="h-4 w-4" />
                              Hostel Facility Needed{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field name="hostelFacility">
                              {({ field, form }: any) => (
                                <select
                                  {...field}
                                  onChange={(e) =>
                                    form.setFieldValue(
                                      "hostelFacility",
                                      e.target.value === "true",
                                    )
                                  }
                                  value={
                                    field.value === true
                                      ? "true"
                                      : field.value === false
                                        ? "false"
                                        : ""
                                  }
                                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                                >
                                  <option
                                    value=""
                                    disabled
                                    className="bg-black text-gray-400"
                                  >
                                    Select option
                                  </option>
                                  <option
                                    value="true"
                                    className="bg-black text-white"
                                  >
                                    Yes
                                  </option>
                                  <option
                                    value="false"
                                    className="bg-black text-white"
                                  >
                                    No
                                  </option>
                                </select>
                              )}
                            </Field>
                            <ErrorMessage
                              name="hostelFacility"
                              component="div"
                              className="text-red-400 text-xs mt-1"
                            />
                          </div>
                        </div>

                        {/* ==================== SECTION 5: Educational Qualification ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                              <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              Educational Qualification
                            </h2>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="highestQualification"
                              className="text-sm font-medium text-white"
                            >
                              Highest Qualification{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field
                              as="select"
                              id="highestQualification"
                              name="highestQualification"
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setFieldValue(
                                  "highestQualification",
                                  e.target.value,
                                );
                                if (e.target.value !== "Other") {
                                  setFieldValue("otherQualification", "");
                                }
                              }}
                              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                            >
                              <option
                                value=""
                                disabled
                                className="bg-black text-gray-400"
                              >
                                Select your qualification
                              </option>
                              {qualificationOptions.map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  className="bg-black text-white"
                                >
                                  {option}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="highestQualification"
                              component="div"
                              className="text-red-400 text-xs mt-1"
                            />
                          </div>

                          {values.highestQualification === "Other" && (
                            <div className="space-y-2">
                              <label
                                htmlFor="otherQualification"
                                className="text-sm font-medium text-white"
                              >
                                Please specify qualification{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="otherQualification"
                                name="otherQualification"
                                type="text"
                                placeholder="e.g., ITI Electrical"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="otherQualification"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          )}
                        </div>

                        {/* ==================== SECTION 6: German Language Background ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                              <Languages className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              German Language Background
                            </h2>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="studiedGerman"
                              className="text-sm font-medium text-white"
                            >
                              Have you studied German before?{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field name="studiedGerman">
                              {({ field, form }: any) => (
                                <select
                                  {...field}
                                  onChange={(e) => {
                                    const boolValue = e.target.value === "true";
                                    form.setFieldValue(
                                      "studiedGerman",
                                      boolValue,
                                    );
                                    if (!boolValue) {
                                      form.setFieldValue("levelCompleted", "");
                                    }
                                  }}
                                  value={
                                    field.value === true
                                      ? "true"
                                      : field.value === false
                                        ? "false"
                                        : ""
                                  }
                                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                                >
                                  <option
                                    value=""
                                    disabled
                                    className="bg-black text-gray-400"
                                  >
                                    Select option
                                  </option>
                                  <option
                                    value="true"
                                    className="bg-black text-white"
                                  >
                                    Yes
                                  </option>
                                  <option
                                    value="false"
                                    className="bg-black text-white"
                                  >
                                    No
                                  </option>
                                </select>
                              )}
                            </Field>
                            <ErrorMessage
                              name="studiedGerman"
                              component="div"
                              className="text-red-400 text-xs mt-1"
                            />
                          </div>

                          {values.studiedGerman === true && (
                            <div className="space-y-2">
                              <label
                                htmlFor="levelCompleted"
                                className="text-sm font-medium text-white"
                              >
                                Level Completed{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Field
                                id="levelCompleted"
                                name="levelCompleted"
                                type="text"
                                placeholder="e.g., A1, A2, B1"
                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                              />
                              <ErrorMessage
                                name="levelCompleted"
                                component="div"
                                className="text-red-400 text-xs mt-1"
                              />
                            </div>
                          )}
                        </div>

                        {/* ==================== SECTION 7: Purpose of Learning German ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              Purpose of Learning German
                            </h2>
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-medium text-white">
                              Select your purpose(s){" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {learningPurposeOptions.map((purpose) => (
                                <label
                                  key={purpose}
                                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors cursor-pointer"
                                >
                                  <Field
                                    type="checkbox"
                                    name="purposeLearningGerman"
                                    value={purpose}
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-yellow-400 focus:ring-yellow-400/20"
                                  />
                                  <span className="text-sm text-white/90">
                                    {purpose}
                                  </span>
                                </label>
                              ))}
                            </div>
                            <ErrorMessage
                              name="purposeLearningGerman"
                              component="div"
                              className="text-red-400 text-xs mt-1"
                            />
                          </div>
                        </div>

                        {/* ==================== SECTION 8: Work Experience ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              Work Experience
                            </h2>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="workExperience"
                              className="text-sm font-medium text-white"
                            >
                              Do you have work experience?{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Field name="workExperience">
                              {({ field, form }: any) => (
                                <select
                                  {...field}
                                  onChange={(e) =>
                                    form.setFieldValue(
                                      "workExperience",
                                      e.target.value === "true",
                                    )
                                  }
                                  value={
                                    field.value === true
                                      ? "true"
                                      : field.value === false
                                        ? "false"
                                        : ""
                                  }
                                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 sm:py-4 text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 text-sm sm:text-base"
                                >
                                  <option
                                    value=""
                                    disabled
                                    className="bg-black text-gray-400"
                                  >
                                    Select option
                                  </option>
                                  <option
                                    value="true"
                                    className="bg-black text-white"
                                  >
                                    Yes
                                  </option>
                                  <option
                                    value="false"
                                    className="bg-black text-white"
                                  >
                                    No
                                  </option>
                                </select>
                              )}
                            </Field>
                            <ErrorMessage
                              name="workExperience"
                              component="div"
                              className="text-red-400 text-xs mt-1"
                            />
                          </div>
                        </div>

                        {/* ==================== SECTION 9: Declaration ==================== */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
                              <FileCheck className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                              Declaration
                            </h2>
                          </div>

                          <label className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                            <Field
                              type="checkbox"
                              name="declaration"
                              className="w-6 h-6 mt-0.5 rounded border-white/20 bg-white/5 text-yellow-400 focus:ring-yellow-400/20"
                            />
                            <span className="text-sm text-white/90">
                              I hereby declare that the information provided is
                              true and correct to the best of my knowledge.{" "}
                              <span className="text-red-500">*</span>
                            </span>
                          </label>
                          <ErrorMessage
                            name="declaration"
                            component="div"
                            className="text-red-400 text-xs"
                          />
                        </div>

                        {/* ==================== SECTION 10: Security Verification ==================== */}
                        <div className="space-y-2 sm:space-y-3">
                          <label className="text-sm font-medium text-white flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Security Verification{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="flex justify-center">
                            {turnstileLoaded ? (
                              <div
                                ref={turnstileRef}
                                id="turnstile-container"
                              />
                            ) : (
                              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center bg-white/5">
                                <div className="flex flex-col items-center space-y-3">
                                  <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                                  <p className="text-white/70 font-medium">
                                    Loading security verification...
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <ErrorMessage
                            name="turnstileToken"
                            component="div"
                            className="text-red-400 text-xs mt-1 text-center"
                          />
                        </div>

                        {/* Submit Button */}
                        {submitStatus !== "idle" && (
                          <div
                            className={`mx-4 sm:mx-0 mb-6 p-4 rounded-xl border ${
                              submitStatus === "success"
                                ? "bg-green-500/10 border-green-500/30 text-green-400"
                                : "bg-red-500/10 border-red-500/30 text-red-400"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {submitStatus === "success" ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <XCircle className="h-5 w-5" />
                              )}
                              <span>{submitMessage}</span>
                            </div>
                          </div>
                        )}
                        <div className="pt-2 sm:pt-4">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            onClick={handleFormSubmit}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                <span>Submitting please wait...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <Send className="h-4 w-4" />
                                <span>Submit Registration</span>
                              </div>
                            )}
                          </Button>
                        </div>
                        {/* Success/Error Messages */}
                      </Form>
                    );
                  }}
                </Formik>

                {/* Additional Information */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      What happens next?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                      <div className="space-y-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-black font-bold text-xs sm:text-sm">
                            1
                          </span>
                        </div>
                        <p>We'll review your registration</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-black font-bold text-xs sm:text-sm">
                            2
                          </span>
                        </div>
                        <p>Contact you with course details</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-black font-bold text-xs sm:text-sm">
                            3
                          </span>
                        </div>
                        <p>Begin your German journey</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer note */}
                <p className="text-xs text-gray-500 text-center mt-6 sm:mt-8 px-2">
                  By registering, you agree to our terms and conditions. We'll
                  contact you with course details and enrollment information.
                  Your personal information will be handled according to our
                  privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
