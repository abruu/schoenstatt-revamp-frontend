# Strapi API Client

A performance-optimized, reusable API client for Strapi CMS built with TypeScript and native fetch API.

## Features

- 🚀 **Performance Optimized**: Built-in caching mechanism with configurable TTL
- 🔒 **Type Safe**: Full TypeScript support with comprehensive interfaces
- 🛠 **Flexible**: Support for all Strapi query parameters and operations
- 🔄 **Interceptors**: Request and response interceptors for custom logic
- 🎯 **Error Handling**: Comprehensive error handling with detailed error types
- 📦 **Modular**: Separate services for collections, single types, media, and auth
- 🌐 **Native**: Uses native fetch API, no external dependencies

## Quick Start

### 1. Environment Setup

Add these environment variables to your `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
```

### 2. Basic Usage

```typescript
import { strapiApi, createCollectionService } from '@/lib/api-services';

// Create a service for your collection
const articlesService = createCollectionService('articles');

// Fetch articles with relations
const articles = await articlesService.findMany({
  populate: ['author', 'categories'],
  pagination: { page: 1, pageSize: 10 }
});
```

## API Client (`api-client.ts`)

### Core Features

#### Basic Requests
```typescript
import { strapiApi } from '@/lib/api-client';

// GET request
const response = await strapiApi.get('/articles');

// POST request
const newArticle = await strapiApi.post('/articles', {
  data: { title: 'My Article', content: '...' }
});

// PUT request
const updated = await strapiApi.put('/articles/1', {
  data: { title: 'Updated Title' }
});

// DELETE request
await strapiApi.delete('/articles/1');
```

#### Strapi Query Parameters
```typescript
// Complex query with all Strapi features
const articles = await strapiApi.get('/articles', {
  populate: {
    author: {
      populate: ['avatar']
    },
    categories: true
  },
  filters: {
    title: {
      $containsi: 'react'
    },
    publishedAt: {
      $notNull: true
    }
  },
  sort: ['publishedAt:desc'],
  pagination: {
    page: 1,
    pageSize: 10
  },
  fields: ['title', 'slug', 'publishedAt']
});
```

#### Authentication
```typescript
// Set auth token
strapiApi.setAuthToken('your-jwt-token');

// Remove auth token
strapiApi.removeAuthToken();
```

#### Caching
```typescript
// Clear all cache
strapiApi.clearCache();

// Invalidate specific cache entries
strapiApi.invalidateCache('articles');
```

#### Interceptors
```typescript
// Request interceptor
strapiApi.addRequestInterceptor((config) => {
  console.log('Making request:', config);
  return config;
});

// Response interceptor
strapiApi.addResponseInterceptor((response) => {
  console.log('Received response:', response);
  return response;
});
```

## API Services (`api-services.ts`)

### Collection Service

For Strapi collection types (articles, products, etc.):

```typescript
import { createCollectionService } from '@/lib/api-services';

interface Article extends StrapiEntity {
  attributes: {
    title: string;
    content: string;
    slug: string;
    author: { data: Author };
  };
}

const articlesService = createCollectionService<Article>('articles');

// CRUD operations
const articles = await articlesService.findMany();
const article = await articlesService.findOne(1);
const newArticle = await articlesService.create({ title: 'New Article' });
const updated = await articlesService.update(1, { title: 'Updated' });
await articlesService.delete(1);

// Additional methods
const count = await articlesService.count();
const searchResults = await articlesService.search('react');
const published = await articlesService.findPublished();
```

### Single Type Service

For Strapi single types (global settings, homepage, etc.):

```typescript
import { createSingleTypeService } from '@/lib/api-services';

interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  logo: { data: any };
}

const globalService = createSingleTypeService<GlobalSettings>('global');

// Operations
const settings = await globalService.find();
const updated = await globalService.update({ siteName: 'New Name' });
```

### Media Service

For file uploads and media management:

```typescript
import { mediaService } from '@/lib/api-services';

// Upload files
const uploadResponse = await mediaService.upload(file);
const uploadMultiple = await mediaService.upload([file1, file2]);

// Upload with relation
const uploadToArticle = await mediaService.upload(
  file, 
  '1', // refId
  'api::article.article', // ref
  'featuredImage' // field
);

// Media operations
const fileInfo = await mediaService.getFile(1);
await mediaService.deleteFile(1);
const files = await mediaService.searchFiles();
```

