import React from 'react'
import { Block, Button } from '#client/components/ui'
import { useMemory, useCreateMemory } from '#client/queries'
import { cn } from '#client/utils'
import { fp } from '#shared/utils'
import { DefaultQuestion } from '#shared/types'

export function MemoryWidget() {
  const [isDisplayed, setIsDisplayed] = React.useState(false)
  const [isShown, setIsShown] = React.useState(false)
  const [isQuestionShown, setIsQuestionShown] = React.useState(false)
  const [isResponseShown, setIsResponseShown] = React.useState(false)
  const [question, setQuestion] = React.useState<DefaultQuestion | null>(null)
  const [response, setResponse] = React.useState<string | null>(null)
  const { data: loadedQuestion = null } = useMemory()
  const { mutate: createMemory } = useCreateMemory({
    onSuccess: ({ response }) => {
      setIsQuestionShown(false)
      setTimeout(() => {
        setQuestion(null)
        setResponse(response)
        setTimeout(() => {
          setIsResponseShown(true)
          setTimeout(() => {
            setIsShown(false)
            setTimeout(() => {
              setIsDisplayed(false)
              setIsResponseShown(false)
              setResponse(null)
            }, 1500)
          }, 5000)
        }, 100)
      }, 1500)
    },
  })

  const onAnswer = React.useCallback(
    (option: string) => (ev: React.MouseEvent) => {
      if (!question) return
      createMemory({ questionId: question.id, option })
    },
    [question]
  )

  React.useEffect(() => {
    if (loadedQuestion) {
      setTimeout(() => {
        setIsDisplayed(true)
        setTimeout(() => {
          setQuestion(loadedQuestion)
          setIsShown(true)
          setIsQuestionShown(true)
          setResponse(null)
          setIsResponseShown(false)
        }, 100)
      }, fp.randomElement([1200, 2100, 1650, 2800]))
    }
  }, [loadedQuestion])

  React.useEffect(() => {
    if (response) {
      setTimeout(() => {
        setIsResponseShown(true)
      }, 1500)
    }
  }, [response])

  // return !isDisplayed ? null : (
  return (
    <Block
      label="Memory:"
      blockView
      className={cn(
        'min-h-[208px]',
        // To avoid flickering. This widget should placed last on the "systems" page.
        // Alternatively, max-height animation could be used.
        'opacity-0 transition-opacity duration-[1400ms]',
        isShown && 'opacity-100'
      )}
    >
      {!!question && (
        <div
          className={cn(
            'opacity-0 transition-opacity duration-[1400ms]',
            isQuestionShown && 'opacity-100'
          )}
        >
          <div className="mb-16">{question?.question || '...'}</div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-8 sm:-mb-8">
            {(question?.options || []).map((option) => (
              <Button
                key={option}
                className="w-full sm:w-auto sm:mb-8"
                onClick={onAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
      {!!response && (
        <div
          className={cn(
            'opacity-0 transition-opacity duration-[1400ms]',
            isResponseShown && 'opacity-100'
          )}
        >
          {response}
        </div>
      )}
    </Block>
  )
}
