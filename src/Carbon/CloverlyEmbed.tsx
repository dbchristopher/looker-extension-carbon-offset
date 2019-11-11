import React, { FC, useLayoutEffect, useState } from "react";
import {
  Heading,
  IconButton,
  Spinner,
  Confirm,
  Icon
} from "@looker/components";
import { palette } from "@looker/design-tokens";
import styled, { createGlobalStyle } from "styled-components";

interface CloverlyEmbedProps {
  cloverlyReceiptUrl: string;
  onReset: () => void;
  onComplete: () => void;
  getResponseCount: () => void;
  responseCount: number;
}

const CloverlyEmbed: FC<CloverlyEmbedProps> = ({
  cloverlyReceiptUrl,
  onReset,
  onComplete,
  responseCount,
  getResponseCount
}) => {
  const [asyncLoading, setAsyncLoading] = useState(false);

  useLayoutEffect(() => {
    async function updateResponses() {
      setAsyncLoading(true);
      await getResponseCount();
      setAsyncLoading(false);
    }
    updateResponses();
  }, []);

  if (!cloverlyReceiptUrl) {
    return null;
  }
  return (
    <EmbedLayout>
      <EmbedNavbar>
        <ContentWrapper>
          <LogoWrapper>
            <IconButton
              shape="round"
              icon="CaretLeft"
              onClick={onReset}
              label="Start Over"
              size="large"
              px="large"
              outline
            />
            <Heading as="h1">Start Over</Heading>
          </LogoWrapper>
          <NextWrapper>
            <NextLabel as="h1">
              {asyncLoading ? (
                <Spinner
                  size={30}
                  markers={15}
                  markerRadius={20}
                  color="#6C43E0"
                  speed={2000}
                  top="7px"
                />
              ) : (
                `Notify ${responseCount} Users`
              )}
            </NextLabel>
            <Confirm
              title="Send text messages:"
              message={
                (<Message responseCount={responseCount} /> as unknown) as string
              }
              onConfirm={close => {
                onComplete();
                close();
              }}
            >
              {open => (
                <NextButton
                  shape="round"
                  icon="CaretRight"
                  onClick={open}
                  label="Notify people that you’ve offset their carbon."
                  size="large"
                  px="large"
                  outline
                />
              )}
            </Confirm>
          </NextWrapper>
        </ContentWrapper>
      </EmbedNavbar>
      <IframeWrapper>
        <GlobalModalStyle />
        <Iframe src={cloverlyReceiptUrl} />
      </IframeWrapper>
    </EmbedLayout>
  );
};

export default CloverlyEmbed;

interface MessageProps {
  responseCount: number;
}

const Message: FC<MessageProps> = ({ responseCount }) => (
  <MessageGrid>
    <IconWrapper>
      <Icon name="DigitalMarketingApp" size="50px" />
    </IconWrapper>
    <div>
      Would you like to{" "}
      <MessageHighlight>text {responseCount} people</MessageHighlight> to notify
      them about these offsets?
    </div>
  </MessageGrid>
);

const MessageGrid = styled.div`
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: auto 1fr;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const IconWrapper = styled.div`
  border: 3px solid ${palette.purple400};
  padding: 0.5rem;
  color: ${palette.purple400};
  border-radius: 100%;
`;

const MessageHighlight = styled.span`
  color: ${palette.purple500};
  font-weight: 600;
`;

const GlobalModalStyle = createGlobalStyle`
  [class*='ModalHeader'] {
    background: ${palette.charcoal100};
    border-radius: 0.25rem 0.25rem 0 0;
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    h2 {
      font-size: 0.85rem !important;
      font-weight: bold;
      color: ${palette.charcoal700};
   }
   [class*='ButtonBase'] {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      margin-right: -0.5rem;
    }
  }
  [class*='ModalContent'] {
    max-width: 400px;
    padding-bottom: 0.25rem;
  }
`;

const NextLabel = styled(Heading).attrs({ as: "h1" })`
  color: ${({ theme }) => theme.colors.palette.purple400};
`;

const EmbedLayout = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-rows: auto 1fr;
`;

const Iframe = styled.iframe`
  border: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const IframeWrapper = styled.div`
  position: relative;
`;

const EmbedNavbar = styled.div`
  background: ${({ theme }) => theme.colors.palette.charcoal100};
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space.large} 1.25rem`};
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const LogoWrapper = styled.div`
  justify-self: left;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
`;

const NextWrapper = styled.div`
  justify-self: right;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
`;

const NextButton = styled(IconButton)`
  background: ${({ theme }) => theme.colors.palette.purple400};
  border-color: white;
  color: white;
  &:hover {
    color: white;
    background: ${({ theme }) => theme.colors.palette.purple500};
    border-color: white;
  }
`;
