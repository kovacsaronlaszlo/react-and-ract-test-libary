/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-node-access */
import { act, fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import LoginComponent from "./LoginComponent";
import userEvent from "@testing-library/user-event";

describe("Login component tests", () => {
  const loginServiceMock = {
    login: jest.fn(),
  };
  const setTokenMock = jest.fn();

  let container: HTMLElement;

  function setup() {
    container = render(
      <LoginComponent loginService={loginServiceMock} setToken={setTokenMock} />
    ).container;
  }

  beforeEach(() => {
    setup();
  });

  it("should render correctly - the login component", () => {
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(screen.queryByTestId("resultLabel")).not.toBeInTheDocument();
  });

  it("should render correctly - query by test id", () => {
    const inputs = screen.getAllByTestId("input");
    expect(inputs).toHaveLength(3);
    expect(inputs[0].getAttribute("value")).toBe("");
    expect(inputs[1].getAttribute("value")).toBe("");
    expect(inputs[2].getAttribute("value")).toBe("Login");
  });

  it("should render correctly - query by document query", () => {
    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
    expect(inputs[0].value).toBe("");
    expect(inputs[1].value).toBe("");
    expect(inputs[2].value).toBe("Login");
  });

  it("Click login button with incomplate credentails - show requered message", () => {
    const inputs = screen.getAllByTestId("input");
    const loginButton = inputs[2];

    fireEvent.click(loginButton);

    const resultLabe = screen.getByTestId("resultLabel");
    expect(resultLabe.textContent).toBe("UserName and password required!");
  });

  it("Click login button with incomplate credentails - show requered message - with user click", () => {
    const inputs = screen.getAllByTestId("input");
    const loginButton = inputs[2];

    act(() => {
      user.click(loginButton);
    });

    const resultLabe = screen.getByTestId("resultLabel");
    expect(resultLabe.textContent).toBe("UserName and password required!");
  });

  it("should right credetials - succesful login", async () => {
    loginServiceMock.login.mockResolvedValueOnce("1234");
    const inputs = container.querySelectorAll("input");
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: "someUser" } });
    fireEvent.change(passwordInput, { target: { value: "somePassword" } });
    fireEvent.click(loginButton);

    expect(loginServiceMock.login).toBeCalledWith("someUser", "somePassword");

    const resultLabel = await screen.findByTestId("resultLabel");
    expect(resultLabel.textContent).toBe("successful login");
  });

  it("should right credetials - succesful login - with user calls", async () => {
    loginServiceMock.login.mockResolvedValueOnce("1234");
    const inputs = container.querySelectorAll("input");
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    act(() => {
      user.click(userNameInput);
      user.keyboard("someUser");

      user.click(passwordInput);
      user.keyboard("somePassword");

      user.click(loginButton);
    });

    expect(loginServiceMock.login).toBeCalledWith("someUser", "somePassword");

    const resultLabel = await screen.findByTestId("resultLabel");
    expect(resultLabel.textContent).toBe("successful login");
  });

  it("should right credetials - unsuccesful login", async () => {
    loginServiceMock.login.mockResolvedValueOnce(undefined);
    const inputs = container.querySelectorAll("input");
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: "someUser" } });
    fireEvent.change(passwordInput, { target: { value: "somePassword" } });
    fireEvent.click(loginButton);

    expect(loginServiceMock.login).toBeCalledWith("someUser", "somePassword");

    const resultLabel = await screen.findByTestId("resultLabel");
    expect(resultLabel.textContent).toBe("invalid credentials");
  });

  it("should right credetials - unsuccesful login - solve act warning", async () => {
    const result = Promise.resolve(undefined);
    loginServiceMock.login.mockReturnValueOnce(result);
    const inputs = container.querySelectorAll("input");
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: "someUser" } });
    fireEvent.change(passwordInput, { target: { value: "somePassword" } });
    fireEvent.click(loginButton);

    await result;
    expect(loginServiceMock.login).toBeCalledWith("someUser", "somePassword");

    const resultLabel = await screen.findByTestId("resultLabel");
    expect(resultLabel.textContent).toBe("invalid credentials");
  });
});
