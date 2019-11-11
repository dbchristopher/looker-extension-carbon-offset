import React, { FC, ReactNode } from "react";
import { Heading } from "@looker/components";
import styled from "styled-components";
import SubTitle from "./SubTitle";

interface MetricProps {
  glyph: ReactNode;
  amount: string;
}

const Metric: FC<MetricProps> = ({ glyph, amount }) => {
  return (
    <MetricWrapper>
      {glyph}
      <div>
        <Heading
          fontSize="xxxlarge"
          fontWeight="bold"
          as="h3"
          my="none"
          lineHeight="xlarge"
        >
          {amount}
        </Heading>
        <SubTitle>Kg of carbon</SubTitle>
      </div>
    </MetricWrapper>
  );
};

export default Metric;

const MetricWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  grid-gap: 1rem;
`;
