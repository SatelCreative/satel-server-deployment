/**
 * Defines which features in the app should be
 * enabled. Will be useful for different environments
 * and parallel development
 */
export interface FeatureFlags {
  DIAGRAMS_BASE: boolean;
  PARTS_BASE: boolean;
  PRODUCTS_BASE: boolean;
  PRODUCTS_REPLACEMENTS: boolean;
  PRODUCTS_CATEGORIZATION: boolean;
  CATEGORIZATION_BASE: boolean;
  COMPANY_LEGACY_SYNC: boolean;
  COMPANY_TRANSFER: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  DIAGRAMS_BASE: true,
  CATEGORIZATION_BASE: true,
  PRODUCTS_BASE: true,
  PRODUCTS_REPLACEMENTS: false,
  PRODUCTS_CATEGORIZATION: true,
  PARTS_BASE: true,
  COMPANY_LEGACY_SYNC: true,
  COMPANY_TRANSFER: true,
};
