import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TextViewer from "./text-viewer";

test("renders text viewer", () => {
  render(<TextViewer />);
  const textAreaElement = screen.getByPlaceholderText(/Enter text here/i);
  expect(textAreaElement).toBeInTheDocument();
});

test("updates text viewer on input", () => {
  render(<TextViewer />);
  const textAreaElement = screen.getByPlaceholderText(/Enter text here/i);
  fireEvent.change(textAreaElement, { target: { value: "Hello, world!" } });
  const textViewerElement = document.querySelector(".text-viewer");
  expect(textViewerElement).toBeInTheDocument();
});

test("loads text from file input", async () => {
  render(<TextViewer />);
  const fileInputElement = screen.getByTestId("file-input");
  const file = new File(["Hello from file!"], "example.txt", {
    type: "text/plain",
  });

  fireEvent.change(fileInputElement, { target: { files: [file] } });

  const textViewerElement = await screen.findAllByText("Hello from file!");
  // 特定のdiv要素に特定のテキストがあることを確認
  const divElement = document.querySelector(".text-viewer");
  expect(divElement).toHaveTextContent("Hello from file!");
  screen.debug();
});
