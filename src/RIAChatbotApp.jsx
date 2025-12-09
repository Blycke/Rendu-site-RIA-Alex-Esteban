import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function RIAChatbotApp() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis RIA Check & Go, votre assistant pour vérifier la conformité de vos projets IA. Comment puis-je vous aider ?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [complianceScore, setComplianceScore] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeCompliance = (userMessage) => {
    const keywords = {
      data: ['données', 'data', 'rgpd', 'cnil', 'personnelles'],
      transparency: ['transparent', 'explicable', 'comprendre', 'expliquer'],
      ethics: ['éthique', 'bias', 'discrimination', 'équitable'],
      security: ['sécurité', 'protection', 'cryptage', 'confidentiel']
    };

    let score = 0;
    let concerns = [];
    let validations = [];

    const lowerMsg = userMessage.toLowerCase();

    if (keywords.data.some(k => lowerMsg.includes(k))) {
      score += 25;
      validations.push('Protection des données mentionnée');
    } else {
      concerns.push('Précisez comment les données personnelles sont traitées');
    }

    if (keywords.transparency.some(k => lowerMsg.includes(k))) {
      score += 25;
      validations.push('Transparence prise en compte');
    } else {
      concerns.push('Assurez-vous que votre IA est explicable');
    }

    if (keywords.ethics.some(k => lowerMsg.includes(k))) {
      score += 25;
      validations.push('Dimension éthique considérée');
    } else {
      concerns.push('Vérifiez les biais potentiels de votre système');
    }

    if (keywords.security.some(k => lowerMsg.includes(k))) {
      score += 25;
      validations.push('Sécurité évoquée');
    } else {
      concerns.push('Pensez à la sécurisation des données');
    }

    return { score, concerns, validations };
  };

  const getRIAResponse = (userMessage) => {
    const analysis = analyzeCompliance(userMessage);
    setComplianceScore(analysis.score);

    let response = `**Analyse de conformité RIA : ${analysis.score}/100**\n\n`;

    if (analysis.validations.length > 0) {
      response += '✅ **Points validés :**\n';
      analysis.validations.forEach(v => {
        response += `• ${v}\n`;
      });
      response += '\n';
    }

    if (analysis.concerns.length > 0) {
      response += '⚠️ **Points à améliorer :**\n';
      analysis.concerns.forEach(c => {
        response += `• ${c}\n`;
      });
      response += '\n';
    }

    response += '📋 **Recommandations :**\n';
    if (analysis.score >= 75) {
      response += '• Votre projet semble bien aligné avec les principes RIA\n';
      response += '• Documentez ces aspects dans votre dossier de conformité\n';
    } else if (analysis.score >= 50) {
      response += '• Améliorez les points mentionnés ci-dessus\n';
      response += '• Consultez le RGPD et les directives de la CNIL\n';
    } else {
      response += '• Revoyez les fondamentaux de l\'IA responsable\n';
      response += '• Référez-vous aux ressources : Legifrance, CNIL, EUR-Lex\n';
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const response = getRIAResponse(input);
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 75) return <CheckCircle className="w-5 h-5" />;
    if (score >= 50) return <AlertCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">RIA Check & Go</h1>
                <p className="text-sm text-gray-600">Assistant de conformité IA responsable</p>
              </div>
            </div>
            {complianceScore !== null && (
              <div className={`flex items-center gap-2 ${getScoreColor(complianceScore)}`}>
                {getScoreIcon(complianceScore)}
                <span className="font-bold text-lg">{complianceScore}/100</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-300'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-700" />
                )}
              </div>
              <div className={`flex-1 max-w-2xl ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                }`}>
                  <div className="whitespace-pre-line">{msg.content}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1 px-2">
                  {msg.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-700" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Décrivez votre projet IA pour vérifier sa conformité..."
              className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              rows="2"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Esteban, Alex & Mehdi | Conforme RIA 2025
          </p>
        </div>
      </div>
    </div>
  );
}