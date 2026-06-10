const API_BASE_URL = 'http://localhost:8000/api/bookings';

export interface BookingCreate {
  full_name: string;
  phone: string;
  email?: string;
  age?: number;
  gender?: string;
  complaint?: string;
  service_id?: string;
  doctor_id?: string;
  package_id?: string;
  visit_type: string;
  selected_date: string;
  selected_time: string;
}

export interface BookingResponse extends BookingCreate {
  id: string;
  booking_ref: string;
  status: string;
  created_at: string;
}

export async function createBooking(data: BookingCreate): Promise<{ message: string; booking_ref: string }> {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'فشل في إنشاء الحجز');
  }

  return response.json();
}

export async function getBookings(token: string, skip = 0, limit = 100): Promise<BookingResponse[]> {
  const response = await fetch(`${API_BASE_URL}/?skip=${skip}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'فشل في جلب الحجوزات');
  }

  return response.json();
}

export async function updateBookingStatus(bookingId: string, status: string, token: string): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/${bookingId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'فشل في تحديث حالة الحجز');
  }

  return response.json();
}

export async function deleteBooking(bookingId: string, token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/${bookingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'فشل في حذف الحجز');
  }

  return response.json();
}
