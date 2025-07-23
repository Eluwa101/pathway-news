import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Calculator, 
  FileText, 
  Timer, 
  Download, 
  Play, 
  Pause, 
  RotateCcw,
  Plus,
  Minus,
  Equal,
  Divide,
  X,
  Percent
} from 'lucide-react';

export default function UtilityAppsPage() {
  const [weather, setWeather] = useState({
    location: '',
    temperature: null,
    condition: '',
    loading: false
  });
  
  const [calculator, setCalculator] = useState({
    display: '0',
    operation: null,
    previousValue: null,
    waitingForNewValue: false
  });
  
  const [notes, setNotes] = useState('');
  
  const [timer, setTimer] = useState({
    minutes: 0,
    seconds: 0,
    isRunning: false,
    timeLeft: 0
  });

  // Weather functionality
  const searchWeather = async () => {
    if (!weather.location.trim()) return;
    
    setWeather(prev => ({ ...prev, loading: true }));
    
    // Simulate API call - in real implementation, you'd use a weather API
    setTimeout(() => {
      const mockWeather = {
        temperature: Math.floor(Math.random() * 40) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)]
      };
      
      setWeather(prev => ({
        ...prev,
        temperature: mockWeather.temperature,
        condition: mockWeather.condition,
        loading: false
      }));
    }, 1000);
  };

  // Calculator functionality
  const handleCalculatorInput = (value: string) => {
    const { display, operation, previousValue, waitingForNewValue } = calculator;
    
    if (value >= '0' && value <= '9') {
      if (waitingForNewValue) {
        setCalculator({
          display: value,
          operation,
          previousValue,
          waitingForNewValue: false
        });
      } else {
        setCalculator({
          display: display === '0' ? value : display + value,
          operation,
          previousValue,
          waitingForNewValue: false
        });
      }
    } else if (value === '.') {
      if (display.indexOf('.') === -1) {
        setCalculator({
          display: display + '.',
          operation,
          previousValue,
          waitingForNewValue: false
        });
      }
    } else if (value === 'C') {
      setCalculator({
        display: '0',
        operation: null,
        previousValue: null,
        waitingForNewValue: false
      });
    } else if (value === '=') {
      if (operation && previousValue !== null) {
        const current = parseFloat(display);
        const previous = parseFloat(previousValue);
        let result = 0;
        
        switch (operation) {
          case '+':
            result = previous + current;
            break;
          case '-':
            result = previous - current;
            break;
          case 'x':
            result = previous * current;
            break;
          case '/':
            result = previous / current;
            break;
        }
        
        setCalculator({
          display: result.toString(),
          operation: null,
          previousValue: null,
          waitingForNewValue: true
        });
      }
    } else {
      // Operation
      if (operation && !waitingForNewValue) {
        handleCalculatorInput('=');
      }
      
      setCalculator({
        display,
        operation: value,
        previousValue: display,
        waitingForNewValue: true
      });
    }
  };

  // Timer functionality
  const startTimer = () => {
    const totalSeconds = timer.minutes * 60 + timer.seconds;
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      timeLeft: totalSeconds
    }));
    
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          return { ...prev, isRunning: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setTimer({
      minutes: 0,
      seconds: 0,
      isRunning: false,
      timeLeft: 0
    });
  };

  // Notes export functionality
  const exportNotes = (format: string) => {
    const content = notes;
    const filename = `notes_${new Date().toISOString().split('T')[0]}`;
    
    let blob: Blob;
    let mimeType: string;
    let extension: string;
    
    switch (format) {
      case 'txt':
        blob = new Blob([content], { type: 'text/plain' });
        mimeType = 'text/plain';
        extension = '.txt';
        break;
      case 'csv':
        // Convert to simple CSV format
        const csvContent = content.split('\n').map(line => `"${line}"`).join('\n');
        blob = new Blob([csvContent], { type: 'text/csv' });
        mimeType = 'text/csv';
        extension = '.csv';
        break;
      default:
        blob = new Blob([content], { type: 'text/plain' });
        mimeType = 'text/plain';
        extension = '.txt';
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + extension;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Utility Apps</h1>
            <p className="text-muted-foreground">
              Essential tools for productivity and daily tasks
            </p>
          </div>

          <Tabs defaultValue="weather" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weather">
                <Cloud className="h-4 w-4 mr-2" />
                Weather
              </TabsTrigger>
              <TabsTrigger value="calculator">
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="timer">
                <Timer className="h-4 w-4 mr-2" />
                Timer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weather">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5" />
                    <span>Weather App</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter city name..."
                      value={weather.location}
                      onChange={(e) => setWeather(prev => ({ ...prev, location: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
                    />
                    <Button onClick={searchWeather} disabled={weather.loading}>
                      {weather.loading ? 'Loading...' : 'Search'}
                    </Button>
                  </div>
                  
                  {weather.temperature && (
                    <div className="text-center space-y-2 p-6 bg-muted rounded-lg">
                      <h3 className="text-2xl font-bold">{weather.location}</h3>
                      <div className="text-4xl font-bold text-primary">{weather.temperature}°F</div>
                      <Badge>{weather.condition}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculator">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>Calculator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-sm mx-auto space-y-4">
                    <div className="bg-muted p-4 rounded-lg text-right text-2xl font-mono">
                      {calculator.display}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <Button variant="outline" onClick={() => handleCalculatorInput('C')}>C</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('/')}><Divide className="h-4 w-4" /></Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('x')}><X className="h-4 w-4" /></Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('-')}><Minus className="h-4 w-4" /></Button>
                      
                      <Button variant="outline" onClick={() => handleCalculatorInput('7')}>7</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('8')}>8</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('9')}>9</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('+')} className="row-span-2"><Plus className="h-4 w-4" /></Button>
                      
                      <Button variant="outline" onClick={() => handleCalculatorInput('4')}>4</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('5')}>5</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('6')}>6</Button>
                      
                      <Button variant="outline" onClick={() => handleCalculatorInput('1')}>1</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('2')}>2</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('3')}>3</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('=')} className="row-span-2"><Equal className="h-4 w-4" /></Button>
                      
                      <Button variant="outline" onClick={() => handleCalculatorInput('0')} className="col-span-2">0</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('.')}>.</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Notes Pad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    className="w-full h-64 p-3 border rounded-md resize-none"
                    placeholder="Start typing your notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => exportNotes('txt')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as TXT
                    </Button>
                    <Button variant="outline" onClick={() => exportNotes('csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Character count: {notes.length}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timer">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Timer className="h-5 w-5" />
                    <span>Timer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-w-sm mx-auto text-center space-y-4">
                    {timer.isRunning ? (
                      <div className="text-6xl font-mono font-bold text-primary">
                        {formatTime(timer.timeLeft)}
                      </div>
                    ) : (
                      <div className="flex space-x-2 justify-center">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={timer.minutes || ''}
                          onChange={(e) => setTimer(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                          className="w-20 text-center"
                          min="0"
                          max="59"
                        />
                        <span className="text-2xl">:</span>
                        <Input
                          type="number"
                          placeholder="Sec"
                          value={timer.seconds || ''}
                          onChange={(e) => setTimer(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                          className="w-20 text-center"
                          min="0"
                          max="59"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-2 justify-center">
                      {!timer.isRunning ? (
                        <Button onClick={startTimer} disabled={timer.minutes === 0 && timer.seconds === 0}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      ) : (
                        <Button onClick={pauseTimer}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button variant="outline" onClick={resetTimer}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}