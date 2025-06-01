import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { TaskStatusDescriptions, TaskTypeDescriptions, TaskStatus, TaskType } from '../../models/task.enums';
import { FilteringMenuComponent } from '../filtering-menu/filtering-menu.component';
import { FilteringMenuOptions } from '../../models/filteringMenuOptions';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { FormComponent } from '../form/form.component';
import { PopupComponent } from '../popup/popup.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-table',
  imports: [MatIconModule, CommonModule, FilteringMenuComponent, DateFilterComponent, FormComponent, PopupComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: true
})

export class TableComponent {
  @Input() tasks: Task[] = [];
  
  @Output() selectionChange = new EventEmitter<{[key: string]: string[] }>();
  @Output() dateRangeSelected = new EventEmitter<void>();

  taskTypeDescriptions = TaskTypeDescriptions;
  taskStatusDescriptions = TaskStatusDescriptions;
  showFilterMenu = false;
  showDateFilter = false;
  options:FilteringMenuOptions[] = [];
  showFilterMenuFor: string | null = null;
  filterMenuAnchor: HTMLElement | null = null;
  dateFilterAnchor: HTMLElement | null = null;
  activeFilters: { [key: string]: string[] } = {};
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  showForm = false;
  editedTask: Task | null = null;
  deletePopupMessage: string = 'Are you sure you want to delete this task?';
  showDeletePopup = false;
  deleteTaskId: number | null = null;

  constructor(private taskService:TaskService) {}

  onChanges(event: any) {
    console.log('Changes detected:', event);
  }

  getTypeDescription(type: number): string {
    return this.taskTypeDescriptions[type as TaskType];
  }

  getStatusDescription(status: number): string {
    return this.taskStatusDescriptions[status as TaskStatus];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth()+1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  closeFilterMenu() {
    this.showFilterMenuFor = null;
    this.filterMenuAnchor = null;
  }

  openFilterMenu(columnName: string, anchor: HTMLElement) {
    if (this.showFilterMenuFor === columnName) {
      this.closeFilterMenu();
      return;
    }
    
    this.showFilterMenuFor = null;

    setTimeout(() => {
      this.showFilterMenuFor = columnName;
      this.filterMenuAnchor = anchor;

      let selectedValues = this.activeFilters[columnName] || [];
      switch (columnName) {
        case 'entityName':
          const entityNames = Array.from(new Set(this.tasks.map(task => task.entityName)));
          this.options = entityNames.map(name => ({
            label: name,
            value: name,
            checked: selectedValues.includes(name)
          }));
        break;
        case 'contactPerson':
          const contactPersons = Array.from(new Set(this.tasks.map(task => task.contactPerson)));
          this.options = contactPersons.map(person => ({
            label: person,
            value: person,
            checked: selectedValues.includes(person)
          }));
        break;
        case 'type':
          const taskTypes = Array.from(new Set(this.tasks.map(task => task.type)));
          this.options = taskTypes.map(type => ({
            label: this.getTypeDescription(type),
            value: type.toString(),
            checked: selectedValues.includes(type.toString())
          }));
        break;
        case 'status':
          const taskStatuses = Array.from(new Set(this.tasks.map(task => task.status)));
          this.options = taskStatuses.map(status => ({
            label: this.getStatusDescription(status),
            value: status.toString(),
            checked: selectedValues.includes(status.toString())
          }));
        break;
      }
    });
  }

  openDateFilter(anchor: HTMLElement) {
    if (this.showDateFilter) {
      this.showDateFilter = false;
      this.dateFilterAnchor = null;
      return;
    }
    this.showDateFilter = true;
    this.dateFilterAnchor = anchor;
  }

  onFilterSelectionChange(event: { type: string | null, selected: string[] }) {
    if (event.type) {
      this.activeFilters[event.type] = event.selected;
    }

    Object.keys(this.activeFilters).forEach(key => {
      if (!this.activeFilters[key] || this.activeFilters[key].length === 0) {
        delete this.activeFilters[key];
      }
    });

    this.selectionChange.emit(this.activeFilters);
  }

  onDateRangeChange(dateRange: { startDate: string, endDate: string }) {
    if (dateRange.startDate && dateRange.endDate) {
      this.activeFilters['dateRange'] = [dateRange.startDate, dateRange.endDate];
    } else {
      delete this.activeFilters['dateRange'];
    }
    this.showDateFilter = false;
    this.dateFilterAnchor = null;
    this.selectionChange.emit(this.activeFilters);
    this.dateRangeSelected.emit();
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.activeFilters['sortingParams'] = [this.sortColumn, this.sortDirection];
    this.selectionChange.emit(this.activeFilters);
  }

  editTask(task: Task) {
    this.editedTask = {...task};
    this.showForm = true;
  }

  onTaskUpdated() {
    this.showForm = false;
    this.editedTask = null;
    this.selectionChange.emit(this.activeFilters);
  }

  deleteTask(taskId: number) {
    this.showDeletePopup = true;
    this.deleteTaskId = taskId;
  }

  onDeleteConfirmed() {
    if(this.deleteTaskId) {
      this.taskService.deleteTask(this.deleteTaskId).subscribe({
        next: (response) => {
          this.showDeletePopup = false;
          this.deleteTaskId = null;
          this.selectionChange.emit(this.activeFilters);
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        }
      });
    }
  }

  onDeleteCancelled() {
    this.showDeletePopup = false;
    this.deleteTaskId = null;
  }

  closeForm() {
    this.showForm = false;
  }

}
