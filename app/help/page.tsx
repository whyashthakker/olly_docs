// ErrorHelpPage.jsx
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Ban, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ErrorHelpPage() {
  const errors = [
    {
      code: '404',
      title: 'Model Not Found',
      description: 'This error occurs because the model you are using is no longer available.',
      detail: 'HTTP error! status: 404, message: {"error": {"message": "The model gpt-4 does not exist or you do not have access to it."}}',
      solution: 'Change to the latest model version.',
      icon: <Ban className="h-12 w-12 text-yellow-500 dark:text-yellow-400" />,
      color: 'bg-yellow-50 dark:bg-yellow-950/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      code: '429',
      title: 'Rate Limit Exceeded',
      description: 'This error indicates that you are out of LLM credits.',
      detail: 'HTTP error! status: 429, message: {"error": {"message": "You exceeded your current quota, please check your plan and billing details."}}',
      solution: 'To resolve this error you have to add the credits to your API accountAlso watch this video guide and this guide will hels you to understand the error and how to resolve it',
      videoLink: 'https://youtu.be/878N5HT68g0?si=nAI0OZ2Nb92ZQnEe',
      icon: <AlertTriangle className="h-12 w-12 text-orange-500 dark:text-orange-400" />,
      action: 'Watch Video Guide',
      color: 'bg-orange-50 dark:bg-orange-950/30',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      code: '401',
      title: 'Incorrect API Key',
      description: 'This error indicates that you are using the wrong LLM vendor (The LLM vendor is different from API you are using).',
      detail: 'HTTP error! status: 401, message: {"error": {"message": "Incorrect API key provided: olly-ef6**c694. You can find your API key at https://platform.openai.com/account/api-keys./", "type": "invalid_request_error", "param": null, "code": "invalid_api_key"}}',
      solution: 'Go to Olly Extension and ensure that you are using the right API key and that the selected LLM model corresponds to your API (Using OpenAI API key? Then use GPT models).',
      icon: <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />,
      action: 'Check API Settings',
      color: 'bg-red-50 dark:bg-red-950/30',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">Troubleshooting Guide</h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-400">Common errors and their solutions</p>
        
        <div className="grid grid-cols-1 gap-8">
          {errors.map((error) => (
            <Card 
              key={error.code} 
              className={`overflow-hidden border-2 ${error.borderColor} hover:shadow-lg transition-shadow dark:shadow-none dark:hover:shadow-none`}
            >
              <CardHeader className={`${error.color}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold dark:text-white">{error.title}</CardTitle>
                  <span className="text-4xl font-extrabold opacity-80 dark:text-white dark:opacity-90">Error {error.code}</span>
                </div>
                <CardDescription className="text-base mt-2 dark:text-gray-300">
                  {error.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="flex items-start gap-4 mb-6">
                  {error.icon}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg dark:text-white mb-2">Error Details</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                      <code className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                        {error.detail}
                      </code>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold text-lg dark:text-white mb-2">Solution</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {error.solution}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2 pt-2">
                {error.videoLink && (
                  <Link href={error.videoLink} target="_blank" rel="noopener noreferrer">
                    <Button className="flex items-center gap-2">
                      {error.action || 'Watch Guide'}
                      <ExternalLink size={16} />
                    </Button>
                  </Link>
                )}
                {!error.videoLink && (
                  <Button>
                    {error.action || 'Learn More'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}