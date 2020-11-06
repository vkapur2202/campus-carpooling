import * as React from "react";
import * as ReactDOM from "react-dom";
import Footer from './Footer';

it("renders the correct content", () => {
    const root = document.createElement("div");
    ReactDOM.render(<Footer></Footer>, root);
    expect(root.querySelector("footer").textContent).toBe("CSDS 393sarah dogvin, akhila vuppalapati, sanhita kumari, vivek kapur");
    expect(root.querySelector("small").textContent).toBe("sarah dogvin, akhila vuppalapati, sanhita kumari, vivek kapur");
});