/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { recipeWidget, dismissRecipeWidget } from '#client/stores/recipeWidget'
import { Block } from '#client/components/ui'
import { useCreateLog, useLogs } from '#client/queries'
import { cn } from '#client/utils'
import * as stores from '#client/stores'
import { recordSignal } from '#client/stores/intentionEngine'

const FAREWELL_PHRASES = [
  'Bon appétit!',
  'Enjoy!',
  'Buon appetito!',
  'Guten Appetit!',
  '¡Buen provecho!',
  'Smakelijk!',
  'Приятного аппетита!', // Russian
  'いただきます!', // Japanese
  'Enjoy your meal!',
  'Dig in!',
  'Savor it!',
  'Delicious!',
]

/**
 * Farewell phrases used when the user acknowledges a fasting
 * suggestion. Keeping them reverent and brief to match the tone
 * of a light fast.
 */
const FASTING_FAREWELLS = [
  'Amen.',
  'Peace.',
  'Blessed fast.',
  'Godspeed.',
  'Go gently.',
  'Held.',
]

const WATER_TIPS: Record<string, string> = {
  breakfast: 'Drink 500ml of water before eating.',
  lunch: 'Drink a glass 30 min before lunch — not during.',
  dinner: 'Water before dinner, not during; aids digestion.',
  snack: 'Try a glass of water first — it often satisfies hunger.',
}

const FASTING_WATER_TIPS: Record<string, string> = {
  'light-snack': 'Sip water regularly between your light meal.',
  'dry-food': 'Stay hydrated between dry-food intervals.',
  'water-only': 'Warm or room-temp · herbal teas count · aim for 2 L total.',
  'prayer-rest': 'Sip water gently throughout the day.',
}

