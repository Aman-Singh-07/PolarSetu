DELETE FROM ai_generations WHERE id IN (SELECT id FROM ai_generations WHERE prompt_format='LESSON_PLAN' AND content LIKE '%हिंदी%');
