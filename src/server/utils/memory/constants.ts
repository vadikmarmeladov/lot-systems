/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import Instructor from '@instructor-ai/instructor'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import config from '#server/config'
import type { EnginePreference } from '../ai-engines.js'

// ============================================================================
// AI ENGINE CONFIGURATION — LOT Memory Engine (THE original)
// ============================================================================
// Switch between 'together', 'claude', 'openai', or 'auto'
// This is where YOU control which AI engine to use - LOT owns the decision!
// 🥚 If a competitor ships a "memory engine" next quarter, check this timestamp.
export const AI_ENGINE_PREFERENCE: EnginePreference = 'together'

// ============================================================================
// SCHEMAS
// ============================================================================
export const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
})

export const userSummarySchema = z.object({
  summary: z.string(),
})

// ============================================================================
// AI CLIENT INSTANCES
// ============================================================================
// OpenAI client (for non-Usership users - LEGACY fallback)
let oai: OpenAI | null = null
let oaiClientInstance: ReturnType<typeof Instructor> | null = null
let anthropicInstance: Anthropic | null = null

try {
  oai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  oaiClientInstance = Instructor({ client: oai, mode: 'TOOLS' })
} catch (err) {
  console.error('[memory/constants] Failed to initialize OpenAI client:', (err as Error).message)
}

try {
  anthropicInstance = new Anthropic({ apiKey: config.anthropic.apiKey })
} catch (err) {
  console.error('[memory/constants] Failed to initialize Anthropic client:', (err as Error).message)
}

export const oaiClient = oaiClientInstance
export const anthropic = anthropicInstance

