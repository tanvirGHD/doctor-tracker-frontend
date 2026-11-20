'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PAGE_SIZE } from '@/lib/constants';

const withLimit = (params = {}) => ({ limit: PAGE_SIZE, ...params });

// ---- Reads. keepPreviousData keeps the old rows visible while the next page loads (no flicker).
export const useDoctors = (params) =>
  useQuery({ queryKey: ['doctors', 'list', params], queryFn: () => api.get('/doctors', withLimit(params)), placeholderData: keepPreviousData });

export const useDoctorFilters = () =>
  useQuery({ queryKey: ['doctors', 'filters'], queryFn: () => api.get('/doctors/filters'), staleTime: 60_000 });

// Small, name-sorted list used by the "Doctor" dropdowns.
export const useDoctorOptions = () =>
  useQuery({ queryKey: ['doctors', 'options'], queryFn: () => api.get('/doctors', { limit: 50, sort: 'name' }), staleTime: 60_000 });

export const useDoctor = (id) =>
  useQuery({ queryKey: ['doctors', 'detail', id], queryFn: () => api.get(`/doctors/${id}`), enabled: Boolean(id) });

export const useDoctorPatients = (id, params) =>
  useQuery({
    queryKey: ['patients', 'doctor', id, params],
    queryFn: () => api.get(`/doctors/${id}/patients`, withLimit(params)),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });

export const usePatients = (params) =>
  useQuery({ queryKey: ['patients', 'list', params], queryFn: () => api.get('/patients', withLimit(params)), placeholderData: keepPreviousData });

export const useDashboard = (days) =>
  useQuery({ queryKey: ['dashboard', days], queryFn: () => api.get('/dashboard', { days }), placeholderData: keepPreviousData });

// ---- Writes. Any change can affect lists, counts and charts, so refresh those groups.
function useInvalidatingMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all(['doctors', 'patients', 'dashboard'].map((key) => queryClient.invalidateQueries({ queryKey: [key] }))),
  });
}

export const useSaveDoctor = () =>
  useInvalidatingMutation(({ id, values }) => (id ? api.put(`/doctors/${id}`, values) : api.post('/doctors', values)));

export const useDeleteDoctor = () => useInvalidatingMutation((id) => api.delete(`/doctors/${id}`));

export const useSavePatient = () =>
  useInvalidatingMutation(({ id, doctorId, values }) => {
    if (id) return api.put(`/patients/${id}`, values);
    if (doctorId) return api.post(`/doctors/${doctorId}/patients`, values);
    return api.post('/patients', values);
  });

export const useDeletePatient = () => useInvalidatingMutation((id) => api.delete(`/patients/${id}`));

export const useRemoveDoctorPatient = () =>
  useInvalidatingMutation(({ doctorId, patientId }) => api.delete(`/doctors/${doctorId}/patients/${patientId}`));
