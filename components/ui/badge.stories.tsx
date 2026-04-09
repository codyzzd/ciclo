import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { children: 'Período' },
}

export const Secondary: Story = {
  args: { children: 'Fértil', variant: 'secondary' },
}

export const Outline: Story = {
  args: { children: 'Previsão', variant: 'outline' },
}

export const Destructive: Story = {
  args: { children: 'Atrasado', variant: 'destructive' },
}