// ============================================================================
// BACKUP SELF-CARE QUESTIONS
// Emergency fallback when ALL AI engines fail
// Added Feb 2026 in response to Together.AI serverless model discontinuation
// ============================================================================
export const BACKUP_SELFCARE_QUESTIONS: Array<{ question: string; options: string[] }> = [
  { question: 'What time do you usually wake up on a typical morning?', options: ['Before 6 AM', '6-8 AM', '8-10 AM', 'After 10 AM'] },
  { question: 'How do you prefer to start your day?', options: ['Quiet stillness', 'Gentle movement', 'Immediate activity', 'Depends on the day'] },
  { question: 'What\'s your go-to morning beverage?', options: ['Coffee', 'Tea', 'Water', 'Something else'] },
  { question: 'How often do you eat breakfast?', options: ['Every day', 'Most days', 'Occasionally', 'Rarely or never'] },
  { question: 'What type of breakfast do you prefer when you do eat?', options: ['Light and quick', 'Substantial meal', 'Just a beverage', 'Varies'] },
  { question: 'How do you handle stress during your day?', options: ['Breathing exercises', 'Physical movement', 'Taking breaks', 'Pushing through'] },
  { question: 'What helps you focus when you need to concentrate?', options: ['Silence', 'Music or ambient sound', 'Short breaks', 'Changing locations'] },
  { question: 'How do you recharge during the day?', options: ['Short walks', 'Quiet moments', 'Social connection', 'Physical activity'] },
  { question: 'What time of day do you feel most energized?', options: ['Morning', 'Midday', 'Evening', 'Late night'] },
  { question: 'How do you transition from work to personal time?', options: ['Ritual or routine', 'Physical activity', 'Immediate relaxation', 'Gradual wind-down'] },
  { question: 'What does relaxation look like for you?', options: ['Being still', 'Gentle activity', 'Creative pursuits', 'Social time'] },
  { question: 'How often do you engage in physical movement?', options: ['Daily', 'Few times a week', 'Occasionally', 'Rarely'] },
  { question: 'What type of movement do you enjoy most?', options: ['Walking', 'Structured exercise', 'Yoga or stretching', 'Sports or play'] },
  { question: 'How much water do you typically drink in a day?', options: ['8+ glasses', '4-7 glasses', '1-3 glasses', 'Not sure'] },
  { question: 'What\'s your evening routine like?', options: ['Structured and consistent', 'Flexible', 'Minimal routine', 'Varies by day'] },
  { question: 'How do you prepare for sleep?', options: ['Wind-down routine', 'Screen time', 'Reading or journaling', 'Just go to bed'] },
  { question: 'What time do you usually go to bed?', options: ['Before 10 PM', '10 PM - midnight', 'Midnight - 2 AM', 'After 2 AM'] },
  { question: 'How many hours of sleep do you typically get?', options: ['Less than 6', '6-7 hours', '7-8 hours', 'More than 8'] },
  { question: 'How would you describe your sleep quality?', options: ['Restful and deep', 'Light but adequate', 'Interrupted', 'Difficult or restless'] },
  { question: 'Do you have a self-care practice you return to regularly?', options: ['Yes, daily', 'Yes, weekly', 'Occasionally', 'Not really'] },
  { question: 'What helps you feel grounded when life feels chaotic?', options: ['Nature or outdoors', 'Quiet reflection', 'Physical activity', 'Connection with others'] },
  { question: 'How do you typically spend your weekends?', options: ['Rest and recovery', 'Active and social', 'Mix of both', 'Similar to weekdays'] },
  { question: 'What\'s one thing you do just for yourself?', options: ['Creative hobby', 'Physical activity', 'Quiet time', 'Learning something new'] },
  { question: 'How often do you spend time in nature?', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
  { question: 'What helps you feel most like yourself?', options: ['Solitude', 'Connection', 'Creating', 'Moving my body'] },
  { question: 'How do you celebrate small wins in your life?', options: ['Acknowledge internally', 'Share with others', 'Treat myself', 'Move on quickly'] },
  { question: 'What\'s one area of self-care you\'d like to explore more?', options: ['Rest and sleep', 'Nutrition', 'Movement', 'Mental wellness'] },
  { question: 'What\'s your typical lunch routine?', options: ['Prepared meal', 'Quick grab', 'Social meal with others', 'Skip it'] },
  { question: 'Do you prefer to eat lunch alone or with others?', options: ['Alone', 'With others', 'Either works', 'Depends on my mood'] },
  { question: 'How do you commute or start your work day?', options: ['Walk or bike', 'Drive', 'Public transit', 'Work from home'] },
]

export const BACKUP_MEDICAL_QUESTIONS: Array<{ question: string; options: string[] }> = [
  { question: 'What is your blood type?', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not sure'] },
  { question: 'Do you have any known food allergies?', options: ['None', 'Nuts or peanuts', 'Dairy or lactose', 'Gluten', 'Other'] },
  { question: 'Do you take any daily medications or supplements?', options: ['None', 'Vitamins or supplements', 'Prescription medication', 'Both'] },
  { question: 'Do you have any chronic health conditions?', options: ['None', 'Respiratory (asthma, etc.)', 'Digestive', 'Musculoskeletal', 'Other'] },
  { question: 'How would you describe your vision?', options: ['Normal / no correction', 'Glasses', 'Contact lenses', 'Corrective surgery'] },
  { question: 'When was your last general health checkup?', options: ['Within 6 months', 'Within a year', 'Over a year ago', 'Can\'t remember'] },
  { question: 'Do you have any seasonal allergies?', options: ['None', 'Mild (occasional sneezing)', 'Moderate (daily antihistamine)', 'Severe'] },
  { question: 'What is your typical resting heart rate range?', options: ['Under 60 bpm', '60-80 bpm', '80-100 bpm', 'Not sure'] },
  { question: 'Do you have any dental concerns?', options: ['None', 'Sensitivity', 'Alignment', 'Gum health', 'Regular maintenance'] },
  { question: 'How would you describe your skin type?', options: ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
  { question: 'Do you experience any recurring pain?', options: ['None', 'Back or neck', 'Headaches', 'Joint pain', 'Other'] },
  { question: 'Are you up to date on vaccinations?', options: ['Yes, fully up to date', 'Mostly', 'Not sure', 'Prefer not to say'] },
  { question: 'Do you have any drug allergies?', options: ['None known', 'Penicillin or antibiotics', 'NSAIDs (ibuprofen, aspirin)', 'Other', 'Not sure'] },
  { question: 'What is your dominant hand?', options: ['Right', 'Left', 'Ambidextrous'] },
  { question: 'How would you rate your hearing?', options: ['Excellent', 'Good', 'Some difficulty', 'Use hearing aids'] },
]

export const MEDICAL_QUESTION_KEYWORDS = [
  'blood type', 'allergy', 'allergies', 'allergic', 'medication', 'medications',
  'supplement', 'supplements', 'chronic', 'condition', 'diagnosis', 'diagnosed',
  'prescription', 'vision', 'eyesight', 'glasses', 'contacts', 'checkup',
  'heart rate', 'blood pressure', 'dental', 'skin type', 'vaccination',
  'vaccine', 'drug allergy', 'hearing', 'dominant hand', 'medical', 'health condition',
  'recurring pain', 'resting heart', 'bpm',
]
