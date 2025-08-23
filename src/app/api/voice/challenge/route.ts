import { NextResponse } from "next/server"

// Predefined challenge phrases with different difficulty levels
const CHALLENGE_PHRASES = [
  { phrase: "My voice is my password", difficulty: 1, category: "security" },
  { phrase: "Authentication successful", difficulty: 1, category: "security" },
  { phrase: "Please verify my identity", difficulty: 2, category: "security" },
  { phrase: "The quick brown fox jumps over the lazy dog", difficulty: 3, category: "sentences" },
  { phrase: "Seven eight nine ten eleven twelve", difficulty: 2, category: "numbers" },
  { phrase: "Technology innovation security", difficulty: 3, category: "words" },
  { phrase: "Biometric voice recognition system", difficulty: 4, category: "technical" },
  { phrase: "Artificial intelligence machine learning", difficulty: 4, category: "technical" },
  { phrase: "Secure access granted successfully", difficulty: 3, category: "security" },
  { phrase: "Voice authentication protocol active", difficulty: 4, category: "technical" },
  { phrase: "Digital identity verification complete", difficulty: 3, category: "security" },
  { phrase: "Advanced security measures enabled", difficulty: 3, category: "security" },
  { phrase: "Multi-factor authentication approved", difficulty: 4, category: "technical" },
  { phrase: "Biometric data processing initiated", difficulty: 4, category: "technical" },
  { phrase: "User credentials validated successfully", difficulty: 3, category: "security" },
]

export async function GET() {
  try {
    // Select a random challenge phrase
    const randomIndex = Math.floor(Math.random() * CHALLENGE_PHRASES.length)
    const selectedChallenge = CHALLENGE_PHRASES[randomIndex]

    // Add timestamp to ensure uniqueness
    const challengeId = `challenge_${Date.now()}_${randomIndex}`

    return NextResponse.json({
      challengeId,
      phrase: selectedChallenge.phrase,
      difficulty: selectedChallenge.difficulty,
      category: selectedChallenge.category,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Challenge generation error:", error)
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 })
  }
}
