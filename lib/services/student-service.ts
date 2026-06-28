import strapiClient from "@/lib/strapi-client";
import qs from "qs";

export interface StrapiStudent {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  gender?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  dateOfBirth: string;
  address: string;
  fathersName?: string;
  mothersName?: string;
  parentName: string;
  parentContact: string;
  hostelFacility?: boolean;
  highestQualification?: string;
  otherQualification?: string;
  studiedGerman?: boolean;
  levelCompleted?: string;
  purposeLearningGerman?: string[];
  workExperience?: boolean;
  howDidYouHearAboutUs?: string;
  howDidYouHearAboutUsOther?: string;
  statuses: "pending" | "accepted" | "rejected" | "enquired";
  photo?: {
    id: number;
    url: string;
    formats?: any;
  };
  aadhaarFile?: {
    id: number;
    url: string;
    name?: string;
    ext?: string;
    mime?: string;
  };
  center?: {
    id: number;
    documentId: string;
    name: string;
    header: string;
    email?: string;
  };
  courseLevel?: {
    id: number;
    documentId: string;
    LabelFull: string;
    LabelShort?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentListResponse {
  data: StrapiStudent[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StudentParams {
  page?: number;
  pageSize?: number;
  search?: string;
  courseLevel?: string;
  registrationDate?: string; // DD/MM/YYYY
  center?: string;
  populate?: string[];
}

export const studentService = {
  async getAll(params?: StudentParams): Promise<StudentListResponse> {
    const queryParams: any = {
      pagination: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
      populate: {
        center: true,
        courseLevel: true,
        photo: true,
        aadhaarFile: true,
      },
      sort: ["createdAt:desc"],
      filters: {},
    };

    // Add search filter
    if (params?.search) {
      queryParams.filters.$or = [
        { firstName: { $containsi: params.search } },
        { lastName: { $containsi: params.search } },
        { email: { $containsi: params.search } },
        { phone: { $containsi: params.search } },
      ];
    }

    // Add course level filter
    if (params?.courseLevel && params.courseLevel !== "all") {
      queryParams.filters.courseLevel = {
        documentId: { $eq: params.courseLevel },
      };
    }

    // Add registration date filter (DD/MM/YYYY or DD/MM/YYYY - DD/MM/YYYY → Strapi date range)
    if (params?.registrationDate) {
      const rangeMatch = params.registrationDate.match(
        /^(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{2})\/(\d{4})$/,
      );
      if (rangeMatch) {
        const [, sDay, sMonth, sYear, eDay, eMonth, eYear] = rangeMatch;
        const isoStart = `${sYear}-${sMonth}-${sDay}`;
        const isoEnd = `${eYear}-${eMonth}-${eDay}`;
        const nextDay = new Date(`${isoEnd}T00:00:00Z`);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        const isoNextDay = nextDay.toISOString().split("T")[0];
        queryParams.filters.createdAt = {
          $gte: isoStart,
          $lt: isoNextDay,
        };
      } else {
        const dateMatch = params.registrationDate.match(
          /^(\d{2})\/(\d{2})\/(\d{4})$/,
        );
        if (dateMatch) {
          const [, day, month, year] = dateMatch;
          const isoDate = `${year}-${month}-${day}`;
          const nextDay = new Date(`${isoDate}T00:00:00Z`);
          nextDay.setUTCDate(nextDay.getUTCDate() + 1);
          const isoNextDay = nextDay.toISOString().split("T")[0];
          queryParams.filters.createdAt = {
            $gte: isoDate,
            $lt: isoNextDay,
          };
        }
      }
    }

    // Add center filter (for super admin)
    if (params?.center && params.center !== "all") {
      queryParams.filters.center = { documentId: { $eq: params.center } };
    }

    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
    const response = await strapiClient.get(`/students?${queryString}`);
    return response.data;
  },

  async getOne(documentId: string): Promise<StrapiStudent> {
    const queryParams = {
      populate: ["center", "courseLevel", "photo", "aadhaarFile"],
      filters: { documentId: { $eq: documentId } },
    };

    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
    const response = await strapiClient.get(`/students?${queryString}`);
    return response.data.data[0];
  },

  async create(data: Partial<StrapiStudent>): Promise<StrapiStudent> {
    const response = await strapiClient.post("/students", { data });
    return response.data.data;
  },

  async update(
    documentId: string,
    data: Partial<StrapiStudent>,
  ): Promise<StrapiStudent> {
    const response = await strapiClient.put(`/students/${documentId}`, {
      data,
    });
    return response.data.data;
  },

  async updateStatus(
    documentId: string,
    statuses: "pending" | "accepted" | "rejected" | "enquired",
  ): Promise<StrapiStudent> {
    const response = await strapiClient.put(`/students/${documentId}`, {
      data: { statuses },
    });
    return response.data.data;
  },

  async delete(documentId: string): Promise<void> {
    await strapiClient.delete(`/students/${documentId}`);
  },

  async uploadPhoto(
    documentId: string,
    file: File,
    firstName: string,
  ): Promise<StrapiStudent> {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", "api::student.student");
    formData.append("refId", documentId);
    formData.append("field", "photo");
    formData.append(
      "data",
      JSON.stringify({
        fileInfo: {
          name: "photo",
          caption: firstName,
        },
      }),
    );

    await strapiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Fetch updated student
    return this.getOne(documentId);
  },
};
