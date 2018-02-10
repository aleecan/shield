import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jp from 'jsonpath';

import { NotificationService } from '../../utils/notification.service';

@Component({
  selector: 'dynamic-datatable',
  templateUrl: './dynamic-datatable.component.html',
  styleUrls: ['./dynamic-datatable.component.css']
})
export class DynamicDatatableComponent implements OnInit, OnChanges {

  @Input() url: string;
  @Input() filters: Object;
  @Input() schema: any[];
  @Input() rootField: string;

  loading = false;
  render = true;

  data: any[];

  sizes = [10, 20, 50];

  pagination = {
    page: 1,
    size: this.sizes[0]
  };

  columns: any[];
  displayColumns: string[];

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.columns = this.schema.map(field => ({ 'data': field.name }));
    this.displayColumns = this.schema.map(field => field.display);
  }

  ngOnChanges() {
    this.getData();
  }

  getData() {
    this.loading = true;
    const data = { pagination: this.pagination, filters: this.filters || {} };
    this.http.post(this.url, data)
        .subscribe(res => {
          this.data = this.transformData(res[this.rootField]);
          this.render = false;
          setTimeout(() => {
            this.render = true;
          }, 10);
          this.loading = false;
        }, error => {
          // do something with error
          this.notificationService.smallBox({
            content: 'Something went wrong',
            color: '#a90329',
            timeout: 4000,
            icon: 'fa fa-warning shake animated'
          });
          this.loading = false;
        })
  }

  transformData(entries: any[]) {
    const transformedEntries = [];
    entries.forEach(entry => {
      const transformedEntry = {};
      this.schema.forEach(rule => {
        if (rule.path) {
          transformedEntry[rule.name] = jp.value(entry, rule.path);
        } else {
          transformedEntry[rule.name] = '';
        }
      });
      transformedEntries.push(transformedEntry);
    });
    return transformedEntries;
  }

}
