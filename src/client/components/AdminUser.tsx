import * as React from 'react'
import { useStore } from '@nanostores/react'
import { Block, Link, Tag, TagsContainer, Unknown } from '#client/components/ui'
import { useUpdateUser, useUser } from '#client/queries'
import { USER_TAGS_BY_ID, COUNTRY_BY_ALPHA3 } from '#shared/constants'
import { UserTag } from '#shared/types'
import * as stores from '#client/stores'
import * as fp from '#shared/utils/fp'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'
import { useDocumentTitle } from '#client/utils/hooks'

export const AdminUser = () => {
  const [tagsEditorIsOn, setTagsEditorIsOn] = React.useState(false)
  const [tagsChanged, setTagsChanged] = React.useState<UserTag[]>([])
  const router = useStore(stores.router)

  const { data: user, refetch: refetchUser } = useUser(
    router?.route === 'adminUser' ? router.params.userId : ''
  )
  const { mutate: updateUser } = useUpdateUser({
    onSuccess: () => refetchUser(),
  })
  useDocumentTitle(user?.email ?? null)

  const country = React.useMemo(() => {
    if (!user?.country) return ''
    return COUNTRY_BY_ALPHA3[user.country]?.name || ''
  }, [user])

  const toggleTagsEditor = React.useCallback(() => {
    if (!user) return
    if (!tagsEditorIsOn) {
      setTagsChanged(user?.tags || [])
      setTagsEditorIsOn(true)
      return
    }
    const userTags = user?.tags || []
    const hasChanges = !fp.compareArrays(userTags, tagsChanged)
    if (hasChanges) {
      if (window.confirm('Do you want to save changes?')) {
        const sortedTagsChanged = Object.values(UserTag).filter((x) =>
          tagsChanged.includes(x)
        )
        updateUser({ id: user.id, tags: sortedTagsChanged })
      } else {
        setTagsChanged(userTags)
      }
    }
    setTagsEditorIsOn(false)
  }, [tagsEditorIsOn, tagsChanged, user])

  React.useEffect(() => {
    if (tagsEditorIsOn) {
      const listener = (ev: KeyboardEvent) => {
        if (ev.key === 'Enter') {
          toggleTagsEditor()
        }
        if (ev.key === 'Escape') {
          setTagsChanged(user?.tags || [])
          setTagsEditorIsOn(false)
        }
      }
      window.addEventListener('keydown', listener)
      return () => {
        window.removeEventListener('keydown', listener)
      }
    }
  }, [tagsEditorIsOn, user, toggleTagsEditor])

  React.useEffect(() => {
    if (user) {
      setTagsChanged(user.tags)
    }
  }, [user])

  return (
    <div>
      <div className="mb-32 flex gap-x-16">
        <Link href="/system" rel="external">
          /system
        </Link>
        <Link href="/us">/us</Link>
      </div>

      {!user ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-y-16">
          <div>
            <Block label="Email:">
              <Link href={`mailto:${user.email}`}>{user.email}</Link>
            </Block>
            <Block label="Name:" children={user.firstName || <Unknown />} />
            <Block label="Surname:" children={user.lastName || <Unknown />} />
          </div>
          <div>
            <Block
              label="Tags:"
              onClick={!tagsEditorIsOn ? toggleTagsEditor : undefined}
              onLabelClick={toggleTagsEditor}
              blockView
              contentClassName={cn(tagsEditorIsOn && 'blink')}
            >
              <TagsContainer
                items={
                  tagsEditorIsOn
                    ? Object.values(UserTag).map((tagId) => {
                        const tag = USER_TAGS_BY_ID[tagId] || {
                          name: tagId,
                          color: 'gray',
                        }
                        return (
                          <Tag
                            key={tagId}
                            fill={tagsChanged.includes(tagId)}
                            onClick={() => {
                              setTagsChanged(
                                fp.toggleInArray(tagsChanged, tagId)
                              )
                            }}
                          >
                            {tag.name}
                          </Tag>
                        )
                      })
                    : !user.tags.length
                    ? [<Unknown>None</Unknown>]
                    : user.tags.map((x) => {
                        const tag = USER_TAGS_BY_ID[x] || {
                          name: x,
                          color: 'gray',
                        }
                        return (
                          <Tag key={x} fill>
                            {tag.name}
                          </Tag>
                        )
                      })
                }
              />
            </Block>
          </div>
          <div>
            <Block
              label="Joined at:"
              children={dayjs(user.createdAt).format('D MMMM YYYY')}
            />
            <Block label="Active:">
              {user.joinedAt ? 'Yes' : <Unknown>No</Unknown>}
            </Block>
          </div>
          <div>
            <Block label="Country:" children={country || <Unknown />} />
            <Block label="City:" children={user.city || <Unknown />} />
            <Block label="Address:" children={user.address || <Unknown />} />
            <Block label="Phone:" children={user.phone || <Unknown />} />
          </div>
          {!!user.lastSeenAt && (
            <div className="mt-32">
              Last seen {dayjs(user.lastSeenAt).fromNow()}
            </div>
          )}
          {!!Object.keys(user.metadata || {}).length && (
            <div className="mt-32">
              <Block label="Metadata:" blockView>
                <Unknown>
                  <pre>{JSON.stringify(user.metadata, null, 2)}</pre>
                </Unknown>
              </Block>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
