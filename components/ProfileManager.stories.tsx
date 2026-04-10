import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProfileManager } from './ProfileManager'

const PROFILES = [
  { id: '1', nome: 'Luna', created_at: '2024-01-01' },
  { id: '2', nome: 'Ana', created_at: '2024-02-01' },
]

const meta: Meta<typeof ProfileManager> = {
  title: 'Ciclo/Organismos/ProfileManager',
  component: ProfileManager,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'app' },
  },
  args: {
    open: true,
    onSwitch: () => {},
    onCreate: () => {},
    onRename: () => {},
    onDelete: () => {},
    onClose: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ProfileManager>

export const UmPerfil: Story = {
  name: 'Um perfil',
  args: {
    profiles: [PROFILES[0]],
    currentProfileId: '1',
  },
}

export const MultiplosPerfis: Story = {
  name: 'Múltiplos perfis',
  args: {
    profiles: PROFILES,
    currentProfileId: '1',
  },
}

export const SemPerfis: Story = {
  name: 'Sem perfis (novo usuário)',
  args: {
    profiles: [],
    currentProfileId: null,
  },
}
