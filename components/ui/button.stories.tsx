import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Salvar' },
}

export const Outline: Story = {
  args: { children: 'Cancelar', variant: 'outline' },
}

export const Secondary: Story = {
  args: { children: 'Secundário', variant: 'secondary' },
}

export const Destructive: Story = {
  args: { children: 'Apagar perfil', variant: 'destructive' },
}

export const Ghost: Story = {
  args: { children: 'Ver mais', variant: 'ghost' },
}

export const Small: Story = {
  args: { children: 'Confirmar', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Entrar', size: 'lg' },
}
