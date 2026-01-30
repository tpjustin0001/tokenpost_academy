/**
 * Database Types
 * Supabase 테이블 스키마 기반 TypeScript 타입 정의
 * 
 * 참고: Supabase CLI로 자동 생성 가능
 * npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
 */

// ========================================
// Users Table
// ========================================
export interface User {
    id: string // UUID, auth.users 참조
    email: string
    nickname: string | null
    profile_image: string | null
    role: 'student' | 'admin'
    created_at: string // timestamptz
}

// ========================================
// Courses Table
// ========================================
export interface Course {
    id: string // UUID
    title: string
    slug: string // URL 접근용 (unique)
    description: string | null
    thumbnail_url: string | null
    price: number // 기본값: 0
    is_published: boolean // 기본값: false
    created_at: string
}

// ========================================
// Modules Table (챕터)
// ========================================
export interface Module {
    id: string
    course_id: string
    title: string
    position: number // 정렬 순서
    created_at: string
}

// ========================================
// Lessons Table
// ========================================
export interface Lesson {
    id: string
    module_id: string
    title: string
    video_uid: string | null // 🔐 Cloudflare Stream Video ID
    duration: number | null // 영상 길이 (초)
    is_free_preview: boolean // 기본값: false
    position: number
    created_at: string
}

// ========================================
// Enrollments Table (수강 권한)
// ========================================
export interface Enrollment {
    user_id: string
    course_id: string
    purchased_at: string
    expires_at: string | null // 기간제 강의
}

// ========================================
// User Progress Table (진도율)
// ========================================
export interface UserProgress {
    user_id: string
    lesson_id: string
    is_completed: boolean
    last_watched_position: number // 초 단위 (이어보기용)
    updated_at: string
}

// ========================================
// Extended Types (조인 결과 등)
// ========================================

/** 모듈과 레슨을 포함한 코스 */
export interface CourseWithCurriculum extends Course {
    modules: (Module & {
        lessons: Lesson[]
    })[]
}

/** 진도 정보가 포함된 레슨 */
export interface LessonWithProgress extends Lesson {
    progress?: UserProgress | null
}

/** 사용자의 수강 코스 (진도율 포함) */
export interface EnrolledCourse extends Course {
    enrollment: Enrollment
    progressPercent: number
    lastLesson?: Lesson
}

// ========================================
// Insert/Update Types
// ========================================

export type CourseInsert = Omit<Course, 'id' | 'created_at'>
export type LessonInsert = Omit<Lesson, 'id' | 'created_at'>
export type EnrollmentInsert = Omit<Enrollment, 'purchased_at'>
export type ProgressUpsert = Omit<UserProgress, 'updated_at'>
