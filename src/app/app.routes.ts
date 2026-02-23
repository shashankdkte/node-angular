import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'tasks',
    component: TaskListComponent
  }
];
