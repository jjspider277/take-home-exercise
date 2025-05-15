import { generatePersona, getChatResponse } from './api';

// Mock fetch
global.fetch = jest.fn();

describe('API Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePersona', () => {
    it('should call the API and return persona data', async () => {
      // Arrange
      const mockPersona = {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        location: 'New York',
        jobTitle: 'Software Engineer',
        interests: ['Technology'],
        challenges: ['Finding solutions'],
        initialChallenge: 'I need help',
      };
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ persona: mockPersona }),
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const companyData = {
        name: 'Test Company',
        characteristics: ['Innovative'],
      };

      // Act
      const result = await generatePersona(companyData);

      // Assert
      expect(fetch).toHaveBeenCalledWith('/api/generate-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockPersona);
    });

    it('should throw an error when API call fails', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const companyData = {
        name: 'Test Company',
        characteristics: ['Innovative'],
      };

      // Act & Assert
      await expect(generatePersona(companyData)).rejects.toThrow('API error: 500');
    });
  });

  describe('getChatResponse', () => {
    it('should call the API and return chat response', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: { response: 'Hello there!' } }),
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const message = { role: 'user' as const, content: 'Hi' };
      const persona = { name: 'John', id: '123' };
      const companyName = 'Test Company';
      const messageHistory = [];

      // Act
      const result = await getChatResponse(message, persona, companyName, messageHistory);

      // Assert
      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          persona,
          companyName,
          messageHistory,
        }),
      });
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual('Hello there!');
    });

    it('should throw an error when API call fails', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const message = { role: 'user' as const, content: 'Hi' };
      const persona = { name: 'John', id: '123' };
      const companyName = 'Test Company';
      const messageHistory = [];

      // Act & Assert
      await expect(getChatResponse(message, persona, companyName, messageHistory)).rejects.toThrow('API error: 500');
    });
  });
});