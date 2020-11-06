import * as React from "react";
import * as ReactDOM from "react-dom";
import About from './About';

it("renders the correct content", () => {
    const root = document.createElement("div");
    ReactDOM.render(<About></About>, root);
    expect(root.querySelector("h1").textContent).toBe("About");
    expect(root.querySelector("p").textContent).toBe("We are !");
});