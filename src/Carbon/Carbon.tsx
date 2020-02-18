import React, { FC, useState, useReducer } from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme, palette } from "@looker/design-tokens";
import { CityScape } from "./assets";
import Calculator from "./Calculator";
import Purchase from "./Purchase";
import CloverlyEmbed from "./CloverlyEmbed";
import OffsetConfirmation from "./OffsetConfirmation";
import Title from "./Title";

const lookerTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    semanticColors: {
      ...theme.colors.semanticColors,
      primary: {
        ...theme.colors.semanticColors.primary,
        dark: palette.purple500,
        darker: palette.purple600,
        main: palette.purple400
      }
    }
  }
};

interface AppProps {
  planeCarbon: number;
  autoCarbon: number;
  otherCarbon: number;
  responseCount: number;
  getResponseCount: () => void;
  notifyUsers: () => void;
}

interface Action {
  type: "submit" | "cancel" | "view-receipt" | "offset-confirmation" | "";
}

interface State {
  route: "purchase" | "calculate" | "view-receipt" | "offset-confirmation";
}

function formStateReducer(state: State, action: Action = { type: "" }) {
  switch (action.type) {
    case "submit":
      return { route: "purchase" };
    case "cancel":
      return { route: "calculate" };
    case "view-receipt":
      return { route: "view-receipt" };
    case "offset-confirmation":
      return { route: "offset-confirmation" };
    default:
      return state;
  }
}

const Carbon: FC<AppProps> = ({
  planeCarbon,
  autoCarbon,
  otherCarbon,
  responseCount,
  getResponseCount,
  notifyUsers
}) => {
  const [carbonOffset, setCarbonOffset] = useState(0);
  const [cloverlyReceiptUrl, setCloverlyReceiptUrl] = useState("");
  const [formState, dispatch] = useReducer<any>(formStateReducer, {
    route: "calculate"
  } as State);

  const handleFormSubmit = () => dispatch({ type: "submit" } as Action);
  const handleFormCancel = () => dispatch({ type: "cancel" } as Action);
  const handlePurchase = () => dispatch({ type: "view-receipt" } as Action);
  const handleConfirmation = () =>
    dispatch({ type: "offset-confirmation" } as Action);

  return (
    <ThemeProvider theme={lookerTheme}>
      {(formState.route === "view-receipt" && (
        <CloverlyEmbed
          cloverlyReceiptUrl={cloverlyReceiptUrl}
          onComplete={handleConfirmation}
          onReset={handleFormCancel}
          responseCount={responseCount}
          getResponseCount={getResponseCount}
        />
      )) || (
        <PageLayout>
          <Header>
            <ContentWrapper>
              <Title />
              <CityScape />
            </ContentWrapper>
          </Header>
          {(formState.route === "offset-confirmation" && (
            <OffsetConfirmation notifyUsers={notifyUsers} />
          )) || (
            <ContentWrapper>
              {formState.route === "calculate" && (
                <Calculator
                  planeCarbon={planeCarbon}
                  autoCarbon={autoCarbon}
                  otherCarbon={otherCarbon}
                  carbonOffset={carbonOffset}
                  onChange={setCarbonOffset}
                  onSubmit={handleFormSubmit}
                />
              )}
              {formState.route === "purchase" && (
                <Purchase
                  onCancel={handleFormCancel}
                  onPurchase={handlePurchase}
                  carbonOffset={carbonOffset}
                  setCloverlyReceiptUrl={setCloverlyReceiptUrl}
                />
              )}
            </ContentWrapper>
          )}
        </PageLayout>
      )}
    </ThemeProvider>
  );
};

export default Carbon;

const PageLayout = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-rows: auto 1fr;
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.palette.charcoal100};
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  padding: 0 ${({ theme }) => theme.space.xxlarge};
  margin: 0 auto;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 3fr 1fr;
`;
