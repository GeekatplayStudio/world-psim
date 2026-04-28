import {
  calculateActorRadius,
  calculateCompositePower,
  calculateNonStateCompositePower
} from "../src/index";

describe("calculateCompositePower", () => {
  it("applies the documented weighted formula", () => {
    expect(
      calculateCompositePower({
        politicalPower: 70,
        economicPower: 50,
        militaryPower: 80,
        diplomaticPower: 60,
        softPower: 40
      })
    ).toBe(63.5);
  });

  it("supports the non-state actor weighting", () => {
    expect(
      calculateNonStateCompositePower({
        politicalPower: 45,
        economicPower: 20,
        militaryPower: 70,
        diplomaticPower: 30,
        territorialInfluence: 55,
        externalSupport: 65
      })
    ).toBe(53.25);
  });

  it("uses a softened radius scale", () => {
    expect(calculateActorRadius(64)).toBe(2.04);
    expect(calculateActorRadius(-10)).toBe(0.6);
  });
});