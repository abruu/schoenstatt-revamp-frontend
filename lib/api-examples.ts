/**
 * Strapi API Usage Examples
 * Demonstrates how to use the StrapiApiClient and services
 */

import { 
  createCollectionService, 
  createSingleTypeService,
  mediaService,
  authService,
  utils,
  StrapiEntity
} from './api-services';
import { strapiApi } from './api-client';

// Example: Define your content types
interface Article extends StrapiEntity {
  attributes: {
    title: string;
    content: string;
    slug: string;
    publishedAt: string;
    author: {
      data: Author;
    };
    categories: {
      data: Category[];
    };
    featuredImage: {
      data: any;
    };
  };
}

interface Author extends StrapiEntity {
  attributes: {
    name: string;
    email: string;
    bio: string;
    avatar: {
      data: any;
    };
  };
}

interface Category extends StrapiEntity {
  attributes: {
    name: string;
    slug: string;
    description: string;
  };
}

interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  logo: {
    data: any;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

// Create service instances
const articlesService = createCollectionService<Article>('articles');
const authorsService = createCollectionService<Author>('authors');
const categoriesService = createCollectionService<Category>('categories');
const globalService = createSingleTypeService<GlobalSettings>('global');

// Example usage functions
export const apiExamples = {
  // Basic CRUD operations
  async createArticle() {
    try {
      const newArticle = await articlesService.create({
        title: 'My New Article',
        content: 'This is the content of my article...',
        slug: 'my-new-article'
      });
      
      console.log('Created article:', utils.extractAttributes(newArticle.data));
      return newArticle;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Get articles with relations populated
  async getArticlesWithAuthors() {
    try {
      const articles = await articlesService.findMany({
        populate: {
          author: {
            populate: ['avatar']
          },
          categories: true,
          featuredImage: true
        },
        pagination: {
          page: 1,
          pageSize: 10
        },
        sort: ['publishedAt:desc']
      });

      return articles.data.map(article => ({
        ...utils.extractAttributes(article),
        id: article.id
      }));
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Search articles
  async searchArticles(query: string) {
    try {
      const results = await articlesService.search(query, ['title', 'content']);
      return results.data.map(article => utils.extractAttributes(article));
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  },

  // Filter articles by category
  async getArticlesByCategory(categorySlug: string) {
    try {
      const articles = await articlesService.findMany({
        filters: {
          categories: {
            slug: {
              $eq: categorySlug
            }
          }
        },
        populate: ['author', 'featuredImage']
      });

      return articles.data.map(article => utils.extractAttributes(article));
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      throw error;
    }
  },

  // Get articles published in date range
  async getArticlesByDateRange(startDate: Date, endDate: Date) {
    try {
      const dateFilter = utils.buildDateRangeFilter('publishedAt', startDate, endDate);
      
      const articles = await articlesService.findMany({
        filters: dateFilter,
        sort: ['publishedAt:desc']
      });

      return articles.data.map(article => utils.extractAttributes(article));
    } catch (error) {
      console.error('Error fetching articles by date range:', error);
      throw error;
    }
  },

  // Upload and attach image to article
  async uploadArticleImage(file: File, articleId: string) {
    try {
      // Upload the file
      const uploadResponse = await mediaService.upload(file);
      const uploadedFile = uploadResponse.data[0];

      // Update article with the uploaded image
      const updatedArticle = await articlesService.update(articleId, {
        featuredImage: uploadedFile.id
      });

      return {
        article: utils.extractAttributes(updatedArticle.data),
        imageUrl: utils.getMediaUrl(uploadedFile)
      };
    } catch (error) {
      console.error('Error uploading article image:', error);
      throw error;
    }
  },

  // Authentication example
  async authenticateUser(email: string, password: string) {
    try {
      const authResponse = await authService.login(email, password);
      
      // Get user profile
      const profile = await authService.getProfile();
      
      return {
        token: authResponse.data.jwt,
        user: authResponse.data.user,
        profile: profile.data
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  // Get global settings
  async getGlobalSettings() {
    try {
      const settings = await globalService.find({
        populate: {
          logo: true
        }
      });

      const settingsData = utils.extractData(settings);
      
      return {
        ...settingsData,
        logoUrl: settingsData.logo?.data ? utils.getMediaUrl(settingsData.logo.data) : null
      };
    } catch (error) {
      console.error('Error fetching global settings:', error);
      throw error;
    }
  },

  // Advanced filtering example
  async getPublishedArticlesByAuthor(authorId: number, limit: number = 5) {
    try {
      const articles = await articlesService.findMany({
        filters: {
          author: {
            id: {
              $eq: authorId
            }
          },
          publishedAt: {
            $notNull: true
          }
        },
        populate: ['categories', 'featuredImage'],
        pagination: {
          pageSize: limit
        },
        sort: ['publishedAt:desc']
      });

      return articles.data.map(article => ({
        ...utils.extractAttributes(article),
        id: article.id,
        featuredImageUrl: article.attributes.featuredImage?.data 
          ? utils.getMediaUrl(article.attributes.featuredImage.data)
          : null
      }));
    } catch (error) {
      console.error('Error fetching articles by author:', error);
      throw error;
    }
  },

  // Direct API calls for custom endpoints
  async getCustomData() {
    try {
      // Direct API call for custom endpoint
      const response = await strapiApi.get('/custom-endpoint', {
        populate: ['relation1', 'relation2'],
        filters: {
          status: 'active'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching custom data:', error);
      throw error;
    }
  },

  // Batch operations
  async batchCreateArticles(articlesData: Array<Partial<Article['attributes']>>) {
    try {
      const promises = articlesData.map(data => articlesService.create(data));
      const results = await Promise.allSettled(promises);
      
      const successful = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => utils.extractAttributes(result.value.data));
        
      const failed = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason);

      return { successful, failed };
    } catch (error) {
      console.error('Error in batch create:', error);
      throw error;
    }
  },

  // Cache management
  async refreshArticlesCache() {
    try {
      // Clear cache for articles
      strapiApi.invalidateCache('articles');
      
      // Fetch fresh data
      const articles = await articlesService.findMany({
        populate: ['author', 'categories']
      });

      return articles.data.map(article => utils.extractAttributes(article));
    } catch (error) {
      console.error('Error refreshing cache:', error);
      throw error;
    }
  }
};

// React Hook examples (for use in components)
export const useApiExamples = {
  // Example custom hook for articles
  useArticles: (params?: any) => {
    // This would typically use React Query, SWR, or similar
    // Here's the basic API call structure:
    return {
      fetchArticles: () => articlesService.findMany(params),
      createArticle: (data: Partial<Article['attributes']>) => articlesService.create(data),
      updateArticle: (id: string, data: Partial<Article['attributes']>) => articlesService.update(id, data),
      deleteArticle: (id: string) => articlesService.delete(id)
    };
  }
};

// Initialize authentication on app start
export const initializeAuth = () => {
  authService.initializeAuth();
};

// Error handling helper
export const handleApiError = (error: any) => {
  if (error.status) {
    // Strapi error
    console.error(`Strapi Error ${error.status}: ${error.message}`);
    return {
      type: 'strapi_error',
      status: error.status,
      message: error.message,
      details: error.details
    };
  } else if (error.message) {
    // Network or other error
    console.error(`Network Error: ${error.message}`);
    return {
      type: 'network_error',
      message: error.message
    };
  } else {
    // Unknown error
    console.error('Unknown error:', error);
    return {
      type: 'unknown_error',
      message: 'An unknown error occurred'
    };
  }
};
