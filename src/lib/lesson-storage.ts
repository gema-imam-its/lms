// Async storage interface for lesson progress, keyed by studentId so a later
// swap to a per-student Supabase-backed adapter only means writing a new
// class here — no call-site changes. Every method returns a Promise even
// though the localStorage adapter is synchronous under the hood, so
// components never need to know which adapter is in use.

export const LOCAL_STUDENT_ID = "local";

export interface QuizResult {
  slideId: string;
  correct: boolean;
  partialCredit?: boolean;
}

export interface LessonResult {
  lessonId: string;
  completed: boolean;
  stars: number;
  quizResults: QuizResult[];
}

export interface LessonStorage {
  getResult(studentId: string, lessonId: string): Promise<LessonResult | null>;
  saveResult(studentId: string, result: LessonResult): Promise<void>;
  getAllResults(studentId: string): Promise<Record<string, LessonResult>>;
}

function storageKey(studentId: string): string {
  return `gema-lesson-progress:${studentId}`;
}

class LocalStorageLessonStorage implements LessonStorage {
  async getAllResults(studentId: string): Promise<Record<string, LessonResult>> {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(storageKey(studentId));
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Record<string, LessonResult>;
    } catch {
      return {};
    }
  }

  async getResult(studentId: string, lessonId: string): Promise<LessonResult | null> {
    const all = await this.getAllResults(studentId);
    return all[lessonId] ?? null;
  }

  async saveResult(studentId: string, result: LessonResult): Promise<void> {
    if (typeof window === "undefined") return;
    const all = await this.getAllResults(studentId);
    all[result.lessonId] = result;
    window.localStorage.setItem(storageKey(studentId), JSON.stringify(all));
  }
}

export const lessonStorage: LessonStorage = new LocalStorageLessonStorage();
