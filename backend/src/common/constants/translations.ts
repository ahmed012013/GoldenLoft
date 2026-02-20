export const ARABIC_TRANSLATIONS: Record<string, string> = {
  // Frequency
  DAILY: 'يومي',
  WEEKLY: 'أسبوعي',
  MONTHLY: 'شهري',
  NONE: 'لا يوجد',

  // Priority
  HIGH: 'عالي',
  MEDIUM: 'متوسط',
  LOW: 'منخفض',

  // Status
  PENDING: 'قيد الانتظار',
  COMPLETED: 'مكتمل',
  IN_PROGRESS: 'جاري التنفيذ',
  SKIPPED: 'تم التخطي',
  MISSED: 'فائت',

  // Categories (Common ones)
  feeding: 'تغذية',
  cleaning: 'تنظيف',
  health: 'صحة',
  training: 'تدريب',
  medication: 'علاج',
  water: 'مياه',
  maintenance: 'صيانة',
  other: 'أخرى',

  // Health Record Types
  vaccination: 'تطعيم',
  checkup: 'فحص',
  illness: 'مرض',
  injury: 'إصابة',
  treatment: 'علاج',

  // Health Status
  healthy: 'سليم',
  sick: 'مريض',
  recovered: 'متعافي',
  critical: 'حرج',
  under_observation: 'تحت الملاحظة',
  deceased: 'ميت',

  // Boolean (sometimes returned as string in some contexts, but usually handled by frontend)
  true: 'نعم',
  false: 'لا',
};
