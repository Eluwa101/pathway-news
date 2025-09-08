import { useState, useEffect, useRef } from 'react';
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
  Percent,
  Scissors,
  Palette,
  QrCode
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

  const [textSplitter, setTextSplitter] = useState({
    text: '',
    delimiter: '\n',
    result: []
  });

  const [colorPicker, setColorPicker] = useState({
    color: '#000000',
    rgb: 'rgb(0, 0, 0)',
    hsl: 'hsl(0, 0%, 0%)'
  });

  const [qrGenerator, setQrGenerator] = useState({
    text: '',
    qrCode: ''
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Weather functionality
  const searchWeather = async () => {
    if (!weather.location.trim()) return;
    
    setWeather(prev => ({ ...prev, loading: true }));
    
    // Mock weather data for demonstration
    setTimeout(() => {
      const mockWeather = {
        temperature: Math.floor(Math.random() * 40) + 50, // 50-90°F
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Windy'][Math.floor(Math.random() * 5)]
      };
      
      setWeather(prev => ({
        ...prev,
        temperature: mockWeather.temperature,
        condition: mockWeather.condition,
        loading: false
      }));
    }, 800);
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
          case '×':
          case 'x':
            result = previous * current;
            break;
          case '÷':
          case '/':
            result = current !== 0 ? previous / current : 0;
            break;
          default:
            return;
        }
        
        setCalculator({
          display: result.toString(),
          operation: null,
          previousValue: null,
          waitingForNewValue: true
        });
      }
    } else {
      // Operation - calculate previous operation first if there's one
      if (operation && !waitingForNewValue && previousValue !== null) {
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
          case '×':
          case 'x':
            result = previous * current;
            break;
          case '÷':
          case '/':
            result = current !== 0 ? previous / current : 0;
            break;
          default:
            result = current;
        }
        
        setCalculator({
          display: result.toString(),
          operation: value,
          previousValue: result.toString(),
          waitingForNewValue: true
        });
      } else {
        setCalculator({
          display,
          operation: value,
          previousValue: display,
          waitingForNewValue: true
        });
      }
    }
  };

  // Text splitter functionality
  const splitText = () => {
    if (!textSplitter.text.trim()) return;
    const parts = textSplitter.text.split(textSplitter.delimiter).filter(part => part.trim());
    setTextSplitter(prev => ({ ...prev, result: parts }));
  };

  // Color picker functionality
  const updateColor = (color: string) => {
    const hex = color;
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    setColorPicker({
      color: hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    });
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // QR Code generator functionality
  const generateQR = () => {
    if (!qrGenerator.text.trim()) return;
    // Simple QR code placeholder - in real app would use a QR library
    setQrGenerator(prev => ({ 
      ...prev, 
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(prev.text)}`
    }));
  };

  // Timer functionality
  const startTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    const totalSeconds = timer.minutes * 60 + timer.seconds;
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      timeLeft: totalSeconds
    }));
    
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev.timeLeft <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          return { ...prev, isRunning: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimer({
      minutes: 0,
      seconds: 0,
      isRunning: false,
      timeLeft: 0
    });
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

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
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Utility Apps</h1>
            <p className="text-muted-foreground">
              Essential tools for productivity and daily tasks
            </p>
          </div>

          <Tabs defaultValue="weather" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
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
              <TabsTrigger value="text-splitter">
                <Scissors className="h-4 w-4 mr-2" />
                Text Splitter
              </TabsTrigger>
              <TabsTrigger value="color-picker">
                <Palette className="h-4 w-4 mr-2" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="qr-generator">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
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
                      <Button variant="outline" onClick={() => handleCalculatorInput('÷')}>÷</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('×')}>×</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('-')}>-</Button>
                      
                      <Button variant="outline" onClick={() => handleCalculatorInput('7')}>7</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('8')}>8</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('9')}>9</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('+')} className="row-span-2">+</Button>
                      
                      <Button variant="outline" onClick={() => handleCalculatorInput('4')}>4</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('5')}>5</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('6')}>6</Button>
                      
                      <Button variant="outline" onClick={() => handleCalculatorInput('1')}>1</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('2')}>2</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('3')}>3</Button>
                      <Button variant="outline" onClick={() => handleCalculatorInput('=')} className="row-span-2">=</Button>
                      
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

            <TabsContent value="text-splitter">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scissors className="h-5 w-5" />
                    <span>Text Splitter</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    className="w-full h-32 p-3 border rounded-md resize-none"
                    placeholder="Enter text to split..."
                    value={textSplitter.text}
                    onChange={(e) => setTextSplitter(prev => ({ ...prev, text: e.target.value }))}
                  />
                  
                  <div className="flex space-x-2 items-center">
                    <span className="text-sm">Split by:</span>
                    <Input
                      placeholder="Delimiter"
                      value={textSplitter.delimiter}
                      onChange={(e) => setTextSplitter(prev => ({ ...prev, delimiter: e.target.value }))}
                      className="w-24"
                    />
                    <Button onClick={splitText}>Split</Button>
                  </div>
                  
                  {textSplitter.result.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Results ({textSplitter.result.length} parts):</h4>
                      <div className="grid gap-2 max-h-64 overflow-y-auto">
                        {textSplitter.result.map((part, index) => (
                          <div key={index} className="p-2 bg-muted rounded text-sm">
                            <span className="text-xs text-muted-foreground">Part {index + 1}:</span> {part}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="color-picker">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Color Picker</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="color"
                      value={colorPicker.color}
                      onChange={(e) => updateColor(e.target.value)}
                      className="w-20 h-20 rounded-lg border"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-12 text-sm">HEX:</span>
                        <Input value={colorPicker.color} readOnly className="font-mono" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-12 text-sm">RGB:</span>
                        <Input value={colorPicker.rgb} readOnly className="font-mono" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-12 text-sm">HSL:</span>
                        <Input value={colorPicker.hsl} readOnly className="font-mono" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-2">
                    {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'].map(color => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: color }}
                        onClick={() => updateColor(color)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qr-generator">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>QR Code Generator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter text or URL to generate QR code..."
                      value={qrGenerator.text}
                      onChange={(e) => setQrGenerator(prev => ({ ...prev, text: e.target.value }))}
                    />
                    <Button onClick={generateQR} disabled={!qrGenerator.text.trim()}>
                      Generate QR Code
                    </Button>
                  </div>
                  
                  {qrGenerator.qrCode && (
                    <div className="text-center space-y-4">
                      <img 
                        src={qrGenerator.qrCode} 
                        alt="Generated QR Code" 
                        className="mx-auto border rounded"
                      />
                      <p className="text-sm text-muted-foreground">
                        QR Code for: {qrGenerator.text}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}