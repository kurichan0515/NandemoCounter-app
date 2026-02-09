/**
 * バリデーション関数
 */

/**
 * 数値のバリデーション
 */
export function validateNumber(value: string): { isValid: boolean; value?: number; error?: string } {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return { isValid: false, error: '有効な数値を入力してください' };
  }
  return { isValid: true, value: parsed };
}

/**
 * 必須項目のバリデーション
 */
export function validateRequired(value: string | null | undefined, fieldName: string): { isValid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName}を入力してください` };
  }
  return { isValid: true };
}

/**
 * カウンターIDのバリデーション
 */
export function validateCounterId(counterId: string | null | undefined): { isValid: boolean; error?: string } {
  return validateRequired(counterId, 'カウンター');
}
