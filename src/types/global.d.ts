/**
 * Global type declarations for the project.
 * Includes module declarations for SVG, JSON, and custom utility types.
 * @module global
 */
import { Transaction } from './Transaction';
import { User } from './User';

declare global {
    /**
     * Declaration module for importing SVG files as React components.
     */
    declare module '*.svg' {
        import React from 'react';
        import { SvgProps } from 'react-native-svg';
        const content: React.FC<SvgProps>;
        export default content;
    }

    /**
     * Declaration module for importing JSON files.
     */
    declare module '*.json' {
        const value: any;
        export default value;
    }

    /**
     * Utility type for nullable values.
     */
    type Nullable<T> = T | null;
    /**
     * Utility type for optional values.
     */
    type Optional<T> = T | undefined;
}
