import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from '../../../core/models/model';
import { LessonService } from '../../../core/services/lesson.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson-detail',
  imports: [
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.css',
})
export class LessonDetailComponent {
  isLoading: boolean = true;
  showPurchaseAlert: boolean = false;
  lesson!: Lesson;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _LessonService: LessonService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  getLessonById(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this._LessonService.getLessonById(id).subscribe({
        next: (res) => {
          this.lesson = res.data;
          this.isLoading = false;
        },
        error: (error) => {
          if (error.status === 403) {
            this.showPurchaseAlert = true;
            this.isLoading = false;
          } else {
            console.error('Error fetching lesson:', error);
            this.isLoading = false;
          }
        },
      });
    }
  }

  getEmbeddedVideoUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYoutubeVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYoutubeVideoId(url: string): string | null {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }

  goToLessons(): void {
    this.router.navigate(['/student/lessons']);
  }

  ngOnInit() {
    this.getLessonById();
  }
}
