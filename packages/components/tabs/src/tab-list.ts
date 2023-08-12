import { Primitive, PrimitiveProps } from '@oku-ui/primitive'
import type {
  ElementType,
  IPrimitiveProps,
  InstanceTypeRef,
  MergeProps,
} from '@oku-ui/primitive'
import type { PropType } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import { useForwardRef } from '@oku-ui/use-composable'
import { OkuRovingFocusGroup, createRovingFocusGroupScope } from '@oku-ui/roving-focus'
import type { ScopedPropsInterface } from './tabs'
import { ScopedProps, useTabsInject } from './tabs'

type TabListElement = ElementType<'div'>
export type _TabListEl = HTMLDivElement

const TAB_LIST_NAME = 'OkuTabList' as const

interface TabListProps extends ScopedPropsInterface<IPrimitiveProps> {
  loop?: boolean
}

const useRovingFocusGroupScope = createRovingFocusGroupScope()

const TabList = defineComponent({
  name: TAB_LIST_NAME,
  inheritAttrs: false,
  props: {
    loop: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    ...PrimitiveProps,
    ...ScopedProps,
  },
  setup(props, { slots, attrs }) {
    const { scopeTabs } = toRefs(props)
    const { ...listAttrs } = attrs

    const injectTabs = useTabsInject(TAB_LIST_NAME, scopeTabs.value)
    const forwardedRef = useForwardRef()

    const rovingFocusGroupScope = useRovingFocusGroupScope(props.scopeTabs)
    console.log('ONE', rovingFocusGroupScope)
    return () =>
      h(OkuRovingFocusGroup, {
        asChild: true,
        ...rovingFocusGroupScope.value,
        dir: injectTabs.value.dir,
        loop: props.loop,
      }, {
        default: () => h(
          Primitive.div,
          {
            'role': 'tablist',
            'aria-orientation': injectTabs.value.orientation,
            ...listAttrs,
            'ref': forwardedRef,
          },
          {
            default: () => slots.default?.(),
          },
        ),
      })
  },
})

type _TabListProps = MergeProps<TabListProps, TabListElement>

export type InstanceTabListType = InstanceTypeRef<typeof TabList, _TabListEl>

const OkuTabList = TabList as typeof TabList & (new () => { $props: _TabListProps })

export { OkuTabList }

export type { TabListProps }
