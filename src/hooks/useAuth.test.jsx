import { render, screen } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "./useAuth";

function TestComponent() {
  const auth = useAuth();

  return <div>{auth.user}</div>;
}

describe("useAuth", () => {
  test("returns auth context", () => { //true option
    render(
      <AuthContext.Provider value={{ user: "User" }}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(screen.getByText("User")).toBeInTheDocument();
  });

  test("throws error outside provider", () => { //false option
    expect(() => render(<TestComponent />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );
  });
});