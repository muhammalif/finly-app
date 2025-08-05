/**
 * Category definitions for income and expense transactions.
 * Used for categorizing and displaying transactions throughout the app.
 * @module categories
 */

/**
 * List of expense categories with key, label, icon, and color.
 */
export const expenseCategories = [
  { key: 'transportation', label: 'Transportation', icon: 'car', color: '#FF5E5E' },
  { key: 'entertainment', label: 'Entertainment', icon: 'movie-open', color: '#3EDBF0' },
  { key: 'bills', label: 'Bills & Utilities', icon: 'file-document', color: '#FFD93D' },
  { key: 'health', label: 'Health & Fitness', icon: 'heart-pulse', color: '#6BCB77' },
  { key: 'shopping', label: 'Shopping', icon: 'shopping', color: '#00C9A7' },
  { key: 'food', label: 'Food & Drink', icon: 'food', color: '#6A5ACD' },
  { key: 'education', label: 'Education', icon: 'school', color: '#FFB84C' },
  { key: 'other_expense', label: 'Other Expense', icon: 'dots-horizontal', color: '#B0B3C6' },
];

/**
 * List of income categories with key, label, icon, and color.
 */
export const incomeCategories = [
  { key: 'salary', label: 'Salary', icon: 'cash', color: '#5B5FE9' },
  { key: 'bonus', label: 'Bonus', icon: 'gift', color: '#FFD93D' },
  { key: 'freelance', label: 'Freelance', icon: 'briefcase', color: '#00C9A7' },
  { key: 'investment', label: 'Investment', icon: 'chart-line', color: '#6BCB77' },
  { key: 'business', label: 'Business', icon: 'store', color: '#3EDBF0' },
  { key: 'allowance', label: 'Allowance', icon: 'account-heart', color: '#FF5E5E' },
  { key: 'cashback', label: 'Cashback', icon: 'cash-refund', color: '#6A5ACD' },
  { key: 'other_income', label: 'Other Income', icon: 'dots-horizontal', color: '#23243A' },
];

/**
 * Combined list of all categories (expense and income).
 */
export const categories = [
  ...expenseCategories,
  ...incomeCategories,
]; 