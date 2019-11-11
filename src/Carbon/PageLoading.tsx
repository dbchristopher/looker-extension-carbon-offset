import { Spinner, Text } from "@looker/components";
import React, { FC } from "react";
import styled from "styled-components";

const PageLoading: FC<{}> = () => {
  return (
    <LoadingWrapper>
      <LoadingLayout>
        <Spinner
          size={80}
          markers={20}
          markerRadius={50}
          color="#6C43E0"
          speed={2000}
        />
        <LoadingLabel>
          Matching <br />
          Offset
        </LoadingLabel>
      </LoadingLayout>
    </LoadingWrapper>
  );
};

export default PageLoading;

const LoadingWrapper = styled.div`
  display: grid;
  height: 400px;
  align-items: center;
  justify-items: center;
`;

const LoadingLabel = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.palette.purple500};
  line-height: 1.2;
`;

const LoadingLayout = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto auto;
  grid-gap: 0.5rem;
`;
