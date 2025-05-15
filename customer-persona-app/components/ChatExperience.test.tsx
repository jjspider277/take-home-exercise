import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatExperience from './ChatExperience';
import '@testing-library/jest-dom';

// Mock data
const mockPersona = {
  id: '123',
  name: 'John Doe',
  age: 30,
  gender: 'Male',
  location: 'New York',
  jobTitle: 'Software Engineer',
  interests: ['Technology', 'Innovation'],
  challenges: ['Finding the right solution'],
  initialChallenge: 'I need help with your product',
};

const mockCompanyName = 'Test Company';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: { response: 'This is a test response' } }),
    text: () => Promise.resolve(''),
  })
);

describe('ChatExperience', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the chat component with initial message', () => {
    render(<ChatExperience persona={mockPersona} companyName={mockCompanyName} />);
    
    // Check if persona name is displayed
    expect(screen.getByText(`Chat with ${mockPersona.name}`)).toBeInTheDocument();
    
    // Check if initial challenge is displayed
    expect(screen.getByText(mockPersona.initialChallenge)).toBeInTheDocument();
    
    // Check if input field is present
    expect(screen.getByPlaceholderText(`Reply to ${mockPersona.name}...`)).toBeInTheDocument();
  });

  it('allows sending a message and displays the response', async () => {
    render(<ChatExperience persona={mockPersona} companyName={mockCompanyName} />);
    
    // Type a message
    const input = screen.getByPlaceholderText(`Reply to ${mockPersona.name}...`);
    fireEvent.change(input, { target: { value: 'Hello there!' } });
    
    // Send the message
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);
    
    // Check if user message is displayed
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('This is a test response')).toBeInTheDocument();
    });
    
    // Check if fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.any(String),
    }));
  });

  it('displays an error message when API call fails', async () => {
    // Mock fetch to return an error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Error message'),
      })
    );
    
    render(<ChatExperience persona={mockPersona} companyName={mockCompanyName} />);
    
    // Type and send a message
    const input = screen.getByPlaceholderText(`Reply to ${mockPersona.name}...`);
    fireEvent.change(input, { target: { value: 'Hello there!' } });
    
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to get response. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows loading state while waiting for response', async () => {
    // Mock fetch to delay response
    global.fetch = jest.fn(() =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({ data: { response: 'Delayed response' } }),
          });
        }, 100);
      })
    );
    
    render(<ChatExperience persona={mockPersona} companyName={mockCompanyName} />);
    
    // Type and send a message
    const input = screen.getByPlaceholderText(`Reply to ${mockPersona.name}...`);
    fireEvent.change(input, { target: { value: 'Hello there!' } });
    
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);
    
    // Check for loading indicator
    expect(screen.getByText(`${mockPersona.name} is typing...`)).toBeInTheDocument();
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Delayed response')).toBeInTheDocument();
    });
  });
});