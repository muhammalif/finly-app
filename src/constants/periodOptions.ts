/**
 * Utility for generating period filter options for statistics and reports.
 * @module periodOptions
 */

import { TFunction } from 'i18next';

/**
 * Returns an array of period options for filtering (day, week, month, year, all).
 * @param t - Translation function
 * @returns Array of period option objects with key and label
 */
export const getPeriodOptions = (t: TFunction) => ([
  { key: 'day', label: t('day') },
  { key: 'week', label: t('week') },
  { key: 'month', label: t('month') },
  { key: 'year', label: t('year') },
  { key: 'all', label: t('all') },
]); 