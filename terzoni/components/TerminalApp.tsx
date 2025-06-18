import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TerminalCommand, AppId, ContentComponentProps } from '../types';

const TerminalApp: React.FC<ContentComponentProps> = ({ openWindow }) => {
  const [history, setHistory] = useState<string[]>(['Justin Terzoni OS [Version 1.0.0]', '(c) Justin Terzoni. All rights reserved.', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const availableCommands: Record<string, TerminalCommand> = {
    help: {
      command: 'help',
      description: 'Shows a list of available commands.',
      action: () => {
        const commandList = Object.values(availableCommands)
          .map(cmd => `${cmd.command} - ${cmd.description}`)
          .join('\n');
        return `Available commands:\n${commandList}`;
      },
    },
    clear: {
      command: 'clear',
      description: 'Clears the terminal screen.',
      action: () => {
        setHistory([]);
        return ''; 
      },
    },
    date: {
      command: 'date',
      description: 'Displays the current date and time.',
      action: () => new Date().toString(),
    },
    echo: {
        command: 'echo',
        description: 'Displays a message.',
        action: (args) => args.join(' '),
    },
    open: {
        command: 'open',
        description: 'Opens an application. Usage: open <app_name>',
        action: (args) => {
            if (args.length === 0) return 'Usage: open <app_name> (e.g., open about)';
            const appToOpen = args[0].toLowerCase() as AppId;
            if (['home', 'about', 'skills', 'experience', 'contact', 'terminal'].includes(appToOpen)) {
                 if (openWindow) {
                    openWindow(appToOpen);
                    return `Attempting to open ${appToOpen}...`;
                 } else {
                    return `Error: openWindow function not available to terminal.`;
                 }
            }
            return `Error: App "${appToOpen}" not found. Try: home, about, skills, experience, contact, terminal.`;
        }
    },
    motd: {
      command: 'motd',
      description: 'Displays the message of the day.',
      action: () => 'Welcome, Justin! Ready to build something amazing today?',
    },
    whoami: {
      command: 'whoami',
      description: 'Displays current user (you!).',
      action: () => 'justin_terzoni_dev',
    }
  };


  const processCommand = useCallback((cmdText: string) => {
    const newHistoryLine = `> ${cmdText}`;
    let output: string | void | Promise<string | void> = '';

    const [commandName, ...args] = cmdText.trim().split(/\s+/);

    if (commandName && availableCommands[commandName.toLowerCase()]) {
      output = availableCommands[commandName.toLowerCase()].action(args, openWindow);
    } else if (commandName) {
      output = `Command not found: ${commandName}. Type "help".`;
    }
    
    Promise.resolve(output).then(resolvedOutput => {
        if (typeof resolvedOutput === 'string' && resolvedOutput.length > 0) {
            setHistory(prev => [...prev, newHistoryLine, ...resolvedOutput.split('\n')]);
        } else if (typeof resolvedOutput === 'string') { 
            setHistory(prev => [...prev, newHistoryLine]);
        } else { 
             setHistory(prev => [...prev, newHistoryLine]);
        }
    });

  }, [availableCommands, openWindow]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input.trim());
    } else {
      setHistory(prev => [...prev, `> `]); 
    }
    setInput('');
  };

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-full flex flex-col p-1" onClick={() => inputRef.current?.focus()}>
      <div className="flex-grow overflow-y-auto text-xs leading-normal whitespace-pre-wrap break-words">
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div ref={endOfHistoryRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center pt-1">
        <span className="text-green-400 mr-1">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none text-green-400 focus:outline-none flex-grow text-xs"
          spellCheck="false"
          autoFocus
        />
      </form>
    </div>
  );
};

export default TerminalApp;