import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProfileHeader } from './ProfileHeader'

const meta: Meta<typeof ProfileHeader> = {
  title: 'Ciclo/Moléculas/ProfileHeader',
  component: ProfileHeader,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white', values: [{ name: 'white', value: '#ffffff' }] },
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    onOpenManager: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ProfileHeader>

export const ComPerfil: Story = {
  name: 'Com perfil',
  args: {
    profile: { id: '1', nome: 'Luna', created_at: '2024-01-01' },
  },
}

export const SemPerfil: Story = {
  name: 'Sem perfil (novo usuário)',
  args: {
    profile: null,
  },
}

export const NomeLongo: Story = {
  name: 'Nome longo (truncado)',
  args: {
    profile: { id: '2', nome: 'Valentina Marchetti de Oliveira', created_at: '2024-01-01' },
  },
}
