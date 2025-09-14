import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { EngineerChatbot } from "./EngineerChatbot";
import { vi } from "vitest";
import { authService } from "../services/authService";

// Mock authService
vi.mock("../services/authService", () => ({
  authService: {
    getAuthHeaders: vi.fn(() => ({ Authorization: "Bearer test-token" })),
  },
}));

const mockCurrentUser = {
  id: "123",
  name: "Test Engineer",
  role: "engineer",
  email: "test@engineer.com",
};

const mockOnBack = vi.fn();

describe("EngineerChatbot", () => {
  beforeEach(() => {
    mockOnBack.mockClear();
    vi.clearAllMocks();
    sessionStorage.clear(); // Clear session storage before each test

    // Mock fetch for API calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response: "Bot response" }),
      } as Response)
    );
  });

  it("renders without crashing and displays initial bot message", async () => {
    render(
      <EngineerChatbot currentUser={mockCurrentUser} onBack={mockOnBack} />
    );
    await waitFor(() => {
      expect(screen.getByText(/Hello Test Engineer!/i)).toBeInTheDocument();
    });
    expect(
      screen.getByPlaceholderText(
        /Describe your quality engineering challenge/i
      )
    ).toBeInTheDocument();
  });

  it("sends a message and displays bot response", async () => {
    render(
      <EngineerChatbot currentUser={mockCurrentUser} onBack={mockOnBack} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Hello Test Engineer!/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(
      /Describe your quality engineering challenge/i
    );
    fireEvent.change(input, { target: { value: "My challenge" } });
    fireEvent.click(screen.getByTitle("Send Message"));

    await waitFor(() => {
      expect(screen.getByText("My challenge")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Bot response")).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/chat",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          prompt: "My challenge",
          user_role: "engineer",
          language: "en",
          history: expect.any(Array),
        }),
      })
    );
  });

  it("saves and loads chat history from session storage", async () => {
    render(
      <EngineerChatbot currentUser={mockCurrentUser} onBack={mockOnBack} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Hello Test Engineer!/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(
      /Describe your quality engineering challenge/i
    );
    fireEvent.change(input, { target: { value: "First message" } });
    fireEvent.click(screen.getByTitle("Send Message"));

    await waitFor(() => {
      expect(screen.getByText("First message")).toBeInTheDocument();
      expect(screen.getByText("Bot response")).toBeInTheDocument();
    });

    // Unmount and remount component to simulate page reload
    // This will trigger loading from session storage
    render(
      <EngineerChatbot currentUser={mockCurrentUser} onBack={mockOnBack} />,
      { container: document.body }
    ); // Re-render into body to clear previous render

    await waitFor(() => {
      expect(screen.getByText("First message")).toBeInTheDocument();
      expect(screen.getByText("Bot response")).toBeInTheDocument();
    });

    // Check if session storage was populated correctly
    const savedHistory = JSON.parse(
      sessionStorage.getItem("engineer_chatbot_history") || "[]"
    );
    expect(savedHistory.length).toBe(3); // Initial bot message + user message + bot response
    expect(savedHistory[0].content).toMatch(/Hello Test Engineer!/i);
    expect(savedHistory[1].content).toBe("First message");
    expect(savedHistory[2].content).toBe("Bot response");
  });

  it("handles action clicks correctly", async () => {
    render(
      <EngineerChatbot currentUser={mockCurrentUser} onBack={mockOnBack} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Hello Test Engineer!/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Generate Root Cause Report"));

    await waitFor(() => {
      expect(
        screen.getByText("Generate: Generate Root Cause Report")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Bot response")).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/chat",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          prompt: expect.stringContaining(
            "Generate a detailed Generate Root Cause Report"
          ),
          user_role: "engineer",
          language: "en",
          history: expect.any(Array),
        }),
      })
    );
  });
});
