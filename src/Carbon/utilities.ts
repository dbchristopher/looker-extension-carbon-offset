import reduceRight from 'lodash/reduceRight'
import replace from 'lodash/replace'
import round from 'lodash/round'

// formats numbers by inserting a comma every three digits
export const numberFormat: (num: number) => string = num => {
  const formatted = reduceRight(num.toString(), (numString, digit) => {
    const bareNumber = replace(numString, /,/g, '')
    return `${digit}${!(bareNumber.length % 3) ? ',' : ''}${numString}`
  })

  return formatted || '0'
}

// convert kilograms to pounds
export const massInLbs = (mass: number) => {
  return round(mass * 2.20462)
}
