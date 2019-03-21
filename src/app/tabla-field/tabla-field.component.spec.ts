import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFieldComponent } from './tabla-field.component';

describe('TablaFieldComponent', () => {
  let component: TablaFieldComponent;
  let fixture: ComponentFixture<TablaFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
