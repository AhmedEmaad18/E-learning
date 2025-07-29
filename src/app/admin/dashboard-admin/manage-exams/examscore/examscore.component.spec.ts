import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamscoreComponent } from './examscore.component';

describe('ExamscoreComponent', () => {
  let component: ExamscoreComponent;
  let fixture: ComponentFixture<ExamscoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamscoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
