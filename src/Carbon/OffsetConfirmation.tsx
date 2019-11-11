import React, { FC, useEffect } from "react";
import { Heading, Text, Box } from "@looker/components";
import styled from "styled-components";

interface OrderConfirmationProps {
  notifyUsers: () => void;
}

const OffsetConfirmation: FC<OrderConfirmationProps> = ({ notifyUsers }) => {
  useEffect(() => {
    notifyUsers();
  }, []);
  return (
    <Box mt="xlarge">
      <MessageWrapper>
        <StyledPreface>Carbon offset!</StyledPreface>
        <StyledHeading>Thank you</StyledHeading>
        <StyledMessage>— For doing your part —</StyledMessage>
      </MessageWrapper>
    </Box>
  );
};

export default OffsetConfirmation;

const MessageWrapper = styled.div`
  display: grid;
  justify-items: center;
  max-width: 500px;
  margin: auto;
  grid-gap: ${({ theme }) => theme.space.xsmall};
  border: 1px solid ${({ theme }) => theme.colors.palette.purple400};
  padding: ${({ theme }) => `${theme.space.large} ${theme.space.xxlarge}`};
`;

const StyledHeading = styled(Heading).attrs({
  textTransform: "uppercase",
  fontWeight: "bold"
})`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.palette.purple400};
  line-height: 0.8;
  letter-spacing: -0.5px;
`;

const StyledPreface = styled(Text)`
  color: ${({ theme }) => theme.colors.palette.purple400};
  background: white;
  text-transform: uppercase;
  margin-top: -37px;
  margin-bottom: 10px;
  padding: 5px;
  letter-spacing: 1px;
`;

const StyledMessage = styled(Text)`
  letter-spacing: 1px;
  font-size: ${({ theme }) => theme.fontSizes.large};
`;
