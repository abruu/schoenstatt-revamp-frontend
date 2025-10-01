'use client';

import React, { useEffect } from 'react';
import { useApiStore, apiHelpers } from '@/lib/stores/api-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, MapPin, RefreshCw } from 'lucide-react';

const ApiExample: React.FC = () => {
  const { 
    events, 
    eventsLoading, 
    eventsError, 
    fetchEvents, 
    clearError 
  } = useApiStore();

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRefresh = () => {
    clearError();
    fetchEvents();
  };

  const handleFilteredFetch = () => {
    // Example: Fetch events with filters
    apiHelpers.getEvents({
      category: 'workshop',
      page: 1,
      pageSize: 5,
    });
  };

  const handleSearchFetch = () => {
    // Example: Search events
    apiHelpers.getEvents({
      search: 'language',
      pageSize: 3,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Store Example</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} disabled={eventsLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${eventsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleFilteredFetch} variant="outline" disabled={eventsLoading}>
            Filter Events
          </Button>
          <Button onClick={handleSearchFetch} variant="outline" disabled={eventsLoading}>
            Search Events
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {eventsLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span className="text-lg">Loading events...</span>
        </div>
      )}

      {/* Error State */}
      {eventsError && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Error: {eventsError}</span>
              <Button 
                onClick={clearError} 
                variant="outline" 
                size="sm"
                className="ml-4"
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Events Grid */}
      {!eventsLoading && !eventsError && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {event.attributes.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.attributes.date).toLocaleDateString()}
                  {event.attributes.location && (
                    <>
                      <MapPin className="w-4 h-4 ml-2" />
                      {event.attributes.location}
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {event.attributes.description}
                </p>
                {event.attributes.category && (
                  <div className="mt-3">
                    <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      {event.attributes.category}
                    </span>
                  </div>
                )}
                {event.attributes.image?.data && (
                  <div className="mt-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${event.attributes.image.data.attributes.url}`}
                      alt={event.attributes.image.data.attributes.alternativeText || event.attributes.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!eventsLoading && !eventsError && events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            There are no events available at the moment.
          </p>
          <Button onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      )}

      {/* API Store State Debug Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Store State (Debug)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>Events Count:</strong> {events.length}</div>
            <div><strong>Loading:</strong> {eventsLoading ? 'Yes' : 'No'}</div>
            <div><strong>Error:</strong> {eventsError || 'None'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiExample;
