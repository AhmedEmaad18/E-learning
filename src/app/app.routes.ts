import { Routes } from '@angular/router';
import { ExamListComponent } from './frontend-layout/dashboard-student/exams/exam-list/exam-list.component';
import { ExamTakeComponent } from './frontend-layout/dashboard-student/exams/exam-take/exam-take.component';
import { ExamResultComponent } from './frontend-layout/dashboard-student/exams/exam-result/exam-result.component';

export const routes: Routes = [
  { path: '', component: ExamListComponent },
    { path: 'exam-list', component: ExamListComponent },
  { path: 'exam-start/:examId', component: ExamTakeComponent },  // changed param name here
  { path: 'exam-results/:studentExamId', component: ExamResultComponent }, // likewise here
];
