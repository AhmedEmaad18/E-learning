import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditquestionComponent } from './editquestion.component';

describe('EditquestionComponent', () => {
  let component: EditquestionComponent;
  let fixture: ComponentFixture<EditquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditquestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
