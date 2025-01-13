import { render, screen } from "@testing-library/react";
import Layout from "./Layout";

test("should display header", () => {
    render(
        <Layout>
            <div/>
        </Layout>
    );
    
    const header = screen.getByRole('navigation');

    expect(header).toBeInTheDocument();
}); 


