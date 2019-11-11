import React, { FC } from "react";
import styled from "styled-components";
import { Heading } from "@looker/components";

const Title: FC<{}> = () => {
  return (
    <TitleWrapper>
      <Heading as="h1">Carbon Offset Calculator</Heading>
    </TitleWrapper>
  );
};

export default Title;

const TitleWrapper = styled.div`
  align-self: center;
`;
