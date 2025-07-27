export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface ExamDetails {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: string[];
  createdBy: string;
  classLevel: string;
  isPublished: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface StudentExam {
  _id: string;
  examId: string;
  score?: number;
}


// export interface StudentExam {
//   exam: ExamDetails;
//   startTime: string;
//   endTime: string;
// }
// In your models file
export interface StudentExamStartResponse {
   _id:string;
  exam: ExamDetails;   // you already defined ExamDetails
  startTime: string;
  endTime: string;
}
export interface StartExamApiResponse {
  success: boolean;
  message: string;
  data: {
    exam: {
      _id: string;
      title: string;
    };
    _id:string;
    startTime: string;
    endTime: string;
  };
}

export interface ExamSubmitResponse {
  score: number;
  totalPoints: number;
}

export interface ExamStatusResponse {
  message: string;
  success: boolean;
}
export interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions?: any[];
  score?: number | null; // add score field here
}
export interface ExamResult {
  answers: Answer[];
  score: number;
  student: {
    _id: string;
    fullName: string;
  };
  exam: {
    _id: string;
    title: string;
  };
  startTime: string;
  endTime: string;
}

export interface Answer {
  question: string;
  selectedAnswer: string;
  isCorrect: boolean;
  questionText?: string; // Optional question content from exam
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  video: string;
  classLevel: string;
  price: number;
  isPaid: boolean;
  scheduledDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
