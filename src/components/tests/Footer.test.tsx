import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders company name", () => {
    render(<Footer />);
    expect(screen.getByText(/Capitec Bank/)).toBeInTheDocument();
  });

  it("renders social media links", () => {
    render(<Footer />);
    expect(
      screen.getByLabelText("Visit our Facebook page"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Visit our Twitter page")).toBeInTheDocument();
  });

  it("renders scam warning", () => {
    render(<Footer />);
    expect(screen.getByText("⚠️ Beware of Scams")).toBeInTheDocument();
  });

  it("renders current year in copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(currentYear.toString())),
    ).toBeInTheDocument();
  });

  it("renders custom company name", () => {
    render(<Footer companyName="Test Company" />);
    expect(screen.getByText(/Test Company/)).toBeInTheDocument();
  });
});
