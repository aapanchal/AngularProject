import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserData } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <button
          (click)="goBack()"
          class="btn-secondary mb-4 inline-flex items-center"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Users
        </button>

        <h1 class="text-3xl font-bold text-gray-900 mb-2">User Details</h1>
        <p class="text-gray-600">Detailed information for the selected user</p>
      </div>

      <div
        *ngIf="user; else userNotFound"
        class="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ getDisplayName() }}
          </h2>
          <p class="text-sm text-gray-600 mt-1">ID: {{ user['id'] }}</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let field of getFieldKeys()" class="space-y-2">
              <label
                class="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ formatFieldName(field) }}
              </label>
              <div class="p-3 bg-gray-50 rounded-lg border">
                <span class="text-gray-900 font-medium">
                  {{ formatFieldValue(user[field]) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <button (click)="goBack()" class="btn-secondary">
              Back to Users
            </button>
            <button (click)="editUser()" class="btn-primary">Edit User</button>
          </div>
        </div>
      </div>

      <ng-template #userNotFound>
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="text-gray-400 mb-4">
            <svg
              class="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.291M6.343 6.343A8 8 0 1017.657 17.657 8 8 0 006.343 6.343z"
              ></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p class="text-gray-600 mb-6">
            The requested user could not be found.
          </p>
          <button (click)="goBack()" class="btn-primary">Back to Users</button>
        </div>
      </ng-template>
    </div>
  `,
})
export class UserDetailsComponent implements OnInit {
  user: UserData | undefined;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.user = this.userService.getUserById(this.userId);
    }
  }

  getDisplayName(): string {
    if (!this.user) return 'Unknown User';

    // Try common name fields
    const nameFields = [
      'name',
      'fullName',
      'displayName',
      'firstName',
      'title',
    ];
    for (const field of nameFields) {
      if (this.user[field]) {
        return this.user[field];
      }
    }

    // Fallback to combining first and last name
    const firstName = this.user['firstName'] || this.user['first_name'];
    const lastName = this.user['lastName'] || this.user['last_name'];
    if (firstName || lastName) {
      return `${firstName || ''} ${lastName || ''}`.trim();
    }

    return `User ${this.user['id'] || 'Unknown'}`;
  }

  getFieldKeys(): string[] {
    if (!this.user) return [];
    return Object.keys(this.user).filter((key) => key !== 'id');
  }

  formatFieldName(field: string): string {
    // Convert camelCase or snake_case to readable format
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  formatFieldValue(value: any): string {
    if (value === null || value === undefined) return 'Not specified';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return '[Complex Object]';
      }
    }
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return value.toString();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  editUser(): void {
    // Navigate back to table and start editing
    this.router.navigate(['/']);
  }
}
