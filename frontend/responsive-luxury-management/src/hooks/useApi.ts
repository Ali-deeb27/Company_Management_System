import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/lib/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiQuery<T>(
  queryFn: () => Promise<ApiResponse<T>>,
  deps: React.DependencyList = [],
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null
  });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await queryFn();
      
      if (response.error) {
        setState({ data: null, loading: false, error: response.error });
        if (options.showErrorToast !== false) {
          toast({
            title: 'Error',
            description: response.error,
            variant: 'destructive'
          });
        }
        options.onError?.(response.error);
      } else {
        setState({ data: response.data, loading: false, error: null });
        options.onSuccess?.(response.data!);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      if (options.showErrorToast !== false) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
      options.onError?.(errorMessage);
    }
  }, [queryFn, toast, options]);

  useEffect(() => {
    fetchData();
  }, [...deps, fetchData]);

  return { ...state, refetch: fetchData };
}

export function useApiMutation<T, P = void>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });
  const { toast } = useToast();

  const mutate = useCallback(async (params: P): Promise<ApiResponse<T>> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await mutationFn(params);
      
      if (response.error) {
        setState({ data: null, loading: false, error: response.error });
        if (options.showErrorToast !== false) {
          toast({
            title: 'Error',
            description: response.error,
            variant: 'destructive'
          });
        }
        options.onError?.(response.error);
        return response;
      } else {
        setState({ data: response.data, loading: false, error: null });
        if (options.showSuccessToast !== false && options.successMessage) {
          toast({
            title: 'Success',
            description: options.successMessage
          });
        }
        options.onSuccess?.(response.data!);
        return response;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      if (options.showErrorToast !== false) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
      options.onError?.(errorMessage);
      return { data: null, error: errorMessage };
    }
  }, [mutationFn, toast, options]);

  return { ...state, mutate };
}

// Specific hooks for each entity
export function useDepartments() {
  return useApiQuery(
    async () => {
      const { departmentsApi } = await import('@/lib/api');
      return departmentsApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function useEmployees() {
  return useApiQuery(
    async () => {
      const { employeesApi } = await import('@/lib/api');
      return employeesApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function useInterns() {
  return useApiQuery(
    async () => {
      const { internsApi } = await import('@/lib/api');
      return internsApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function useProjects() {
  return useApiQuery(
    async () => {
      const { projectsApi } = await import('@/lib/api');
      return projectsApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function useTasks() {
  return useApiQuery(
    async () => {
      const { tasksApi } = await import('@/lib/api');
      return tasksApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function useAttendance() {
  return useApiQuery(
    async () => {
      const { attendanceApi } = await import('@/lib/api');
      return attendanceApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function usePayrolls() {
  return useApiQuery(
    async () => {
      const { payrollApi } = await import('@/lib/api');
      return payrollApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function useEvents() {
  return useApiQuery(
    async () => {
      const { eventsApi } = await import('@/lib/api');
      return eventsApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function useDocuments() {
  return useApiQuery(
    async () => {
      const { documentsApi } = await import('@/lib/api');
      return documentsApi.getAll();
    },
    [],
    { showErrorToast: true }
  );
}

export function useDashboardStats() {
  return useApiQuery(
    async () => {
      const { dashboardApi } = await import('@/lib/api');
      return dashboardApi.getStats();
    },
    [],
    { showErrorToast: true }
  );
}
