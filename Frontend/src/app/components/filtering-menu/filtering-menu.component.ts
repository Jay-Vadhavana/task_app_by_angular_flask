import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilteringMenuOptions } from '../../models/filteringMenuOptions';

@Component({
  selector: 'app-filtering-menu',
  imports: [CommonModule, FormsModule],
  templateUrl: './filtering-menu.component.html',
  styleUrl: './filtering-menu.component.css'
})
export class FilteringMenuComponent {

  @Input() options: FilteringMenuOptions[] = [];
  @Input() anchor: HTMLElement | null = null;
  @Input() showFilterMenuFor: string | null = null;

  @Output() closeMenu = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<{ type: string | null, selected: string[] }>();

  menuStyle: any = {};

  selectedEntityNames: string[] = [];
  selectedTypes: string[] = [];
  selectedStatuses: string[] = [];
  selectedContactPerson: string[] = [];

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.anchor) {
      const rect = this.anchor.getBoundingClientRect();
      this.menuStyle = {
        position: 'absolute',
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        minWidth: `${rect.width}px`,
        zIndex: 1000
      };
    }
  }

  onSelectionChange() {
    const selected = this.options.filter(i => i.checked).map(i => i.value);
    this.selectionChange.emit({ type: this.showFilterMenuFor, selected });
  }
}
