import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PregnancyChanceCard } from './PregnancyChanceCard'

const meta: Meta<typeof PregnancyChanceCard> = {
  title: 'Ciclo/Organismos/PregnancyChanceCard',
  component: PregnancyChanceCard,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'rosa', values: [{ name: 'rosa', value: '#fdf6f7' }] },
  },
  argTypes: {
    chance: {
      control: 'select',
      options: ['improvável', 'baixa', 'possível', 'certo', 'alta'],
    },
  },
}

export default meta
type Story = StoryObj<typeof PregnancyChanceCard>

export const Improvavel: Story = {
  name: 'Improvável',
  args: { chance: 'improvável' },
}

export const Baixa: Story = {
  name: 'Baixa',
  args: { chance: 'baixa' },
}

export const Possivel: Story = {
  name: 'Possível',
  args: { chance: 'possível' },
}

export const Certo: Story = {
  name: 'Certo',
  args: { chance: 'certo' },
}

export const Alta: Story = {
  name: 'Alta',
  args: { chance: 'alta' },
}