export const RecipeWidget: React.FC = () => {
  const state = useStore(recipeWidget)
  const router = useStore(stores.router)
  const { mutate: createLog } = useCreateLog()
  const { data: logs } = useLogs()
  const loggedRecipesRef = React.useRef<Set<string>>(new Set())
  const [isShown, setIsShown] = React.useState(false)
  const [isFading, setIsFading] = React.useState(false)
  const [isLabelFading, setIsLabelFading] = React.useState(false)
  const [farewellPhrase, setFarewellPhrase] = React.useState<string | null>(null)

  // Auto-log recipe when it becomes visible on System tab (only once per meal-time + recipe combo)
  React.useEffect(() => {
    if (!state.isVisible || !state.recipe) return

    // Only log if on System tab (no route or route === 'system')
    const isOnSystemTab = !router || router.route === 'system'
    if (!isOnSystemTab) return

    // Create unique key for this meal-time + recipe combination
    const recipeKey = `${state.mealTime}:${state.recipe}`

    // Skip if we've already logged this exact recipe in this session
    if (loggedRecipesRef.current.has(recipeKey)) {
      console.log(`⏭️  Skipping duplicate recipe (already in session): "${recipeKey}"`)
      return
    }

    // Create the full log text
    const mealLabel = getMealLabel()
    const fullText = `${mealLabel} ${state.recipe}`

    // Check if this exact recipe text already exists in the database
    const alreadyExists = logs?.some(log => log.text === fullText)
    if (alreadyExists) {
      console.log(`⏭️  Skipping duplicate recipe (already in database): "${fullText}"`)
      // Add to session tracking even if it's already in database
      loggedRecipesRef.current.add(recipeKey)
      return
    }

    // Mark as logged BEFORE creating (prevents race conditions)
    loggedRecipesRef.current.add(recipeKey)

    // Create log entry with recipe suggestion
    createLog(
      { text: fullText },
      {
        onSuccess: () => {
          console.log(`Logged recipe: ${recipeKey}`)
        },
        onError: (error) => {
          console.error('Failed to log recipe:', error)
          // Remove from logged set on error so it can be retried
          loggedRecipesRef.current.delete(recipeKey)
        }
      }
    )
  }, [state.isVisible, state.recipe, state.mealTime, router, createLog])

  // Handle fade-in when widget becomes visible
  React.useEffect(() => {
    if (state.isVisible) {
      // Small delay before showing to trigger transition
      setTimeout(() => {
        setIsShown(true)
      }, 100)
    } else {
      setIsShown(false)
      setIsFading(false)
      setIsLabelFading(false)
      setFarewellPhrase(null)
    }
  }, [state.isVisible])

  const handleDismiss = () => {
    try {
      recordSignal('selfcare', state.isFasting ? 'fasting_acknowledged' : 'recipe_acknowledged', {
        mealTime: state.mealTime,
        hour: new Date().getHours(),
        fastingMode: state.fastingMode,
      })
    } catch (e) {}

    // Pick a random farewell phrase — reverent for fasts, cheerful for meals
    const pool = state.isFasting ? FASTING_FAREWELLS : FAREWELL_PHRASES
    const randomPhrase = pool[Math.floor(Math.random() * pool.length)]
    setFarewellPhrase(randomPhrase)

    // Greeting stays visible for 3 seconds, then fades with label at memory speed (1400ms)
    setTimeout(() => {
      setIsFading(true) // Fade greeting content
      setIsLabelFading(true) // Fade label at same time
    }, 3000) // 3 seconds visible

    // Dismiss after fade completes
    setTimeout(() => {
      dismissRecipeWidget()
    }, 4400) // 3000ms visible + 1400ms fade = 4400ms total
  }

  if (!state.isVisible) return null

  const getWaterTip = (): string | null => {
    if (state.isFasting) return FASTING_WATER_TIPS[state.fastingMode] ?? null
    return state.mealTime ? (WATER_TIPS[state.mealTime] ?? null) : null
  }

  const getMealLabel = () => {
    // During a Christian fast, we relabel the widget so the user
    // immediately reads the suggestion as fasting guidance, not a
    // recipe. The label shifts with the fasting mode to match the
    // gradual algorithm: light snack → dry food → water → rest.
    if (state.isFasting) {
      switch (state.fastingMode) {
        case 'light-snack': return 'Light snack:'
        case 'dry-food':    return 'Fast:'
        case 'water-only':  return 'Water:'
        case 'prayer-rest': return 'Rest:'
        default:            return 'Fast:'
      }
    }
    switch (state.mealTime) {
      case 'breakfast': return 'Breakfast idea:'
      case 'lunch': return 'Lunch idea:'
      case 'dinner': return 'Dinner idea:'
      case 'snack': return 'Snack idea:'
      default: return 'Recipe idea:'
    }
  }

  return (
    <div
      className={cn(
        'transition-opacity duration-[1400ms]',
        isLabelFading ? 'opacity-0' : 'opacity-100'
      )}
    >
      <Block label={getMealLabel()} blockView>
        <div
          onClick={handleDismiss}
          className="cursor-pointer select-none"
        >
          {farewellPhrase ? (
            <div
              className={cn(
                'transition-opacity duration-[1400ms]',
                isFading ? 'opacity-0' : 'opacity-100'
              )}
            >
              {farewellPhrase}
            </div>
          ) : (
            <div
              className={cn(
                'opacity-0 transition-opacity duration-[1400ms]',
                isShown && 'opacity-100'
              )}
            >
              {state.isFasting && state.fastingHeadline && (
                <div className="opacity-30 mb-4">{state.fastingHeadline}</div>
              )}
              <div>{state.recipe}</div>
              {getWaterTip() && (
                <div
                  className={cn(
                    'mt-3 text-xs leading-relaxed',
                    state.fastingMode === 'water-only' ? 'opacity-60' : 'opacity-40'
                  )}
                >
                  {getWaterTip()}
                </div>
              )}
            </div>
          )}
        </div>
      </Block>
    </div>
  )
}
