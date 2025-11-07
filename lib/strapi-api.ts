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
  }
);

// Upload photo to Strapi
export async function uploadPhotoToStrapi(
  file: File
): Promise<{ id: number; documentId: string; name: string }> {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await strapiApi.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

// Register student in Strapi
export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD format
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentContact: string;
  aadhaarNumber: string;
  center: string; // Branch ID
  photo: string; // Photo ID from upload
  courseLevel: string; // Language certification level ID
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
    aadhaarNumber: string;
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
  data: StudentRegistrationData
): Promise<StudentRegistrationResponse> {
  try {
    console.log("Registering student in Strapi:", data);
    const response = await strapiApi.post<StudentRegistrationResponse>(
      "/students",
      {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
          phone: data.phone,
          address: data.address,
          parentName: data.parentName,
          parentContact: data.parentContact,
          aadhaarNumber: data.aadhaarNumber,
          center: data.center,
          photo: data.photo,
          courseLevel: data.courseLevel,
        },
      }
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
  phone: string
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

export { strapiApi };
