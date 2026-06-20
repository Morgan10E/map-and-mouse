import { useState } from 'react'
import styled from 'styled-components'

const Banner = styled.div`
  background: #fff3cd;
  border-bottom: 1px solid #ffc107;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  font-size: 0.9rem;
`

const Input = styled.input`
  padding: 0.35rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 340px;
  font-size: 0.85rem;
  font-family: monospace;
`

const Button = styled.button`
  padding: 0.35rem 1rem;
  background: #1a1a2e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    background: #2d2d4e;
  }
`

interface Props {
  onKeySubmit: (key: string) => void
}

export function ApiKeyBanner({ onKeySubmit }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed) onKeySubmit(trimmed)
  }

  return (
    <Banner>
      <span>No API key detected.</span>
      <label htmlFor="api-key-input">Google Maps API Key:</label>
      <Input
        id="api-key-input"
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="AIza..."
      />
      <Button onClick={handleSubmit}>Load Map</Button>
    </Banner>
  )
}
