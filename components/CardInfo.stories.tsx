import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CardInfo } from './CardInfo'

const meta: Meta<typeof CardInfo> = {
  title: 'Ciclo/Moléculas/CardInfo',
  component: CardInfo,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'app' },
  },
  argTypes: {
    color: { control: 'radio', options: ['rose', 'teal'] },
  },
}

export default meta
type Story = StoryObj<typeof CardInfo>

export const Periodo: Story = {
  name: 'Período (rose)',
  args: { title: 'Período', value: '9 de maio', color: 'rose' },
}

export const Ovulacao: Story = {
  name: 'Ovulação (teal)',
  args: { title: 'Ovulação', value: '25 de abril', color: 'teal' },
}

export const DuplosLadoALado: Story = {
  name: 'Par lado a lado',
  render: () => (
    <div className="flex gap-2">
      <CardInfo title="Período" value="9 de maio" color="rose" />
      <CardInfo title="Ovulação" value="25 de abril" color="teal" />
    </div>
  ),
}
