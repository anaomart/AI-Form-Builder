'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import useAiQuestions from '@/components/hooks/useAIQustions';

const ResetOnRouteChange = () => {
    const {setQuestionsResponse , setSuggestionsQuestion} = useAiQuestions()
    const pathname = usePathname();

  useEffect(() => {
    console.log(pathname)
    if (pathname === '/') {
        
        setQuestionsResponse([]);
        setSuggestionsQuestion([]);
    }
  }, [pathname, setQuestionsResponse , setSuggestionsQuestion]);

  return null; // This component doesn't render anything
};

export default ResetOnRouteChange;
