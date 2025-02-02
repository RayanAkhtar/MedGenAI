const BASE_URL = "https://testname.com/execute_sql";

async function fetchData(query: string) {
  const response = await fetch(`${BASE_URL}?sql=${encodeURIComponent(query)}`);
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to fetch data");
  }
}

export async function getGuessesPerMonth() {
  const query = `
    SELECT 
      strftime('%Y-%m', dateOfGuess) AS month,
      COUNT(*) AS guessCount
    FROM userGuess
    WHERE dateOfGuess >= date('now', '-12 months')
    GROUP BY month
    ORDER BY month;
  `;
  return fetchData(query);
}

export async function getImageDetectionAccuracy() {
  const query = `
    SELECT 
      strftime('%Y-%m', dateOfGuess) AS month,
      SUM(CASE WHEN userGuessType = (SELECT type FROM Images WHERE Images.imageId = userGuess.imageId) THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS accuracy
    FROM userGuess
    WHERE dateOfGuess >= date('now', '-12 months')
    GROUP BY month
    ORDER BY month;
  `;
  return fetchData(query);
}

export async function getFeedbackInstances() {
  const query = `
    SELECT 
      strftime('%Y-%m', (SELECT dateOfGuess FROM userGuess WHERE userGuess.guessId = FeedbackUser.guessId)) AS month,
      COUNT(*) AS feedbackCount
    FROM FeedbackUser
    GROUP BY month
    ORDER BY month;
  `;
  return fetchData(query);
}

export async function getTotalRealImages() {
  const query = `
    SELECT 
      COUNT(*) AS totalReal,
      SUM(CASE WHEN (SELECT userGuessType FROM userGuess WHERE userGuess.imageId = Images.imageId) = 'real' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS percentageDetected
    FROM Images
    WHERE type = 'real';
  `;
  return fetchData(query);
}

export async function getTotalAIImages() {
  const query = `
    SELECT 
      COUNT(*) AS totalAI,
      SUM(CASE WHEN (SELECT userGuessType FROM userGuess WHERE userGuess.imageId = Images.imageId) = 'ai' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS percentageDetected
    FROM Images
    WHERE type = 'ai';
  `;
  return fetchData(query);
}

export async function getFeedbackResolutionStatus() {
  const query = `
    SELECT 
      SUM(CASE WHEN resolved = 1 THEN 1 ELSE 0 END) AS resolvedCount,
      SUM(CASE WHEN resolved = 0 THEN 1 ELSE 0 END) AS unresolvedCount
    FROM Feedback;
  `;
  return fetchData(query);
}

export async function getMatchingFeedbackForImage(imageId: string) {
    const query = `
      SELECT 
        FeedbackUser.guessId, 
        FeedbackUser.msg, 
        FeedbackUser.x AS x, 
        FeedbackUser.y AS y
      FROM FeedbackUser
      JOIN userGuess ON FeedbackUser.guessId = userGuess.guessId
      JOIN Images ON userGuess.imageId = Images.imageId
      WHERE userGuess.imageId = '${imageId}'
      AND userGuess.userGuessType = Images.type;
    `;
    return fetchData(query);
  }
  
  
  export async function getRandomUnresolvedFeedback(imageId: string) {
    const query = `
      SELECT FeedbackUser.guessId, FeedbackUser.feedbackMessage
      FROM FeedbackUser
      JOIN userGuess ON FeedbackUser.guessId = userGuess.guessId
      JOIN Feedback ON FeedbackUser.guessId = Feedback.feedbackId
      WHERE userGuess.imageId = '${imageId}'
      AND Feedback.resolved = 0
      ORDER BY RANDOM()
      LIMIT 1;
    `;
    return fetchData(query);
  }
  