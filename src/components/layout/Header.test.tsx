import { render, screen } from "@testing-library/react";
import Header from "./Header";

test("should display image and text on header", () => {
    render(<Header />);
    
    const logoImage = screen.getByRole("img", {
        name: /logo/i
    });

    expect(logoImage).toBeInTheDocument();

    const bannerText = screen.getByRole('paragraph');

    expect(bannerText).toBeInTheDocument();
    expect(bannerText).toHaveTextContent(/An Official Website of the Singapore Government/i)
}); 