import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { TaskDetailComponent } from './features/tasks/task-detail/task-detail.component';
import { TaskFormComponent } from './features/tasks/task-form/task-form.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [authGuard] // Protect tasks route
  },
  {
    path: 'tasks/new',
    component: TaskFormComponent,
    canActivate: [authGuard] // Protect new task route
  },
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
    canActivate: [authGuard] // Protect task detail route
  },
  {
    path: 'tasks/:id/edit',
    component: TaskFormComponent,
    canActivate: [authGuard] // Protect edit task route
  },
  {
    path: '**',
    redirectTo: ''
  }
];
