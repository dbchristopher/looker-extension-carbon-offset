import React, { FC } from 'react'
import styled from 'styled-components'

interface TotalProps {
  value: string
}

const Total: FC<TotalProps> = ({ value }) => {
  return (
    <TotalWrapper>
      <div>
        <TotalLabel>Total</TotalLabel>
        <MathSymbol>=</MathSymbol>
        {value}
      </div>
    </TotalWrapper>
  )
}

export default Total

const TotalWrapper = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxxxlarge};
  font-weight: bold;
`

const TotalLabel = styled.span`
  color: ${({ theme }) => theme.colors.palette.purple500};
  text-transform: uppercase;
`

const MathSymbol = styled.span`
  color: ${({ theme }) => theme.colors.palette.charcoal400};
  margin: 0 ${({ theme }) => theme.space.medium};
`
