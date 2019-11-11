/* eslint-disable @typescript-eslint/camelcase */
import React, { FC, useState, useLayoutEffect, SetStateAction } from "react";
import styled from "styled-components";
import {
  Paragraph,
  Heading,
  Button,
  ButtonTransparent
} from "@looker/components";
import isEmpty from "lodash/isEmpty";
import compact from "lodash/compact";
import has from "lodash/has";
import map from "lodash/map";
import round from "lodash/round";
import SectionHeading from "./SectionHeading";
import Total from "./Total";
import SubTitle from "./SubTitle";
import Map from "./Map";
import PageLoading from "./PageLoading";
import { numberFormat } from "./utilities";

interface PurchaseProps {
  carbonOffset: number;
  onCancel: () => void;
  onPurchase: () => void;
  setCloverlyReceiptUrl: (url: SetStateAction<string>) => void;
}

const publicKey = "629ba2f71882b63e"; // sandbox

const Purchase: FC<PurchaseProps> = ({
  carbonOffset,
  onCancel,
  onPurchase,
  setCloverlyReceiptUrl
}) => {
  const [cloverlyResponse, setCloverlyResponse] = useState({});

  useLayoutEffect(() => {
    async function fetchCloverly() {
      const response = await fetch(
        "https://api.cloverly.com/2019-03-beta/estimates/carbon",
        {
          body: `{"weight":{"value":${carbonOffset},"units":"kg"}}`,
          headers: {
            Authorization: `Bearer public_key:${publicKey}`,
            "Content-Type": "application/json;charset=utf-8"
          },
          method: "POST"
        }
      );

      if (response.ok) {
        // if HTTP-status is 200-299
        // get the response body (the method explained below)
        const json = await response.json();
        setCloverlyResponse(json);
      }
    }
    if (carbonOffset) {
      fetchCloverly();
    }
  }, [carbonOffset]);

  if (isEmpty(cloverlyResponse)) {
    return <PageLoading />;
  }

  const {
    offset,
    total_cost_in_usd_cents,
    equivalent_carbon_in_kg,
    pretty_url
  } = cloverlyResponse as any;

  setCloverlyReceiptUrl(pretty_url);

  const description: string[] = compact(
    offset.technical_details.split("\r\n\r\n")
  );

  return (
    <>
      <div>
        <SectionHeading>Here's what you'll be buying:</SectionHeading>
        <Heading as="h1" fontWeight="bold" fontSize="xxxxlarge" mb="medium">
          {offset.name}
        </Heading>
        {map(description, (p, i) => (
          <Paragraph key={i} mb="large">
            {p}
          </Paragraph>
        ))}
        <TotalWrapper>
          <Total
            value={`$${numberFormat(round(total_cost_in_usd_cents / 100))}`}
          />
          <div>
            <EquivalentCarbonWrapper>
              <CarbonAmount>
                {numberFormat(equivalent_carbon_in_kg)}
              </CarbonAmount>
              <SubTitle>Kg of carbon offset</SubTitle>
            </EquivalentCarbonWrapper>
          </div>
        </TotalWrapper>
        <PurchaseWrapper>
          <Button onClick={onPurchase} size="large" mr="medium">
            {" "}
            Purchase
          </Button>
          <ButtonTransparent onClick={onCancel} size="large">
            Cancel
          </ButtonTransparent>
        </PurchaseWrapper>
      </div>
      <div>
        <Map lat={offset.latlng.y} lng={offset.latlng.x} />
        <dl>
          <Dt>Location</Dt>
          <Dd>
            {offset.city}, {offset.province}, {offset.country}
          </Dd>
          <Dt>Type</Dt>
          <Dd>{offset.offset_type}</Dd>
          <Dt>Total Capacity</Dt>
          <Dd>{offset.total_capacity}</Dd>
        </dl>
      </div>
    </>
  );
};

export default Purchase;

const PurchaseWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xxxlarge};
`;

const TotalWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 2rem;
  margin: ${({ theme }) => theme.space.xxxlarge} 0;
  align-items: center;
`;

const EquivalentCarbonWrapper = styled.div`
  border: 5px solid ${({ theme }) => theme.colors.palette.purple400};
  padding: ${({ theme }) => `${theme.space.medium} ${theme.space.xlarge}`};
  display: inline-block;
`;

const CarbonAmount = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
`;

const Dt = styled.dt`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-top: ${({ theme }) => theme.space.large};
`;

const Dd = styled.dd`
  font-weight: 300;
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.space.large};
`;
