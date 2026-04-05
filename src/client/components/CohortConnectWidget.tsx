import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Block, Button } from '#client/components/ui'
import { useCohorts, useEnergy } from '#client/queries'
import { useLogContext } from '#client/hooks/useLogContext'
import { recordSignal, getUserState } from '#client/stores/intentionEngine'

/**
 * Cohort Connect Widget - Find and connect with cohort members
 *
 * Shows users in the same cohort with shared patterns and behaviors
 * Enriched with user log context for personalized cohort presentation
 * Connection-state aware: factors in user's energy and alignment
 */
export const CohortConnectWidget: React.FC = () => {
  const me = useStore(stores.me)
  const { data: cohortData, isLoading } = useCohorts()
  const { data: energyData } = useEnergy()
  const [expandedMemberId, setExpandedMemberId] = React.useState<string | null>(null)
  const logCtx = useLogContext()
  const hasRecordedRef = React.useRef(false)

  // Record cohort widget view signal once
  if (!hasRecordedRef.current && cohortData?.matches?.length) {
    recordSignal('mood', 'cohort_widget_viewed', {
      matchCount: cohortData.matches.length,
      hour: new Date().getHours()
    })
    hasRecordedRef.current = true
  }

  if (isLoading || !cohortData?.matches || cohortData.matches.length === 0) {
    return null
  }

  const { matches, yourPatterns } = cohortData

  // Determine cohort name from patterns
  const cohort = yourPatterns && yourPatterns.length > 0
    ? yourPatterns[0].type.replace('-', ' ')
    : 'explorer'

  // Get connection state context for richer matching insight
  const userState = getUserState()
  const connectionQuality = energyData?.energyState?.romanticConnection?.connectionQuality
  const energyStatus = energyData?.energyState?.status

  // Connection readiness - combine energy + alignment for cohort context
  const connectionReadiness =
    userState.alignment === 'flowing' || userState.alignment === 'aligned'
      ? 'open'
      : userState.needsSupport === 'critical' || userState.needsSupport === 'moderate'
        ? 'needs-support'
        : userState.energy === 'depleted' || userState.energy === 'low'
          ? 'low-energy'
          : 'neutral'

  // Show only top 5 matches by similarity
  const topMatches = matches
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)

  const handleViewProfile = (userId: string, similarity: number) => {
    recordSignal('mood', 'cohort_profile_viewed', {
      userId,
      similarity,
      connectionReadiness,
      hour: new Date().getHours()
    })
    window.location.href = `/users/${userId}`
  }

  const handleSendMessage = (userId: string, similarity: number) => {
    recordSignal('mood', 'cohort_message_initiated', {
      userId,
      similarity,
      connectionReadiness,
      hour: new Date().getHours()
    })
    window.location.href = '/sync'
  }

  const handleToggleExpand = (userId: string) => {
    const willExpand = expandedMemberId !== userId
    if (willExpand) {
      recordSignal('mood', 'cohort_member_expanded', { userId, hour: new Date().getHours() })
    }
    setExpandedMemberId(expandedMemberId === userId ? null : userId)
  }

  // Connection context message based on user state
  const connectionContext =
    connectionReadiness === 'needs-support'
      ? 'Reaching out can help. These members share your patterns.'
      : connectionReadiness === 'low-energy'
        ? 'Low energy. Gentle connections only.'
        : connectionReadiness === 'open'
          ? 'Good energy for connection.'
          : null

  return (
    <Block label="Cohort:" blockView>
      <div>
        {/* Cohort name */}
        <div className="mb-16">
          <div className="mb-4">Your cohort</div>
          <div className="capitalize">{cohort}</div>
        </div>

        {/* Connection context from user state */}
        {connectionContext && (
          <div className="mb-16 opacity-30">
            {connectionContext}
          </div>
        )}

        {/* Total members */}
        <div className="mb-16">
          {matches.length} {matches.length === 1 ? 'member' : 'members'} with shared patterns
        </div>

        {/* Member list - minimal */}
        <div className="space-y-4">
          {topMatches.map((match) => {
            const isExpanded = expandedMemberId === match.user.id
            const similarity = Math.round(match.similarity * 100)

            return (
              <div
                key={match.user.id}
                className="border-t border-acc/10 pt-8 first:border-t-0 first:pt-0"
              >
                {/* Member header - clickable */}
                <div
                  className="flex items-start justify-between cursor-pointer grid-fill-hover -mx-4 px-4 py-2 rounded"
                  onClick={() => handleToggleExpand(match.user.id)}
                >
                  <div className="flex-1">
                    <div className="mb-4">
                      {match.user.firstName} {match.user.lastName?.charAt(0)}.
                    </div>
                    <div>
                      {match.user.city || 'Location unknown'} • {similarity}% match
                    </div>
                  </div>

                  <div>
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-8 ml-4 space-y-8">
                    {/* Shared patterns */}
                    {match.sharedPatterns.length > 0 && (
                      <div>
                        <div className="mb-4">Shared patterns</div>
                        <div className="space-y-2">
                          {match.sharedPatterns.slice(0, 3).map((pattern, i) => (
                            <div key={i}>. {pattern}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        size="small"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          handleViewProfile(match.user.id, match.similarity)
                        }}
                      >
                        View profile
                      </Button>
                      <Button
                        size="small"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          handleSendMessage(match.user.id, match.similarity)
                        }}
                      >
                        Send message
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* View all link */}
        {matches.length > 5 && (
          <div className="mt-16">
            <button
              onClick={() => window.location.href = '/community'}
              className="hover:opacity-100 transition-opacity"
            >
              View all {matches.length} members
            </button>
          </div>
        )}

        {/* Log-context-grounded cohort insight */}
        <div className="mt-16 opacity-30">
          {!logCtx.isEmpty && logCtx.widgetDiversity >= 3
            ? `Matched on ${logCtx.widgetDiversity} behavioral dimensions.`
            : 'Connections based on shared patterns.'
          }
        </div>
      </div>
    </Block>
  )
}
