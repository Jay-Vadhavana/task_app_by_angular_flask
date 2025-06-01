import { Component, Input, SimpleChanges, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskType, TaskTypeDescriptions, TaskStatus, TaskStatusDescriptions } from '../../models/task.enums';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  standalone: true
})
export class FormComponent implements OnInit, OnChanges {
  taskForm = this.createForm();
  taskTypes = Object.values(TaskType).filter(v => typeof v === 'number') as number[];
  taskTypeDescriptions = TaskTypeDescriptions;
  taskStatuses = Object.values(TaskStatus).filter(v => typeof v === 'number') as number[];
  taskStatusDescriptions = TaskStatusDescriptions;

  @Input() task: Task | null = null;

  @Output() formSubmitted = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskForm = this.createForm(this.task || undefined);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      this.taskForm = this.createForm(this.task || undefined);
    }
  }

  createForm(task?: Task) {
    let dueDateTimeValue = '';
    if (task?.dueDateTime) {
      const date = new Date(task.dueDateTime);
      dueDateTimeValue = date.toISOString().slice(0, 16);
    }
    return new FormGroup({
      entityName: new FormControl(task?.entityName || '', [Validators.required, Validators.minLength(3)]),
      dueDateTime: new FormControl(dueDateTimeValue, [Validators.required, Validators.minLength(10)]),
      type: new FormControl(task?.type ?? TaskType.MEETING, Validators.required),
      status: new FormControl(task?.status ?? TaskStatus.OPEN, Validators.required),
      contactPerson: new FormControl(task?.contactPerson || '', [Validators.required, Validators.minLength(3)]),
      notes: new FormControl(task?.notes || '')
    });
  }

  onSubmit() {
    console.log('Form submitted:', this.taskForm.value);
    if (this.taskForm.valid) {
      // Ensure type and status are numbers before submitting
      const formValue = {
        ...this.taskForm.value,
        type: Number(this.taskForm.value.type),
        status: Number(this.taskForm.value.status)
      };
      this.createTask(formValue);
    } else {
      console.error('Form is invalid');
    }
  }

  getTaskTypeDescription(type: number): string {
    return this.taskTypeDescriptions[type as TaskType];
  }

  getTaskStatusDescription(status: number): string {
    return this.taskStatusDescriptions[status as TaskStatus];
  }

  createTask(formValue?: any) {
    if(this.task){
      const updatedTask = { ...formValue, id: this.task.id };
      this.taskService.updateTask(updatedTask).subscribe({
        next: (response) => {
          this.taskForm.reset();
          this.formSubmitted.emit();
        },
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    }else{
      this.taskService.addTask(formValue || this.taskForm.value).subscribe({
        next: (response) => {
          this.taskForm.reset();
          this.formSubmitted.emit();
        },
        error: (error) => {
          console.error('Error adding task:', error);
        }
      });
    }
  }
}
