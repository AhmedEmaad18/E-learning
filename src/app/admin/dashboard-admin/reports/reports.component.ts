import { Component, OnInit, Inject } from '@angular/core';
import { ExamService } from '../../../core/services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  providers: [ExamService],
})
export class ReportsComponent implements OnInit {
  examsWithScores: { exam: any; scores: any[] }[] = [];
  filteredExamsWithScores: { exam: any; scores: any[] }[] = [];
  loading: boolean = false;
  error: string = '';

  // Modal properties
  selectedStudentExam: any = null;
  studentAnswers: any[] = [];
  showAnswersModal = false;
  loadingAnswers = false;
  answersError = '';

  // Filter properties
  examTitleFilter: string = '';
  studentNameFilter: string = '';
  minScoreFilter: number | null = null;
  maxScoreFilter: number | null = null;
  sortBy: string = 'examTitle';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(@Inject(ExamService) private examService: ExamService) {}

  ngOnInit(): void {
    this.fetchAllExamsWithScores();
  }

  fetchAllExamsWithScores() {
    this.loading = true;
    this.error = '';
    this.examService.getAllExams().subscribe({
      next: (response: any) => {
        const exams = Array.isArray(response.data) ? response.data : [];
        if (!exams.length) {
          this.error = 'No exams found.';
          this.loading = false;
          return;
        }
        const examScoreRequests = exams.map((exam: any) =>
          this.examService
            .getAllStudentsScoresForExam(exam._id)
            .toPromise()
            .then((res) => ({
              exam,
              scores: Array.isArray(res.data)
                ? res.data
                : res.data?.students || [],
            }))
            .catch(() => ({ exam, scores: [], error: 'Failed to load scores' }))
        );
        Promise.all(examScoreRequests).then((results) => {
          this.examsWithScores = results;
          this.applyFilters();
          this.loading = false;
        });
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to fetch exams';
        this.loading = false;
      },
    });
  }

