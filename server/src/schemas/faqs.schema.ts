import { z } from 'zod';

export const faqsIdParamSchema = z.object({
  id: z.string().min(1, 'FAQ ID is required'),
});

export const faqsCreateSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, 'Question is required'),
        answer: z.string().min(1, 'Answer is required'),
      }),
    )
    .min(1, 'At least one FAQ is required'),
});

export const faqsUpdateSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, 'Question is required'),
        answer: z.string().min(1, 'Answer is required'),
      }),
    )
    .min(1, 'At least one FAQ is required'),
});

export const faqsUpdateCurrentSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, 'Question is required'),
        answer: z.string().min(1, 'Answer is required'),
      }),
    )
    .min(1, 'At least one FAQ is required'),
});
