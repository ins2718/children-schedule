import { AlignmentType } from "docx";

export type AlignmentTypeType = typeof AlignmentType[keyof typeof AlignmentType];

export const twipsPerCm = 567;

export interface Lesson {
    title: string;
    purpose?: string;
}