### Authentication Service

For user authentication:

```typescript
import { authService } from '@/lib/api-services';

// Initialize auth from stored token
authService.initializeAuth();

// Login
const authResponse = await authService.login('user@example.com', 'password');

// Register
const registerResponse = await authService.register('username', 'email', 'password');

// Profile operations
const profile = await authService.getProfile();
const updated = await authService.updateProfile({ firstName: 'John' });

// Password operations
await authService.forgotPassword('user@example.com');
await authService.resetPassword('reset-code', 'newPassword', 'newPassword');

// Logout
authService.logout();
```

## Utility Functions

### Data Extraction
```typescript
import { utils } from '@/lib/api-services';

// Extract attributes from Strapi entity
const articleData = utils.extractAttributes(strapiArticle);

// Extract data from response
const data = utils.extractData(strapiResponse);
```

### Media URLs
```typescript
// Get full media URL
const imageUrl = utils.getMediaUrl(mediaObject);
const customBaseUrl = utils.getMediaUrl(mediaObject, 'https://cdn.example.com');
```

### Date Handling
```typescript
// Format Strapi dates
const formatted = utils.formatDate(article.createdAt);
const localized = utils.formatDate(article.createdAt, 'fr-FR');

// Build date range filters
const dateFilter = utils.buildDateRangeFilter(
  'publishedAt',
  new Date('2024-01-01'),
  new Date('2024-12-31')
);
```

### Complex Population
```typescript
// Build nested populate
const populate = utils.buildPopulate([
  'author.avatar',
  'categories',
  'comments.user.avatar'
]);
```

## Error Handling

The API client provides comprehensive error handling:

```typescript
try {
  const articles = await articlesService.findMany();
} catch (error) {
  if (error.status) {
    // Strapi error
    console.error(`Error ${error.status}: ${error.message}`);
    if (error.details) {
      console.error('Details:', error.details);
    }
  } else {
    // Network or other error
    console.error('Network error:', error.message);
  }
}
```

## React Integration

### With React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesService } from '@/lib/api-services';

// Fetch articles
const useArticles = (params?: any) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articlesService.findMany(params)
  });
};

// Create article
const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: articlesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    }
  });
};
```

### With SWR

```typescript
import useSWR from 'swr';
import { articlesService } from '@/lib/api-services';

const useArticles = (params?: any) => {
  return useSWR(
    ['articles', params],
    () => articlesService.findMany(params)
  );
};
```

## Performance Tips

1. **Use Caching**: GET requests are cached by default for 5 minutes
2. **Populate Wisely**: Only populate relations you need
3. **Pagination**: Always use pagination for large datasets
4. **Field Selection**: Use `fields` parameter to limit returned data
5. **Cache Invalidation**: Invalidate cache after mutations

## TypeScript Support

The API client is fully typed. Define your content types:

```typescript
interface Article extends StrapiEntity {
  attributes: {
    title: string;
    content: string;
    slug: string;
    publishedAt: string;
    author: {
      data: Author;
    };
  };
}

// Use with services
const articlesService = createCollectionService<Article>('articles');
```

## Examples

See `api-examples.ts` for comprehensive usage examples including:

- CRUD operations
- Complex queries and filters
- File uploads
- Authentication flows
- Error handling
- Batch operations
- Cache management

## Configuration

### Custom Base URL
```typescript
import { createStrapiClient } from '@/lib/api-client';

const customApi = createStrapiClient('https://api.example.com');
```

### Custom Headers
```typescript
const apiWithHeaders = createStrapiClient(
  'https://api.example.com',
  { 'X-Custom-Header': 'value' }
);
```

### Timeout Configuration
```typescript
await strapiApi.get('/articles', {}, { timeout: 30000 }); // 30 seconds
```

## Contributing

When extending the API client:

1. Maintain TypeScript strict mode compliance
2. Add comprehensive error handling
3. Include JSDoc comments
4. Update this README with new features
5. Add examples for new functionality

## License

This API client is part of the SLA Website project.
