import { Routes } from '@angular/router';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

export const routes: Routes = [
  { path: '', component: UserTableComponent },
  { path: 'user/:id', component: UserDetailsComponent },
  { path: '**', redirectTo: '' },
];
