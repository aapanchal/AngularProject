import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export type UserData = Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl =
    'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json';
  private usersSubject = new BehaviorSubject<UserData[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.apiUrl);
  }

  loadUsers(): void {
    this.fetchUsers().subscribe({
      next: (users) => {
        this.usersSubject.next(users);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.usersSubject.next([]);
      },
    });
  }

  getUserById(id: string): UserData | undefined {
    const users = this.usersSubject.value;
    return users.find((user) => user['id']?.toString() === id);
  }

  updateUser(updatedUser: UserData): void {
    const users = this.usersSubject.value;
    const index = users.findIndex((user) => user['id'] === updatedUser['id']);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      this.usersSubject.next([...users]);
    }
  }

  getTableHeaders(users: UserData[]): string[] {
    if (users.length === 0) return [];

    // Get all unique keys from all objects
    const allKeys = new Set<string>();
    users.forEach((user) => {
      Object.keys(user).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys);
  }
}
