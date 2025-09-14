import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MSMEDashboard } from "./MSMEDashboard";
import { vi } from "vitest";
import { authService } from "../services/authService";

// Mock authService
vi.mock("../services/authService", () => ({
  authService: {
    getAuthHeaders: vi.fn(() => ({ Authorization: "Bearer test-token" })),
  },
}));

// Mock WebSocket
const mockWebSocket = vi.fn(() => ({
  onopen: null,
  onmessage: null,
  onclose: null,
  onerror: null,
  send: vi.fn(),
  close: vi.fn(),
}));

vi.stubGlobal("WebSocket", mockWebSocket);

const mockCurrentUser = {
  id: "123",
  name: "Test MSME",
  role: "msme",
  email: "test@msme.com",
};

const mockOnLogout = vi.fn();
const mockOnAccessChatbot = vi.fn();
const mockOnLanguageChange = vi.fn();

describe("MSMEDashboard", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockOnLogout.mockClear();
    mockOnAccessChatbot.mockClear();
    mockOnLanguageChange.mockClear();
    mockWebSocket.mockClear();
    // Mock fetch for API calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {}, message: "" }),
        blob: () => Promise.resolve(new Blob()),
      } as Response)
    );
  });

  it("renders without crashing", () => {
    render(
      <MSMEDashboard
        currentUser={mockCurrentUser}
        onLogout={mockOnLogout}
        onAccessChatbot={mockOnAccessChatbot}
        currentLanguage="en"
        onLanguageChange={mockOnLanguageChange}
      />
    );
    expect(screen.getByText("MSME Business Dashboard")).toBeInTheDocument();
  });

  it("displays business summary correctly", () => {
    render(
      <MSMEDashboard
        currentUser={mockCurrentUser}
        onLogout={mockOnLogout}
        onAccessChatbot={mockOnAccessChatbot}
        currentLanguage="en"
        onLanguageChange={mockOnLanguageChange}
      />
    );
    expect(screen.getByText("Defect Cost")).toBeInTheDocument();
    expect(screen.getByText("Complaints")).toBeInTheDocument();
    expect(screen.getByText("Top Bad Supplier")).toBeInTheDocument();
  });

  it("changes active tab on click", async () => {
    render(
      <MSMEDashboard
        currentUser={mockCurrentUser}
        onLogout={mockOnLogout}
        onAccessChatbot={mockOnAccessChatbot}
        currentLanguage="en"
        onLanguageChange={mockOnLanguageChange}
      />
    );
    fireEvent.click(screen.getByText("Quality Tools"));
    await waitFor(() => {
      expect(screen.getByText("Business Tools")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Dashboard"));
    await waitFor(() => {
      expect(screen.getByText("Business Summary")).toBeInTheDocument();
    });
  });

  it("initiates WebSocket connection on mount", () => {
    render(
      <MSMEDashboard
        currentUser={mockCurrentUser}
        onLogout={mockOnLogout}
        onAccessChatbot={mockOnAccessChatbot}
        currentLanguage="en"
        onLanguageChange={mockOnLanguageChange}
      />
    );
    expect(mockWebSocket).toHaveBeenCalledWith("ws://localhost:8000/ws");
  });

  it("handles incoming WebSocket messages", async () => {
    render(
      <MSMEDashboard
        currentUser={mockCurrentUser}
        onLogout={mockOnLogout}
        onAccessChatbot={mockOnAccessChatbot}
        currentLanguage="en"
        onLanguageChange={mockOnLanguageChange}
      />
    );

    const wsInstance = mockWebSocket.mock.results[0].value; // Get the WebSocket instance
    const message = '{"type": "test_update", "data": {"metric": 123}}';
    act(() => {
      wsInstance.onmessage({ data: message });
    });
    await waitFor(() => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });
});