  applyFilters() {
    let filtered = [...this.examsWithScores];

    // Filter by exam title
    if (this.examTitleFilter.trim()) {
      const searchTerm = this.examTitleFilter.toLowerCase().trim();
      filtered = filtered.filter((examBlock) =>
        examBlock.exam.title.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by student name
    if (this.studentNameFilter.trim()) {
      const searchTerm = this.studentNameFilter.toLowerCase().trim();
      filtered = filtered
        .map((examBlock) => ({
          ...examBlock,
          scores: examBlock.scores.filter((score) => {
            const studentName = (
              score.student?.fullName ||
              score.fullName ||
              score.name ||
              ''
            ).toLowerCase();
            return studentName.includes(searchTerm);
          }),
        }))
        .filter((examBlock) => examBlock.scores.length > 0);
    }

    // Filter by score range
    if (this.minScoreFilter !== null || this.maxScoreFilter !== null) {
      filtered = filtered
        .map((examBlock) => ({
          ...examBlock,
          scores: examBlock.scores.filter((score) => {
            const scoreValue =
              typeof score.score === 'number' ? score.score : 0;
            const minCondition =
              this.minScoreFilter === null || scoreValue >= this.minScoreFilter;
            const maxCondition =
              this.maxScoreFilter === null || scoreValue <= this.maxScoreFilter;
            return minCondition && maxCondition;
          }),
        }))
        .filter((examBlock) => examBlock.scores.length > 0);
    }

    // Sort results
    filtered = this.sortResults(filtered);

    this.filteredExamsWithScores = filtered;
  }

  sortResults(data: { exam: any; scores: any[] }[]) {
    return data.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.sortBy) {
        case 'examTitle':
          aValue = a.exam.title.toLowerCase();
          bValue = b.exam.title.toLowerCase();
          break;
        case 'studentCount':
          aValue = a.scores.length;
          bValue = b.scores.length;
          break;
        case 'averageScore':
          aValue = this.getAverageScore(a.scores);
          bValue = this.getAverageScore(b.scores);
          break;
        default:
          aValue = a.exam.title.toLowerCase();
          bValue = b.exam.title.toLowerCase();
      }

      if (this.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.examTitleFilter = '';
    this.studentNameFilter = '';
    this.minScoreFilter = null;
    this.maxScoreFilter = null;
    this.sortBy = 'examTitle';
    this.sortOrder = 'asc';
    this.applyFilters();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  getAverageScore(scores: any[]): number {
    if (!scores.length) return 0;
    const total = scores.reduce(
      (sum, s) => sum + (typeof s.score === 'number' ? s.score : 0),
      0
    );
    return total / scores.length;
  }

  getTotalStudents(): number {
    const uniqueStudents = new Set<string>();

    this.filteredExamsWithScores.forEach((examBlock) => {
      examBlock.scores.forEach((score) => {
        const studentName =
          score.student?.fullName || score.fullName || score.name || 'Unknown';
        uniqueStudents.add(studentName);
      });
    });

    return uniqueStudents.size;
  }

  getOverallAverageScore(): number {
    const allScores = this.filteredExamsWithScores.flatMap(
      (examBlock) => examBlock.scores
    );
    return this.getAverageScore(allScores);
  }

  // New methods for handling student answers
  showStudentAnswers(studentExam: any) {
    this.selectedStudentExam = studentExam;
    this.studentAnswers = [];
    this.showAnswersModal = true;
    this.loadingAnswers = true;
    this.answersError = '';

    // Extract IDs from the student exam object
    const studentExamId = studentExam._id;
    const examId = studentExam.exam?._id;
    const studentId = studentExam.student?._id;

    this.tryGetStudentExamData(studentExamId, examId, studentId);
  }

  private tryGetStudentExamData(
    studentExamId: string,
    examId: string,
    studentId: string
  ) {
    this.examService.getStudentExamDetails(studentExamId).subscribe({
      next: (response) => {
        const answers = this.extractAnswersFromResponse(response);
        if (answers.length > 0) {
          this.studentAnswers = answers;
          this.loadingAnswers = false;
        } else {
          this.tryWithExamId(examId, studentId);
        }
      },
      error: () => {
        this.tryWithExamId(examId, studentId);
      },
    });
  }

  private tryWithExamId(examId: string, studentId: string) {
    this.examService.getStudentExamByExamId(examId, studentId).subscribe({
      next: (response) => {
        const answers = this.extractAnswersFromResponse(response);
        if (answers.length > 0) {
          this.studentAnswers = answers;
        }
        this.loadingAnswers = false;
      },
      error: (error) => {
        this.answersError = 'Failed to load student answers. Please try again.';
        this.loadingAnswers = false;
      },
    });
  }

  closeAnswersModal() {
    this.showAnswersModal = false;
    this.selectedStudentExam = null;
    this.studentAnswers = [];
    this.loadingAnswers = false;
    this.answersError = '';
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  }

  getAnswerStatusClass(isCorrect: boolean): string {
    return isCorrect ? 'correct-answer' : 'incorrect-answer';
  }

  getCorrectAnswersPercentage(): number {
    if (this.studentAnswers.length === 0) return 0;
    const correctAnswers = this.studentAnswers.filter(
      (answer) => answer.isCorrect
    ).length;
    return Math.round((correctAnswers / this.studentAnswers.length) * 100);
  }

  getCorrectAnswersCount(): number {
    return this.studentAnswers.filter((answer) => answer.isCorrect).length;
  }

  // Helper method to extract answers from different data structures
  private extractAnswersFromResponse(response: any): any[] {
    // First, check if response.data is an array of student exam objects
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      // Find the student exam object that matches our selectedStudentExam._id
      const matchingStudentExam = response.data.find(
        (exam: any) => exam._id === this.selectedStudentExam?._id
      );

      if (matchingStudentExam) {
        if (
          matchingStudentExam.answers &&
          Array.isArray(matchingStudentExam.answers)
        ) {
          return matchingStudentExam.answers;
        }
      }
    }

    // Fallback to checking other possible paths
    const possiblePaths = [
      response?.data?.answers,
      response?.data?.data?.answers,
      response?.answers,
      response?.data?.studentExam?.answers,
      response?.studentExam?.answers,
      response?.data?.exam?.answers,
      response?.exam?.answers,
      response?.data?.student?.answers,
      response?.student?.answers,
      response?.data?.examData?.answers,
      response?.examData?.answers,
      response?.data?.result?.answers,
      response?.result?.answers,
    ];

    for (let i = 0; i < possiblePaths.length; i++) {
      const path = possiblePaths[i];
      if (path && Array.isArray(path) && path.length > 0) {
        return path;
      }
    }

    return [];
  }
}
