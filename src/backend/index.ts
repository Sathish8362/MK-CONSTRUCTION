/**
 * Backend Architecture Barrel Export
 * Groups all backend database operations, notifications, auth, image processing, and Supabase server clients.
 */

// Database and Persistence
export * from './db/data-store';
export * from './db/mock-data';

// Backend Services
export * from './services/notifications';
export * from './services/image-compression';
export * from './services/auth';

// Supabase Server & Admin Clients
export * from './supabase/admin';
export * from './supabase/server';
