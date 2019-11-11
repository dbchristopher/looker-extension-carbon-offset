import React, { FC, useState, useEffect, SyntheticEvent } from "react";
import get from "lodash/get";
import toNumber from "lodash/toNumber";
import { round } from "lodash/fp";
import styled from "styled-components";
import { Button, InputText, Field } from "@looker/components";
import { Plane, Car, OtherTransport } from "./assets";
import Metric from "./Metric";
import OffsetSlider from "./OffsetSlider";
import SectionHeading from "./SectionHeading";
import WhaleChart from "./WhaleChart";
import Total from "./Total";
import { numberFormat } from "./utilities";

export interface CalculatorProps {
  planeCarbon: number;
  autoCarbon: number;
  otherCarbon: number;
  carbonOffset: number;
  onChange: (amount: number) => void;
  onSubmit: () => void;
}

const Calculator: FC<CalculatorProps> = ({
  planeCarbon,
  autoCarbon,
  otherCarbon,
  carbonOffset,
  onChange,
  onSubmit
}) => {
  const [offsetPercent, setOffsetPercent] = useState(0);
  const [additionalOffset, setAdditionalOffset] = useState(0);
  const totalCarbon = planeCarbon + autoCarbon + otherCarbon;

  useEffect(() => {
    onChange(round(totalCarbon * (offsetPercent / 100) + additionalOffset));
  }, [totalCarbon, offsetPercent, additionalOffset, onChange]);

  const handleNumberInput = (event: SyntheticEvent) => {
    const value = toNumber(get(event, "target.value", 0));

    if (!isNaN(value) && value <= 10000000) {
      setAdditionalOffset(value);
    }
  };

  return (
    <>
      <div>
        <SectionHeading>
          How many kg of carbon did it take for us to get here?
        </SectionHeading>
        <CarbonMetrics>
          <Metric glyph={<Plane />} amount={numberFormat(planeCarbon)} />
          <Metric glyph={<Car />} amount={numberFormat(autoCarbon)} />
          <Metric
            glyph={<OtherTransport />}
            amount={numberFormat(otherCarbon)}
          />
        </CarbonMetrics>
        <InputLayout>
          <Field>
            <SectionHeading>
              What percentage do you want to offset?
            </SectionHeading>
            <OffsetSlider
              offsetPercent={offsetPercent}
              onChange={setOffsetPercent}
            />
          </Field>
          <Field>
            <SectionHeading>Any Additional (kg)</SectionHeading>
            <InputNumber
              onChange={handleNumberInput}
              value={additionalOffset}
            />
          </Field>
        </InputLayout>
        <Total value={`${numberFormat(carbonOffset)} kg`} />
        <Button
          size="large"
          onClick={onSubmit}
          mb="xxlarge"
          mt="xxxlarge"
          disabled={carbonOffset === 0}
        >
          Estimate Cost
        </Button>
      </div>
      <WhaleChart totalCarbon={totalCarbon + additionalOffset} />
    </>
  );
};

export default Calculator;

const InputNumber = styled(InputText).attrs({
  fontSize: "xxlarge",
  fontWeight: "bold",
  type: "number"
})`
  border: 5px solid ${({ theme }) => theme.colors.palette.purple400};
  border-radius: 0;
  padding: ${({ theme }) => `${theme.space.large} ${theme.space.medium}`};
  margin-top: -15px;
  max-width: 170px;
  &:focus {
    outline: none;
  }
`;

const CarbonMetrics = styled.div`
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: ${({ theme }) => theme.space.xxlarge};
`;

const InputLayout = styled.div`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: 2fr 1fr;
  margin-bottom: ${({ theme }) => theme.space.xxlarge};
`;
