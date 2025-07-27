import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from '../../../core/models/model';
import { LessonService } from '../../../core/services/lesson.service';

@Component({
  selector: 'app-lesson-detail',
  imports: [DatePipe],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.css',
})
export class LessonDetailComponent {
  isLoading: boolean = true;

  lesson!: Lesson;

  constructor(
    private route: ActivatedRoute,
    private _LessonService: LessonService,
    private sanitizer: DomSanitizer
  ) {}

  getLessonById(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this._LessonService.getLessonById(id).subscribe((res) => {
        this.lesson = res.data;
        this.isLoading = false;
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

  ngOnInit() {
    this.getLessonById();
  }
}
