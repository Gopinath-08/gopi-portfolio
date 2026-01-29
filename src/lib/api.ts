// API Base URL configuration
// Priority: 1. VITE_API_URL env variable, 2. Production URL, 3. Proxy for development
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.PROD
  ? 'https://gopi-backend-mpjh.onrender.com/api'
  : 'https://gopi-backend-mpjh.onrender.com/api'; // Use production API URL

export interface ApiError {
  status: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  type?: 'mobile' | 'website';
  createdAt: string;
  updatedAt?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async sendContactMessage(formData: ContactFormData): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async getProjects(): Promise<{ status: string; data: Project[] }> {
    return this.request<{ status: string; data: Project[] }>('/projects', {
      method: 'GET',
    });
  }

  async getGitHubStats(): Promise<{ status: string; data: GitHubStats }> {
    return this.request<{ status: string; data: GitHubStats }>('/github/stats', {
      method: 'GET',
    });
  }

  async getGitHubProfile(): Promise<{ status: string; data: GitHubProfile }> {
    return this.request<{ status: string; data: GitHubProfile }>('/github/profile', {
      method: 'GET',
    });
  }
}

export interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  blog: string | null;
  location: string | null;
}

export const apiClient = new ApiClient(API_BASE_URL);

