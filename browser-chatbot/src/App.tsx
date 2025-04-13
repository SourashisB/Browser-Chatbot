// Animations
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import GlobalStyle from './globalStyles';


// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const typing = keyframes`
  0% { width: 0 }
  100% { width: 100% }
`;

// Styled Components
const ChatContainer = styled.div`
  width: 90%;
  max-width: 800px;
  height: 80vh;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease;
  
  @media (max-width: 768px) {
    width: 95%;
    height: 90vh;
  }
`;

const ChatHeader = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const BotAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const BotAvatarImage = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(45deg, #a777e3, #6e8efb);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    top: 12px;
    left: 12px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const BotName = styled.h1`
  font-size: 18px;
  font-weight: 600;
`;

const BotStatus = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

interface MessageProps {
  isUser: boolean;
}

const MessageBubble = styled.div<MessageProps>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  animation: ${fadeIn} 0.3s ease;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isUser ? '#6e8efb' : '#f0f2f5'};
  color: ${props => props.isUser ? 'white' : '#1a1a1a'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  border-radius: 18px;
  background-color: #f0f2f5;
  align-self: flex-start;
  max-width: 70px;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #a777e3;
  border-radius: 50%;
  animation: ${pulse} 1s infinite;
`;

const InputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 10px;
  background-color: white;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  outline: none;
  font-size: 16px;
  transition: border 0.2s ease;
  
  &:focus {
    border: 1px solid #6e8efb;
    box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.2);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
  animation: ${fadeIn} 1s ease;
`;

const SuggestionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
`;

const SuggestionButton = styled.button`
  background-color: white;
  border: 1px solid #6e8efb;
  border-radius: 18px;
  padding: 8px 16px;
  font-size: 14px;
  color: #6e8efb;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #6e8efb;
    color: white;
    animation: ${pulse} 0.5s ease;
  }
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 10px;
  background-color: ${props => props.isConnected ? '#4CAF50' : '#f44336'};
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ConnectionDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
`;

// Types
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// API config
const API_URL = 'http://localhost:5000/api';

// Main Component
const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check backend connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        setIsBackendConnected(data.status === 'healthy');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setIsBackendConnected(false);
      }
    };
    
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Initially show typing indicator and then welcome message
  useEffect(() => {
    setIsTyping(true);
    
    const timer = setTimeout(() => {
      setIsTyping(false);
      addBotMessage("👋 Hi there! I'm ChatBot. How can I help you today?");
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    try {
      if (isBackendConnected) {
        // Send message to backend
        const response = await fetch(`${API_URL}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage.text }),
        });
        
        if (!response.ok) {
          throw new Error('Backend response error');
        }
        
        const data = await response.json();
        
        // Short delay to simulate thinking
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage(data.response);
        }, 500 + Math.random() * 1000);
      } else {
        // Fallback if backend is not connected
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("Sorry, I'm having trouble connecting to my brain right now. Please check your backend connection and try again.");
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message to backend:', error);
      
      // Error handling
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Sorry, I encountered an error processing your message. Please try again later.");
      }, 1000);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    // Optional: auto-send the suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };
  
  return (
    <>
      <GlobalStyle />
      <ConnectionStatus isConnected={isBackendConnected}>
        <ConnectionDot />
        {isBackendConnected ? 'Connected' : 'Disconnected'}
      </ConnectionStatus>
      <ChatContainer>
        <ChatHeader>
          <BotAvatar>
            <BotAvatarImage />
          </BotAvatar>
          <HeaderInfo>
            <BotName>AI Assistant</BotName>
            <BotStatus>{isTyping ? 'Typing...' : 'Online'}</BotStatus>
          </HeaderInfo>
        </ChatHeader>
        
        <MessagesContainer>
          {messages.length === 0 && !isTyping && (
            <WelcomeMessage>
              Start a conversation with the chatbot! Try asking a question.
              <SuggestionContainer>
                <SuggestionButton onClick={() => handleSuggestionClick("Hello, how are you?")}>
                  👋 Say Hello
                </SuggestionButton>
                <SuggestionButton onClick={() => handleSuggestionClick("What can you help me with?")}>
                  ❓ What can you do?
                </SuggestionButton>
                <SuggestionButton onClick={() => handleSuggestionClick("Tell me a joke")}>
                  😄 Tell me a joke
                </SuggestionButton>
              </SuggestionContainer>
            </WelcomeMessage>
          )}
          
          {messages.map((message) => (
            <MessageBubble key={message.id} isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          ))}
          
          {isTyping && (
            <TypingIndicator>
              <TypingDot theme={{ delay: '0s' }} />
              <TypingDot theme={{ delay: '0.2s' }} />
              <TypingDot theme={{ delay: '0.4s' }} />
            </TypingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <InputContainer>
          <MessageInput
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={inputText.trim() === ''}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </>
  );
};

export default ChatBot;