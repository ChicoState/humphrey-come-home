import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Login from "./Login";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

vi.mock("@/hooks/useAuth");

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useSearchParams: () => [{ get: () => null }],
}));

describe("Login", () => {
  const signInWithOtp = vi.fn();
  const verifyOtp = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      signInWithOtp,
      verifyOtp,
    });

    useNavigate.mockReturnValue(navigate);
  });

  test("shows error if email is empty", async () => {
    render(<Login />);

    fireEvent.submit(
      screen.getByRole("button", { name: /send code/i }).closest("form")
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please enter your email."
    );
  });

  test("full login flow works", async () => {
    signInWithOtp.mockResolvedValueOnce();
    verifyOtp.mockResolvedValueOnce();

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /send code/i }).closest("form")
    );

    await screen.findByLabelText(/code/i);

    fireEvent.change(screen.getByLabelText(/code/i), {
      target: { value: "123456" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /verify/i }).closest("form")
    );

    await waitFor(() => {
      expect(verifyOtp).toHaveBeenCalledWith("test@example.com", "123456");
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });
});