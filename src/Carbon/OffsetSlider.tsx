import React, { FC, useCallback, useState } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";
import { Slider } from "@looker/components";

interface OffsetSliderProps {
  offsetPercent: number;
  onChange: (value: number) => void;
}

const debounceNodeMeasurement = debounce(
  (node: any, cb: (arg: number) => void) => {
    if (node !== null) {
      cb(node.getBoundingClientRect().width);
    }
  },
  50
);

const OffsetSlider: FC<OffsetSliderProps> = ({ offsetPercent, onChange }) => {
  const handleChange = (event: any) => onChange(event.target.value);
  const [valueLabelWidth, setValueLabelWidth] = useState(0);

  // Measure width of text label when value changes
  const measuredRef = useCallback(
    (node: any) => {
      debounceNodeMeasurement(node, setValueLabelWidth);
    },
    [offsetPercent] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <SliderWrapper>
      <SliderBar>
        <SliderFill offsetPercent={offsetPercent} />
        <SliderValue
          realWidth={valueLabelWidth}
          offsetPercent={offsetPercent}
          ref={measuredRef}
        >
          {offsetPercent}%
        </SliderValue>
      </SliderBar>
      <StyledSlider
        min={0}
        max={100}
        value={offsetPercent}
        step={1}
        onChange={handleChange}
      />
    </SliderWrapper>
  );
};

export default OffsetSlider;

const SliderWrapper = styled.div`
  position: relative;
  height: auto;
  margin: 0 -10px;
`;

const StyledSlider = styled(Slider)`
  -webkit-appearance: none; /* stylelint-disable-line */
  width: 100%;
  background: transparent;
  display: block;

  &::-webkit-slider-thumb {
    -webkit-appearance: none; /* stylelint-disable-line */
    border: 3px solid ${({ theme }) => theme.colors.palette.purple400};
    height: 26px;
    width: 26px;
    border-radius: 100%;
    background: #ffffff;
    cursor: pointer;
    margin-top: -8px;
  }

  &::-moz-range-thumb {
    border: 3px solid ${({ theme }) => theme.colors.palette.purple400};
    height: 26px;
    width: 26px;
    border-radius: 100%;
    background: #ffffff;
    cursor: pointer;
  }

  &::-ms-thumb {
    border: 3px solid ${({ theme }) => theme.colors.palette.purple400};
    height: 26px;
    width: 26px;
    border-radius: 100%;
    background: #ffffff;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &::-ms-track {
    width: 100%;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
`;

const SliderBar = styled.div`
  width: calc(100% - 26px);
  height: 0.5rem;
  background: ${({ theme }) => theme.colors.palette.charcoal200};
  border-radius: ${({ theme }) => theme.radii.small};
  position: relative;
  top: 10px;
  margin: 0 auto;
  z-index: -1;
`;

interface SliderFillProps {
  offsetPercent: number;
}

const SliderFill = styled.div<SliderFillProps>`
  height: 100%;
  background: ${({ theme }) => theme.colors.palette.purple400};
  width: ${({ offsetPercent }) => offsetPercent}%;
  border-radius: ${({ theme }) => theme.radii.small};
`;

interface SliderValueProps extends SliderFillProps {
  realWidth: number;
}

const SliderValue = styled.div.attrs(({ realWidth }: SliderValueProps) => ({
  style: { marginLeft: `-${realWidth / 2}px` } // use style attr to mitigate quickly changing classes
}))<SliderValueProps>`
  position: absolute;
  left: ${({ offsetPercent }) => offsetPercent}%;
  top: 1rem;
  color: ${({ theme }) => theme.colors.palette.purple400};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
`;
