import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, UserData } from '../../services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p class="text-gray-600">Manage and view user information</p>
      </div>

      <div
        class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
      >
        <div
          class="px-8 py-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 flex items-center justify-between"
        >
          <div>
            <h2 class="text-2xl font-bold text-blue-900">Users List</h2>
            <p class="text-sm text-blue-700 mt-1">
              Total users: <span class="font-semibold">{{ users.length }}</span>
            </p>
          </div>
          <div *ngIf="isEditing" class="flex items-center space-x-2">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
            >
              Editing Mode
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class=" table-auto min-w-full divide-y divide-gray-200">
            <thead class="bg-blue-50">
              <tr>
                <th
                  *ngFor="let header of headers"
                  class="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100"
                >
                  {{ header }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                *ngFor="let user of users; trackBy: trackByUserId"
                class="hover:bg-blue-50 transition-colors duration-150 cursor-pointer group"
                (click)="!isEditing ? navigateToDetails(user) : null"
              >
                <td
                  *ngFor="let header of headers"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  <input
                    *ngIf="
                      editingUser === user && isEditableField(header);
                      else displayValue
                    "
                    type="text"
                    [value]="user[header]"
                    (input)="updateField(user, header, $event)"
                    (click)="$event.stopPropagation()"
                    class="table-cell-editable w-full border border-blue-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
                  />
                  <ng-template #displayValue>
                    <span
                      [class.truncate]="shouldTruncate(user[header])"
                      [title]="user[header]"
                      class="block max-w-xs group-hover:text-blue-700"
                    >
                      {{ formatValue(user[header]) }}
                    </span>
                  </ng-template>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      *ngIf="editingUser !== user"
                      (click)="startEditing(user, $event)"
                      class="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6"
                        />
                      </svg>
                      Edit
                    </button>
                    <ng-container *ngIf="editingUser === user">
                      <button
                        (click)="saveEdit($event)"
                        class="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-700 bg-white hover:bg-green-50 hover:text-green-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition"
                      >
                        <svg
                          class="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save
                      </button>
                      <button
                        (click)="cancelEdit($event)"
                        class="inline-flex items-center px-3 py-1.5 border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition"
                      >
                        <svg
                          class="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel
                      </button>
                    </ng-container>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="users.length === 0" class="text-center py-12">
        <div class="text-gray-500">
          <p class="text-lg mb-2">Loading users...</p>
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
        </div>
      </div>
    </div>
  `,
})
export class UserTableComponent implements OnInit, OnDestroy {
  users: UserData[] = [];
  headers: string[] = [];
  editingUser: UserData | null = null;
  originalUserData: UserData | null = null;
  isEditing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        this.headers = this.userService.getTableHeaders(users);
      });

    this.userService.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByUserId(index: number, user: UserData): any {
    return user['id'] || index;
  }

  navigateToDetails(user: UserData): void {
    if (user['id']) {
      this.router.navigate(['/user', user['id']]);
    }
  }

  startEditing(user: UserData, event: Event): void {
    event.stopPropagation();
    this.editingUser = user;
    this.originalUserData = { ...user };
    this.isEditing = true;
  }

  saveEdit(event: Event): void {
    event.stopPropagation();
    if (this.editingUser) {
      this.userService.updateUser(this.editingUser);
    }
    this.editingUser = null;
    this.originalUserData = null;
    this.isEditing = false;
  }

  cancelEdit(event: Event): void {
    event.stopPropagation();
    if (this.editingUser && this.originalUserData) {
      // Restore original data
      Object.keys(this.originalUserData).forEach((key) => {
        if (this.editingUser) {
          this.editingUser[key] = this.originalUserData![key];
        }
      });
    }
    this.editingUser = null;
    this.originalUserData = null;
    this.isEditing = false;
  }

  updateField(user: UserData, field: string, event: any): void {
    user[field] = event.target.value;
  }

  isEditableField(field: string): boolean {
    // Make most fields editable except id and certain system fields
    const nonEditableFields = ['id', '_id', 'createdAt', 'updatedAt'];
    return !nonEditableFields.includes(field);
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  }

  shouldTruncate(value: any): boolean {
    const str = this.formatValue(value);
    return str.length > 50;
  }
}
