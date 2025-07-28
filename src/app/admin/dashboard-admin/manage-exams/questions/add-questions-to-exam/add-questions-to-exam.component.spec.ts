import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionsToExamComponent } from './add-questions-to-exam.component';

describe('AddQuestionsToExamComponent', () => {
  let component: AddQuestionsToExamComponent;
  let fixture: ComponentFixture<AddQuestionsToExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQuestionsToExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQuestionsToExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
