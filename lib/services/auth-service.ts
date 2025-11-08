import strapiClient from '@/lib/strapi-client';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface StrapiUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  isSuperAdmin: boolean;
  assignedCenter?: {
    id: number;
    documentId: string;
    name: string;
    header: string;
    address: string;
    gradient?: string;
    image?: any;
  };
}

export interface LoginResponse {
  jwt: string;
  user: StrapiUser;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await strapiClient.post('/auth/local', credentials);
    const { jwt, user } = response.data;
    
    // Store JWT
    if (typeof window !== 'undefined') {
      localStorage.setItem('strapi_jwt', jwt);
    }
    
    return { jwt, user };
  },

  async getProfile(): Promise<StrapiUser> {
    const response = await strapiClient.get('/user-profile/me');
    return response.data.data;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strapi_jwt');
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('strapi_jwt');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
