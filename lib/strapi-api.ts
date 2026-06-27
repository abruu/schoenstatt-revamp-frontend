import axios from "axios";

const strapiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
strapiApi.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Upload photo to Strapi
export async function uploadPhotoToStrapi(
  file: File,
  firstName: string,
): Promise<{ id: number; documentId: string; name: string }> {
  try {
    const formData = new FormData();
    formData.append("files", file);
    formData.append(
      "data",
      JSON.stringify({
        fileInfo: {
          name: "photo",
          caption: firstName,
        },
      }),
    );

    const response = await strapiApi.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 180000,
    });

    if (response.data && response.data.length > 0) {
      return {
        id: response.data[0].id,
        documentId: response.data[0].documentId,
        name: response.data[0].name,
      };
    }

    throw new Error("No file data returned from upload");
  } catch (error) {
    console.error("Photo upload error:", error);
    throw new Error("Failed to upload photo to Strapi");
  }
}

// Upload Aadhaar document to Strapi
export async function uploadAadhaarToStrapi(
  file: File,
  firstName: string,
): Promise<{ id: number; documentId: string; name: string; url: string }> {
  try {
    const formData = new FormData();
    formData.append("files", file);
    formData.append(
      "data",
      JSON.stringify({
        fileInfo: {
          name: "proof",
          caption: firstName,
        },
      }),
    );

    const response = await strapiApi.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 180000,
    });

    if (response.data && response.data.length > 0) {
      return {
        id: response.data[0].id,
        documentId: response.data[0].documentId,
        name: response.data[0].name,
        url: response.data[0].url,
      };
    }

    throw new Error("No file data returned from upload");
  } catch (error) {
    console.error("Aadhaar upload error:", error);
    throw new Error("Failed to upload Aadhaar file to Strapi");
  }
}

// Register student in Strapi
export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth: string; // YYYY-MM-DD format
  email: string;
  phone: string;
  whatsappNumber?: string;
  isWhatsappSameAsPhone?: boolean;
  address: string;
  fathersName: string;
  mothersName: string;
  parentContact: string;
  center: string; // Branch ID
  photo: string | number; // Photo ID from upload
  aadhaarFile: number; // Uploaded file ID from Strapi
  courseLevel: string; // Language certification level ID
  hostelFacility?: boolean;
  highestQualification?: string;
  studiedGerman?: boolean;
  levelCompleted?: string;
  purposeLearningGerman?: string[];
  workExperience?: boolean;
}

export interface StudentRegistrationResponse {
  data: {
    id: number;
    documentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    parentName: string;
    parentContact: string;
    dateOfBirth: string;
    center: {
      id: number;
      documentId: string;
      name: string;
      header: string;
      address: string;
      phone: string;
      callno: string;
      email: string;
    };
    courseLevel: {
      id: number;
      documentId: string;
      LabelFull: string;
      LabelShort: string;
    };
    photo: {
      id: number;
      documentId: string;
      url: string;
      name: string;
    };
  };
}

export async function registerStudentInStrapi(
  data: StudentRegistrationData,
): Promise<StudentRegistrationResponse> {
  try {
    console.log("Registering student in Strapi:", data);
    const response = await strapiApi.post<StudentRegistrationResponse>(
      "/students",
      {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
          phone: data.phone,
          whatsappNumber: data.whatsappNumber,
          isWhatsappSameAsPhone: data.isWhatsappSameAsPhone,
          address: data.address,
          fathersName: data.fathersName,
          mothersName: data.mothersName,
          parentContact: data.parentContact,
          center: data.center,
          photo: data.photo,
          aadhaarFile: data.aadhaarFile,
          courseLevel: data.courseLevel,
          hostelFacility: data.hostelFacility,
          highestQualification: data.highestQualification,
          studiedGerman: data.studiedGerman,
          levelCompleted: data.levelCompleted,
          purposeLearningGerman: data.purposeLearningGerman,
          workExperience: data.workExperience,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Student registration error:", error);
    if (axios.isAxiosError(error)) {
      // Handle 409 Conflict error (duplicate email/phone)
      if (error.response?.status === 409) {
        const errorMessage =
          error.response?.data?.error?.message ||
          "A student with this email or phone number already exists.";
        throw new Error(errorMessage);
      }
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      throw new Error(`Failed to register student: ${errorMessage}`);
    }
    throw new Error("Failed to register student in Strapi");
  }
}

// Get student by email or phone (for duplicate check)
export async function checkStudentExists(
  email: string,
  phone: string,
): Promise<{ exists: boolean; field?: string }> {
  try {
    // Check email
    const emailResponse = await strapiApi.get("/students", {
      params: {
        filters: {
          email: {
            $eq: email,
          },
        },
        pagination: {
          pageSize: 1,
        },
      },
    });

    if (emailResponse.data.data && emailResponse.data.data.length > 0) {
      return { exists: true, field: "email address" };
    }

    // Check phone
    const phoneResponse = await strapiApi.get("/students", {
      params: {
        filters: {
          phone: {
            $eq: phone,
          },
        },
        pagination: {
          pageSize: 1,
        },
      },
    });

    if (phoneResponse.data.data && phoneResponse.data.data.length > 0) {
      return { exists: true, field: "phone number" };
    }

    return { exists: false };
  } catch (error) {
    console.error("Duplicate check error:", error);
    // If check fails, allow registration to proceed
    return { exists: false };
  }
}

// Get admin notification emails
export interface AdminNotificationEmail {
  id: number;
  documentId: string;
  UserName: string;
  UserEmailForGettingNotifications: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AdminNotificationEmailsResponse {
  data: AdminNotificationEmail[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function getAdminNotificationEmails(): Promise<string[]> {
  try {
    const response = await strapiApi.get<AdminNotificationEmailsResponse>(
      "/admin-notification-emails",
      {
        params: {
          "pagination[pageSize]": 100,
        },
      },
    );

    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data
        .map((item) => item.UserEmailForGettingNotifications)
        .filter((email) => email && email.trim());
    }

    return [];
  } catch (error) {
    console.error("Error fetching admin notification emails:", error);
    return [];
  }
}

export { strapiApi };
