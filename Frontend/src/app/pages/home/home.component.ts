import { Component } from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';
import { TableComponent } from '../../components/table/table.component';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';
import { FilterChipComponent } from '../../components/filter-chip/filter-chip.component';

@Component({
  selector: 'app-home',
  imports: [SearchComponent, TableComponent, FormComponent, CommonModule, FilterChipComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {
  tasks: Task[] = [];
  showForm = false;
  activeFilters: { [key: string]: string[] } = {};
  isLoading = false;
  showFilterChip = false;
  filterChipLabel = '';

  constructor(private taskService:TaskService) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks(paramsObj?: any) {
    this.isLoading = true;
    this.taskService.fetchTasks(paramsObj).subscribe({
      next: (response) => {
        this.tasks = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      }
    });
  }

  onFilterSelectionChange(activeFilters: { [key: string]: string[] }) {
    this.activeFilters = activeFilters;
    this.fetchTasks(activeFilters);
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  onSearch(value: string) {
    this.fetchTasks({ ...this.activeFilters, search: value });
  }

  onTaskCreated() {
    this.showForm = false;
    this.fetchTasks(this.activeFilters);
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  onDateRangeSelected(){
    this.showFilterChip = true;
    const dateRange = this.activeFilters['dateRange'];
    this.filterChipLabel = ` From ${this.formatDateTime(dateRange[0])} to ${this.formatDateTime(dateRange[1])}`;
  }

  removeDateFilter() {
    delete this.activeFilters['dateRange'];
    this.showFilterChip = false;
    this.filterChipLabel = '';
    this.fetchTasks(this.activeFilters);
  }
}
