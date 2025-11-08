import strapiClient from '@/lib/strapi-client';
import qs from 'qs';

export interface StrapiStudent {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  parentName: string;
  parentContact: string;
  aadhaarNumber: string;
  status: 'pending' | 'accepted' | 'rejected' | 'enquired';
  photo?: {
    id: number;
    url: string;
    formats?: any;
  };
  center?: {
    id: number;
    documentId: string;
    name: string;
    header: string;
  };
  courseLevel?: {
    id: number;
    documentId: string;
    LabelFull: string;
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
  status?: string;
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
      },
      sort: ['createdAt:desc'],
      filters: {}
    };

    // Add search filter
    if (params?.search) {
      queryParams.filters.$or = [
        { firstName: { $containsi: params.search } },
        { lastName: { $containsi: params.search } },
        { email: { $containsi: params.search } },
        { aadhaarNumber: { $containsi: params.search } }
      ];
    }

    // Add course level filter
    if (params?.courseLevel && params.courseLevel !== 'all') {
      queryParams.filters.courseLevel = { name: { $eq: params.courseLevel } };
    }

    // Add status filter
    if (params?.status && params.status !== 'all') {
      queryParams.filters.status = { $eq: params.status };
    }

    // Add center filter (for super admin)
    if (params?.center && params.center !== 'all') {
      queryParams.filters.center = { documentId: { $eq: params.center } };
    }

    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
    const response = await strapiClient.get(`/students?${queryString}`);
    return response.data;
  },

  async getOne(documentId: string): Promise<StrapiStudent> {
    const queryParams = {
      populate: {
        center: true,
        courseLevel: true,
        photo: true,
      }
    };
    
    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
    const response = await strapiClient.get(`/students/${documentId}?${queryString}`);
    return response.data.data;
  },

  async create(data: Partial<StrapiStudent>): Promise<StrapiStudent> {
    const response = await strapiClient.post('/students', { data });
    return response.data.data;
  },

  async update(documentId: string, data: Partial<StrapiStudent>): Promise<StrapiStudent> {
    const response = await strapiClient.put(`/students/${documentId}`, { data });
    return response.data.data;
  },

  async updateStatus(documentId: string, status: 'pending' | 'accepted' | 'rejected' | 'enquired'): Promise<StrapiStudent> {
    const response = await strapiClient.put(`/students/${documentId}`, { 
      data: { status } 
    });
    return response.data.data;
  },

  async delete(documentId: string): Promise<void> {
    await strapiClient.delete(`/students/${documentId}`);
  },

  async uploadPhoto(documentId: string, file: File): Promise<StrapiStudent> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('ref', 'api::student.student');
    formData.append('refId', documentId);
    formData.append('field', 'photo');

    await strapiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Fetch updated student
    return this.getOne(documentId);
  }
};
