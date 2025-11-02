# API Store Documentation

This directory contains Zustand stores for managing API calls and application state.

## API Store (`api-store.ts`)

A simple Zustand store for managing API calls with loading states and error handling, specifically designed for Strapi backend integration.

### Features

- **Loading States**: Automatic loading state management for API calls
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Strapi Integration**: Built-in support for Strapi API with proper query parameter formatting
- **Axios Integration**: Uses axios for HTTP requests with interceptors
- **Query String Support**: Uses `qs` library for complex query parameter serialization

### Basic Usage

```tsx
import { useApiStore } from '@/lib/stores/api-store';

function EventsComponent() {
  const { events, eventsLoading, eventsError, fetchEvents } = useApiStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (eventsLoading) return <div>Loading...</div>;
  if (eventsError) return <div>Error: {eventsError}</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.attributes.title}</div>
      ))}
    </div>
  );
}
```

### Advanced Usage with Filters

```tsx
import { apiHelpers } from '@/lib/stores/api-store';

// Filter events by category
await apiHelpers.getEvents({
  category: 'workshop',
  page: 1,
  pageSize: 10
});

// Search events
await apiHelpers.getEvents({
  search: 'language learning',
  pageSize: 5
});

// Get single event
const event = await apiHelpers.getEventById(123);
```

### Store State

The store manages the following state:

- `events`: Array of event objects from Strapi
- `eventsLoading`: Boolean indicating if events are being fetched
- `eventsError`: String containing error message or null
- `loading`: Generic loading state
- `error`: Generic error state

### Actions

- `fetchEvents(params?)`: Fetch events with optional parameters
- `clearError()`: Clear all error states
- `setLoading(loading)`: Set generic loading state

### Environment Variables

Make sure to set these in your `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_TOKEN=your_strapi_api_token
```

### Strapi Query Parameters

The store automatically handles Strapi-specific query parameters:

- `populate`: Populates relations (default: '*')
- `sort`: Sorting (default: 'date:desc')
- `pagination`: Page and page size
- `filters`: Complex filtering with operators like `$eq`, `$containsi`, etc.

### Error Handling

The store includes comprehensive error handling:

- Network errors
- Strapi API errors
- Timeout errors
- Authentication errors

All errors are formatted into user-friendly messages and stored in the error state.

### Example Component

See `components/examples/api-example.tsx` for a complete example of how to use the API store in a React component.

## Extending the Store

To add more API endpoints, follow this pattern:

1. Add new state properties for the data, loading, and error states
2. Create action functions that follow the same pattern as `fetchEvents`
3. Add helper functions to `apiHelpers` for common use cases
4. Update the TypeScript interfaces as needed

```tsx
// Add to the store interface
interface ApiState {
  // ... existing properties
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  fetchUsers: (params?: Record<string, any>) => Promise<void>;
}

// Add to the store implementation
export const useApiStore = create<ApiState>((set, get) => ({
  // ... existing state
  users: [],
  usersLoading: false,
  usersError: null,

  fetchUsers: async (params = {}) => {
    set({ usersLoading: true, usersError: null });
    
    try {
      const queryString = qs.stringify(params, { encodeValuesOnly: true });
      const response = await api.get(`/users?${queryString}`);
      set({ users: response.data.data, usersLoading: false });
    } catch (error) {
      set({ 
        users: [],
        usersLoading: false,
        usersError: error.message 
      });
    }
  },
}));
```
