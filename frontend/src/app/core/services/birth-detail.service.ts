import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BirthDetail, BirthDetailCreate, BirthDetailUpdate, PlaceSuggestion } from '../models/birth-detail.model';

@Injectable({
  providedIn: 'root'
})
export class BirthDetailService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly curatedPlaces: PlaceSuggestion[] = [
    // Kerala & South India
    { name: 'Kochi, Kerala, India', city: 'Kochi', state: 'Kerala', country: 'India', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' },
    { name: 'Thiruvananthapuram, Kerala, India', city: 'Thiruvananthapuram', state: 'Kerala', country: 'India', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata' },
    { name: 'Kozhikode, Kerala, India', city: 'Kozhikode', state: 'Kerala', country: 'India', latitude: 11.2588, longitude: 75.7804, timezone: 'Asia/Kolkata' },
    { name: 'Thrissur, Kerala, India', city: 'Thrissur', state: 'Kerala', country: 'India', latitude: 10.5276, longitude: 76.2144, timezone: 'Asia/Kolkata' },
    { name: 'Kollam, Kerala, India', city: 'Kollam', state: 'Kerala', country: 'India', latitude: 8.8932, longitude: 76.6141, timezone: 'Asia/Kolkata' },
    { name: 'Alappuzha, Kerala, India', city: 'Alappuzha', state: 'Kerala', country: 'India', latitude: 9.4981, longitude: 76.3388, timezone: 'Asia/Kolkata' },
    { name: 'Palakkad, Kerala, India', city: 'Palakkad', state: 'Kerala', country: 'India', latitude: 10.7867, longitude: 76.6548, timezone: 'Asia/Kolkata' },
    { name: 'Kannur, Kerala, India', city: 'Kannur', state: 'Kerala', country: 'India', latitude: 11.8745, longitude: 75.3704, timezone: 'Asia/Kolkata' },
    { name: 'Kottayam, Kerala, India', city: 'Kottayam', state: 'Kerala', country: 'India', latitude: 9.5916, longitude: 76.5222, timezone: 'Asia/Kolkata' },
    { name: 'Malappuram, Kerala, India', city: 'Malappuram', state: 'Kerala', country: 'India', latitude: 11.0510, longitude: 76.0711, timezone: 'Asia/Kolkata' },
    { name: 'Bengaluru, Karnataka, India', city: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
    { name: 'Chennai, Tamil Nadu, India', city: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
    { name: 'Hyderabad, Telangana, India', city: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
    { name: 'Coimbatore, Tamil Nadu, India', city: 'Coimbatore', state: 'Tamil Nadu', country: 'India', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata' },
    { name: 'Madurai, Tamil Nadu, India', city: 'Madurai', state: 'Tamil Nadu', country: 'India', latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata' },
    { name: 'Mysuru, Karnataka, India', city: 'Mysuru', state: 'Karnataka', country: 'India', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata' },
    { name: 'Mangaluru, Karnataka, India', city: 'Mangaluru', state: 'Karnataka', country: 'India', latitude: 12.9141, longitude: 74.8560, timezone: 'Asia/Kolkata' },

    // National Metropolises
    { name: 'Mumbai, Maharashtra, India', city: 'Mumbai', state: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
    { name: 'New Delhi, Delhi, India', city: 'New Delhi', state: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
    { name: 'Kolkata, West Bengal, India', city: 'Kolkata', state: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
    { name: 'Pune, Maharashtra, India', city: 'Pune', state: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
    { name: 'Ahmedabad, Gujarat, India', city: 'Ahmedabad', state: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
    { name: 'Jaipur, Rajasthan, India', city: 'Jaipur', state: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
    { name: 'Lucknow, Uttar Pradesh, India', city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' },
    { name: 'Chandigarh, Punjab, India', city: 'Chandigarh', state: 'Punjab', country: 'India', latitude: 30.7333, longitude: 76.7794, timezone: 'Asia/Kolkata' },
    { name: 'Goa, India', city: 'Panaji', state: 'Goa', country: 'India', latitude: 15.4909, longitude: 73.8278, timezone: 'Asia/Kolkata' },

    // Global Hubs
    { name: 'Dubai, United Arab Emirates', city: 'Dubai', state: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
    { name: 'Abu Dhabi, United Arab Emirates', city: 'Abu Dhabi', state: 'Abu Dhabi', country: 'UAE', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai' },
    { name: 'Singapore, Singapore', city: 'Singapore', state: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
    { name: 'London, United Kingdom', city: 'London', state: 'England', country: 'UK', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
    { name: 'New York, NY, United States', city: 'New York', state: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
    { name: 'San Francisco, CA, United States', city: 'San Francisco', state: 'California', country: 'USA', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
    { name: 'Toronto, Ontario, Canada', city: 'Toronto', state: 'Ontario', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
    { name: 'Sydney, New South Wales, Australia', city: 'Sydney', state: 'NSW', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
    { name: 'Doha, Qatar', city: 'Doha', state: 'Ad Dawhah', country: 'Qatar', latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar' },
    { name: 'Kuwait City, Kuwait', city: 'Kuwait City', state: 'Al Asimah', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774, timezone: 'Asia/Kuwait' },
    { name: 'Riyadh, Saudi Arabia', city: 'Riyadh', state: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' }
  ];

  getBirthDetails(): Observable<BirthDetail> {
    return this.http.get<BirthDetail>(`${this.apiUrl}/birth-details`);
  }

  createBirthDetails(data: BirthDetailCreate): Observable<BirthDetail> {
    return this.http.post<BirthDetail>(`${this.apiUrl}/birth-details`, data);
  }

  updateBirthDetails(data: BirthDetailUpdate): Observable<BirthDetail> {
    return this.http.put<BirthDetail>(`${this.apiUrl}/birth-details`, data);
  }

  deleteBirthDetails(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/birth-details`);
  }

  searchPlaces(query: string): PlaceSuggestion[] {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) {
      return [];
    }

    return this.curatedPlaces.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q)
    ).slice(0, 6);
  }
}
